<template>
    <div class="prose-content">
        <section class="content-narrow">
            <h1 class="heading-large">Privacy Policy</h1>
            <p class="text-text-secondary mb-12">
                Last updated: April 23, 2026.
            </p>

            <div class="space-y-12">
                <section>
                    <h2 class="heading-section">1. Introduction</h2>
                    <p>
                        This Privacy Policy describes how your personal information is collected, used, and shared when you visit my portfolio at <strong>bayuaksana.com</strong>. I am committed to protecting your privacy and ensuring you have a positive experience on this website.
                    </p>
                </section>

                <section>
                    <h2 class="heading-section">2. Information Collection</h2>
                    <p>
                        I use <strong>Google Analytics (GA4)</strong> to understand how visitors engage with my site. This service collects data such as your IP address, browser type, and the pages you visit. This data is processed in a way that does not identify anyone personally.
                    </p>
                    <p class="mt-4">
                        If you use the <strong>Chat Assistant</strong>, your messages are processed to provide real-time responses. No personal identifying information is stored permanently unless you explicitly provide it during a conversation.
                    </p>
                </section>

                <section>
                    <h2 class="heading-section">3. Cookie Policy</h2>
                    <p>
                        Cookies are small files placed on your computer to help the site provide a better user experience. On this site, we use:
                    </p>
                    <ul class="pl-6 list-disc space-y-3 mt-4">
                        <li><strong>Necessary Cookies:</strong> Required for the site's basic functionality, such as remembering your dark mode preference.</li>
                        <li><strong>Analytics Cookies:</strong> Provided by Google Analytics to help us measure traffic and usage patterns. These are only activated if you click "Accept" on our consent banner.</li>
                    </ul>
                </section>

                <section>
                    <h2 class="heading-section">4. Your Cookie Preferences</h2>
                    <p>
                        You have control over the cookies used on this site. If you would like to change your previous choice (Accept/Decline), you can reset your preferences below:
                    </p>
                    <div class="mt-6 p-6 bg-bg-muted rounded-xl border border-border-subtle">
                        <div class="flex items-center justify-between gap-4">
                            <div>
                                <h3 class="font-bold text-text-primary mb-1">Reset Consent</h3>
                                <p class="text-sm text-text-secondary mb-0">This will clear your choice and show the consent banner again.</p>
                            </div>
                            <button 
                                @click="resetConsent" 
                                class="px-5 py-2 text-sm font-semibold border border-border-subtle rounded-lg hover:bg-bg-main transition-colors"
                            >
                                Reset Now
                            </button>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 class="heading-section">5. Contact</h2>
                    <p>
                        If you have any questions or concerns about this policy, please get in touch through the <router-link to="/contact">Contact Page</router-link>.
                    </p>
                </section>
            </div>

            <div class="mt-20 pt-10 border-t border-border-subtle flex justify-center">
                <router-link to="/" class="text-sm text-accent-primary hover:underline">
                    ← Return to Home
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useSeo } from '@/core/composables/use-seo';
import { SITE_URL } from '@/core/utils/schema';
import { computed } from 'vue';

useSeo(
    computed(() => ({
        title: 'Privacy Policy — Bayu Aksana',
        description: 'Learn how we protect your privacy and use cookies on bayuaksana.com.',
        ogType: 'website',
        ogUrl: `${SITE_URL}/privacy`,
        canonical: `${SITE_URL}/privacy`,
    })),
);

const resetConsent = () => {
    localStorage.removeItem('cookie-consent-status');
    window.location.reload();
};
</script>
