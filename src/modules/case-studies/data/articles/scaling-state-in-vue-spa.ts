import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const SCALING_STATE_IN_VUE_SPA_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        id: 'front-end-state-management-at-scale',
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        title: 'Front-end State Management at Scale (Vue → Vuex)',
        heading: 'State Management at Scale',
        subtitle:
            'An incremental approach to scaling a large, long-lived Vue single-page application by moving from deeply nested prop-based state to predictable, centralized state management with Vuex',
        highlight:
            'Improving maintainability in a large Vue SPA by centralizing shared state with Vuex.',
        description:
            'Twin v1 is a long-lived single-page application. As it grew, prop-based state management became unsustainable. This case study shows how Vuex was introduced incrementally to improve maintainability, predictability, and team onboarding.',
        systemId: 'system-twin-v1',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'Twin v1 used Vue for its front end. In the early stages, state was managed entirely through props and callbacks. Parent components passed data down, and child components emitted events back up. This approach worked fine when features were small and pages were simple.',
                    'As the system grew, however, the front end became a large single-page application with complex workflows. Many pages represented complete business processes and combined multiple APIs, calculations, and UI states in a single flow.',
                ],
            },
            {
                id: 'problem',
                label: 'The Problem',
                paragraphs: [
                    'As complexity increased, the component tree became difficult to reason about. A single page could contain 9 to 15 nested components, all coordinated through a central parent component that held most of the business logic.',
                    'State changes often needed to travel from child to parent and then back down to another child. When communication was no longer strictly parent–child but child–child, data flow became hard to trace. Small changes in one part of the UI could unexpectedly affect others.',
                    'Over time, several symptoms appeared:',
                ],
                items: [
                    'Debugging required tracing long chains of props and events',
                    'Stale props caused subtle bugs',
                    'Adding new features became slow and risky',
                    'Developers hesitated to touch existing components out of fear of breaking something',
                ],
            },
            {
                id: 'problem-conclusion',
                paragraphs: [
                    'At this point, the issue wasn’t just “messy code.” The structure itself made change expensive.',
                ],
            },
            {
                id: 'trigger',
                label: 'Trigger',
                paragraphs: [
                    'The turning point came when new developers joined the team after a company reshuffle. Even experienced developers struggled to understand the flow of data in complex pages. Explaining how a single feature worked required walking through multiple components and callback chains.',
                    'That was the moment it became clear that the problem wasn’t individual code quality—it was the absence of a shared, predictable state model.',
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                paragraphs: [
                    'This was a live production system. Rewriting the entire front end was not realistic due to the number of pages and ongoing feature requests. Other developers were working on the same UI, and improvements had to be made incrementally, without blocking delivery.',
                    'There was no strict deadline, but the pressure came from constant requests for feature changes on existing screens.',
                ],
            },
            {
                id: 'decision',
                label: 'Decision',
                paragraphs: [
                    'We chose Vuex as the state management solution. At that time, no built-in global state options existed. Vuex was the officially recommended approach and provided exactly what we were missing: shared state, predictable data flow, and proper debugging tools.',
                    'Not using Vuex wasn’t a serious option. The problem was already structural, and continuing with props and callbacks would only increase long-term complexity.',
                ],
            },
            {
                id: 'Approach',
                label: 'Approach',
                paragraphs: [
                    'The migration was incremental. We did not attempt a full rewrite. Instead, we focused on high-impact features—especially operational and calculation-heavy pages that frequently required changes.',
                    'For a long time, prop-based logic and Vuex coexisted. Less complex pages were left untouched, while the most problematic parts were gradually migrated. This allowed us to improve stability without stopping development.',
                ],
            },
            {
                id: 'implementation',
                label: 'Implementation',
                paragraphs: [
                    'The Vuex store was structured by modules, aligned with business domains rather than UI structure. Only state that needed to be shared across components was moved into Vuex.',
                    'Local UI state stayed inside components. Mutations and actions were the only way to change global state, while component-specific logic remained decoupled. This kept the store relatively small and avoided unnecessary boilerplate.',
                    'The goal was not to centralize everything, but to centralize only what truly needed to be shared.',
                ],
                codeBlock: {
                    language: 'javascript',
                    code: `// Example showing centralized store structure
const store = new Vuex.Store({
  modules: {
    orders: orderModule,
    products: productModule
  }
});

// Decoupled component using mapped actions
export default {
  computed: {
    ...mapState('orders', ['currentOrder'])
  },
  methods: {
    ...mapActions('orders', ['updateOrder'])
  }
};`,
                },
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'After introducing Vuex, development speed improved noticeably. Tasks that previously took three to four days could often be completed in one or two. Debugging became easier thanks to predictable state transitions and better tooling.',
                    'Bugs related to stale or out-of-sync state decreased, and new developers found it easier to understand how data moved through the application. The system felt less fragile, and changes no longer required mental mapping of the entire component tree.',
                    'That said, this was not a performance optimization. The main gain was cognitive clarity—for both the system and the people working on it.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'Looking back, I would not choose Vuex for a new project today. With Vue 3 and built-in global state options, I prefer lighter solutions that avoid additional dependencies.',
                    'However, this case taught me an important lesson: state management is not an optimization—it’s a design decision. Even small SPAs benefit from early, intentional state structure. Introducing it late is far more painful than introducing it early.',
                    'I also learned that centralization needs restraint. Not everything belongs in a global store. Global state should remain global; behavior and specialized logic should stay close to the components that use them.',
                    'Since this experience, I almost always introduce some form of state management early in SPA development. Done carefully, it reduces long-term complexity rather than adding to it.',
                ],
            },
        ],
        qnas: [
            {
                question: 'When should you move from props to a global state manager?',
                answer: 'When your component tree grows deep (e.g., 9+ levels) and you find yourself "drilling" props through components that don\'t actually need them just to reach a child.',
            },
            {
                question: 'Did you migrate the entire application to Vuex at once?',
                answer: 'No, we took an incremental approach, targeting the most complex, calculation-heavy pages first while leaving simpler pages with prop-based logic to avoid unnecessary friction.',
            },
        ],
    },
    id: null,
};

export function useScalingStateInVueSpaData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () =>
            SCALING_STATE_IN_VUE_SPA_BY_LOCALE[locale.value] ??
            SCALING_STATE_IN_VUE_SPA_BY_LOCALE.en,
    );
}

export default SCALING_STATE_IN_VUE_SPA_BY_LOCALE.en;
