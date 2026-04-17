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
        title: 'Explicit Connection Pooling in Go: Fixing Cross-Tenant Data Contamination',
        subtitle:
            'A registry-driven approach to resolving race conditions and data leaks in high-concurrency Go SaaS applications.',
        highlight:
            'A deep dive into fixing cross-tenant data contamination in Go—using the Tenant Registry pattern to trade memory footprint for absolute system integrity.',
        keywords: 'Explicit Connection Pooling, Go SaaS, Cross-Tenant Data Contamination, High-Concurrency Go, Database Management, Tenant Registry Pattern, Go Backend Engineering',
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
                    'In a standard Go application, `*sql.DB` is not a single connection; it is a thread-safe connection pool manager. Most applications initialize one global pool and share it across all goroutines. While efficient, this assumes a single target database.',
                    'When a system must handle multiple tenants with dedicated databases, the architecture must evolve from a single manager to an "Array of Managers." In this model, every tenant has its own isolated `*sql.DB` instance, creating a physical silo where internal mutexes and idle connection lists are completely separated.',
                ],
            },
            {
                id: 'registry-pattern',
                label: 'The Registry Pattern: How it Works',
                paragraphs: [
                    'The core of this architecture is the shift from "Mutation" (changing a global state) to "Selection" (resolving a resource from a registry). This is managed via a thread-safe lookup table.',
                    '```go\n' +
                        'type TenantRegistry struct {\n' +
                        '    pools map[string]*sql.DB\n' +
                        '    mu    sync.RWMutex\n' +
                        '}\n\n' +
                        'func (r *TenantRegistry) GetPool(id string) (*sql.DB, error) {\n' +
                        '    r.mu.RLock()\n' +
                        '    pool, exists := r.pools[id]\n' +
                        '    r.mu.RUnlock()\n\n' +
                        '    if exists { return pool, nil }\n\n' +
                        '    r.mu.Lock()\n' +
                        '    defer r.mu.Unlock()\n' +
                        '    // Double-check to prevent race during init\n' +
                        '    if p, ok := r.pools[id]; ok { return p, nil }\n\n' +
                        '    newPool, _ := sql.Open("postgres", getDSN(id))\n' +
                        '    r.pools[id] = newPool\n' +
                        '    return newPool, nil\n' +
                        '}\n' +
                        '```',
                ],
            },
            {
                id: 'enforcement',
                label: 'Enforcement via Dependency Injection',
                paragraphs: [
                    'The registry provides safety, but Dependency Injection provides enforcement. By binding the repository to a specific `*sql.DB` instance at instantiation, you create a compiler-enforced silo.',
                    'The service layer or middleware resolves the pool and injects it into the repository. Once injected, the repository is physically incapable of querying the wrong database because it has no access to any other state.',
                    '```go\n' +
                        'type OrderRepository struct {\n' +
                        '    db *sql.DB // Scoped to a specific tenant\n' +
                        '}\n\n' +
                        'func (repo *OrderRepository) Fetch() {\n' +
                        '    // Compiler-enforced: no global state is accessed\n' +
                        '    repo.db.Query("SELECT * FROM orders")\n' +
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
                    '`Handshake Elimination`: By keeping pools "warm," you eliminate the 20ms-100ms TCP/TLS handshake latency. Queries start instantly.',
                    '`Granular Governance`: You can set `MaxOpenConns(50)` for a high-traffic tenant while restricting a trial tenant to `MaxOpenConns(2)`.',
                    '`The Multiplier Effect`: $N$ tenants $\\times$ $M$ idle connections can lead to socket exhaustion. Tuning `SetMaxIdleConns(1)` and `SetConnMaxLifetime()` is mandatory.',
                ],
            },
            {
                id: 'scaling',
                label: 'Scaling for Exponential Growth',
                paragraphs: [
                    'A single registry works for hundreds of tenants, but thousands require Horizontal Sharding. In this scenario, you group tenants into clusters and deploy sharded backend instances.',
                    'Each shard only manages the "warm" pools for its specific subset of tenants. This maintains the explicit pooling model while keeping the memory footprint of individual instances manageable.',
                ],
            },
            {
                id: 'conclusion',
                label: 'The Bottom Line',
                paragraphs: [
                    'In software engineering, explicit is always safer than implicit. Shifting to siloed connection pooling allows you to align your architecture with Go’s concurrency model. You trade a higher memory footprint for a system that is fundamentally honest, faster, and immune to the race conditions that plague global state mutation.',
                ],
            },
        ],
        glossary: [
            {
                term: '*sql.DB',
                definition:
                    'In Go, this is not a single connection, but a thread-safe connection pool manager. In this architecture, we move from one global pool to an array of these managers.',
            },
            {
                term: 'Resource Silos',
                definition:
                    'An architectural model where every tenant has its own isolated database instance, ensuring that internal mutexes and connection lists are completely separated.',
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
                    'A property of code (achieved here via RWMutex) that allows it to be accessed by multiple goroutines simultaneously without causing data corruption.',
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
                    'The speed advantage gained by keeping pools open, which removes the 20ms–100ms latency normally required for TCP/TLS negotiations.',
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
