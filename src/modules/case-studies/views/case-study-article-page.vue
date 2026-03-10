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

                <div class="article-meta-row">
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
                <h1 class="article-title-large">
                    {{ article.title }}
                </h1>
                <p class="article-summary">
                    {{ article.highlight }}
                </p>
            </header>

            <div class="article-body">
                <aside class="toc-aside">
                    <nav v-if="article.sections?.length">
                        <h2 class="toc-title">On this page</h2>
                        <ul class="toc-list">
                            <li
                                v-for="section in article.sections"
                                :key="section.id"
                                class="toc-item"
                            >
                                <a
                                    :href="`#${section.id}`"
                                    @click.prevent="scrollToSection(section.id)"
                                    class="toc-link"
                                    :class="{
                                        'toc-link-active': currentActiveSection === section.id,
                                    }"
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

                <article class="article-content">
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
                            <p
                                v-for="(paragraph, pIndex) in section.paragraphs"
                                :key="pIndex"
                                class="article-paragraph"
                            >
                                <TextBlock :text="paragraph" :items="glossaryItems" />
                            </p>
                        </div>
                        <ul v-if="section.items" class="pl-6 list-disc space-y-3 article-paragraph">
                            <li v-for="(item, iIndex) in section.items" :key="iIndex">
                                <TextBlock :text="item" :items="glossaryItems" />
                            </li>
                        </ul>
                        <div v-if="section.codeBlock" class="mt-6 mb-8 group">
                            <div
                                class="rounded-xl overflow-hidden border border-border-subtle bg-[#1a1b26]/90 shadow-lg relative"
                            >
                                <div
                                    class="px-4 py-2 bg-[#16161e] border-b border-border-subtle/30 flex justify-between items-center text-[10px] text-text-secondary font-mono uppercase tracking-wider"
                                >
                                    <span class="opacity-70">{{ section.codeBlock.language }}</span>
                                </div>
                                <div
                                    class="p-4 overflow-x-auto text-sm font-mono text-[#c0caf5] leading-relaxed"
                                >
                                    <pre
                                        class="whitespace-pre-wrap"
                                    ><code v-text="section.codeBlock.code"></code></pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- QnA Section -->
                    <section
                        v-if="article.qnas?.length"
                        class="mt-16 pt-16 border-t border-border-subtle"
                    >
                        <div class="flex items-center gap-3 mb-8">
                            <div class="p-2 bg-accent-primary/10 rounded-lg">
                                <HelpCircle class="w-5 h-5 text-accent-primary" />
                            </div>
                            <h2 class="text-2xl font-bold text-text-primary">
                                Questions & Answers
                            </h2>
                        </div>

                        <div class="grid gap-8">
                            <div
                                v-for="(qna, index) in article.qnas"
                                :key="index"
                                class="p-6 bg-bg-muted/50 rounded-2xl border border-border-subtle hover:border-accent-primary/30 transition-colors group"
                            >
                                <h3
                                    class="text-lg font-semibold text-text-primary mb-3 flex items-start gap-3 text-left"
                                >
                                    <span
                                        class="text-accent-primary opacity-50 font-mono mt-0.5 shrink-0"
                                        >Q.</span
                                    >
                                    <span><TextBlock :text="qna.question" :items="glossaryItems" /></span>
                                </h3>
                                <div class="flex items-start gap-3 text-left">
                                    <span
                                        class="text-text-secondary opacity-50 font-mono mt-0.5 shrink-0"
                                        >A.</span
                                    >
                                    <div class="text-text-secondary leading-relaxed">
                                        <TextBlock :text="qna.answer" :items="glossaryItems" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Next Case Study Section (Minimalist) -->
                    <section
                        v-if="nextCaseStudies.length"
                        class="mt-20 pt-16 border-t border-border-subtle no-print"
                    >
                        <p class="label-overline mb-6">You might also like my other articles</p>
                        <div class="space-y-6">
                            <div v-for="study in nextCaseStudies" :key="study.id">
                                <p class="text-text-primary mb-0">
                                    <router-link
                                        :to="study.link.href"
                                        class="hover:text-accent-primary transition-colors"
                                    >
                                        → {{ study.title }}
                                    </router-link>
                                </p>
                            </div>
                        </div>
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
                <router-link to="/case-studies" class="btn-primary">
                    Back to case studies
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import {
    useCaseStudyArticle,
    useCaseStudiesData,
} from '@/modules/case-studies/data/case-studies.data.ts';
import { headerComponentRef } from '@/store.ts';
import { ArrowLeft, ArrowUp, BookOpen, Clock, FileQuestion, HelpCircle } from 'lucide-vue-next';
import TextBlock from '@/core/components/text-block.vue';

import { useSeo } from '@/core/composables/use-seo';
import { language } from '@/store';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const articleData = useCaseStudyArticle(articleId);
const glossaryItems = computed(() => articleData.value?.glossary || []);
const article = computed(() => articleData.value);

const glossaryRegistry = new Set<string>();
provide('glossaryRegistry', glossaryRegistry);

watch([language, articleData], () => {
    glossaryRegistry.clear();
});

const { y } = useWindowScroll();
const currentActiveSection = ref<string>('');

const allCaseStudies = useCaseStudiesData();
const nextCaseStudies = computed(() => {
    if (!article.value) return [];

    const currentId = article.value.id;
    const currentSystemId = article.value.systemId;

    // Filter out current
    const candidates = allCaseStudies.value.filter((cs) => cs.id !== currentId);

    // Prioritize same system
    const sameSystem = candidates
        .filter((cs) => cs.systemId === currentSystemId)
        .sort(() => Math.random() - 0.5);

    const others = candidates
        .filter((cs) => cs.systemId !== currentSystemId)
        .sort(() => Math.random() - 0.5);

    let result = [...sameSystem];

    if (result.length < 2) {
        result = [...result, ...others.slice(0, 2 - result.length)];
    }

    return result.slice(0, 2);
});

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

const readingTime = computed(() => {
    if (!article.value) return 0;

    let text = article.value.title + ' ' + article.value.highlight + ' ';
    article.value.sections?.forEach((s: any) => {
        text += (s.label || '') + ' ';
        s.paragraphs?.forEach((p: string) => (text += p + ' '));
        s.items?.forEach((i: string) => (text += i + ' '));
    });

    article.value.qnas?.forEach((qna: any) => {
        text += qna.question + ' ' + qna.answer + ' ';
    });

    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200); // 200 WPM baseline
});

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
            rootMargin: '-20% 0px -60% 0px',
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
