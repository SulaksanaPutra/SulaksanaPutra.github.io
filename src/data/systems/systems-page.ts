import { System } from '@/types/system.ts';

const systemsPage: System[] = [
    {
        id: 'system-laas',
        title: 'LAAS — Logistics as a Service',
        highlight:
            'A customer-facing platform exposing logistics capabilities to external clients while protecting internal operational systemsPage.',
        tags: ['Customer-facing', 'B2B', 'B2C'],
        sections: [
            {
                label: 'Design intent',
                description:
                    'Designed to support a new business model where warehouse capacity and logistics services could be rented to external customers. Acts as a controlled access layer that exposes logistics operations without coupling clients to internal systemsPage.',
            },
            {
                label: 'Architecture',
                description:
                    'Implemented as an asynchronous proxy using queues and background jobs. Requests follow a fire-and-forget model, requiring strong observability, logging, and traceability to compensate for the lack of immediate synchronous feedback.',
            },
            {
                label: 'My role',
                description:
                    'Sole designer and technical decision-maker. Led development with support from two other developers, selecting architecture, patterns, and trade-offs based on lessons learned from earlier systemsPage.',
            },
            {
                label: 'Trade-offs',
                description:
                    'Chose Laravel to meet tight delivery timelines, accepting performance and strictness limitations compared to Go. Mitigated these through explicit service layers, DTO usage, and strict separation between validation, data access, and business logic.',
            },
            {
                label: 'Outcome',
                description:
                    'Enabled a new logistics business model by giving customers real-time access to logistics capabilities while shielding internal systemsPage from direct external interaction.',
            },
        ],
        link: {
            id: 'view-laas',
            href: '/case-studies#laas',
            label: '→ View case study',
        },
    },
    {
        id: 'system-twin-v2-wms',
        title: 'Twin V2 — Warehouse Management System',
        highlight:
            'A standalone warehouse management system designed to replace legacy stock handling while serving as a foundation for a future SaaS offering.',
        tags: ['Warehouse Management', 'Distribution', 'Logistics'],
        sections: [
            {
                label: 'Architecture & design',
                description:
                    'Backend implemented as independent services with separate databases, written in Go to prioritize performance, reliability, and infrastructure cost efficiency. The frontend was shared across applications to reduce operational overhead. Design decisions balanced SaaS generality against customer-specific requirements inherited from the legacy system.',
            },
            {
                label: 'Trade-offs',
                description:
                    'Chose Go despite a slower development pace to improve correctness and long-term operability. Accepted limited modularity in certain workflows due to tight coupling with legacy sales systemsPage, deferring full SaaS generalization to later phases.',
            },
            {
                label: 'My role',
                description:
                    'Designed and owned the backend architecture, including service boundaries, data separation, and integration contracts. Contributed to frontend architectural decisions and took primary responsibility for backend stability in production.',
            },
            {
                label: 'Outcome',
                description:
                    'Delivered a more reliable and scalable stock management system with significantly clearer architecture than the legacy platform. Enabled horizontal scaling, safer data migration, and improved correctness of inventory calculations.',
            },
        ],
        link: {
            id: 'view-wms',
            href: '/case-studies#twin-v2-wms',
            label: '→ View case study',
        },
    },
    {
        id: 'system-twin-v2-fleet',
        title: 'Twin V2 — Fleet Management System',
        highlight:
            'A standalone delivery domain created to isolate fleet and settlement workflows after the organization split warehouse and delivery into separate business units.',
        tags: ['Logistics', 'Delivery Operations'],
        sections: [
            {
                label: 'Key complexity',
                description:
                    'Although simpler than WMS in flow, the system required high transparency and traceability. This led to complex relational models and extensive logging of state changes. A major challenge was reconciling inconsistent legacy business rules—such as unit measurements—into a stable and general-purpose domain model.',
            },
            {
                label: 'Reliability approach',
                description:
                    'Integration safety was critical. Failures in communication with WMS or Sales systemsPage could cascade into financial impact, so consistency checks and saga-style coordination were implemented to protect transaction settlement.',
            },
            {
                label: 'My role',
                description:
                    'Designed the system boundaries and core domain model, implemented critical correctness safeguards, and owned integration reliability across dependent systemsPage.',
            },
            {
                label: 'Outcome',
                description:
                    'Delivered a reliable delivery execution platform with improved correctness in settlement and measurement handling, while maintaining safe integration with upstream and downstream systemsPage.',
            },
            {
                label: 'What I would change today',
                description:
                    'Reduce architectural layering to improve development speed and clarity. With more time, I would explore automated routing using optimization or machine learning techniques once the domain model is sufficiently simplified.',
            },
        ],
        link: {
            id: 'view-fms',
            href: '/case-studies#twin-v2-fms',
            label: '→ View case study',
        },
    },
    {
        id: 'system-twin-v1',
        title: 'Twin — In-house Distributor System',
        highlight:
            'A business-critical legacy platform that unified fragmented, paper-based distributor operations into a single operational backbone across multiple companies and branches.',
        tags: ['Distribution', 'Inventory', 'Sales Operations'],
        sections: [
            {
                label: 'Context & constraints',
                description:
                    'A large Laravel monolith used daily by two distributor companies and all their branches. The system had minimal automated testing, duplicated business logic, and real-time operational tables. Architectural change carried high risk, limiting scalability primarily to vertical approaches.',
            },
            {
                label: 'My responsibility',
                description:
                    'Inherited and maintained the system in production. Led incremental refactoring in high-risk areas, introduced unit testing for critical calculations, resolved major tax-calculation defects, and supported rollout to additional branch offices. Shared direct responsibility for production stability within a small core team.',
            },
            {
                label: 'Outcome',
                description:
                    'Replaced branch-isolated and paper-based workflows with a centralized system relied on for daily operations. Improved data consistency, reduced manual reconciliation, and enabled real-time visibility across distributor branches.',
            },
        ],
        link: {
            id: 'view-twin-v1',
            href: '/case-studies#twin-v1',
            label: '→ View case study',
        },
    },
];

export default systemsPage;
