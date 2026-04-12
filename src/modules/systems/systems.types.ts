import { DrawerItem } from '@/core/types/drawer.types.ts';
import { Link } from '@/core/types/link.types.ts';
import { GlossaryItem } from '@/core/types/glossary.types';

export interface System {
    id: string;
    title: string;
    heading: string;
    subtitle: string;
    highlight: string;
    tags: string[];
    sections: {
        label: string;
        description: string;
    }[];
    link?: Link;
    glossary?: GlossaryItem[];
}

export type Systems = System[];
export interface SystemsDrawerItem extends DrawerItem {}

export type SystemsDrawer = SystemsDrawerItem[];
