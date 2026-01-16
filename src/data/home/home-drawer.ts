import { HomeDrawerItem } from '@/types/drawer';

const homeDrawer: HomeDrawerItem[] = [
    {
        id: 'homePage',
        href: '/',
        label: 'About',
        description: 'Background, values, and professional summary',
    },
    {
        id: 'writingPage',
        href: '/writing',
        label: 'Writing',
        description: 'Essays, notes, and long-form thoughts',
    },
    {
        id: 'projectsPage',
        href: '/projects',
        label: 'Projects',
        description: 'Short ideas, experiments, and drafts',
    },
    {
        id: 'usesPage',
        href: '/uses',
        label: 'Uses',
        description: 'Tools, hardware, and software I use daily',
    },
    {
        id: 'hobbiesPage',
        href: '/hobbies',
        label: 'Hobbies',
        description: 'Things I enjoy doing',
    },
];

export default homeDrawer;
