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
                <p class="article-summary" itemprop="description" role="doc-abstract">
                    {{ article.hook }}
                </p>
                <div
                    v-if="article.techStack?.length || article.deploymentStatus"
                    class="mt-6 flex flex-wrap gap-2 items-center"
                >
                    <span
                        v-if="article.deploymentStatus"
                        class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                    >
                        {{ article.deploymentStatus }}
                    </span>
                    <span
                        v-for="tech in article.techStack"
                        :key="tech"
                        class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-muted text-text-secondary border border-border-subtle"
                    >
                        {{ tech }}
                    </span>
                </div>
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
                        class="article-section transition-all duration-300"
                        :class="{
                            'p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm dark:bg-amber-500/5 dark:border-amber-500/10':
                                section.variant === 'trade-off',
                            'p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20 shadow-sm dark:bg-violet-500/5 dark:border-violet-500/10':
                                section.variant === 'deep-dive',
                            'py-2': !section.variant || section.variant === 'standard',
                        }"
                    >
                        <div class="flex items-center flex-wrap gap-2 mb-4">
                            <h3 v-if="section.label" class="article-section-title !mb-0">
                                {{ section.label }}
                            </h3>
                            <span
                                v-if="section.variant && section.variant !== 'standard'"
                                class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                                :class="{
                                    'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20':
                                        section.variant === 'trade-off',
                                    'bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20':
                                        section.variant === 'deep-dive',
                                }"
                            >
                                {{ section.variant }}
                            </span>
                        </div>

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

                        <!-- Challenges and Solutions Section -->
                        <div
                            v-if="section.challenges && section.challenges.length"
                            class="mt-8 space-y-12"
                        >
                            <div
                                v-for="challenge in section.challenges"
                                :key="challenge.id"
                                :id="challenge.id"
                                class="challenge-block pl-4 md:pl-6 border-l-2 border-border-subtle space-y-6 scroll-mt-24"
                            >
                                <!-- Challenge Description -->
                                <div class="space-y-3">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md border border-rose-500/20"
                                        >
                                            Challenge
                                        </span>
                                    </div>
                                    <div
                                        v-for="(p, pIndex) in challenge.challenge"
                                        :key="pIndex"
                                        class="article-paragraph text-text-secondary text-sm md:text-base"
                                    >
                                        <TextBlock :text="p" :items="glossaryItems" />
                                    </div>
                                </div>

                                <!-- Solution Description -->
                                <div v-if="challenge.solution" class="space-y-4">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-500/20"
                                        >
                                            Solution
                                        </span>
                                    </div>

                                    <div
                                        v-for="(p, pIndex) in challenge.solution.paragraph"
                                        :key="pIndex"
                                        class="article-paragraph"
                                    >
                                        <TextBlock :text="p" :items="glossaryItems" />
                                    </div>

                                    <!-- Solution list items -->
                                    <ul
                                        v-if="challenge.solution.items"
                                        class="pl-6 list-disc space-y-3 article-paragraph"
                                    >
                                        <template
                                            v-for="(item, iIndex) in challenge.solution.items"
                                            :key="iIndex"
                                        >
                                            <template v-if="Array.isArray(item)">
                                                <li v-for="(subItem, sIdx) in item" :key="sIdx">
                                                    <TextBlock
                                                        :text="subItem"
                                                        :items="glossaryItems"
                                                    />
                                                </li>
                                            </template>
                                            <li v-else>
                                                <TextBlock :text="item" :items="glossaryItems" />
                                            </li>
                                        </template>
                                    </ul>

                                    <!-- Solution Code Block -->
                                    <div
                                        v-if="challenge.solution.codeBlock"
                                        class="mt-4 mb-6 group"
                                    >
                                        <div
                                            class="rounded-xl overflow-hidden border border-border-subtle bg-bg-muted/40 shadow-sm relative"
                                        >
                                            <div
                                                class="px-4 py-2 bg-bg-muted border-b border-border-subtle flex justify-between items-center text-[10px] text-text-secondary font-mono uppercase tracking-wider"
                                            >
                                                <span class="opacity-70">{{
                                                    challenge.solution.codeBlock.language
                                                }}</span>
                                            </div>
                                            <div
                                                class="p-4 overflow-x-auto text-sm font-mono text-text-primary leading-relaxed"
                                            >
                                                <CodeHighlighter
                                                    :code="challenge.solution.codeBlock.code"
                                                    :language="
                                                        challenge.solution.codeBlock.language
                                                    "
                                                />
                                            </div>
                                        </div>
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
            title="Project Not Available"
            description="This project is not yet available in your currently selected language. You can read it in the available languages below:"
            :back-link="{ href: '/projects' }"
        />

        <LanguageFallback
            v-else
            :availability="[]"
            title="Project not found"
            description="The project you are looking for does not exist or is no longer available."
            :back-link="{ href: '/projects' }"
        />

        <JsonLd v-if="article" :data="structuredData" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import {
    useProjectArticle,
    useProjectArticleAvailability,
} from '@/modules/projects/data/projects.data';
import { ArrowLeft, ArrowUp, Calendar, Clock } from 'lucide-vue-next';
import TextBlock from '@/core/components/text-block.vue';
import CodeHighlighter from '@/core/components/code-highlighter.vue';
import LanguageFallback from '@/core/components/language-fallback.vue';
import JsonLd from '@/core/components/json-ld.vue';
import { useSeo } from '@/core/composables/use-seo';
import { SITE_URL } from '@/core/utils/schema';
import { getArticleSchema } from '@/core/utils/schema';
import { language } from '@/store';
import { headerComponentRef } from '@/store.ts';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const article = useProjectArticle(articleId);
const availability = useProjectArticleAvailability(articleId);

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

        const ogImage =
            typeof article.value.thumbnail === 'string'
                ? article.value.thumbnail
                : article.value.thumbnail?.light || '';

        const normalizedPath = route.path.replace(/\/$/, '');
        const currentUrl = `${SITE_URL}${normalizedPath}/`;

        return {
            title: article.value.title,
            description: article.value.hook,
            keywords: article.value.techStack?.join(', '),
            ogType: 'article',
            ogImage: ogImage,
            ogUrl: currentUrl,
            canonical: currentUrl,
        };
    }),
);

const structuredData = computed(() => {
    if (!article.value) return {};

    const ogImage =
        typeof article.value.thumbnail === 'string'
            ? article.value.thumbnail
            : article.value.thumbnail?.light || '';

    const articleSchema = getArticleSchema({
        id: articleId,
        title: article.value.title,
        description: article.value.hook,
        date: article.value.date,
        image: ogImage,
        keywords: article.value.techStack?.join(', '),
        urlPath: `/projects/${articleId}`,
    });

    return {
        '@context': 'https://schema.org',
        '@graph': [articleSchema],
    };
});

const readingTime = computed(() => {
    if (!article.value) return 0;

    let text = article.value.title + ' ' + (article.value.hook || '') + ' ';
    article.value.sections?.forEach((s: any) => {
        text += (s.label || '') + ' ';
        s.paragraphs?.forEach((p: string) => (text += p + ' '));
        s.items?.forEach((i: string) => (text += i + ' '));
        if (s.codeBlock) text += s.codeBlock.code + ' ';
        if (s.challanges) {
            s.challanges.forEach((c: any) => {
                c.challange?.forEach((cp: string) => (text += cp + ' '));
                if (c.solution) {
                    c.solution.paragraph?.forEach((sp: string) => (text += sp + ' '));
                    c.solution.items?.forEach((si: any) => {
                        if (Array.isArray(si)) {
                            si.forEach((ssi: string) => (text += ssi + ' '));
                        } else {
                            text += si + ' ';
                        }
                    });
                    if (c.solution.codeBlock) text += c.solution.codeBlock.code + ' ';
                }
            });
        }
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
