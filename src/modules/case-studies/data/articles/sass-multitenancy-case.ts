import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const SAAS_MULTITENANCY_CASE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'resolving-cross-tenant-data-contamination-go-saas',
        systemIds: ['system-twin-v2-wms', 'system-twin-v2-fms'],
        title: 'Resolving Cross-Tenant Data Contamination in a High-Traffic Go SaaS',
        heading: 'Multi-Tenant Architecture Redesign',
        highlight: 'Twin WMS & FMS — Fixing a critical concurrency flaw to secure tenant data',
        subtitle:
            'How I redesigned a flawed database connection strategy in a production SaaS application to eliminate race conditions, secure tenant data, and improve overall backend performance.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'Twin WMS & FMS was transitioning into a large-scale, multi-tenant SaaS application. But under the hood, the foundation was dangerously naive. The architecture utilized a single, shared Go backend that routed requests to dedicated databases for each tenant.',
                    'Because the system was originally built and tested with only a single tenant in mind, a critical architectural flaw was quietly waiting for the day we actually succeeded in getting more users. Once multiple tenants began hitting the production servers concurrently, the system buckled under its own underlying assumptions.',
                ],
            },
            {
                id: 'problem',
                label: 'Problem',
                paragraphs: [
                    "We started experiencing the absolute worst-case scenario for any SaaS product: data contamination. We received reports of abnormal data suddenly appearing in one tenant's view, while another tenant reported entirely missing records.",
                    "It wasn't just a performance bottleneck; it was a fundamental breach of system integrity and user trust. Operational flows halted, and as the Senior Developer, I had to step in immediately and alone to stop the bleeding.",
                ],
            },
            {
                id: 'root-cause',
                label: 'Root Cause',
                paragraphs: [
                    'The architecture relied on an early `middleware` design that prioritized immediate simplicity over long-term concurrency. To switch tenants, the logic closed the previous database connection, opened a new one, and cached it in a global variable. At the time, it was a perfectly pragmatic decision—it worked seamlessly when the app was only serving a single tenant, and there was no visible reason to over-engineer the system before the scale demanded it.',
                    "In a highly concurrent Go application, this created massive race conditions. If a background `goroutine` or a concurrent request from `Tenant A` fired off while the global connection had just been overwritten by a new request from `Tenant B`, `Tenant A`'s data would simply be read from or written to `Tenant B`'s database. It was a ticking time bomb built on global state mutation.",
                ],
            },
            {
                id: 'decision-and-architecture-shift',
                label: 'Decision and Architecture Shift',
                paragraphs: [
                    "The ironic part was that the codebase already possessed the skeleton of a `Repository` pattern—it just wasn't being utilized for actual `Dependency Injection` (`DI`). Since I had full autonomy to solve the crisis, I completely abandoned the global state approach.",
                    'Instead of thrashing connections open and closed, I configured the backend to establish persistent connection pools to all tenant databases upon startup, storing them in a globally accessible `map` in memory.',
                    'The crucial structural fix was utilizing `DI` properly. The middleware now identifies the tenant, retrieves the correct connection pool from the `map`, and explicitly injects it down the execution chain: from the `Request`, to the `Controller`, to the `Service`, and finally into the `Repository`. Every single request and background process was now hard-bound to an isolated database context.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'The cross-tenant data bleeding stopped immediately and permanently. Ironically, by fixing the architectural flaw, backend performance drastically improved. By eliminating the massive overhead of constantly tearing down and rebuilding TCP/DB handshakes for every request, the system became significantly faster.',
                    'We traded memory (holding multiple database connection pools open simultaneously) for stability and speed. Given the high traffic volume of each tenant, this was a highly pragmatic and necessary trade-off for a production SaaS.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'This incident was a humbling reminder of how architectural decisions that make perfect sense in the early days can quietly become liabilities as a system scales. The original design solved the exact problem it was built for, but concurrency has a way of hiding its flaws until the system is under real, multi-tenant load.',
                    'A single, basic suite of concurrent unit tests would have exposed the race condition on that global variable long before it ever reached production. It taught me that isolated contexts and strict dependency injection aren\'t just "clean code" aesthetics—they are the only mechanisms actually protecting your users\' data when the system scales.',
                ],
            },
        ],
        glossary: [
            {
                term: 'SaaS (Software as a Service)',
                definition:
                    'A software distribution model in which applications are hosted by a vendor and made available to customers over a network.',
            },
            {
                term: 'Multi-tenancy',
                definition:
                    'A software architecture where a single instance of software serves multiple tenants (customers), with data physically or logically isolated.',
            },
            {
                term: 'Data Contamination',
                definition:
                    'A critical failure where data from one tenant incorrectly appears in another tenant’s environment, representing a fundamental breach of system integrity.',
            },
            {
                term: 'Middleware',
                definition:
                    'A layer of code that intercepts requests to perform logic—such as identifying a tenant—before passing the request to the main application handlers.',
            },
            {
                term: 'Goroutine',
                definition:
                    'A lightweight thread managed by the Go runtime, used to perform tasks concurrently within a single application instance.',
            },
            {
                term: 'Race Condition',
                definition:
                    'A flaw occurring when the timing or order of events (like concurrent requests) affects a program’s correctness, often leading to unpredictable behavior.',
            },
            {
                term: 'Global State Mutation',
                definition:
                    'The practice of changing a shared global variable during runtime. In concurrent systems, this is a "ticking time bomb" that leads to data bleeding.',
            },
            {
                term: 'Connection Pools',
                definition:
                    'A cache of database connections maintained so that they can be reused when future requests to the database are required, improving performance.',
            },
            {
                term: 'Dependency Injection (DI)',
                definition:
                    'A design pattern where a component’s dependencies (like a database connection) are provided to it externally rather than the component creating them itself.',
            },
            {
                term: 'Repository Pattern',
                definition:
                    'An architectural pattern that isolates the data access logic from the business logic, providing a centralized place to manage database interactions.',
            },
            {
                term: 'TCP/DB Handshakes',
                definition:
                    'The multi-step process of establishing a connection between a server and a database. Constantly repeating this for every request creates significant overhead.',
            },
            {
                term: 'Isolated Contexts',
                definition:
                    'A design principle where each request or process is strictly bound to its own data and dependencies, preventing cross-pollination with other concurrent tasks.',
            },
            {
                term: 'Lazy Loading LRU Cache',
                definition:
                    'A strategy that loads data (like connection pools) only when needed and evicts the "Least Recently Used" items to manage memory footprint efficiently.',
            },
        ],
        qnas: [
            {
                question:
                    "Why didn't you just use `context.Context` to pass the database connection?",
                answer: 'I considered it. In the Go world, putting things in `ctx` is the "idiomatic" way to go. But when you’re staring at cross-tenant data contamination in production, "idiomatic" takes a backseat to "explicit." Using `ctx` felt a bit like a wild card—it\'s too easy for a developer to pull the wrong key or for the context to get lost in a deep call stack. By using direct `Dependency Injection` in the `Repository`—`NewRepository(db)`—I made the database a hard contract. It’s harder to mess up, and it made writing unit tests with `sqlmock` much more straightforward.',
            },
            {
                question: "Isn't a global `map` of connection pools a memory hog?",
                answer: 'Yes, we traded `RAM` for integrity. Each `sql.DB` is a pool, and keeping hundreds of them open simultaneously isn\'t free. However, for our current scale and the high traffic each tenant generates, the overhead of constant `TCP` handshakes and `DB` authentication was a much bigger performance killer than the memory footprint. In the early days, "simplicity" meant one global connection. Now, "pragmatism" means persistent pools. If we hit 1,000+ tenants, I’ll likely evolve this into a `Lazy Loading LRU` cache to evict inactive pools, but that time, stability is the priority.',
            },
        ],
    },
    id: null,
};

export function useSaasMultitenancyCaseData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () => SAAS_MULTITENANCY_CASE_BY_LOCALE[locale.value] ?? SAAS_MULTITENANCY_CASE_BY_LOCALE.en,
    );
}

export default SAAS_MULTITENANCY_CASE_BY_LOCALE.en;
