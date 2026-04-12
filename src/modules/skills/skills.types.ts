import { GlossaryItem } from '@/core/types/glossary.types';

export interface Skills {
    sections: {
        id: string;
        label: string;
        description: string;
        points: string[];
    }[];
    glossary?: GlossaryItem[];
}
