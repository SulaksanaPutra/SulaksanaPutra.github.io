import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const OPTIMIZING_QUERY_PERFORMANCE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> =
    {
        en: {
            backLink: {
                id: 'case-studies',
                href: '/case-studies',
                label: 'Back to Case Studies',
            },
            id: 'optimizing-query-performance-in-a-monolithic-erp',
            systemIds: ['system-twin-v1'],
            title: 'Optimizing N+1 Query Performance in a Monolithic ERP',
            heading: 'N+1 Query Performance Optimization',
            highlight:
                'Stabilizing a monolithic Laravel ERP by untangling lazy loading and resolving N+1 query performance issues—a pragmatic exercise in treating symptoms without breaking production.',
            keywords: 'Optimizing N+1 query performance, Monolithic ERP optimization, Master-Slave Database Replication, Lazy Loading Laravel, Database Performance Tuning, N+1 problem, Legacy ERP',
            subtitle:
                'Implementing tactical read optimizations and master-slave replication to protect core transactional flows from the performance bottlenecks of legacy architectural debt.',
            sections: [
                {
                    id: 'context',
                    label: 'Context',
                    paragraphs: [
                        "Twin v1 was a massive, monolithic ERP that grew organically—and painfully—over time. Originally designed strictly for operational flows like sales, warehouse management, and delivery, it was eventually forced to support heavy analytical reporting. Because reporting wasn't a priority in the early design, the system lacked a dedicated analytical layer. Instead, it relied on direct, real-time queries against the live production database for all reports.",
                        'It worked well enough in the early days, but as the data volume swelled and features expanded, the system began to collapse under its own weight.',
                    ],
                },
                {
                    id: 'the-problem',
                    label: 'The Problem',
                    paragraphs: [
                        'After roughly two years of accumulating live data, the performance degradation was impossible to ignore. The root cause was a classic, compounding architectural flaw: lazy loading and the N+1 query problem, heavily exacerbated by the reporting features. We had a single "god model" for Orders that served transactions, simple reads, and complex reports simultaneously.',
                        '',
                        'Over time, developers had piled more and more query logic onto this single model. Convenience abstractions like Laravel’s pagination turned into silent killers, as the underlying COUNT queries became agonizingly expensive on millions of rows.',
                        'Furthermore, with no data cutoff or archiving strategy, reports were crunching years of live transaction history in real-time. The system was trying to sprint while dragging a massive anchor of historical data.',
                    ],
                },
                {
                    id: 'impact',
                    label: 'Impact',
                    paragraphs: [
                        'The user experience degraded into slow page loads, constant request timeouts, and reports that simply hung forever. As the reporting traffic grew, it started choking the core operational flows. Database connections pooled up, expensive queries deadlocked, and the database server crashed multiple times under the strain.',
                        'At this stage, performance was no longer just a UX concern; it had become a critical risk to business continuity.',
                    ],
                },
                {
                    id: 'constraints',
                    label: 'Constraints',
                    paragraphs: [
                        "A full architectural rewrite was unfeasible due to the system's scale and its critical role in daily operations. Since the legacy write-logic governed the core transactions of the business, any structural changes introduced an unacceptable level of risk. We had to optimize the system within its existing, flawed framework to ensure stability while addressing the performance bottleneck.",
                    ],
                },
                {
                    id: 'decision-and-approach',
                    label: 'Decision and Approach',
                    paragraphs: [
                        "Working alongside my tech lead and manager, we accepted that structural redesign wasn't an option. Instead, we chose a tactical retreat, focusing entirely on read optimization to stop the bleeding.",
                        'The main steps were:',
                    ],
                    items: [
                        'Stripping reporting logic out of Eloquent models and replacing it with raw SQL and query builders.',
                        'Aggressively reducing lazy loading in reporting paths and enforcing explicit joins.',
                        'Ripping out standard pagination in favor of simple LIMIT queries where total counts weren’t strictly required.',
                        'Applying targeted database indexes (though we knew this would have limited impact on its own).',
                        'Introducing a master-slave database replication to physically separate read-heavy reporting from write-heavy operations.',
                        'Deploying behind feature flags and temporarily disabling the heaviest reports until they could be stabilized.',
                    ],
                },
                {
                    id: 'outcome',
                    label: 'Outcome',
                    paragraphs: [
                        '',
                        'The tactical intervention was successful. Query latency dropped significantly, memory usage stabilized, and database uptime returned to 100%. By physically separating workloads via replication and optimizing the read paths, we restored the reliability of core business transactions.',
                        'However, I recognized this as a high-impact mitigation rather than a structural resolution. While we stabilized the platform, the underlying data model remained untouched. Without a formal data archiving strategy, we were essentially extending the system’s "runway" before reaching the next scaling threshold. We successfully resolved the immediate operational crisis, but the fundamental architectural debt remained a known item on the long-term technical roadmap.',
                    ],
                },
                {
                    id: 'reflection',
                    label: 'Reflection',
                    paragraphs: [
                        'Initially, the frustration of this project made me want to abandon ORMs entirely in favor of raw queries and strict repository layers. But over time, I realized the ORM wasn’t the enemy—the lack of architectural boundaries was. ORMs are fantastic for transactional logic, but they do not scale automatically when you force them to handle heavy analytical reporting. Convenience features like lazy loading are loans with high interest rates; eventually, the technical debt comes due.',
                        'Since Twin v1, I’ve become highly intentional about separating read and write paths, defaulting to query-based approaches for reporting, and planning for data archiving on day one. It was a painful lesson, but it fundamentally changed how I approach system longevity.',
                    ],
                },
            ],
            qnas: [
                {
                    question:
                        "Why didn't you just use a dedicated Data Warehouse (like `BigQuery` or `ClickHouse`) for the reporting?",
                    answer: 'We were actually in the process of doing exactly that. We had hired specialists and started building the ETL pipelines, but you can’t build a skyscraper while the ground is shaking. The system was crashing now. A Data Warehouse is a long-term cure, but we needed a tourniquet to stop the immediate bleeding. The Master-Slave replication was a tactical move—it was the fastest way to physically isolate the "reporting" fire from the "transactional" core without a total rewrite. In the end, the company’s trajectory shifted before the "perfect" architecture could be finished, leaving us with a half-baked but stable solution.',
                },
            ],
            glossary: [
                {
                    term: 'N+1 Query Problem',
                    definition:
                        'A common performance issue where an application makes N+1 database calls to fetch a list of items and their related data, instead of using a single query with a join.',
                },
                {
                    term: 'Lazy Loading',
                    definition:
                        'A design pattern where data is only fetched from the database the moment it is accessed. In large loops, this often triggers the N+1 problem and can crash a production database.',
                },
                {
                    term: 'Read/Write Contention',
                    definition:
                        'A performance bottleneck that occurs when heavy "read" operations (like large reports) compete for the same database resources as "write" operations (like creating new orders).',
                },
                {
                    term: 'Master-Slave Replication',
                    definition:
                        'A database setup where one "Master" server handles all data changes (writes), while one or more "Slave" servers stay synchronized to handle read-only queries, reducing the load on the primary server.',
                },
                {
                    term: 'God Model',
                    definition:
                        'An oversized database model that handles too many unrelated business responsibilities, making it difficult to optimize for specific use cases without breaking others.',
                },
                {
                    term: 'Database Indexes',
                    definition:
                        'A data structure that improves the speed of data retrieval operations on a table, though it comes at the cost of additional storage and slightly slower write speeds.',
                },
                {
                    term: 'ETL',
                    definition:
                        'The process of moving data from a primary source (like an ERP) to a destination system (like a Data Warehouse) specifically formatted for complex reporting and analysis.',
                },
                {
                    term: 'ORMs',
                    definition:
                        'Object-Relational Mapping, A tool (like Laravel’s Eloquent) that lets developers interact with a database using object-oriented code. While convenient, it can hide inefficient underlying SQL queries from the developer.',
                },
            ],
        },
        id: null,
    };

export function useOptimizingQueryPerformanceData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () =>
            OPTIMIZING_QUERY_PERFORMANCE_BY_LOCALE[locale.value] ??
            OPTIMIZING_QUERY_PERFORMANCE_BY_LOCALE.en,
    );
}

export default OPTIMIZING_QUERY_PERFORMANCE_BY_LOCALE.en;
