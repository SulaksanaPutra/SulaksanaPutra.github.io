import { Systems } from '@/modules/systems/systems.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const SYSTEMS_BY_LOCALE: Record<'en' | 'id', Systems> = {
    en: [
        {
            id: 'system-laas',
            title: 'LAAS — Logistics as a Service',
            heading: 'LAAS',
            highlight:
                'A hybrid service portal and API gateway for commercial logistics-as-a-service',
            subtitle:
                'A multi-tenant service portal and API gateway designed for commercial logistics-as-a-service.',
            tags: ['Logistics ', ' Customer Portals ', ' API Integration'],
            sections: [
                {
                    label: 'Context',
                    description:
                        'Designed as a "capsulated" bridge to expose internal warehouse and delivery capabilities to the commercial market. The system provides a user-friendly interface for end-clients while offering a flexible Open API for external business integrations, all while maintaining a secure abstraction layer over internal core systems.',
                },
                {
                    label: 'My Responsibility',
                    description:
                        'I served as the sole architect and technical lead, managing the end-to-end development of the platform. I focused on creating a decoupled architecture that could handle both high-traffic UI interactions and complex API requests. My goal was to ensure architectural integrity and system security, shielding the "Twin" ecosystem while delivering a simplified experience for external users.',
                },
                {
                    label: 'Outcome',
                    description:
                        'Successfully delivered a production-ready platform that enabled the business to offer logistics-as-a-service to the public. The system provides the flexibility to support both manual client operations via a modern UI and automated business integrations via API, establishing a secure and scalable gateway for external logistics management.',
                },
            ],
            link: {
                id: 'view-laas',
                href: '/case-studies?systemId=system-laas',
                label: '→ View case study',
            },
            glossary: [
                {
                    term: 'LAAS',
                    definition:
                        'Logistics as a Service — a business model where companies outsource their logistics operations to a third-party provider.',
                },
                {
                    term: 'API Gateway',
                    definition:
                        'A management layer that sits between clients and backend services, handling authentication, routing, and rate limiting.',
                },
            ],
        },
        {
            id: 'system-twin-v2-wms',
            title: 'Twin V2 — Warehouse Management System',
            heading: 'Twin V2 WMS',
            highlight: 'Dedicated service for warehouse management and inventory operations',
            subtitle: 'A multi-tenant, SaaS-ready WMS resolving legacy debt for standalone growth',
            tags: ['Warehouse Management ', 'Multi-tenancy ', ' SaaS Foundation'],
            sections: [
                {
                    label: 'Context',
                    description:
                        'Designed as a dedicated miniservice to address deep-rooted structural issues within the legacy warehouse logic. This system was built to decouple business-critical inventory operations from the monolith, transforming a problematic internal tool into a high-performance, sellable SaaS foundation.',
                },
                {
                    label: 'My Responsibility',
                    description:
                        'I designed and owned the backend architecture, focusing on building a clean domain model that resolved the "ghost stock" and calculation errors of the legacy system. I managed the transition to a multi-tenant architecture, ensuring service boundaries were robust enough to allow the WMS to function as a standalone product while maintaining reliable integration with existing order systems.',
                },
                {
                    label: 'Outcome',
                    description:
                        'Successfully replaced a fragile legacy module with a stable, scalable service. This transition not only improved inventory correctness but also created a new business opportunity by providing a "capsulated" application that can be deployed as a dedicated service for external clients.',
                },
            ],
            link: {
                id: 'view-fms',
                href: '/case-studies?systemId=system-twin-v2-fms',
                label: '→ View case study',
            },
            glossary: [
                {
                    term: 'WMS',
                    definition:
                        'Warehouse Management System — software designed to optimize and manage warehouse operations and inventory.',
                },
                {
                    term: 'SaaS',
                    definition:
                        'Software as a Service — a software distribution model where applications are hosted by a provider and made available over the internet.',
                },
                {
                    term: 'Multi-tenant',
                    definition:
                        'An architecture where a single instance of software serves multiple customers, with data virtually isolated for each.',
                },
            ],
        },
        {
            id: 'system-twin-v2-fms',
            title: 'Twin V2 — Fleet Management System',
            heading: 'Twin V2 FMS',
            highlight: 'Dedicated service for fleet operations and delivery settlement.',
            subtitle:
                'A multi-tenant, SaaS-oriented miniservice designed to decouple fleet operations.',
            tags: ['Logistics', ' Delivery Operations', 'Multi-tenancy'],
            sections: [
                {
                    label: 'Context',
                    description:
                        'Part of a strategic shift to separate business units into dedicated, standalone services. This system extracted complex fleet and settlement logic from the legacy monolith, creating a high-traceability platform capable of supporting multiple business entities independently.',
                },
                {
                    label: 'My Responsibility',
                    description:
                        'I led the architectural design and domain modeling, focusing on defining clear service boundaries. I ensured the FMS could function as a standalone product while maintaining reliable, real-time integration with peer services and the core distribution platform. I also implemented the core correctness safeguards for the end-to-end settlement workflow.',
                },
                {
                    label: 'Outcome',
                    description:
                        'Established a dedicated, scalable platform for delivery execution with high data integrity. By decoupling fleet logic and implementing a multi-tenant architecture, we provided the business with a specialized, "capsulated" tool that can evolve independently and serve external clients as a SaaS offering.',
                },
            ],
            link: {
                id: 'view-fms',
                href: '/case-studies?systemId=system-twin-v2-fms',
                label: '→ View case study',
            },
            glossary: [
                {
                    term: 'FMS',
                    definition:
                        'Fleet Management System — a platform used to manage, coordinate, and monitor commercial motor vehicles.',
                },
                {
                    term: 'Miniservice',
                    definition:
                        'A variant of microservices that are slightly larger in scope, focusing on a specific business domain while being independently deployable.',
                },
            ],
        },
        {
            id: 'system-twin-v1',
            title: 'Twin — In-house Distributor System',
            heading: 'Twin V1',
            highlight: 'A legacy monolith that powered daily distributor operations.',
            subtitle: 'Centralized management for multi-tenant, multi-branch distribution.',
            tags: ['Distribution', ' Inventory', 'Order Operations'],
            sections: [
                {
                    label: 'Context',
                    description:
                        'A large Laravel monolith serving multiple companies. The legacy architecture lacked automated testing and relied on isolated local databases, making data reconciliation a manual, high-risk process.',
                },
                {
                    label: 'My responsibility',
                    description:
                        'As a core maintainer for over three years, I was responsible for the long-term stability and evolution of the platform. I led the incremental refactoring of high-stakes business logic and introduced automated testing to secure legacy modules. My role involved balancing daily production support with strategic technical improvements, ensuring the system remained reliable as we expanded operations to new branches.',
                },
                {
                    label: 'Outcome',
                    description:
                        'Unified fragmented branch data into a single source of truth. By migrating from isolated local systems to a centralized cloud platform, we eliminated manual reconciliation errors and enabled real-time operational tracking across all companies.',
                },
            ],
            link: {
                id: 'view-twin-v1',
                href: '/case-studies?systemId=system-twin-v1',
                label: '→ View case study',
            },
            glossary: [
                {
                    term: 'Monolith',
                    definition:
                        'A software architecture where all components of an application are unified into a single program and codebase.',
                },
                {
                    term: 'Data Reconciliation',
                    definition:
                        'The process of comparing two sets of records to ensure they are in agreement and accurate.',
                },
            ],
        },
    ],
    id: [],
};

export function useSystemsData() {
    const { locale } = useI18n();

    return computed<Systems>(() => SYSTEMS_BY_LOCALE[locale.value] ?? []);
}

export function useSystemsAvailability() {
    return computed(() => {
        const availableLocales = [];
        if (SYSTEMS_BY_LOCALE.en?.length > 0) availableLocales.push('en');
        if (SYSTEMS_BY_LOCALE.id?.length > 0) availableLocales.push('id');
        return availableLocales;
    });
}

export default SYSTEMS_BY_LOCALE.en;
