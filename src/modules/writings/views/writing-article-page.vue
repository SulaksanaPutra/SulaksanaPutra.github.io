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
                    <span class="flex items-center gap-1.5">
                        <Calendar class="w-3.5 h-3.5" />
                        {{ article.date }}
                    </span>
                    <span class="w-1 h-1 rounded-full bg-border-subtle" />
                    <span class="flex items-center gap-1.5" title="Reading Time">
                        <Clock class="w-3.5 h-3.5" />
                        {{ readingTime }} min read
                    </span>
                </div>
            </div>

            <header class="article-header !mb-12">
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
                        <h3 v-if="section.label" class="article-section-title">
                            {{ section.label }}
                        </h3>

                        <div class="space-y-6">
                            <div
                                v-for="(paragraph, pIndex) in section.paragraphs"
                                :key="pIndex"
                                class="article-paragraph"
                            >
                                <TextBlock :text="paragraph" :items="glossaryItems" />
                            </div>
                        </div>

                        <ul
                            v-if="section.items"
                            class="pl-6 list-disc space-y-3 article-paragraph mt-6"
                        >
                            <li v-for="(item, iIndex) in section.items" :key="iIndex">
                                <TextBlock :text="item" :items="glossaryItems" />
                            </li>
                        </ul>

                        <div v-if="section.image" class="mt-8 mb-8 rounded-xl overflow-hidden border border-border-subtle shadow-md">
                            <ThemeImage :src="section.image" :alt="section.label || 'Section image'" class="w-full h-auto" />
                        </div>

                        <div v-if="section.codeBlock" class="mt-6 mb-8 group">
                            <div
                                class="rounded-xl overflow-hidden border border-border-subtle bg-bg-muted/40 shadow-sm relative"
                            >
                                <div
                                    class="px-4 py-2 bg-bg-muted border-b border-border-subtle flex justify-between items-center text-[10px] text-text-secondary font-mono uppercase tracking-wider"
                                >
                                    <span class="opacity-70">{{ section.codeBlock.language }}</span>
                                </div>
                                <div
                                    class="p-4 overflow-x-auto text-sm font-mono text-text-primary leading-relaxed"
                                >
                                    <CodeHighlighter
                                        :code="section.codeBlock.code"
                                        :language="section.codeBlock.language"
                                    />
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
                            <div class="bg-accent-primary/10 rounded-lg">
                                <HelpCircle class="w-5 h-5 text-accent-primary" />
                            </div>
                            <h2 class="mb-0 text-2xl font-bold text-text-primary">
                                Questions & Answers
                            </h2>
                        </div>

                        <div class="grid gap-8">
                            <div
                                v-for="(qna, index) in article.qnas"
                                :key="index"
                                class="p-6 bg-bg-muted/50 rounded-2xl border border-border-subtle hover:border-accent-primary/30 transition-colors group/qna relative"
                            >
                                <h3
                                    class="text-lg font-semibold text-text-primary mb-3 flex items-start gap-3 text-left"
                                >
                                    <span
                                        class="text-accent-primary opacity-50 font-mono mt-0.5 shrink-0"
                                        >Q.</span
                                    >
                                    <span
                                        ><TextBlock :text="qna.question" :items="glossaryItems"
                                    /></span>
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
                </article>
            </div>
        </section>

        <LanguageFallback 
            v-else-if="availability && availability.availableLocales.length > 0" 
            :availability="availability.availableLocales"
            title="Article Not Available"
            description="This writing is not yet available in your currently selected language. You can read it in the available languages below:"
            :back-link="{ href: '/writing' }"
        />

        <LanguageFallback 
            v-else 
            :availability="[]"
            title="Article not found"
            description="The article you are looking for does not exist or is no longer available."
            :back-link="{ href: '/writing' }"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import { useWritingArticle, useWritingArticleAvailability } from '@/modules/writings/data/writings.data';
import { ArrowLeft, ArrowUp, Calendar, Clock, HelpCircle } from 'lucide-vue-next';
import TextBlock from '@/core/components/text-block.vue';
import CodeHighlighter from '@/core/components/code-highlighter.vue';
import ThemeImage from '@/core/components/theme-image.vue';
import LanguageFallback from '@/core/components/language-fallback.vue';
import { useSeo } from '@/core/composables/use-seo';
import { language } from '@/store';
import { headerComponentRef } from '@/store.ts';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const article = useWritingArticle(articleId);
const availability = useWritingArticleAvailability(articleId);

const glossaryItems = computed(() => article.value?.glossary || []);

const glossaryRegistry = new Set<string>();
provide('glossaryRegistry', glossaryRegistry);

watch([language, article], () => {
    glossaryRegistry.clear();
});

const { y } = useWindowScroll();
const currentActiveSection = ref<string>('');

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

    let text = article.value.title + ' ' + (article.value.highlight || '') + ' ';
    article.value.sections?.forEach((s: any) => {
        text += (s.label || '') + ' ';
        s.paragraphs?.forEach((p: string) => (text += p + ' '));
        s.items?.forEach((i: string) => (text += i + ' '));
        if (s.codeBlock) text += s.codeBlock.code + ' ';
    });

    article.value.qnas?.forEach((qna: any) => {
        text += qna.question + ' ' + qna.answer + ' ';
    });

    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
});

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
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
