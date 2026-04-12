import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { HomeDrawer } from '@/modules/home/types/home.types.ts';

const HOME_DRAWER_BY_LOCALE: Record<'en' | 'id', HomeDrawer> = {
    en: [
        {
            id: 'home',
            href: '/',
            label: 'About',
            description: 'Background, values, and professional summary',
        },
        {
            id: 'writing',
            href: '/writing',
            label: 'Writing',
            description: 'Essays, notes, and long-form thoughts',
        },
        {
            id: 'projects',
            href: '/projects',
            label: 'Projects',
            description: 'Short ideas, experiments, and drafts',
        },
        {
            id: 'uses',
            href: '/uses',
            label: 'Uses',
            description: 'Tools, hardware, and software I use daily',
        },
        {
            id: 'hobbies',
            href: '/hobbies',
            label: 'Hobbies',
            description: 'Things I enjoy doing',
        },
    ],
    id: [
        {
            id: 'home',
            href: '/',
            label: 'About',
            description: 'Latar belakang, prinsip, dan rangkuman profesional.',
        },
        {
            id: 'writing',
            href: '/writing',
            label: 'Tulisan',
            description: 'Esai, catatan, dan pemikiran mendalam.',
        },
        {
            id: 'projects',
            href: '/projects',
            label: 'Project',
            description: 'Ide singkat, eksperimen, dan draf.',
        },
        {
            id: 'uses',
            href: '/uses',
            label: 'Uses',
            description: 'Tool, hardware, dan software yang aku pakai sehari-hari.',
        },
        {
            id: 'hobbies',
            href: '/hobbies',
            label: 'Hobi',
            description: 'Hal-hal yang aku nikmati.',
        },
    ],
};

export function useHomeDrawerData() {
    const { locale } = useI18n();

    return computed<HomeDrawer>(
        () => HOME_DRAWER_BY_LOCALE[locale.value] ?? HOME_DRAWER_BY_LOCALE.en,
    );
}

export default HOME_DRAWER_BY_LOCALE.en;
