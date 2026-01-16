import { Link } from '@/types/link.ts';

export interface CaseStudy {
    id: string;
    title: string;
    highlight: string;
    description: string;
    link: Link;
}

export interface VatChangeCase {
    backLink: Link;
    title: string;
    highlight: string;
    description?: string;
    sections: {
        label: string;
        paragraphs?: string[];
        items?: string[];
    }[];
}
