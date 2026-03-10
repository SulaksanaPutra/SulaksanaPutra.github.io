import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const INTEGRATION_STRATEGY_CASE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'architectural-strategy-integration-hub',
        systemId: 'system-twin-v2-wms',
        title: 'Architectural Strategy: Decoupling a Point-to-Point Integration',
        heading: 'Centralized Integration Hub Proposal',
        highlight:
            'Twin v1 & SaaS WMS/FMS — Designing an orchestrator to solve distributed data inconsistencies',
        subtitle:
            'How I audited a tangled API integration and designed a centralized middleware orchestrator to resolve cross-system data loss before a strategic project halt.',
        sections: [
            {
                id: 'context-and-scale',
                label: 'Context and Scale',
                paragraphs: [
                    'Twin v1 was our monolithic distributor system handling everything from sales to warehouse management and delivery. When the business split its operations into separate warehouse and delivery entities, our tech company saw an opportunity. We decided to build a multi-tenant SaaS Warehouse Management System (WMS) and Fleet Management System (FMS) as isolated "miniservices."',
                    'The idea was to use our internal distributor as a test run—migrating operational flows out of Twin v1 and into these new SaaS products, while keeping Twin v1 as the core sales and finance point. To make this work, we needed seamless data synchronization across all three systems, handling hundreds of daily data points for an initial rollout of over 100 users.',
                ],
            },
            {
                id: 'problem',
                label: 'Problem',
                paragraphs: [
                    'Because the WMS and FMS were designed to eventually be sold as independent SaaS products, they were strictly encapsulated. To keep them synced with Twin v1, the initial integration was rushed: we relied heavily on direct Point-to-Point (P2P) API calls and webhooks.',
                    "This approach worked in theory, but in reality, it created a fragile, tangled chain of data. A flow wasn't just moving from A to B; it could jump from Sales to Warehouse, Warehouse to Delivery, and then back to Sales. If a network blip or logical error broke the chain at any point, the failure was silent. To find where the data was lost, we had to manually trace and cross-reference logs across three entirely separate applications. Debugging became a complex, time-consuming nightmare.",
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                paragraphs: [
                    'I was fully aware that this architecture was unsustainable, especially if we planned to scale and sell this SaaS to external tenants. However, the system was already in production and supporting live daily operations. The business was simply not interested in halting development to spend time and effort reinitiating the integration flow.',
                    'As a compromise, we built a reconciliation scheduler to proactively scan all three databases for missing or inconsistent data. It was a band-aid, not a cure. It kept the daily error rate low enough for our initial users, but the architectural debt was still there.',
                ],
            },
            {
                id: 'proposed-blueprint',
                label: 'Proposed Blueprint',
                paragraphs: [
                    'To fix the root cause, I designed a blueprint for a Centralized Integration Service—a Hub-and-Spoke orchestrator. Instead of direct communication between each app, every system would communicate strictly with this central proxy.',
                    'This service would act as a single source of truth for the integration, handling centralized logging, queueing, and automated retry mechanisms. If an application went down or a request failed, the hub would gracefully hold the state rather than silently dropping the data. It was a clean, scalable way to decouple the systems.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    "In the end, the new architecture was never built. The project was halted entirely because the internal distributor company went bankrupt. The application simply wasn't needed anymore.",
                    'However, the temporary reconciliation Loop solution did fulfill the immediate business requirements while the company was still running. More importantly, the engineering team fully agreed with my technical audit, and the Hub-and-Spoke blueprint was adopted as the standard for any future multi-system integrations.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'This experience taught me that rushing the early stages of integration—thinking "we just need to send data from A to B, let\'s just use an API"—quietly builds massive long-term costs. When building distributed systems, you cannot just look at what is directly in front of you.',
                    'Direct integrations without a clear, centralized strategy quickly turn into fragile webs. Today, I am much more intentional about thinking through the holistic architecture, observability, and failure states long before the first API contract is ever written.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Point-to-Point (P2P) Integration',
                definition:
                    'An architecture where systems are connected directly to one another. It works for 2-3 systems but quickly becomes unmanageable (spaghetti architecture) as more systems are added.',
            },
            {
                term: 'Hub-and-Spoke Architecture',
                definition:
                    'A centralized design where a central "hub" manages communications between various "spokes" (applications), improving observability and decoupling the systems.',
            },
            {
                term: 'API Orchestrator / Middleware',
                definition:
                    'A centralized layer that coordinates multiple requests, handles data transformation, and manages retries and logging across different services.',
            },
            {
                term: 'Cron-based Scheduler',
                definition:
                    'A time-based job scheduler used to run automated tasks (like data validation scripts) at fixed intervals.',
            },
        ],
        qnas: [
            {
                question:
                    'Why a Hub-and-Spoke proxy instead of a "proper" event-driven architecture like `Kafka`?',
                answer: 'Because we weren\'t building a unified internal platform; we were building standalone SaaS products. We chose a `miniservice` approach specifically so each app could be sold independently. If we had forced them to share a message broker, we would have permanently tethered their lifecycles together. A Hub-and-Spoke model allowed the WMS and FMS to stay "clean" and product-focused, while the Hub handled the messy, internal translation logic.',
            },
        ],
    },
    id: null,
};

export function useIntegrationStrategyCaseData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () =>
            INTEGRATION_STRATEGY_CASE_BY_LOCALE[locale.value] ??
            INTEGRATION_STRATEGY_CASE_BY_LOCALE.en,
    );
}

export default INTEGRATION_STRATEGY_CASE_BY_LOCALE.en;
