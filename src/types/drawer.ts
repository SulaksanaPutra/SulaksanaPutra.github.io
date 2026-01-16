import { Link } from '@/types/link';

type BaseDrawerItem = {
    id: string;
    label: string;
    description?: string;
    href?: string;
    isActive?: boolean;
};

export type SystemsDrawerItem = BaseDrawerItem;

export interface CaseStudiesDrawerItem extends BaseDrawerItem {
    cases: Link[];
}

export type HomeDrawerItem = BaseDrawerItem;
