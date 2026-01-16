import { CaseStudies } from '@/types/case-studies';

const caseStudies: CaseStudies[] = [
    {
        id: 'twin-v1-vat',
        title: 'Handling a VAT Increase in a Legacy, Real-Time System',
        highlight: 'Twin v1 — Regulatory change under production and architectural constraints',
        description:
            'How I managed a critical regulatory update in a legacy system with hardcoded tax logic, ensuring zero downtime and data integrity.',
        link: {
            id: 'read-vat-case',
            href: '/case-studies/twin-v1/handling-a-vat-increase-in-a-legacy-real-time-system',
            label: 'Read Case Study →',
        },
    },
];

export default caseStudies;
