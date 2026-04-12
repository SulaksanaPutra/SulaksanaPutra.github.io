import { Footer } from '@/core/types/footer.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

const FOOTER_BY_LOCALE: Record<'en' | 'id', Footer | null> = {
    en: {
        copyright: '© 2025 — This site documents my work and thinking around software system.',
        availability: 'Open to senior full-stack web engineering roles —',
        email: 'info@bayuaksana.com',
    },
    id: {
        copyright:
            '© 2025 — Situs ini berisi dokumentasi kerja dan pemikiranku seputar software system.',
        availability: 'Open untuk role senior full-stack web engineering —',
        email: 'info@bayuaksana.com',
    },
};

export function useFooterData() {
    const { locale } = useI18n();

    return computed<Footer | null>(() => FOOTER_BY_LOCALE[locale.value] ?? FOOTER_BY_LOCALE.en);
}

export default FOOTER_BY_LOCALE.en;
