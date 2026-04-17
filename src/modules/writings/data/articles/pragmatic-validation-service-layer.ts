import thumbnail from '@/assets/images/articles/writings/pragmatic-validation-service-layer.jpg';
import thumbnailDark from '@/assets/images/articles/writings/pragmatic-validation-service-layer.dark.png';
import { WritingArticle } from '@/modules/writings/writings.types.ts';
import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';

export const PRAGMATIC_VALIDATION_ARTICLE_BY_LOCALE: Record<'en' | 'id', WritingArticle | null> = {
    en: {
        id: 'pragmatic-validation-service-layer',
        backLink: {
            id: 'writing',
            href: '/writing',
            label: 'Back to Writing',
        },
        title: 'Pragmatic Validation in the Service Layer: Balancing Logic and Clean Architecture',
        subtitle:
            'Why stateful invariants belong inside the transaction, not a separate validation layer. Navigating Clean Architecture trade-offs.',
        highlight:
            'For small to medium applications, architectural "purity" often introduces race conditions and high boilerplate tax. Explore why pragmatic validation in the service layer helps avoid double-gatekeeping.',
        keywords: 'Pragmatic Validation, Service Layer, Clean Architecture Trade-offs, Business Logic, Double-Gatekeeping, Atomic Execution, Boilerplate Tax, Software Design',
        thumbnail: {
            light: thumbnail,
            dark: thumbnailDark,
        },
        date: '2025-01-12',
        sections: [
            {
                id: 'the-big-monster-fallacy',
                label: 'The "Big Monster" Fallacy',
                paragraphs: [
                    "The biggest mistake we make in software design is over-engineering for a scale we haven't reached yet. We build complex, multi-layered validation systems because we’re afraid of what might happen if we scale to millions of users.",
                    'But the reality of engineering is simpler: build what you need first. This pattern works exceptionally well for Miniservices or Microservices designed for specific conditions. By focusing on horizontal simplicity rather than vertical abstraction, you minimize the "Boilerplate Tax" that slows down development.',
                ],
            },
            {
                id: 'double-gatekeeping',
                label: 'The Double-Gatekeeping Anti-Pattern',
                paragraphs: [
                    'In "perfect" layered architectures, we often separate request validation from business logic. This creates a "Double-Gatekeeping" effect where the system hits the database twice for the same check.',
                    '1. `The Performance Tax`: You fetch state once to validate, and again to execute.',
                    '2. `The TOCTOU Race Condition`: Time-of-Check to Time-of-Use. A request might pass validation, but by the time it reaches the service layer, the state has changed. You end up operating on a "ghost" of the past data.',
                ],
            },
            {
                id: 'atomic-execution',
                label: 'The Shift: Atomic Execution',
                paragraphs: [
                    'Instead of asking "Can I do this?" followed by "Do this," we execute a single operation: "Do this, but only if the rules allow it." By moving checkers into the Service Layer, we leverage the database\'s own consistency engine.',
                    'Consider a general case of claiming a unique resource (like a referral code or a specific seat):',
                    '```sql\n' +
                        '-- The validation is baked into the execution\n' +
                        'UPDATE resources \n' +
                        'SET is_claimed = true, user_id = :user_id \n' +
                        'WHERE resource_id = :id AND is_claimed = false;\n' +
                        '```',
                    'If the database returns "0 rows affected," the Service Layer knows the validation failed. No double-gatekeeping. No race conditions.',
                ],
            },
            {
                id: 'trade-offs',
                label: 'Technical Trade-offs',
                paragraphs: [
                    'Architecture is a series of choices. Integrity is often superior to structural purity, but it comes with specific costs.',
                ],
                items: [
                    '`Advantages`: Zero race conditions, reduced latency (fewer DB round-trips), and significantly less boilerplate code.',
                    '`Disadvantages`: Leaky abstractions (Service knows about DB constraints) and harder unit testing (you typically need integration tests with a real DB).',
                    '`Suitability`: Ideal for small-to-medium apps or miniservices. Not recommended for massive distributed systems requiring multi-database Sagas.',
                ],
            },
            {
                id: 'conclusion',
                label: 'The Bottom Line',
                paragraphs: [
                    'Clean Architecture should not be a suicide pact. For most developers building mid-sized systems, merging stateful checks into the Service Layer is a vote for architectural honesty. It ensures your system makes decisions based on the actual state of data, not a cached snapshot from a few milliseconds ago.',
                ],
            },
        ],
        glossary: [
            {
                term: '"Big Monster" Fallacy',
                definition:
                    'The mistake of over-engineering for a massive scale that has not been reached yet, leading to excessive vertical abstraction.',
            },
            {
                term: 'Boilerplate Tax',
                definition:
                    'The time and effort lost to repetitive, manual code required to maintain complex architectural structures that do not match the actual needs of the project.',
            },
            {
                term: 'Double-Gatekeeping Anti-Pattern',
                definition:
                    'An architectural flaw where request validation and business logic are separated, forcing the system to hit the database twice for the same check.',
            },
            {
                term: 'Performance Tax',
                definition:
                    'The latency cost incurred by redundant database round-trips when fetching state separately for validation and execution.',
            },
            {
                term: 'TOCTOU Race Condition',
                definition:
                    'Short for "Time-of-Check to Time-of-Use," a flaw where the system state changes in the millisecond window between validation and execution.',
            },
            {
                term: 'Atomic Execution',
                definition:
                    'A single, unified operation that uses the database’s consistency engine to both validate and execute a rule at the exact same time.',
            },
            {
                term: 'Leaky abstractions',
                definition:
                    'A technical trade-off where a higher layer (like the Service Layer) becomes aware of lower-level constraints (like DB triggers) to ensure data integrity.',
            },
            {
                term: 'Multi-database Sagas',
                definition:
                    'Complex coordination patterns used in massive distributed systems to maintain data consistency across multiple isolated databases.',
            },
            {
                term: 'Architectural honesty',
                definition:
                    'The practice of prioritizing actual system integrity and accurate data state over strict, theoretical adherence to "Clean Architecture" rules.',
            },
        ],
    },
    id: null,
};

export function usePragmaticValidationArticleData() {
    const { locale } = useI18n();
    return computed<WritingArticle | null>(
        () =>
            PRAGMATIC_VALIDATION_ARTICLE_BY_LOCALE[locale.value as 'en' | 'id'] ??
            PRAGMATIC_VALIDATION_ARTICLE_BY_LOCALE.en,
    );
}

export default PRAGMATIC_VALIDATION_ARTICLE_BY_LOCALE.en;
