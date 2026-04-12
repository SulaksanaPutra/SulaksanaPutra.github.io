import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { Contact } from '@/modules/contact/contact.types.ts';

const CONTACT_BY_LOCALE: Record<'en' | 'id', Contact> = {
    en: {
        title: "Let's Talk",
        descriptions: [
            "I'm always open to discussing new opportunities, collaborations, or just chatting about technology.",
            'You can reach me at <a href="mailto:info@bayuaksana.com" class="text-accent-primary hover:underline">info@bayuaksana.com</a>.',
        ],
        email: 'info@bayuaksana.com',
    },
    id: {
        title: 'Yuk, Ngobrol!',
        descriptions: [
            'Aku selalu terbuka untuk mendiskusikan new opportunities, kolaborasi, atau sekadar ngobrol seputar teknologi.',
            'Kamu bisa hubungi aku di <a href="mailto:info@bayuaksana.com" class="text-accent-primary hover:underline">info@bayuaksana.com</a>.',
        ],
        email: 'info@bayuaksana.com',
    },
};

export function useContactData() {
    const { locale } = useI18n();

    return computed<Contact>(() => CONTACT_BY_LOCALE[locale.value] ?? CONTACT_BY_LOCALE.en);
}

export default CONTACT_BY_LOCALE.en;
