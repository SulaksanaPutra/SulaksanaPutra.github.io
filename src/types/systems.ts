import { Link } from '@/types/link.ts';

export interface Systems {
    id: string;
    title: string;
    highlight: string;
    tags: string[];
    sections: {
        label: string;
        description: string;
    }[];
    link?: Link;
}
