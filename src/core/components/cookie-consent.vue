<template>
    <transition name="slide-up">
        <div v-if="isVisible" class="cookie-consent-wrapper no-print">
            <div class="cookie-consent-content">
                <div class="flex flex-col gap-5">
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-accent-primary/10 rounded-lg shrink-0 hidden md:block">
                            <CookieIcon class="w-5 h-5 text-accent-primary" />
                        </div>
                        <p class="text-sm text-text-secondary leading-relaxed max-w-2xl">
                            We use cookies to enhance your experience and analyze our traffic. 
                            By clicking "Accept", you consent to our use of cookies.
                            <router-link to="/privacy" class="underline hover:text-accent-primary ml-1">Learn more</router-link>.
                        </p>
                    </div>
                    <div class="flex items-center justify-end gap-8 px-2">
                        <button 
                            @click="decline" 
                            class="text-xs font-medium uppercase tracking-wider text-text-secondary hover:text-text-primary hover:underline transition-all"
                        >
                            Decline
                        </button>
                        <button 
                            @click="accept" 
                            class="text-xs font-bold uppercase tracking-wider text-accent-primary hover:underline transition-all"
                        >
                            Accept Cookies
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cookie as CookieIcon } from 'lucide-vue-next';

const isVisible = ref(false);
const CONSENT_KEY = 'cookie-consent-status';

onMounted(() => {
    const status = localStorage.getItem(CONSENT_KEY);
    if (!status) {
        // Show after a small delay for better UX
        setTimeout(() => {
            isVisible.value = true;
        }, 1000);
    }
});

const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    isVisible.value = false;
    // Trigger GA initialization
    window.dispatchEvent(new CustomEvent('cookie-consent-accepted'));
};

const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    isVisible.value = false;
};
</script>
