import { HomeDrawerItem } from '@/types/drawer';

const homeDrawer: HomeDrawerItem[] = [
    {
        id: 'about',
        href: '/',
        label: 'About',
        description: 'Background, values, and professional summary',
    },
    {
        id: 'writing',
        href: '/writing',
        label: 'Writing',
        description: 'Essays, notes, and long-form thoughts',
    },
    {
        id: 'projects',
        href: '/projects',
        label: 'Projects',
        description: 'Short ideas, experiments, and drafts',
    },
    {
        id: 'uses',
        href: '/uses',
        label: 'Uses',
        description: 'Tools, hardware, and software I use daily',
    },
    {
        id: 'hobbies',
        href: '/hobbies',
        label: 'Hobbies',
        description: 'Things I enjoy doing',
    },
];

export default homeDrawer;
