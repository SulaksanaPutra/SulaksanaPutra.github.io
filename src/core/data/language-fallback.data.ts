import { LanguageFallbackData } from '@/core/types/language-fallback.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

const FALLBACK_BY_LOCALE: Record<'en' | 'id', LanguageFallbackData> = {
    en: {
        title: 'Language Not Available',
        description: 'This page is not yet available in your currently selected language. You can view it in the available languages below:',
        languagePrefix: 'View in ',
        languageNames: {
            en: 'English',
            id: 'Indonesian',
        },
        links: {
            '/': 'Back to home',
            '/writing': 'Back to writing',
            '/case-studies': 'Back to case studies',
            '/case-studies?all=true': 'View all case studies',
        },
    },
    id: {
        title: 'Bahasa Tidak Tersedia',
        description: 'Halaman ini belum tersedia dalam bahasa yang Anda pilih. Anda dapat melihatnya dalam bahasa yang tersedia di bawah ini:',
        languagePrefix: 'Lihat dalam ',
        languageNames: {
            en: 'English',
            id: 'Bahasa Indonesia',
        },
        links: {
            '/': 'Kembali ke beranda',
            '/writing': 'Kembali ke tulisan',
            '/case-studies': 'Kembali ke studi kasus',
            '/case-studies?all=true': 'Lihat semua studi kasus',
        },
    },
};

export function useLanguageFallbackData() {
    const { locale } = useI18n();

    return computed<LanguageFallbackData>(
        () => FALLBACK_BY_LOCALE[locale.value] ?? FALLBACK_BY_LOCALE.en,
    );
}

export default FALLBACK_BY_LOCALE.en;
