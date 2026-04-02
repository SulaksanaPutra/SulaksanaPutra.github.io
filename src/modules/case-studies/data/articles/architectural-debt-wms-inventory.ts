import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const TWIN_WMS_STOCK_CASE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'architectural-debt-wms-inventory',
        systemIds: ['system-twin-v2-wms'],
        title: 'Architectural Debt: Inventory Ledgers and Physical Constraints',
        heading: 'Architectural Debt: Inventory Ledgers',
        highlight:
            'Twin v1 & Twin v2 WMS — Solving ghost stock and race conditions by transitioning to an append-only transaction architecture.',
        subtitle:
            'How we replaced a flawed dynamic stock calculator with a strict transactional ledger to stabilize warehouse operations and reconcile logical data with physical reality.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'Twin v1 was a monolithic ERP tasked with managing a complex, multi-site warehouse environment. The core architectural flaw was a fundamental misunderstanding of inventory state: the system lacked a transactional ledger. Instead, it relied on daily stock "snapshots" and a heavily queried dynamic table to calculate available stock on the fly.',
                    'Because the calculation logic was decentralized—spread across various controllers and services—it was nearly impossible to maintain a single source of truth. The resulting race conditions meant the stock numbers in the system rarely matched the physical reality on the warehouse floor.',
                ],
            },
            {
                id: 'problem',
                label: 'Problem',
                paragraphs: [
                    'The most critical architectural failure occurred during transaction modifications. In Twin v1, any update to a confirmed order—even for attributes unrelated to inventory, such as a price or discount adjustment—triggered a full rollback of the associated stock allocation.',
                    'This behavior is a classic anti-pattern I’ve categorized as `Naive State Reset` (or Premature Resource De-allocation). By failing to implement granular state management, the system treated every minor edit as a total transaction reversal. (I’ve written a deeper architectural analysis of this pattern here).',
                    'In high-concurrency scenarios, this logic created a destructive race condition. When a transaction like Order A entered a modification state, its reserved inventory was prematurely released. Concurrent processes, such as the placement of Order B, would immediately claim this newly unallocated stock.',
                    "Consequently, the subsequent attempt to re-commit Order A would fail with an `insufficient stock` exception, as the original inventory had already been consumed by a parallel process. This architectural flaw necessitated manual intervention to restore data consistency and significantly eroded the system's overall operational reliability.",
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                paragraphs: [
                    'The primary constraint was an unacceptable risk of regression. The legacy inventory engine was so tightly coupled with the core ERP logic that a safe, in-situ refactor was impossible without jeopardizing the entire distribution flow.',
                    "Furthermore, the lack of a comprehensive automated test suite meant there was no safety net for invasive structural changes. We were forced to maintain business continuity in a high-stakes environment where any logic error would immediately result in physical warehouse discrepancies. These factors effectively prohibited a direct rewrite within the monolith's boundaries.",
                ],
            },
            {
                id: 'solution',
                label: 'Solution',
                paragraphs: [
                    'While the most direct approach would have been to build a new module within the Twin v1 monolith, we chose to architect a standalone service: Twin v2 WMS.',
                    'This was a strategic decision driven by our company’s long-term vision to expand into the SaaS market. We viewed this inventory crisis as the ideal "test run" for our Sovereign Service architecture. By developing a decoupled, encapsulated service to handle the core stock calculation logic, we could prove the feasibility of a standalone product that integrated seamlessly back into the legacy ERP.',
                    'To resolve the race conditions and data integrity issues, we implemented a Hybrid Transactional Model:',
                ],
                items: [
                    '`Immutable Append-Only Ledger`: We shifted the source of truth away from a standalone "total stock" integer. Every inbound shipment, allocation, picking, or adjustment was recorded as a discrete, immutable transaction in a ledger.',
                    '`Read-Optimized Summary` Tables: For performance, we maintained a "Current Stock" summary table to handle high-frequency reads. However, this table was now a derivative projection of the ledger. If a discrepancy was ever detected, the system could "replay" the ledger to re-calculate the correct state, ensuring the math remained bulletproof.',
                    'The `Chain Pattern` for Auditability: Each ledger record validated the state of the previous entry. This created a mathematically verifiable history of every SKU’s movement, making the system resistant to silent data corruption or unauthorized manual database edits.',
                    '`Dynamic Unit of Measure (UOM) System`: We replaced the rigid, hardcoded unit limits with a flexible converter engine. This allowed the system to translate between bulk containers and individual pieces dynamically at the point of transaction.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'Technically, the transition to Twin v2 was a success, with inventory accuracy against physical audits rising to 98%. However, a significant gap remained between the digital ledger and physical operations. While the WMS accurately tracked "Virtual Stock" (bookings and reservations), it remained blind to the final physical outbound movement because the field worker application was never successfully adopted in the live environment.',
                    'This visibility gap existed because a true "delivered" event was never recorded in any system; instead, we relied on Twin v1\'s "Finished Order" status as a proxy for delivery. Since this was a sales-based milestone rather than a real-time warehouse signal, it introduced a data lag that left the WMS functionally unaware of exactly when items physically left the floor. Furthermore, because Twin v2 was designed as a Sovereign SaaS miniservice, it was architected to manage its own data domain and did not pull order status from the monolith to compensate for the lack of field input.',
                    'This led to a pragmatic compromise: we had a reliable ledger of what should be in the warehouse, but no automated way to confirm what had actually left. To bridge this for the business, we had to extract data from both the WMS and Twin v1 to merge them in external reporting layers like Metabase and custom Python scripts. While this satisfied the requirement for accurate reporting, it was a frustrating reminder of how a solid data model can be limited by operational realities and the "good enough" nature of manual data merging.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'This project taught me that stock is fundamentally a time-series problem, not a simple relational status. If I were to rebuild this today, I would rely exclusively on an indexed, append-only transaction table where the latest entry represents the current state. This eliminates the need for "summary" tables and removes the risk of state contamination between the ledger and the cache. (I’ve written a deeper architectural analysis of why I prefer this "Single Source of Truth" model here).',
                    'Additionally, I learned that Unit of Measure (UOM) complexity is most effectively handled by storing all inventory in the smallest base unit. By applying a packaging factor only at the point of transaction, we reduce relational overhead and make the system significantly more resilient to changes in how items are packaged or sold.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Append-Only Ledger',
                definition:
                    'A data pattern where records are only added, never updated. This provides an immutable audit trail of every change that has ever happened to a value.',
            },
            {
                term: 'Unit of Measure (UOM)',
                definition:
                    'The standard units used to quantify an item (e.g., Box, Pack, Piece). Managing conversions between these units is a core challenge in warehouse systems.',
            },
            {
                term: 'Packaging Factor',
                definition:
                    'A numeric multiplier used to calculate the quantity of a base unit within a larger container (e.g., a Box with a factor of 12 contains 12 Pieces).',
            },
            {
                term: 'Naive State Reset',
                definition:
                    'An anti-pattern where a system treats any minor update as a total transaction reversal, leading to the premature and risky de-allocation of resources like inventory.',
            },
            {
                term: 'Race Condition',
                definition:
                    'A technical failure where the timing or sequence of concurrent processes (like two orders being placed at once) leads to inconsistent data or "ghost" stock.',
            },
            {
                term: 'Sovereign Service',
                definition:
                    'A standalone, decoupled service designed to manage its own data domain independently of a central monolith, often used as a precursor to a SaaS product.',
            },
            {
                term: 'Read-Optimized Summary',
                definition:
                    'A derivative table used to store pre-calculated totals for high-frequency access, preventing the system from having to "replay" the entire ledger for every query.',
            },
            {
                term: 'Chain Pattern',
                definition:
                    'A validation method where each record verifies the state of the previous entry, creating a mathematically verifiable history that is resistant to silent corruption.',
            },
            {
                term: 'Virtual Stock',
                definition:
                    'The quantity of inventory represented in the digital system (including bookings and reservations), which may differ from the actual physical stock on the warehouse floor.',
            },
        ],
        qnas: [
            {
                question: 'Why not sync order data from v1 back to v2 for real-time tracking?',
                answer: 'I proposed flagging Twin v1 order data as "real stock out" and feeding it back into the WMS. However, management rejected it. It required a bi-directional sync that felt redundant since we "already had" the (unused) mobile app. Ultimately, the business was content with joining the data in a report rather than fixing the system architecture.',
            },
        ],
    },
    id: null,
};

export function useTwinWmsStockCaseData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () => TWIN_WMS_STOCK_CASE_BY_LOCALE[locale.value] ?? TWIN_WMS_STOCK_CASE_BY_LOCALE.en,
    );
}

export default TWIN_WMS_STOCK_CASE_BY_LOCALE.en;
