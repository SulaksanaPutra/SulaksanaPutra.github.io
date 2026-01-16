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
            id: 'systems',
            label: 'Systems',
            href: '/systems',
            description: 'Architecture, patterns, and system design notes',
        },
        {
            id: 'case-studies',
            label: 'Case Studies',
            href: '/case-studies',
            description: 'Deep dives into real-world projects',
        },
        {
            id: 'skills',
            label: 'Skills',
            href: '/skills',
            description: 'Technical stack and core competencies',
        },
        {
            id: 'contact',
            label: 'Contact',
            href: '/contact',
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
            id: 'systems',
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
            id: 'skills',
            label: 'Skills',
            href: '/skills',
            hiddenOnMd: false,
        },
        {
            id: 'contact',
            label: 'Contact',
            href: '/contact',
            hiddenOnMd: false,
        },
    ],
};

export default header;
