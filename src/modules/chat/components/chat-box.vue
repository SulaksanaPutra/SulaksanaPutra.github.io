<template>
    <div v-if="isSupported" class="chat-box-container">
        <!-- Chat Toggle Button - Matching btn-floating -->
        <button
            class="btn-floating md:flex hidden z-[101] pointer-events-auto"
            @click="toggleChat"
            :aria-label="isOpen ? t.ariaLabels.close : t.ariaLabels.open"
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
                        <h3 class="m-0">{{ t.title }}</h3>
                    </div>
                    <button @click="toggleChat" class="btn-icon w-8 h-8 rounded-lg !border-0">
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
                                'chat-box-message-wrapper mb-4',
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
                    <div v-else-if="messages.length === 0 && !isLoading" class="chat-box-empty">
                        <div class="chat-box-empty-icon-wrapper">
                            <Sparkles class="w-8 h-8 text-accent-primary animate-pulse" />
                        </div>
                        <h3 class="chat-box-empty-title">{{ t.emptyState.title }}</h3>
                        <p class="chat-box-empty-desc">
                            {{ t.emptyState.description }}
                        </p>
                    </div>

                    <!-- Messages List -->
                    <template v-else>
                        <div
                            v-for="msg in messages"
                            :key="msg.id"
                            :class="[
                                'chat-box-message-wrapper',
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
                                    'chat-box-timestamp',
                                    msg.type === 'outgoing' ? 'self-end' : 'self-start',
                                ]"
                            >
                                {{ formatTime(msg.timestamp || msg.created_at) }}
                            </span>
                        </div>
                    </template>

                    <!-- Typing Indicator -->
                    <div v-if="isLoading && messages.length > 0" class="chat-box-typing-indicator">
                        <span class="chat-box-typing-dot" />
                        <span class="chat-box-typing-dot [animation-delay:0.2s]" />
                        <span class="chat-box-typing-dot [animation-delay:0.4s]" />
                    </div>
                </div>

                <!-- Input area -->
                <div class="chat-box-input-area">
                    <input
                        v-model="newMessage"
                        @keyup.enter="send"
                        type="text"
                        :placeholder="t.placeholder"
                        class="chat-box-input"
                    />
                    <button
                        @click="send"
                        class="chat-box-send-btn"
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
import { useChatBoxData } from '../data/chat-box.data.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';

const t = useChatBoxData();
const { locale } = useI18n();
const { messages, isOpen, isLoading, newMessage, toggleChat, send, isSupported } = useChat();
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

    dragY.value = e.touches[0].clientY - startY.value;
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
    const dateLocale = locale.value === 'id' ? 'id-ID' : 'en-US';
    return new Intl.DateTimeFormat(dateLocale, {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(timestamp));
};
</script>
