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
            'Optimizing development throughput in a complex SPA by surgically migrating to a domain-driven state model—eliminating side-effect fragility without interrupting the business feature roadmap.',
        highlight:
            'Twin v1 — Scaling front-end architecture by replacing high-friction prop-drilling with a centralized Vuex state model.',
        description:
            'As Twin v1 grew into a massive SPA, its reliance on prop-based state became a cognitive nightmare. This case study details the painful but necessary incremental migration to Vuex to restore team velocity and system predictability.',
        systemIds: ['system-twin-v1'],
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'Twin v1’s front end was built in Vue. In the optimistic early days, state management was simple: we relied entirely on `props` passed down and events (`$emit`) pushed back up. It was clean, predictable, and perfectly adequate for small features.',
                    'However, as business requirements compounded, the application mutated into a massive Single-Page Application (SPA). Pages stopped being simple views and evolved into complex, multi-step business workflows that wrangled multiple APIs, heavy client-side calculations, and tangled UI states simultaneously.',
                ],
            },
            {
                id: 'problem',
                label: 'The Problem',
                paragraphs: [
                    'Eventually, the component tree became a cognitive maze. We ended up with bloated "god components" acting as puppet masters for 9 to 15 levels of nested children. Because `state` was trapped in the parent, data had to be manually passed down through layers of components that didn’t even care about it, just to reach a deeply nested child.',
                    'When sibling components needed to communicate, the data flow became virtually impossible to trace. A minor state change in one corner of the UI would unpredictably shatter a workflow in another. The symptoms of this architectural debt became glaringly obvious:',
                ],
                items: [
                    'Debugging meant tracing dizzying, multi-level chains of `props` and emitted events.',
                    'Stale `props` and race conditions spawned subtle, irreproducible bugs.',
                    'Velocity tanked; adding a simple feature felt like navigating a minefield.',
                    'A culture of fear set in—developers were terrified to touch existing components lest the whole page collapse.',
                ],
            },
            {
                id: 'problem-conclusion',
                paragraphs: [
                    'At this point, we weren\'t just dealing with "messy code." The fundamental architecture had turned against us, making every new business request prohibitively expensive to build.',
                ],
            },
            {
                id: 'trigger',
                label: 'Trigger',
                paragraphs: [
                    'The breaking point arrived during team expansion. Onboarding new developers revealed that tracing data flow for even minor features required manual walkthroughs of deep component trees and hidden event listeners that were impossible to follow via code alone.',
                    'This friction confirmed that the overhead of managing state was disproportionate to the value we were delivering. Without a shared state model, simple UI updates had become high-risk architectural tasks that stifled our velocity.',
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                paragraphs: [
                    'A full rewrite was not a viable option for a stable production system. While a move to a more modular architecture would have optimized developer workflow, the investment of time and resources offered no immediate business benefit. The risk of destabilizing a working system outweighed the internal gains of "cleaner" code. Consequently, all architectural improvements had to be implemented surgically, without disrupting the ongoing delivery of business features.',
                ],
            },
            {
                id: 'decision',
                label: 'Decision',
                paragraphs: [
                    'We adopted `Vuex` as our state management standard because it was the most pragmatic choice for the Vue 2 ecosystem. At the time, the framework lacked the native reactivity primitives (like `ref` or `reactive`) found in modern Vue 3, making `Vuex` the only robust way to ensure a single source of truth and provide the DevTools integration necessary for predictable debugging.',
                ],
            },
            {
                id: 'implementation',
                label: 'Implementation',
                paragraphs: [
                    'To minimize production risk, we committed to a surgical, incremental migration. We prioritized high-friction, calculation-heavy modules first, accepting a temporary hybrid architecture where legacy prop-drilling coexisted with new Vuex modules. This was a necessary trade-off to pay down technical debt without halting the delivery of business features.\n',
                    'The technical rollout was guided by three strict rules:',
                ],
                items: [
                    'Domain-Based Organization: The store was structured by business domain (e.g., `store/invoicing.js`) rather than mirroring the volatile UI tree. This ensured the state remained predictable and decoupled from layout changes.',
                    'Strict State Boundaries: Only data required by multiple distant components was promoted to the global store. Ephemeral UI state (like dropdown toggles) remained local to keep the store lean and avoid `state bloat`.',
                    'Traceable Transitions: We forbid direct state mutation. Every change had to flow through Actions and Mutations, moving debugging from a "guessing game" of event listeners to a visible, chronological log of transitions in the `Vue DevTools`.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'The migration successfully decoupled our data layer from the UI hierarchy, leading to a measurable increase in development throughput. Features that previously required days of manual prop-wiring and event-tracing were delivered in hours. By centralizing the state, we transformed debugging from a "guessing game" into a predictable inspection of chronological state transitions.',
                    "This shift eliminated the side-effect fragility that had plagued the codebase. Developers no longer had to account for unintended regressions in distant components when making minor UI updates, significantly lowering the risk of change. While this wasn't a runtime performance optimization for the end-user, it drastically reduced the cognitive load for the engineering team, turning a high-maintenance legacy SPA into a manageable, scalable platform.",
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    "Looking back, I wouldn't touch `Vuex` for a modern project today; Vue 3’s `Composition API` and `Pinia` have made it largely obsolete. But the underlying architectural lesson remains permanently etched in my mind: state management is not an optimization you tack on later. It is a foundational design decision.",
                    'I learned the hard way that introducing centralized state to a mature SPA is an agonizing process of untangling wires. Since this project, I always define clear state boundaries on day one. Global state stays global, local state stays local, and I never let a component tree grow deep enough to become a cognitive trap.',
                ],
            },
        ],
        qnas: [
            {
                question: 'Why not use a Global Event Bus to solve the prop-drilling issue?',
                answer: 'An Event Bus only solves the data transport problem; it doesn\'t solve the state management problem. In a complex SPA, events quickly become "invisible spaghetti" that are nearly impossible to trace. I chose Vuex because it provided side-effect traceability—allowing us to see exactly which component triggered a change and how the state responded.',
            },
            {
                question:
                    'Did the boilerplate of Vuex (`Actions`, `Mutations`, `Getters`) slow down the team?',
                answer: 'Initially, yes, but this was a deliberate trade-off. We traded a small amount of "writing time" for a massive reduction in "debugging time." In a codebase with high side-effect fragility, explicit boilerplate is safer than implicit "magic" data flows. It moved the system from being "easy to write" to being "easy to reason about."',
            },
        ],
        glossary: [
            {
                term: 'Prop-Drilling',
                definition:
                    'An anti-pattern where data is passed through multiple layers of components that do not need the information, simply to reach a deeply nested child component.',
            },
            {
                term: 'God Components',
                definition:
                    'A component that has grown too large and complex, taking on too many responsibilities and becoming a "puppet master" for the rest of the UI tree.',
            },
            {
                term: 'Single Source of Truth',
                definition:
                    '(SSoT), The practice of structuring a system so that every piece of data is stored in only one place, ensuring that all parts of the application stay in sync.',
            },
            {
                term: 'Side-Effect Fragility',
                definition:
                    'A state where the codebase is so interconnected that a minor change in one area triggers unexpected and difficult-to-trace bugs in unrelated parts of the system.',
            },
            {
                term: 'State Mutation',
                definition:
                    'The act of changing the data within the store. By strictly controlling mutations, developers can track exactly when and why the application state changed.',
            },
            {
                term: 'Race Conditions',
                definition:
                    'A bug that occurs when the system’s timing or sequence of events (like multiple API calls) affects the final state in an unpredictable way.',
            },
            {
                term: 'Ephemeral UI State',
                definition:
                    'Temporary UI data—such as whether a dropdown is open or a loading spinner is active—that does not need to be stored globally and is kept local to a component.',
            },
            {
                term: 'Cognitive Load',
                definition:
                    'The amount of mental effort required for a developer to understand a piece of code. High cognitive load leads to more bugs and slower development velocity.',
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
