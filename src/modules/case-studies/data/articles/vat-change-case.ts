import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const VAT_CHANGE_CASE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'handling-a-vat-increase-in-a-legacy-real-time-system',
        systemId: 'system-twin-v1',
        title: 'Handling a VAT Increase in a Legacy, Real-Time System',
        heading: 'VAT Increase Handling',
        highlight: 'Twin v1 — Regulatory change under production and architectural constraints',
        subtitle:
            'How I managed a critical regulatory update in a legacy system with hardcoded tax logic, ensuring zero downtime and data integrity.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'Twin v1 is a business-critical distributor system used daily for sales, invoicing, and financial reporting across multiple branches. In 2022, the Indonesian government officially increased VAT (PPN) from 10% to 11%, directly impacting invoice totals, financial reports, and legal compliance.',
                    'I had long been aware that the system’s tax logic was fragile, as VAT percentages were hardcoded deep inside the codebase. When the regulation change was announced, the request to handle this update came directly from the CEO, reflecting the financial and legal sensitivity of the issue.',
                ],
            },
            {
                id: 'the-problem',
                label: 'The Problem',
                paragraphs: [
                    'The system calculated VAT dynamically every time data was fetched. There were no persisted calculated values for totals, VAT, or grand totals. Instead, all values were recalculated in real time from master data.',
                    'VAT logic was duplicated across multiple APIs, and there was no reliable historical record of which VAT percentage had been applied to a given transaction. Changing hardcoded values was never a valid option, as it would retroactively alter historical invoices and reports, creating serious accounting and legal risks.',
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                items: [
                    'Transactions could not be paused or stopped during the change.',
                    'No centralized calculation service existed in the codebase.',
                    'Automated test coverage was minimal and uneven.',
                    'The system relied heavily on real-time recalculation.',
                    'I handled the fix alone due to system complexity and sensitivity.',
                    'A full architectural refactor was too risky for a production-critical system.',
                ],
            },
            {
                id: 'decision-and-approach',
                label: 'Decision and Approach',
                paragraphs: [
                    'I implemented a versioned, configuration-based tax strategy. For new transactions, VAT was driven by configuration rather than hardcoded values. I introduced a new column in the existing transaction table to store the VAT percentage applied to each transaction.',
                    'Historical records preserved their original VAT values, while new transactions respected the configured rate. This prevented retroactive recalculation and allowed the system to safely support regulatory changes.',
                ],
            },
            {
                id: 'risk-management-and-verification',
                label: 'Risk Management and Verification',
                paragraphs: [
                    'To reduce operational and legal risk, I added end-to-end tests for critical operational APIs and performed extensive manual validation. I collaborated closely with the finance team to verify calculations and edge cases.',
                    'I also introduced a runtime flag that blocked transactions if the VAT percentage did not match the officially valid value during the initial rollout period. For two weeks, invoices and reports were continuously revalidated to ensure correctness.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'The system handled the VAT increase without disrupting daily operations. Invoice totals and reports remained accurate, historical data was preserved, and a major legal and financial risk was removed without stopping the business.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'This change did not improve Twin v1’s overall architecture. Due to the lack of centralized logic, the solution required defensive additions across multiple APIs. In practice, this was a controlled patch rather than a structural refactor.',
                    'However, this experience strongly influenced how I designed later systemsPage—especially LAAS—where tax and pricing logic are treated as versioned, auditable data rather than dynamically recomputed values.',
                ],
            },
        ],
        glossary: [
            {
                term: 'legacy system',
                definition:
                    'An outdated computer system, programming language, or software application that is still in use by an organization.',
            },
            {
                term: 'master data',
                definition:
                    'The core data within an enterprise that describes objects like products, customers, and suppliers around which business is conducted.',
            },
        ],
        qnas: [
            {
                question: 'Why was changing the hardcoded VAT value directly not an option?',
                answer: 'Because the system recalculated totals in real-time. Changing the value would have retroactively altered all historical invoices, causing massive legal and accounting discrepancies.',
            },
            {
                question: 'How do you handle regulatory changes in legacy systems safely?',
                answer: 'By shifting from hardcoded logic to versioned, configuration-based strategies and persisting the actual applied rates at the time of transaction.',
            },
        ],
    },
    id: null,
};

export function useVatChangeCaseData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () => VAT_CHANGE_CASE_BY_LOCALE[locale.value] ?? VAT_CHANGE_CASE_BY_LOCALE.en,
    );
}

export default VAT_CHANGE_CASE_BY_LOCALE.en;
