<template>
    <div class="chat-box-container">
        <!-- Chat Toggle Button - Matching btn-floating -->
        <button
            class="btn-floating md:flex hidden z-[101] pointer-events-auto"
            @click="toggleChat"
            :aria-label="isOpen ? 'Close chat' : 'Open chat'"
        >
            <MessageCircle v-if="!isOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
            <span
                v-if="!isOpen && messages.length === 0"
                class="absolute -top-1 -right-1 w-3 h-3 bg-accent-primary border-2 border-bg-main rounded-full"
            />
        </button>

        <!-- Chat Window -->
        <transition name="chat-window">
            <div
                v-if="isOpen"
                class="chat-box-window"
                :class="{ 'is-full': isFullscreen }"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
                :style="isDragging ? { transform: `translateY(${Math.max(0, dragY)}px)` } : {}"
            >
                <!-- Mobile Grabber -->
                <div class="chat-box-grabber-wrapper">
                    <div class="chat-box-grabber"></div>
                </div>

                <!-- Header -->
                <div class="chat-box-header">
                    <div class="flex items-center">
                        <h3 class="m-0">Let's talk</h3>
                    </div>
                    <button
                        @click="toggleChat"
                        class="p-2 hover:bg-bg-muted rounded-lg transition-colors text-text-secondary"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>

                <!-- Messages area -->
                <div class="chat-box-messages" ref="messageContainer">
                    <div
                        v-for="msg in messages"
                        :key="msg.id"
                        :class="[
                            'flex flex-col gap-1.5 max-w-[85%]',
                            msg.isUser ? 'self-end' : 'self-start',
                        ]"
                    >
                        <div
                            :class="[
                                'chat-box-bubble',
                                msg.isUser ? 'chat-box-bubble-user' : 'chat-box-bubble-bot',
                            ]"
                        >
                            {{ msg.body }}
                        </div>
                        <span
                            :class="[
                                'text-[0.65rem] text-text-secondary font-medium',
                                msg.isUser ? 'self-end' : 'self-start',
                            ]"
                        >
                            {{ formatTime(msg.timestamp) }}
                        </span>
                    </div>
                    <div v-if="isLoading" class="flex gap-1 p-2">
                        <span
                            class="w-1.5 h-1.5 bg-text-secondary/30 rounded-full animate-bounce"
                        />
                        <span
                            class="w-1.5 h-1.5 bg-text-secondary/30 rounded-full animate-bounce [animation-delay:-0.15s]"
                        />
                        <span
                            class="w-1.5 h-1.5 bg-text-secondary/30 rounded-full animate-bounce [animation-delay:-0.3s]"
                        />
                    </div>
                </div>

                <!-- Input area -->
                <div class="chat-box-input-area">
                    <input
                        v-model="newMessage"
                        @keyup.enter="send"
                        type="text"
                        placeholder="Type a message..."
                        class="chat-box-input"
                    />
                    <button
                        @click="send"
                        class="text-accent-primary hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!newMessage.trim() || isLoading"
                    >
                        <Send class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { MessageCircle, Send, X } from 'lucide-vue-next';
import { useChat } from '../composables/use-chat';

const { messages, isOpen, isLoading, newMessage, toggleChat, send } = useChat();
const messageContainer = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);

// Drag to Dismiss / Expand logic for mobile
const dragY = ref(0);
const startY = ref(0);
const isDragging = ref(false);

const handleTouchStart = (e: TouchEvent) => {
    if (window.innerWidth >= 768) return;
    startY.value = e.touches[0].clientY;
    isDragging.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;
    const deltaY = e.touches[0].clientY - startY.value;
    dragY.value = deltaY;
};

const handleTouchEnd = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    
    // If dragged down enough, close
    if (dragY.value > 150) {
        toggleChat();
    } 
    // If dragged up enough, fullscreen
    else if (dragY.value < -100) {
        isFullscreen.value = true;
    }
    // If dragged down from fullscreen, back to normal
    else if (isFullscreen.value && dragY.value > 100) {
        isFullscreen.value = false;
    }
    
    dragY.value = 0;
};

const scrollToBottom = async () => {
    await nextTick();
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
};

watch(() => messages.value.length, scrollToBottom);
watch(isOpen, (val) => {
    if (val) {
        scrollToBottom();
        isFullscreen.value = false;
    }
});

const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};
</script>

<style scoped>
.chat-window-enter-active,
.chat-window-leave-active {
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform-origin: bottom right;
}

.chat-window-enter-from,
.chat-window-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}
</style>
