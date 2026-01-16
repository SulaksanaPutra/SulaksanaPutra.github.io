import { Header } from '@/types/header';

const header: Header = {
    searchLinks: [
        {
            id: 'home',
            label: 'Home',
            href: '/',
            description: 'Overview and introduction',
        },
        {
            id: 'systemsPage',
            label: 'Systems',
            href: '/systems',
            description: 'Architecture, patterns, and system design notes',
        },
        {
            id: 'case-studies',
            label: 'Case Studies',
            href: '/case-studies',
            description: 'Deep dives into real-world projectsPage',
        },
        {
            id: 'skillsPage',
            label: 'Skills',
            href: '/skillsPage',
            description: 'Technical stack and core competencies',
        },
        {
            id: 'contactPage',
            label: 'Contact',
            href: '/contactPage',
            description: 'What I am currently focused on',
        },
    ],
    navigations: [
        {
            id: 'home',
            label: 'Home',
            href: '/',
            hiddenOnMd: false,
        },
        {
            id: 'systemsPage',
            label: 'Systems',
            href: '/systems',
            hiddenOnMd: false,
        },
        {
            id: 'case-studies',
            label: 'Case Studies',
            href: '/case-studies',
            hiddenOnMd: true,
        },
        {
            id: 'skillsPage',
            label: 'Skills',
            href: '/skillsPage',
            hiddenOnMd: false,
        },
        {
            id: 'contactPage',
            label: 'Contact',
            href: '/contactPage',
            hiddenOnMd: false,
        },
    ],
};

export default header;
