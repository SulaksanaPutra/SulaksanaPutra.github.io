<template>
    <div class="relative">
        <!-- Floating Back to Top Button -->
        <transition name="fade">
            <button
                v-if="y > 400"
                @click="scrollToTop"
                class="btn-floating !bottom-24 group md:flex hidden"
                aria-label="Back to top"
            >
                <ArrowUp class="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </button>
        </transition>

        <section class="article-container" v-if="article">
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <router-link
                    :to="article.backLink.href"
                    class="text-sm text-text-secondary hover:text-text-primary flex items-center gap-2 group"
                >
                    <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {{ article.backLink.label }}
                </router-link>

                <div
                    class="article-meta-row"
                >
                    <span class="flex items-center gap-1.5" title="Reading Time">
                        <Clock class="w-3.5 h-3.5" />
                        {{ readingTime }} min read
                    </span>
                    <span class="w-1 h-1 rounded-full bg-border-subtle" />
                    <span class="flex items-center gap-1.5">
                        <BookOpen class="w-3.5 h-3.5" />
                        {{ article.sections?.length || 0 }} Sections
                    </span>
                </div>
            </div>

            <header class="article-header">
                <h1
                    class="article-title-large"
                >
                    {{ article.title }}
                </h1>
                <p class="article-summary">
                    {{ article.highlight }}
                </p>
            </header>

            <div class="article-body">
                <aside class="toc-aside">
                    <nav v-if="article.sections?.length">
                        <h2
                            class="toc-title"
                        >
                            On this page
                        </h2>
                        <ul class="toc-list">
                            <li v-for="section in article.sections" :key="section.id" class="toc-item">
                                <a
                                    :href="`#${section.id}`"
                                    @click.prevent="scrollToSection(section.id)"
                                    class="toc-link"
                                    :class="{ 'toc-link-active': currentActiveSection === section.id }"
                                >
                                    <div
                                        v-if="currentActiveSection === section.id"
                                        class="toc-indicator"
                                    />
                                    {{ section.label }}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <article
                    class="article-content"
                >
                    <section
                        v-for="section in article.sections"
                        :id="section.id"
                        :key="section.id"
                        class="article-section"
                    >
                        <h3 class="article-section-title" v-if="section.label">
                            {{ section.label }}
                        </h3>
                        <div v-if="section.paragraphs" class="space-y-6">
                            <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex" class="article-paragraph">
                                {{ paragraph }}
                            </p>
                        </div>
                        <ul
                            v-if="section.items"
                            class="pl-6 list-disc space-y-3 article-paragraph"
                        >
                            <li v-for="(item, iIndex) in section.items" :key="iIndex">
                                {{ item }}
                            </li>
                        </ul>
                    </section>
                </article>
            </div>
        </section>

        <section v-else class="py-16 text-center">
            <div class="max-w-md mx-auto">
                <div
                    class="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <FileQuestion class="text-text-secondary" />
                </div>
                <h1 class="text-2xl text-text-primary mb-2 font-bold">Case study not found</h1>
                <p class="text-text-secondary mb-8">
                    The case study you are looking for does not exist or is no longer available.
                </p>
                <router-link
                    to="/case-studies"
                    class="btn-primary"
                >
                    Back to case studies
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import { useCaseStudyArticle } from '@/modules/case-studies/data/case-studies.data.ts';
import { headerComponentRef } from '@/store.ts';
import { ArrowLeft, ArrowUp, BookOpen, Clock, FileQuestion } from 'lucide-vue-next';

import { useSeo } from '@/core/composables/use-seo';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const article = useCaseStudyArticle(articleId);

const { y } = useWindowScroll();
const currentActiveSection = ref<string>('');

// Sync SEO
useSeo(
    computed(() => {
        if (!article.value) return null;
        return {
            title: article.value.title,
            description: article.value.highlight,
            ogType: 'article',
        };
    }),
);

// Calculate Reading Time
const readingTime = computed(() => {
    if (!article.value) return 0;

    let text = article.value.title + ' ' + article.value.highlight + ' ';
    article.value.sections?.forEach((s: any) => {
        text += (s.label || '') + ' ';
        s.paragraphs?.forEach((p: string) => (text += p + ' '));
        s.items?.forEach((i: string) => (text += i + ' '));
    });

    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // 200 WPM baseline
});

// Scroll to Top
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Scroll to Section
const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = headerComponentRef.value?.headerRef?.offsetHeight || 0;
        const offsetPosition = element.offsetTop - headerOffset - 24;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    }
};

// Intersection Observer for TOC
let observer: IntersectionObserver | null = null;

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    currentActiveSection.value = entry.target.id;
                }
            });
        },
        {
            rootMargin: '-20% 0px -60% 0px', // Trigger when a section is in the top half
            threshold: 0,
        },
    );

    article.value?.sections?.forEach((s: any) => {
        const el = document.getElementById(s.id);
        if (el) observer?.observe(el);
    });
});

onUnmounted(() => {
    observer?.disconnect();
});
</script>
