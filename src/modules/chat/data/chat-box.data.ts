import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';
import type { ChatBoxData } from '../chat.types.ts';

const CHAT_BOX_BY_LOCALE: Record<'en' | 'id', ChatBoxData> = {
    en: {
        title: 'Chatbox',
        placeholder: 'Type a message...',
        emptyState: {
            title: "Let's chat!",
            description:
                "I'm here to help you navigate through my portfolio and answer any questions.",
        },
        ariaLabels: {
            open: 'Open chat',
            close: 'Close chat',
        },
    },
    id: {
        title: 'Chatbox',
        placeholder: 'Ketik pesan...',
        emptyState: {
            title: 'Yuk, ngobrol!',
            description:
                'Aku siap bantu kamu eksplor portofolioku atau jawab pertanyaan apa pun yang kamu punya.',
        },
        ariaLabels: {
            open: 'Buka chat',
            close: 'Tutup chat',
        },
    },
};

export function useChatBoxData() {
    const { locale } = useI18n();

    return computed<ChatBoxData>(() => CHAT_BOX_BY_LOCALE[locale.value] ?? CHAT_BOX_BY_LOCALE.en);
}

export default CHAT_BOX_BY_LOCALE.en;
