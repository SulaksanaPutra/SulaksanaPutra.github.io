import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { Writing } from '@/modules/home/types/writing.types.ts';

const WRITING_BY_LOCALE: Record<'en' | 'id', Writing> = {
    en: {
        title: 'Writing',
        descriptions: [
            'Here you will find my essays, notes, and long-form thoughts on software engineering, system design, and other topics that interest me.',
        ],
    },
    id: {
        title: 'Tulisan',
        descriptions: [
            'Di sini Anda akan menemukan esai, catatan, dan pemikiran panjang saya tentang rekayasa perangkat lunak, desain sistem, dan topik lain yang saya minati.',
        ],
    },
};

export function useWritingData() {
    const { locale } = useI18n();

    return computed<Writing>(() => WRITING_BY_LOCALE[locale.value] ?? WRITING_BY_LOCALE.en);
}

export default WRITING_BY_LOCALE.en;
