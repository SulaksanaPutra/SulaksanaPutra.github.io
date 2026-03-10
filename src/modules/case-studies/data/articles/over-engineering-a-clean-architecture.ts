import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const OVER_ENGINEERING_A_CLEAN_ARCHITECTURE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'over-engineering-a-clean-architecture',
        systemId: 'system-twin-v2-wms',
        title: 'Over-engineering a Clean Architecture',
        heading: 'Clean Architecture Trade-offs',
        highlight:
            'Designed a strict layered architecture in Go to prevent chaos—then learned to simplify it when structure became friction.',
        subtitle:
            'Building WMS and Fleet as standalone SaaS products taught me that clean architecture must match product scale and team maturity.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'This case involved two applications developed in parallel: a Warehouse Management System (WMS) and a Fleet (delivery) system. Both were extracted from a large monolithic distributor platform (v1) and rebuilt as standalone SaaS applications after the company separated those business units.',
                    'I worked as the architecture designer and principal developer. I defined the base modules, coding standards, structural patterns, and overall code flow. The main goal was to avoid repeating the architectural chaos of v1, where business logic was scattered across controllers without clear boundaries.',
                ],
            },
            {
                id: 'the-problem',
                label: 'The Problem',
                paragraphs: [
                    'The challenge was not performance or system instability, but architectural complexity. Coming from a Laravel background, and with most of the team experienced in PHP but new to Go, I adopted a strict layered architecture inspired by Laravel best practices.',
                    'I implemented clear separation between validation, handlers, business logic, repositories, and response formatting. The structure was clean and testable, but Go does not provide the same framework abstractions as Laravel. Without that support, each layer required explicit implementation, which resulted in significant boilerplate and repetitive code.',
                    'In practice, strict boundaries created friction. For example, validation was designed to occur only in the validation layer, but real-world logic sometimes required checks inside deeper layers. To maintain purity, we duplicated validation logic, which led to redundant queries and unnecessary complexity.',
                ],
            },
            {
                id: 'impact',
                label: 'Impact',
                paragraphs: [
                    'Feature development became slower than necessary. Debugging was not difficult, but it required tracing through multiple layers of abstraction. While the structure improved maintainability and testing clarity, it also increased development time.',
                    'The issue was not technical failure—it was architectural overinvestment relative to the actual complexity of the product.',
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                paragraphs: [
                    'The applications were already in production, but still relatively small. Refactoring was technically possible because the boundaries were clear. However, since the system was stable and not breaking, architectural simplification was often deprioritized in favor of delivering new features.',
                    'The primary constraint was time and delivery pressure rather than technical limitation.',
                ],
            },
            {
                id: 'decision-and-approach',
                label: 'Decision and Approach',
                paragraphs: [
                    'We decided to simplify certain layers and relax strict validation boundaries. Instead of forcing all validation to occur only at the entry layer, we allowed validation logic to exist where it made the most practical sense.',
                    'The goal was not to remove structure, but to make it pragmatic and proportional to the system’s size.',
                ],
                items: [
                    'Reduced unnecessary layering where it added little value',
                    'Allowed validation logic in deeper layers when appropriate',
                    'Minimized duplicated database checks and redundant queries',
                    'Preserved clear boundaries while improving development flow',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'Simplifying the layers significantly improved development speed and reduced boilerplate. The system remained maintainable and testable, but with less rigidity.',
                    'The architecture became supportive rather than restrictive, and the team felt more comfortable working within it.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'At the time, I believed strict structure would prevent chaos and technical debt. My intention was to correct the weaknesses of v1 and create something future-proof. However, I learned that over-engineering can be just as harmful as under-engineering.',
                    'Clean architecture is valuable, but it must match the scale of the product and the maturity of the team. I now prioritize progressive complexity: start simple, define clear boundaries, and evolve structure as real needs emerge.',
                    'Architecture should serve the product—not the architect’s vision of perfection. Good ideas do not need to be implemented all at once; some are better introduced when the system truly demands them.',
                ],
            },
        ],
        qnas: [
            {
                question: 'Does "Clean Architecture" always mean better code?',
                answer: "Not necessarily. If the abstraction layers exceed the actual complexity of the problem or the team's needs, it creates friction and slows down development without adding real value.",
            },
            {
                question: 'What did you learn about implementing complex structures in Go?',
                answer: 'Unlike frameworks like Laravel, Go requires explicit boilerplate for every layer. One should start simple and only introduce layers when there is a concrete need for that level of abstraction.',
            },
        ],
    },
    id: null,
};

export function useOverEngineeringACleanArchitectureData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () =>
            OVER_ENGINEERING_A_CLEAN_ARCHITECTURE[locale.value] ??
            OVER_ENGINEERING_A_CLEAN_ARCHITECTURE.en,
    );
}

export default OVER_ENGINEERING_A_CLEAN_ARCHITECTURE.en;
