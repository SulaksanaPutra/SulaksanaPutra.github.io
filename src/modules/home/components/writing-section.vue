<template>
    <section v-if="writingData" class="prose-content content-narrow">
        <header>
            <h2 class="heading-section">
                {{ writingData.subtitle }}
            </h2>
            <div>
                <p v-for="(paragraph, index) in writingData.descriptions" :key="index">
                    {{ paragraph }}
                </p>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <router-link
                v-for="writing in writings"
                :key="writing.id"
                :to="writing.link.href"
                class="group block"
            >
                <div
                    class="relative aspect-video mb-4 overflow-hidden rounded-2xl border border-border-subtle bg-bg-muted group-hover:border-accent-primary/50 transition-all"
                >
                    <ThemeImage
                        :src="writing.thumbnail"
                        :alt="writing.title"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div class="space-y-2">
                    <div
                        class="flex items-center gap-2 text-[10px] font-mono text-text-secondary uppercase tracking-widest"
                    >
                        <Clock class="w-3 h-3" />
                        {{ writing.date }}
                    </div>
                    <h3
                        class="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors"
                    >
                        {{ writing.title }}
                    </h3>
                    <p class="text-sm text-text-secondary line-clamp-2">
                        {{ writing.subtitle }}
                    </p>
                </div>
            </router-link>
        </div>

        <!-- Blended Language Fallback / Info -->
        <div
            v-if="t.otherCount > 0"
            class="p-6 rounded-2xl bg-bg-muted/30 border border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4"
        >
            <div class="flex items-center gap-4 text-left">
                <div
                    class="w-10 h-10 bg-bg-muted rounded-full flex items-center justify-center shrink-0"
                >
                    <Globe class="text-accent-primary" :size="18" />
                </div>
                <div>
                    <p class="text-sm font-medium text-text-primary mb-0">
                        {{ t.message }}
                    </p>
                    <p class="text-xs text-text-secondary mt-0.5 mb-0">
                        {{ t.submessage }}
                    </p>
                </div>
            </div>
            <button
                @click="switchLanguage"
                class="text-xs font-bold uppercase tracking-wider text-accent-primary hover:text-accent-secondary transition-colors px-4 py-2 border border-accent-primary/20 rounded-lg hover:bg-accent-primary/5"
            >
                {{ t.button }}
            </button>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useWritingData } from '@/modules/home/data/home.data.ts';
import {
    useWritingBlendedFallbackData,
    useWritingsDataStrict,
} from '@/modules/writings/data/writings.data';
import { Clock, Globe } from 'lucide-vue-next';
import ThemeImage from '@/core/components/theme-image.vue';
import { language } from '@/store';

const writingData = useWritingData();
const writings = useWritingsDataStrict();
const t = useWritingBlendedFallbackData();

const switchLanguage = () => {
    const newLang = language.value === 'ID' ? 'EN' : 'ID';
    language.value = newLang;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('language', newLang);
    }
};
</script>
