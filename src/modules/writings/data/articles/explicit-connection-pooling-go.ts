import thumbnail from '@/assets/images/articles/writings/explicit-connection-pooling-go.jpg';
import thumbnailDark from '@/assets/images/articles/writings/explicit-connection-pooling-go.dark.png';
import { WritingArticle } from '@/modules/writings/writings.types.ts';

export const EXPLICIT_POOLING_ARTICLE_BY_LOCALE: Record<'en' | 'id', WritingArticle | null> = {
    en: {
        id: 'explicit-connection-pooling-go',
        backLink: {
            id: 'writing',
            href: '/writing',
            label: 'Back to Writing',
        },
        title: 'Explicit Connection Pooling in Go: Architecting Physical Tenant Isolation',
        subtitle:
            'A registry-driven approach to physical database isolation in high-concurrency Go SaaS applications.',
        highlight:
            'A deep dive into architectural multi-tenant isolation in Go—using the Tenant Registry pattern to trade memory footprint for absolute system integrity.',
        keywords:
            'Explicit Connection Pooling, Go SaaS, Physical Database Isolation, High-Concurrency Go, Database Management, Tenant Registry Pattern, Go Backend Engineering, Singleflight',
        thumbnail: {
            light: thumbnail,
            dark: thumbnailDark,
        },
        date: '2025-08-12',
        sections: [
            {
                id: 'resource-silos',
                label: 'From Shared Pools to Resource Silos',
                paragraphs: [
                    'When building a standard Go application, `*sql.DB` is not a single connection; it is a thread-safe connection pool manager. I usually initialize one global pool and share it across all goroutines. While efficient, this assumes a single target database.',
                    'However, when a system must handle multiple tenants with dedicated databases, the architecture must evolve from a single manager to an "Array of Managers." In this model, we give every tenant its own isolated `*sql.DB` instance, creating a physical silo where internal mutexes and idle connection lists are completely separated.',
                ],
            },
            {
                id: 'registry-pattern',
                label: 'The Registry Pattern: How It Works',
                paragraphs: [
                    'The core of this architecture is the shift from "Mutation" (changing a global state) to "Selection" (resolving a resource from a registry). I manage this via a thread-safe lookup table. To prevent the "Thundering Herd" problem—where a spike in requests for an uninitialized tenant causes lock contention—we use Go\'s `singleflight` package to ensure the initialization only happens once, even under heavy concurrent load.',
                    '```go\n' +
                        'type TenantRegistry struct {\n' +
                        '    pools        map[string]*sql.DB\n' +
                        '    mu           sync.RWMutex\n' +
                        '    requestGroup singleflight.Group\n' +
                        '}\n\n' +
                        'func (r *TenantRegistry) GetPool(ctx context.Context, id string) (*sql.DB, error) {\n' +
                        '    r.mu.RLock()\n' +
                        '    pool, exists := r.pools[id]\n' +
                        '    r.mu.RUnlock()\n\n' +
                        '    if exists { return pool, nil }\n\n' +
                        '    // singleflight ensures only one initialization occurs per tenant ID\n' +
                        '    v, err, _ := r.requestGroup.Do(id, func() (interface{}, error) {\n' +
                        '        // Double-check in case it was created while waiting\n' +
                        '        r.mu.RLock()\n' +
                        '        if p, ok := r.pools[id]; ok {\n' +
                        '            r.mu.RUnlock()\n' +
                        '            return p, nil\n' +
                        '        }\n' +
                        '        r.mu.RUnlock()\n\n' +
                        '        newPool, err := sql.Open("postgres", getDSN(id))\n' +
                        '        if err != nil {\n' +
                        '            return nil, err\n' +
                        '        }\n\n' +
                        '        // Use a background context for initialization ping.\n' +
                        '        // If we use the request context, a short timeout could cancel\n' +
                        '        // the pool creation and cause cascading failures.\n' +
                        '        initCtx, cancel := context.WithTimeout(context.Background(), 5 * time.Second)\n' +
                        '        defer cancel()\n\n' +
                        '        if err := newPool.PingContext(initCtx); err != nil {\n' +
                        '            return nil, err\n' +
                        '        }\n\n' +
                        '        r.mu.Lock()\n' +
                        '        r.pools[id] = newPool\n' +
                        '        r.mu.Unlock()\n\n' +
                        '        return newPool, nil\n' +
                        '    })\n\n' +
                        '    if err != nil {\n' +
                        '        return nil, err\n' +
                        '    }\n' +
                        '    return v.(*sql.DB), nil\n' +
                        '}\n' +
                        '```',
                ],
            },
            {
                id: 'enforcement',
                label: 'Enforcement via Dependency Injection',
                paragraphs: [
                    'The registry provides safety, but I rely on Dependency Injection for enforcement. By binding the repository to a specific `*sql.DB` instance at instantiation, we create an architecturally enforced silo. While the compiler ensures type safety, careful middleware scoping is required to prevent injecting the wrong tenant pool at runtime.',
                    'In the service layer or middleware, the pool is resolved and injected into the repository. Once injected, the repository is physically incapable of querying the wrong database because it has no access to any other state.',
                    '```go\n' +
                        'type OrderRepository struct {\n' +
                        '    db *sql.DB // Scoped to a specific tenant\n' +
                        '}\n\n' +
                        'func (repo *OrderRepository) Fetch(ctx context.Context) {\n' +
                        '    // Architecturally enforced: no global state is accessed\n' +
                        '    repo.db.QueryContext(ctx, "SELECT * FROM orders")\n' +
                        '}\n' +
                        '```',
                ],
            },
            {
                id: 'trade-offs',
                label: 'The "Silo Tax": Pragmatic Trade-offs',
                paragraphs: [
                    'Maintaining multiple simultaneous pools involves trading Resident Set Size (RSS) memory for reliability and speed. It is a classic engineering calculation.',
                ],
                items: [
                    '`Handshake Elimination`: By successfully pinging and keeping pools "warm," we eliminate the 20ms-100ms TCP/TLS handshake latency for subsequent requests. Queries start instantly.',
                    '`Granular Governance`: We can set `MaxOpenConns(50)` for a high-traffic tenant while restricting a trial tenant to `MaxOpenConns(2)`.',
                    '`The Multiplier Effect`: $N$ tenants $\\times$ $M$ idle connections can lead to socket exhaustion. Tuning `SetMaxIdleConns(1)` and `SetConnMaxLifetime()` is mandatory.',
                    '`The Eviction Challenge`: A growing registry will leak memory if tenants are never removed. Implementing an LRU (Least Recently Used) eviction policy is the most difficult architectural challenge here. Safely calling `pool.Close()` on a dormant tenant requires carefully draining active connections and managing state concurrently without blocking new incoming requests.',
                ],
            },
            {
                id: 'scaling',
                label: 'Scaling for Exponential Growth',
                paragraphs: [
                    'A single registry works well for hundreds of tenants, but scaling to thousands requires Horizontal Sharding. In this scenario, we group tenants into clusters and deploy sharded backend instances.',
                    'Each shard only manages the "warm" pools for its specific subset of tenants. This maintains the explicit pooling model while keeping the memory footprint of individual instances manageable.',
                ],
            },
            {
                id: 'conclusion',
                label: 'The Bottom Line',
                paragraphs: [
                    'In my experience, explicit is always safer than implicit. Shifting to siloed connection pooling aligns the architecture with Go’s concurrency model. We trade a higher memory footprint for a system that is fundamentally honest, faster, and establishes strict physical isolation boundaries between tenants.',
                ],
            },
        ],
        glossary: [
            {
                term: '*sql.DB',
                definition:
                    'In Go, this is not a single connection, but a thread-safe connection pool manager. In this architecture, the system moves from one global pool to an array of these managers.',
            },
            {
                term: 'singleflight',
                definition:
                    'A package from golang.org/x/sync that provides a duplicate function call suppression mechanism, preventing the "Thundering Herd" problem when initializing resources concurrently.',
            },
            {
                term: 'context.Context',
                definition:
                    'A standard Go package used to carry deadlines, cancellation signals, and other request-scoped values across API boundaries and between processes.',
            },
            {
                term: 'Resource Silos',
                definition:
                    'An architectural model where every tenant receives its own isolated database instance, ensuring that internal mutexes and connection lists are completely separated.',
            },
            {
                term: 'Tenant Registry',
                definition:
                    'A thread-safe lookup table used to resolve and manage multiple database connection pools, shifting logic from "Mutation" to "Selection."',
            },
            {
                term: 'Selection',
                definition:
                    'The process of resolving a specific resource from a registry rather than changing a global state, ensuring the system remains safe during concurrent requests.',
            },
            {
                term: 'Thread-safe',
                definition:
                    'A property of code (achieved here via a pointer receiver on sync.RWMutex) that allows it to be accessed by multiple goroutines simultaneously without causing data corruption.',
            },
            {
                term: 'Dependency Injection',
                definition:
                    'A design pattern used to enforce architectural silos by binding a repository to a specific database instance at the time of its creation.',
            },
            {
                term: 'Silo Tax',
                definition:
                    'The pragmatic trade-off of using more system memory (RSS) to achieve higher reliability and sub-millisecond query performance.',
            },
            {
                term: 'Resident Set Size (RSS)',
                definition:
                    'The portion of RAM occupied by the application. Managing this is a key consideration when keeping multiple database pools "warm" in memory.',
            },
            {
                term: 'Handshake Elimination',
                definition:
                    'The speed advantage gained by verifying connections with PingContext and keeping pools open, which removes the 20ms–100ms latency normally required for TCP/TLS negotiations.',
            },
            {
                term: 'Granular Governance',
                definition:
                    'The ability to set different resource limits, such as maximum connections, for individual tenants based on their traffic or subscription tier.',
            },
            {
                term: 'Multiplier Effect',
                definition:
                    'The risk where many tenants each holding idle connections can lead to socket exhaustion, requiring careful tuning of connection lifetimes.',
            },
            {
                term: 'Horizontal Sharding',
                definition:
                    'A scaling strategy used for thousands of tenants by grouping them into clusters and deploying them across multiple sharded backend instances.',
            },
        ],
    },
    id: null,
};

export default EXPLICIT_POOLING_ARTICLE_BY_LOCALE.en;
