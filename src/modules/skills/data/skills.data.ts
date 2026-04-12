import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { Skills } from '@/modules/skills/skills.types.ts';

const SKILLS_BY_LOCALE: Record<'en' | 'id', Skills | null> = {
    en: {
        sections: [
            {
                id: 'backend-architecture',
                label: 'Core: Backend Architecture & Systems',
                description:
                    'My primary expertise lies in building resilient, scalable server-side systems. I favor designs that remain predictable and easy to debug under production pressure.',
                points: [
                    'Primary Stack: Go, PHP (Laravel), and Node.js for high-concurrency services.',
                    'Data & Caching: Expert usage of SQL and NoSQL; implementation of Redis for performance.',
                    'Integration: Proficient in REST and GraphQL API design, including OpenAI API integration patterns.',
                    'Security: Implementation of multi-tenancy and complex auth flows (OAuth 2, JWT).',
                ],
            },
            {
                id: 'supporting-frontend',
                label: 'Supporting: Full-Stack Implementation',
                description:
                    'I am a full-stack capable developer who builds clean, functional interfaces to support system requirements, focusing on back-office and internal tooling.',
                points: [
                    'Web: React/Next.js and Vue/Nuxt for state-heavy administrative applications.',
                    'Mobile: Foundational experience with Flutter for cross-platform mobile execution.',
                    'UI Systems: Translation of design systems (shadcn/ui, Material, Boostrap, Tailwind) into maintainable frontend code.',
                    'Rendering: Strategic choice of SSR vs. CSR based on the specific needs of the application.',
                ],
            },
            {
                id: 'ops-automation',
                label: 'Infrastructure & Observability',
                description:
                    'I treat infrastructure as a delivery multiplier, ensuring that code moves safely from local to production.',
                points: [
                    'Automation: Orchestrating CI/CD pipelines via GitHub Actions and containerization with Docker.',
                    'Monitoring: Actionable observability using Sentry and data visualization through Metabase.',
                    'Low-Code/Ops: Utilizing n8n for rapid internal automation and data pipeline management.',
                ],
            },
            {
                id: 'execution',
                label: 'Execution & Team Leadership',
                description:
                    'With years of experience, I focus on reducing operational friction and making work executable.',
                points: [
                    'Product Mindset: Refining ambiguous business needs into high-clarity technical specifications.',
                    'Process: Leading teams via Kanban/Scrumban frameworks using Jira and Confluence.',
                    'Velocity: Managing technical debt and architectural decisions to maintain long-term delivery momentum.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Backend Architecture',
                definition:
                    'The structural design of server-side systems, focusing on how data is processed, stored, and communicated between services.',
            },
            {
                term: 'REST',
                definition:
                    'Representational State Transfer — a standard architectural style for building web services that allow systems to communicate over HTTP.',
            },
            {
                term: 'GraphQL',
                definition:
                    'A query language for APIs that allows clients to request exactly the data they need, making it more efficient than traditional REST.',
            },
            {
                term: 'CI/CD',
                definition:
                    'Continuous Integration and Continuous Deployment — a set of practices that automate the building, testing, and deployment of software.',
            },
            {
                term: 'SSR',
                definition:
                    'Server-Side Rendering — the ability of an application to contribute to the display of the web page on the server instead of in the browser.',
            },
            {
                term: 'CSR',
                definition:
                    'Client-Side Rendering — a modern web development technique where the browser renders the content using JavaScript.',
            },
            {
                term: 'Technical Debt',
                definition:
                    'The long-term cost of choosing a quick, sub-optimal solution today instead of a more robust architectural approach.',
            },
            {
                term: 'Kanban',
                definition:
                    'A visual workflow management method that helps teams visualize their work and maximize efficiency.',
            },
        ],
    },
    id: null,
};

export function useSkillsData() {
    const { locale } = useI18n();

    return computed<Skills | null>(() => SKILLS_BY_LOCALE[locale.value]);
}

export function useSkillsAvailability() {
    return computed(() => {
        const availableLocales = [];
        if (SKILLS_BY_LOCALE.en) availableLocales.push('en');
        if (SKILLS_BY_LOCALE.id) availableLocales.push('id');
        return availableLocales;
    });
}

export default SKILLS_BY_LOCALE.en;
