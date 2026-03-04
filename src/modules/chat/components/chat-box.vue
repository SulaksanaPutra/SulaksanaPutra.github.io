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
                        <h3 class="m-0">Chatbox</h3>
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
                    <!-- Skeleton Loading -->
                    <template v-if="isLoading && messages.length === 0">
                        <div
                            v-for="i in 3"
                            :key="i"
                            :class="[
                                'flex flex-col gap-2 max-w-[80%] mb-4',
                                i % 2 === 0 ? 'self-end items-end' : 'self-start items-start',
                            ]"
                        >
                            <div
                                :class="[
                                    'h-12 w-48 rounded-2xl animate-pulse bg-bg-muted border border-border-subtle',
                                    i % 2 === 0 ? 'rounded-br-none' : 'rounded-bl-none',
                                ]"
                            ></div>
                            <div class="h-3 w-12 rounded animate-pulse bg-bg-muted"></div>
                        </div>
                    </template>

                    <!-- Empty State -->
                    <div
                        v-else-if="messages.length === 0 && !isLoading"
                        class="flex flex-col items-center justify-center h-full text-center px-6 py-10"
                    >
                        <div
                            class="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mb-5"
                        >
                            <Sparkles class="w-8 h-8 text-accent-primary animate-pulse" />
                        </div>
                        <h3 class="text-xl font-bold mb-3 text-text-primary">Let's chat!</h3>
                        <p class="text-sm text-text-secondary leading-relaxed max-w-[240px]">
                            I'm here to help you navigate through my portfolio and answer any
                            questions.
                        </p>
                    </div>

                    <!-- Messages List -->
                    <template v-else>
                        <div
                            v-for="msg in messages"
                            :key="msg.id"
                            :class="[
                                'flex flex-col gap-1.5 max-w-[85%]',
                                msg.type === 'outgoing' ? 'self-end' : 'self-start',
                            ]"
                        >
                            <div
                                :class="[
                                    'chat-box-bubble',
                                    msg.type === 'outgoing'
                                        ? 'chat-box-bubble-user'
                                        : 'chat-box-bubble-bot',
                                ]"
                            >
                                {{ msg.message }}
                            </div>
                            <span
                                :class="[
                                    'text-[0.65rem] text-text-secondary font-medium',
                                    msg.type === 'outgoing' ? 'self-end' : 'self-start',
                                ]"
                            >
                                {{ formatTime(msg.timestamp || msg.created_at) }}
                            </span>
                        </div>
                    </template>

                    <!-- Typing Indicator -->
                    <div
                        v-if="isLoading && messages.length > 0"
                        class="flex gap-1.5 p-3 px-4 rounded-xl rounded-bl-none bg-bg-muted border border-border-subtle self-start items-center"
                    >
                        <span class="typing-dot w-1.5 h-1.5 bg-text-secondary/40 rounded-full" />
                        <span
                            class="typing-dot w-1.5 h-1.5 bg-text-secondary/40 rounded-full [animation-delay:0.2s]"
                        />
                        <span
                            class="typing-dot w-1.5 h-1.5 bg-text-secondary/40 rounded-full [animation-delay:0.4s]"
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
import { MessageCircle, Send, Sparkles, X } from 'lucide-vue-next';
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

const formatTime = (timestamp?: number | string) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(timestamp));
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

@keyframes typing {
    0%,
    100% {
        transform: translateY(0);
        opacity: 0.3;
    }
    50% {
        transform: translateY(-3px);
        opacity: 1;
    }
}

.typing-dot {
    animation: typing 1s infinite ease-in-out;
}
</style>
