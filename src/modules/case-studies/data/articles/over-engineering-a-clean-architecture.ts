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
        systemIds: ['system-twin-v2-wms', 'system-twin-v2-fms'],
        title: 'Over-engineering a Clean Architecture',
        heading: 'Clean Architecture Trade-offs',
        highlight:
            'Designed a strict layered architecture in Go to prevent chaos—then learned to simplify it when structure became friction.',
        subtitle:
            'Building WMS and DMS as standalone SaaS products taught me that clean architecture must match product scale and team maturity.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'This case involved the parallel development of two applications: a Warehouse Management System (WMS) and a Fleet Management system (FMS). Both were extracted from the Twin v1 monolith and rebuilt as standalone SaaS applications after the company separated those business units.',
                    'As the Senior Developer leading the architectural design, I defined the base modules, structural patterns, and overall code flow. My primary goal was to prevent a return to the architectural chaos of v1, where business logic was scattered across controllers without clear boundaries.',
                ],
            },
            {
                id: 'the-problem',
                label: 'The Problem',
                paragraphs: [
                    'The challenge was not performance or system instability, but architectural complexity. Since the majority of the team was experienced in PHP/Laravel but new to Go, I implemented a Technical Layering (Layered-by-Type) approach to provide a familiar mental model for the team.',
                    'I established a strict separation between validation, handlers, business logic, repositories, and response formatting. In practice, even though those strict principles created clean boundaries, they led to increased friction. While the structure was theoretically clean, Go lacks the framework abstractions of Laravel, meaning every layer required explicit, repetitive implementation.',
                    'We hit a specific wall with domain logic: sometimes there were crucial complex checkers that required deeper service layers to function. To align with the architectural principles, we often ended up duplicating validation logic across layers. This resulted in redundant database queries and unnecessary code complexity just to satisfy the rules of the structure.',
                ],
            },
            {
                id: 'impact',
                label: 'Impact',
                paragraphs: [
                    'This "Boilerplate Tax" made feature development significantly slower than necessary. With a limited team responsible for maintaining multiple SaaS applications, this overhead became a critical bottleneck.',
                    "The issue wasn't a technical failure, but an architectural overinvestment. The complexity of the structure didn't match the actual needs of the products, making it difficult to manage the sustainability of multiple platforms simultaneously while under constant delivery pressure.",
                ],
            },
            {
                id: 'decision-and-approach',
                label: 'Decision and Approach',
                paragraphs: [
                    'Recognizing that the architecture had become a hindrance, I led a pivot toward a more Pragmatic Layering model. We chose to simplify the layers where structure had turned into friction, focusing on these key changes:',
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
                    'Simplifying the layers significantly improved development speed and reduced the amount of manual boilerplate code. The system remained maintainable and testable, but with far less rigidity. The architecture became supportive rather than restrictive, allowing our limited team to manage the various SaaS applications more effectively and comfortably.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'At the time, I believed a strict structure was the only way to prevent technical debt and correct the weaknesses of v1. However, I learned that over-engineering can be just as harmful as under-engineering. I now prioritize Progressive Complexity: start simple, define clear boundaries, and only evolve the structure as real needs emerge. Architecture should serve the product—not the architect’s vision of perfection. Good ideas do not need to be implemented all at once; they are better introduced when the system truly demands them.',
                ],
            },
        ],
        qnas: [
            {
                question:
                    'How did you identify which layers were "unnecessary" versus which were "essential"?',
                answer: "We identified friction by looking for Functional Redundancy. For instance, in our stock-subtraction logic, we had a validation layer checking if stock existed, and a service layer that also had to 'catch and try' the same check during execution. We realized we were managing the same business rule in two places for two different reasons. By collapsing these, we didn't just remove code—we removed the risk of the validation and service layers ever falling out of sync.",
            },
            {
                question:
                    'By moving validation deeper into the service layers, didn\'t you risk "leaking" concerns and making unit testing harder?',
                answer: "Every architectural choice is a trade-off. While moving validation deeper technically 'leaks' concerns into the service layer, it was a necessary pivot for our system's scale. In a massive enterprise app, strict separation is a shield; in a leaner SaaS, it’s a hurdle. We consolidated our test suites so that the service layer tests handled both the business invariant and the validation, ensuring we didn't lose coverage, just complexity.",
            },
        ],
        glossary: [
            {
                term: 'Clean Architecture',
                definition:
                    'A software design philosophy focused on strict layering and separation of concerns. While intended to prevent chaos, it can introduce significant friction if the structure exceeds the actual needs of the product.',
            },
            {
                term: 'Technical Layering',
                definition:
                    'An organizational pattern where code is grouped by technical function (Handlers, Services, Repositories). Used here to provide a familiar mental model for a team transitioning from PHP/Laravel to Go.',
            },
            {
                term: 'Boilerplate Tax',
                definition:
                    'The overhead of writing repetitive, explicit code required to maintain a strict multi-layered structure. In this case, it became a critical bottleneck that slowed down feature development.',
            },
            {
                term: 'Functional Redundancy',
                definition:
                    'A state where the same logic—such as a stock check—is performed in multiple layers for different reasons, leading to redundant database queries and increased code complexity.',
            },
            {
                term: 'Pragmatic Layering',
                definition:
                    'A simplified architectural model that reduces unnecessary layers and allows logic to exist where it adds the most value, prioritizing development speed over theoretical purity.',
            },
            {
                term: 'Progressive Complexity',
                definition:
                    'The architectural principle of starting with a simple structure and only evolving it into more complex patterns as real business needs and scale emerge.',
            },
            {
                term: 'Business Invariant',
                definition:
                    'A fundamental business rule that must always be true. In this case, ensuring these rules remained intact while collapsing architectural layers was a key priority.',
            },
            {
                term: 'Go',
                definition:
                    'A programming language that favors explicit implementation. Unlike frameworks with high levels of abstraction, Go requires manual effort to maintain multi-layered architectures.',
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
