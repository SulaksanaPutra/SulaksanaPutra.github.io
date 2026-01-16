import { CaseStudiesDrawerItem } from '@/types/drawer';

const caseStudiesDrawer: CaseStudiesDrawerItem[] = [
    {
        id: 'system-laas',
        label: 'LAAS',
        cases: [
            {
                id: 'laas-public-api',
                label: 'Exposing Logistics as a Public API',
                href: '/case-studies/laas-public-api',
            },
            {
                id: 'laas-async-observability',
                label: 'Designing Observability for Async Systems',
                href: '/case-studies/laas-async-observability',
            },
        ],
    },
    {
        id: 'system-twin-v2-wms',
        label: 'Twin V2 WMS',
        cases: [
            {
                id: 'wms-legacy-migration',
                label: 'Migrating Stock Logic from a Legacy Core',
                href: '/case-studies/wms-legacy-migration',
            },
            {
                id: 'wms-service-boundaries',
                label: 'Defining Service Boundaries in Go',
                href: '/case-studies/wms-service-boundaries',
            },
        ],
    },
    {
        id: 'system-twin-v2-fleet',
        label: 'Twin V2 FMS',
        cases: [
            {
                id: 'fleet-settlement-correctness',
                label: 'Building Correctness into Settlement Workflows',
                href: '/case-studies/fleet-settlement-correctness',
            },
        ],
    },
    {
        id: 'system-twin-v1',
        label: 'Twin V1',
        cases: [
            {
                id: 'twin-v1-stabilization',
                label: 'Stabilizing a Business-Critical Monolith',
                href: '/case-studies/twin-v1-stabilization',
            },
        ],
    },
];

export default caseStudiesDrawer;
