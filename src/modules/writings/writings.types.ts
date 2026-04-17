import { Link } from '@/core/types/link.types';
import { GlossaryItem } from '@/core/types/glossary.types';

export interface Writing {
    id: string;
    title: string;
    subtitle: string;
    thumbnail: string | { light: string; dark: string };
    date: string;
    link: Link;
}

export type Writings = Writing[];

export interface WritingArticle {
    id: string;
    backLink: Link;
    title: string;
    subtitle?: string;
    highlight: string;
    keywords?: string;
    thumbnail: string | { light: string; dark: string };
    date: string;
    sections: {
        id: string;
        label?: string;
        paragraphs?: string[];
        items?: string[];
        image?: string | { light: string; dark: string }; // Optional illustration for the section
        codeBlock?: {
            language: string;
            code: string;
        };
    }[];
    glossary?: GlossaryItem[];
    qnas?: {
        question: string;
        answer: string;
    }[];
}

export type WritingArticles = WritingArticle[];
