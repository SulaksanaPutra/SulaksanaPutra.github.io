<template>
    <section v-if="projectsData" class="prose-content content-narrow md:text-left">
        <header>
            <h2 class="heading-section">
                {{ projectsData.subtitle }}
            </h2>
            <div>
                <p v-for="(paragraph, index) in projectsData.descriptions" :key="index">
                    {{ paragraph }}
                </p>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <router-link
                v-for="project in projects"
                :key="project.id"
                :to="project.link.href"
                class="group block"
            >
                <div
                    class="relative mb-4 overflow-hidden rounded-2xl border border-border-subtle bg-bg-muted group-hover:border-accent-primary/50 transition-all"
                >
                    <ThemeImage
                        :src="project.thumbnail"
                        :alt="project.title"
                        :dynamic-aspect="dynamicAspect"
                        :aspect-ratio="imageAspectRatio"
                        :height="imageHeight"
                        :width="imageWidth"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <div class="space-y-2">
                    <h3
                        class="mb-0 text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors"
                    >
                        {{ project.title }}
                    </h3>
                    <p class="text-sm text-text-secondary line-clamp-2">
                        {{ project.subtitle }}
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
import { useProjectsData as useHomeProjectsData } from '@/modules/home/data/home.data.ts';
import {
    useProjectsBlendedFallbackData,
    useProjectsDataStrict,
} from '@/modules/projects/data/projects.data';
import { Globe } from 'lucide-vue-next';
import ThemeImage from '@/core/components/theme-image.vue';
import { language } from '@/store';

interface ProjectsSectionProps {
    imageAspectRatio?: string | number;
    imageHeight?: string;
    imageWidth?: string;
    dynamicAspect?: boolean;
}

const props = withDefaults(defineProps<ProjectsSectionProps>(), {
    imageHeight: '200px',
    dynamicAspect: false,
});

const projectsData = useHomeProjectsData();
const projects = useProjectsDataStrict();
const t = useProjectsBlendedFallbackData();

const switchLanguage = () => {
    const newLang = language.value === 'ID' ? 'EN' : 'ID';
    language.value = newLang;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('language', newLang);
    }
};
</script>
