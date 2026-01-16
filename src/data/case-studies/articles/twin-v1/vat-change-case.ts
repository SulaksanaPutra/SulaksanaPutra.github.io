import { VatChangeCase } from '@/types/case-study.ts';

const vatChangeCase: VatChangeCase = {
    backLink: {
        id: 'case-studies',
        href: '/case-studies',
        label: '← Back to Case Studies',
    },
    title: 'Handling a VAT Increase in a Legacy, Real-Time System',
    highlight: 'Twin v1 — Regulatory change under production and architectural constraints',
    sections: [
        {
            label: 'Context',
            paragraphs: [
                'Twin v1 is a business-critical distributor system used daily for sales, invoicing, and financial reporting across multiple branches. In 2022, the Indonesian government officially increased VAT (PPN) from 10% to 11%, directly impacting invoice totals, financial reports, and legal compliance.',
                'I had long been aware that the system’s tax logic was fragile, as VAT percentages were hardcoded deep inside the codebase. When the regulation change was announced, the request to handle this update came directly from the CEO, reflecting the financial and legal sensitivity of the issue.',
            ],
        },
        {
            label: 'The Problem',
            paragraphs: [
                'The system calculated VAT dynamically every time data was fetched. There were no persisted calculated values for totals, VAT, or grand totals. Instead, all values were recalculated in real time from master data.',
                'VAT logic was duplicated across multiple APIs, and there was no reliable historical record of which VAT percentage had been applied to a given transaction. Changing hardcoded values was never a valid option, as it would retroactively alter historical invoices and reports, creating serious accounting and legal risks.',
            ],
        },
        {
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
            label: 'Decision and Approach',
            paragraphs: [
                'I implemented a versioned, configuration-based tax strategy. For new transactions, VAT was driven by configuration rather than hardcoded values. I introduced a new column in the existing transaction table to store the VAT percentage applied to each transaction.',
                'Historical records preserved their original VAT values, while new transactions respected the configured rate. This prevented retroactive recalculation and allowed the system to safely support regulatory changes.',
            ],
        },
        {
            label: 'Risk Management and Verification',
            paragraphs: [
                'To reduce operational and legal risk, I added end-to-end tests for critical operational APIs and performed extensive manual validation. I collaborated closely with the finance team to verify calculations and edge cases.',
                'I also introduced a runtime flag that blocked transactions if the VAT percentage did not match the officially valid value during the initial rollout period. For two weeks, invoices and reports were continuously revalidated to ensure correctness.',
            ],
        },
        {
            label: 'Outcome',
            paragraphs: [
                'The system handled the VAT increase without disrupting daily operations. Invoice totals and reports remained accurate, historical data was preserved, and a major legal and financial risk was removed without stopping the business.',
            ],
        },
        {
            label: 'Reflection',
            paragraphs: [
                'This change did not improve Twin v1’s overall architecture. Due to the lack of centralized logic, the solution required defensive additions across multiple APIs. In practice, this was a controlled patch rather than a structural refactor.',
                'However, this experience strongly influenced how I designed later systemsPage—especially LAAS—where tax and pricing logic are treated as versioned, auditable data rather than dynamically recomputed values.',
            ],
        },
    ],
};

export default vatChangeCase;
