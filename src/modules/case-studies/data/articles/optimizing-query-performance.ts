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
            systemId: 'system-twin-v1',
            title: 'Optimizing Query Performance in a Monolithic ERP',
            heading: 'Optimizing Query Performance',
            highlight:
                'Stabilized a reporting-heavy Laravel ERP by untangling lazy loading and N+1 queries, optimizing read paths without risking core transactional logic.',
            subtitle:
                'Stabilizing a growing ERP by untangling lazy loading, reporting queries, and read/write contention—without rewriting the system.',
            sections: [
                {
                    id: 'context',
                    label: 'Context',
                    paragraphs: [
                        'Twin v1 was a large monolithic ERP system that evolved over time. It originally focused on operational use cases, sales, internal operations, warehouse management, delivery, and later expanded into heavy reporting. Reporting was never part of the initial design, so transactional tables, especially the orders table, were reused directly for analytics.',
                        'This approach worked in the early stage, but as both data volume and features grew, the system started to show serious scalability problems.',
                    ],
                },
                {
                    id: 'the-problem',
                    label: 'The Problem',
                    paragraphs: [
                        'After roughly two years of accumulated data, performance degradation became obvious. The core issue came from lazy loading and the N+1 query problem, particularly in reporting features. A single “god model,” the Order model, was used across transactions, reads, and reports.',
                        'Over time, more and more query logic was added to this model. Some queries combined lazy loading with joins, others were reused beyond their original purpose. Laravel’s pagination made things worse, since the COUNT query became extremely expensive on large datasets.',
                        'There was also no cutoff or archiving mechanism. Transaction data kept growing, and many reports queried one to two years of live data—sometimes even the entire history.',
                    ],
                },
                {
                    id: 'impact',
                    label: 'Impact',
                    paragraphs: [
                        'Users experienced slow page loads, request timeouts, and reports that failed to complete. As reporting traffic increased, it began to interfere with core operational flows. Database connections piled up, queries blocked each other, and the database server went down multiple times.',
                        'At this stage, performance was no longer just a UX issue—it became a system stability risk.',
                    ],
                },
                {
                    id: 'constraints',
                    label: 'Constraints',
                    paragraphs: [
                        'A full architectural rewrite was not feasible. The system was large, already in production, and deeply embedded in business operations. Changing write logic was especially risky, since it affected core transactions. We had to work within these constraints, even though the architecture itself was part of the problem.',
                    ],
                },
                {
                    id: 'decision-and-approach',
                    label: 'Decision and Approach',
                    paragraphs: [
                        'Together with my tech lead, and my manager, we analyzed the root causes and decided to focus on read optimization rather than structural redesign.',
                        'The main steps were:',
                    ],
                    items: [
                        'Moving reporting logic out of Eloquent models into query builder and raw SQL',
                        'Reducing lazy loading in reporting paths and explicitly controlling joins',
                        'Replacing pagination with LIMIT where total counts were not required',
                        'Adding database indexes (with limited impact on their own)',
                        'Introducing a master–slave database setup to separate read-heavy reporting from write-heavy operations',
                        'Using feature flags and UAT, and temporarily disabling some reports until they were stable',
                    ],
                },
                {
                    id: 'outcome',
                    label: 'Outcome',
                    paragraphs: [
                        'These changes significantly improved load times, reduced memory usage, and stabilized the database. Reporting queries no longer blocked operational traffic, and day-to-day usage became more reliable.',
                        'However, I was fully aware that this was not a permanent solution. Most of the improvements were tactical rather than structural. We optimized read queries, but the underlying data model and write logic remained unchanged. Without a cutoff or archiving mechanism, the system was still on a slow path toward future performance issues.',
                        'In practice, this work felt more like buying time than fixing the root cause. We defused the immediate problem, but the architectural debt was still there.',
                    ],
                },
                {
                    id: 'reflection',
                    label: 'Reflection',
                    paragraphs: [
                        'At first, this case pushed me toward avoiding ORMs entirely and relying only on raw queries and a repository layer. Over time, I realized the real issue wasn’t ORM usage itself, but using it without clear boundaries. ORMs work well for transactional logic, but they don’t scale automatically—especially when reused for heavy reporting. Lazy loading and convenience abstractions can quietly become long-term costs.',
                        'Since then, I’ve been more intentional about separating read and write paths, using query-based approaches for reporting, and planning early for data growth through cutoff or archiving mechanisms. These decisions have consistently reduced performance issues and maintenance risk in newer systems.',
                    ],
                },
            ],
            qnas: [
                {
                    question: 'Why focus on read optimization instead of a database redesign?',
                    answer: 'The system was live and business-critical. Redesigning core transactional models posed too high a risk for immediate operations, so we chose an incremental, read-side separation.',
                },
                {
                    question: 'How did you handle the expensive COUNT queries for pagination?',
                    answer: "We replaced standard pagination with LIMIT-based lists where the total count wasn't business-critical, significantly reducing database load on millions of rows.",
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
