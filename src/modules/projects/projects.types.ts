import { Link } from '@/core/types/link.types';
import { GlossaryItem } from '@/core/types/glossary.types';

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    thumbnail: string | { light: string; dark: string };
    date: string;
    link: Link;
}

export type Projects = Project[];

export interface ProjectArticle {
    id: string;
    backLink: Link;
    title: string;
    subtitle?: string;
    hook: string;
    techStack: string[];
    deploymentStatus?: string;
    thumbnail: string | { light: string; dark: string };
    sections: {
        id: string;
        label?: string;
        variant?: 'standard' | 'trade-off' | 'deep-dive';
        paragraphs?: string[];
        items?: string[];
        codeBlock?: {
            language: string;
            code: string;
        };
        challenges?: {
            id: string;
            challenge: string[];
            solution: {
                paragraph?: string[];
                items?: (string | string[])[];
                codeBlock?: {
                    language: string;
                    code: string;
                };
            };
        }[];
    }[];
    glossary?: GlossaryItem[];
}

export type ProjectArticles = ProjectArticle[];
