import { ref } from 'vue';
import { chatService, type Message } from '../services/chat-service';

// Shared state
const messages = ref<Message[]>([]);
const isOpen = ref(false);
const isLoading = ref(false);
const newMessage = ref('');

export function useChat() {
    const toggleChat = () => {
        isOpen.value = !isOpen.value;
        if (isOpen.value && messages.value.length === 0) {
            loadInitialMessages();
        }
    };

    const loadInitialMessages = async () => {
        isLoading.value = true;
        try {
            const initialMessages = await chatService.fetchInitialMessages();
            messages.value = initialMessages;
        } finally {
            isLoading.value = false;
        }
    };

    const send = async () => {
        if (!newMessage.value.trim() || isLoading.value) return;

        const text = newMessage.value;
        newMessage.value = '';

        // Add user message immediately
        const userMsg: Message = {
            id: Date.now(),
            body: text,
            isUser: true,
            timestamp: new Date()
        };
        messages.value.push(userMsg);

        isLoading.value = true;
        try {
            await chatService.sendMessage(text);

            // Mock a reply from the bot
            setTimeout(() => {
                const botMsg: Message = {
                    id: Date.now() + 1,
                    body: "Thanks for your message! This is a dummy response from my portfolio bot.",
                    isUser: false,
                    timestamp: new Date()
                };
                messages.value.push(botMsg);
            }, 1000);

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        messages,
        isOpen,
        isLoading,
        newMessage,
        toggleChat,
        send
    };
}
