<template>
    <div class="py-16 text-center">
        <div class="max-w-md mx-auto">
            <div class="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <FileQuestion class="text-text-secondary" />
            </div>
            <h1 class="text-2xl text-text-primary mb-2 font-bold">
                {{ title || t.title }}
            </h1>
            <p class="text-text-secondary mb-8">
                {{ description || t.description }}
            </p>
            <div class="flex flex-col gap-4 max-w-[250px] mx-auto">
                <button
                    v-for="loc in availability"
                    :key="loc"
                    @click="switchLanguageTo(loc)"
                    class="btn-primary justify-center"
                >
                    {{ t.languagePrefix }}{{ t.languageNames[loc] || loc }}
                </button>
                <router-link 
                    v-if="backLink" 
                    :to="backLink.href" 
                    class="text-text-secondary hover:text-text-primary mt-2 text-sm underline underline-offset-4"
                >
                    {{ backLink.label }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FileQuestion } from 'lucide-vue-next';
import { language } from '@/store';
import { useLanguageFallbackData } from '@/core/data/language-fallback.data.ts';

defineProps<{
    availability: string[];
    title?: string;
    description?: string;
    backLink?: {
        href: string;
        label: string;
    };
}>();

const t = useLanguageFallbackData();

const switchLanguageTo = (loc: string) => {
    const lang = loc.toLowerCase() === 'id' ? 'ID' : 'EN';
    language.value = lang;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('language', lang);
    }
};
</script>
