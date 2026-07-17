import thumbnail from '@/assets/images/articles/writings/summary-table-high-stakes-systems.jpg';
import thumbnailDark from '@/assets/images/articles/writings/summary-table-high-stakes-systems.dark.png';
import { WritingArticle } from '@/modules/writings/writings.types.ts';
import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';

export const SUMMARY_TABLE_ARTICLE_BY_LOCALE: Record<'en' | 'id', WritingArticle | null> = {
    en: {
        id: 'killing-the-summary-table',
        backLink: {
            id: 'writing',
            href: '/writing',
            label: 'Back to Writing',
        },
        title: 'Why I’m Killing the "Summary Table" in High-Stakes Systems',
        subtitle:
            'Moving from state-based duality to Head-Pointer Snapshotting and Optimistic Concurrency Control for data integrity.',
        highlight:
            'In ERP and WMS architectures, summary tables are often factories for "Ghost Stock." Explore why transaction ledgers should be the sole source of truth and how to safeguard them.',
        thumbnail: {
            light: thumbnail,
            dark: thumbnailDark,
        },
        date: '2025-10-02',
        sections: [
            {
                id: 'the-problem',
                label: 'The Duality Danger',
                paragraphs: [
                    'In many ERP and Warehouse Management System (WMS) architectures, there is a dangerous duality: a Ledger (the granular history) and a Summary Table (a single row representing current state).',
                    'On paper, this is for performance. In reality, it is a factory for "Ghost Stock" and race conditions. A summary table is effectively a cache—and you should never use a cache to make a transactional decision.',
                ],
            },
            {
                id: 'the-pattern',
                label: 'The Pattern: Head-Pointer Snapshotting',
                paragraphs: [
                    'Instead of managing two "sources of truth," I’ve adopted Head-Pointer Snapshotting. This bridges the gap between event-based logic and query efficiency.',
                    'Every movement is recorded as an immutable row in an append-only ledger, and the latest transaction for a specific SKU is marked with a "Current_State" flag. This flag acts as the "Head" of the ledger, similar to a pointer in Git.',
                ],
            },
            {
                id: 'contention-tax',
                label: 'The Contention Tax & The Database Fail-Safe',
                paragraphs: [
                    'Updating a single "Summary Row" requires a lock that forces concurrent processes to wait. An append-only ledger bypasses this contention tax, but it requires strict concurrency control to avoid race conditions when moving the "Head" flag.',
                    'To solve this, each new transaction must explicitly declare its parent state (`prev_id`). This introduces a Compare-and-Swap (CAS) mechanism natively into the relational model. If two concurrent requests try to append to the exact same previous state, the database constraint instantly rejects the stale one. The application handles the retry queue, but the schema acts as the ultimate fail-safe.',
                ],
            },
            {
                id: 'trade-offs',
                label: 'Integrity vs. Convenience',
                paragraphs: [
                    'Choosing this architecture is about managing risks. While a ledger grows fast and requires partitioning, it offers native auditability. Every stock level is tethered to a specific event, timestamp, and user ID.',
                    'You can always optimize a slow query with partitioning or materialized views, but you can never "optimize" a system back into honesty once the data has been corrupted.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Summary Table',
                definition:
                    'A common but dangerous architectural pattern where a single row is used to represent the current state of a resource (like stock totals), effectively acting as a cache.',
            },
            {
                term: 'Ledger',
                definition:
                    'The granular, transaction-by-transaction history of all movements. In high-stakes systems, this should be the sole source of truth.',
            },
            {
                term: 'Duality Danger',
                definition:
                    'The risk of having two separate "sources of truth" (the ledger and the summary table) that can fall out of sync, leading to data corruption.',
            },
            {
                term: 'Ghost Stock',
                definition:
                    'Inaccurate inventory data where the system reports available stock that does not exist physically, often caused by out-of-sync summary tables.',
            },
            {
                term: 'Head-Pointer Snapshotting',
                definition:
                    'An architectural pattern where every movement is recorded in an append-only ledger, and the latest transaction is marked as the "Head" to ensure both integrity and query speed.',
            },
            {
                term: 'Append-only ledger',
                definition:
                    'A data structure where movements are recorded as new, immutable rows rather than modifying existing data, providing a permanent and auditable history.',
            },
            {
                term: 'Current_State flag',
                definition:
                    'A marker used in Head-Pointer Snapshotting to identify the latest entry in the ledger, allowing for rapid O(1) reads without traversing the entire history.',
            },
            {
                term: 'prev_id',
                definition:
                    'A reference to the specific ledger row that a new transaction believes is the current state. This creates an unbroken chain of events and validates data integrity on insertion.',
            },
            {
                term: 'Compare-and-Swap',
                definition:
                    'A concurrency control mechanism where a new write is only accepted by the database if the underlying state (the prev_id) has not changed since it was last read.',
            },
            {
                term: 'Optimistic Concurrency Control',
                definition:
                    'A method for handling concurrent transactions that avoids upfront row-locking. It assumes conflicts are rare and uses constraints to reject invalid writes at the time of insertion.',
            },
            {
                term: 'Contention Tax',
                definition:
                    'The performance penalty incurred when multiple concurrent processes try to lock and update the same summary row at the same time.',
            },
            {
                term: 'Materialized views',
                definition:
                    'A database object that contains the results of a query, used here as a potential tool to optimize performance without compromising the integrity of the ledger.',
            },
        ],
    },
    id: null,
};

export function useSummaryTableArticleData() {
    const { locale } = useI18n();
    return computed<WritingArticle | null>(
        () => SUMMARY_TABLE_ARTICLE_BY_LOCALE[locale.value] ?? SUMMARY_TABLE_ARTICLE_BY_LOCALE.en,
    );
}

export default SUMMARY_TABLE_ARTICLE_BY_LOCALE.en;