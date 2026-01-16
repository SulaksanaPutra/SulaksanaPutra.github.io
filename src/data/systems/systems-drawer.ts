import { SystemsDrawerItem } from '@/types/drawer';

const systemsDrawer: SystemsDrawerItem[] = [
    {
        id: 'system-laas',
        label: 'LAAS',
        description: 'External access to logistics capabilities without exposing internal systems.',
        href: '/case-studies#laas',
    },
    {
        id: 'system-twin-v2-wms',
        label: 'Twin V2 WMS',
        description: 'A clean-slate WMS built to replace a fragile legacy core.',
        href: '/case-studies#twin-v2-wms',
    },
    {
        id: 'system-twin-v2-fleet',
        label: 'Twin V2 FMS',
        description: 'Delivery and settlement isolated into a correctness-first domain.',
        href: '/case-studies#twin-v2-fms',
    },
    {
        id: 'system-twin-v1',
        label: 'Twin V1',
        description: 'A legacy monolith that powered daily distributor operations.',
        href: '/case-studies#twin-v1',
    },
];

export default systemsDrawer;
