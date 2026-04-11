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
    },
    id: {
        title: 'Bahasa Tidak Tersedia',
        description: 'Halaman ini belum tersedia dalam bahasa yang Anda pilih. Anda dapat melihatnya dalam bahasa yang tersedia di bawah ini:',
        languagePrefix: 'Lihat dalam ',
        languageNames: {
            en: 'English',
            id: 'Bahasa Indonesia',
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
