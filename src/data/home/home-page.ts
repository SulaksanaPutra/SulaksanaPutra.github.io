import { About } from '@/types/about';

const homePage: About = {
    intro: [
        'Hi, I’m Bayu. I work on systemsPage behind everyday operations—orders, finance, payments, warehouse and fleet operations, internal platforms, and multi-tenant business tools.',
        'Over six years, I’ve built and maintained production systemsPage under real daily usage. For the last four years, I’ve worked remotely, owning features from design through production, running systemsPage under real traffic, and serving as technical lead on specific projectsPage.',
        'I design systemsPage that adapt as requirements evolve, where traffic grows unevenly and failures are subtle but costly, requiring deliberate trade-offs between speed, cost, and correctness.',
    ],
    principles: {
        title: 'How I think homePage engineering',
        items: [
            {
                label: 'Reliability',
                description:
                    'Reliable systemsPage are built on strong patterns and clear principles. When the team follows them, failures are predictable, diagnosable, and easier to resolve.',
            },
            {
                label: 'Vision & Cost Awareness',
                description:
                    'Every project has trade-offs. Early decisions homePage the app’s purpose, vision, and cost shape maintainability, scalability, and long-term success.',
            },
            {
                label: 'Simplicity',
                description:
                    'Complexity incurs a cost. My system designs prioritize simplicity, ease of use, and the ability to scale to accommodate future needs and the overall vision.',
            },
            {
                label: 'Clean boundaries',
                description:
                    'A clear assignment of responsibilities makes it easy to identify and fix problems quickly and ensures accountability across teams and tasks.',
            },
        ],
    },
    links: [
        {
            id: 'systemsPage',
            href: '/systems',
            label: '→ Systems I’ve worked on',
        },
        {
            id: 'case-studies',
            href: '/case-studies',
            label: '→ Selected case studies',
        },
    ],
};

export default homePage;
