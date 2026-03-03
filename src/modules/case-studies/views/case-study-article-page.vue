<template>
    <div class="relative">
        <!-- Floating Back to Top Button -->
        <transition name="fade">
            <button
                v-if="y > 400"
                @click="scrollToTop"
                class="fixed bottom-8 right-8 z-[80] w-12 h-12 rounded-full bg-bg-main text-accent-primary outline flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
                aria-label="Back to top"
            >
                <ArrowUp class="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </button>
        </transition>

        <section class="py-8" v-if="article">
            <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <router-link
                    :to="article.backLink.href"
                    class="text-sm text-text-secondary hover:text-text-primary flex items-center gap-2 group"
                >
                    <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {{ article.backLink.label }}
                </router-link>

                <div
                    class="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-text-secondary"
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

            <header class="mb-12">
                <h1
                    class="text-3xl md:text-4xl text-left text-text-primary leading-tight mb-4 font-bold tracking-tight"
                >
                    {{ article.title }}
                </h1>
                <p class="text-lg text-text-secondary max-w-3xl leading-relaxed">
                    {{ article.highlight }}
                </p>
            </header>

            <div class="flex flex-col md:flex-row md:gap-16 relative items-start">
                <aside class="hidden md:block w-52 shrink-0 sticky top-28">
                    <nav v-if="article.sections?.length">
                        <h2
                            class="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-text-secondary"
                        >
                            On this page
                        </h2>
                        <ul class="space-y-4 text-sm relative">
                            <!-- Active Indicator Line -->
                            <div
                                class="absolute left-0 top-0 w-px bg-border-subtle h-full transition-all"
                            />

                            <li v-for="section in article.sections" :key="section.id" class="pl-4">
                                <a
                                    :href="`#${section.id}`"
                                    @click.prevent="scrollToSection(section.id)"
                                    class="block transition-all duration-300 relative"
                                    :class="
                                        currentActiveSection === section.id
                                            ? 'text-accent-primary translate-x-1 font-medium'
                                            : 'text-text-secondary hover:text-text-primary'
                                    "
                                >
                                    <div
                                        v-if="currentActiveSection === section.id"
                                        class="absolute -left-[17px] top-1/2 -translate-y-1/2 w-px h-full bg-accent-primary"
                                    />
                                    {{ section.label }}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <article
                    class="text-justify hyphens-auto leading-relaxed space-y-12 flex-1 min-w-0"
                >
                    <section
                        v-for="section in article.sections"
                        :id="section.id"
                        :key="section.id"
                        class="scroll-mt-24"
                    >
                        <h3 class="label-overline mb-4" v-if="section.label">
                            {{ section.label }}
                        </h3>
                        <div v-if="section.paragraphs" class="space-y-6 text-lg text-text-primary">
                            <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex">
                                {{ paragraph }}
                            </p>
                        </div>
                        <ul
                            v-if="section.items"
                            class="pl-6 list-disc space-y-3 text-lg text-text-primary"
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
                    class="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-primary text-white rounded-full hover:scale-105 active:scale-95 transition-all"
                >
                    Back to case studies
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import { useCaseStudyArticle } from '@/modules/case-studies/data/case-studies.data.ts';
import { headerComponentRef } from '@/store.ts';
import { ArrowLeft, ArrowUp, BookOpen, Clock, FileQuestion } from 'lucide-vue-next';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const article = useCaseStudyArticle(articleId);

const { y } = useWindowScroll();
const currentActiveSection = ref<string>('');

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

// Update Meta Tags & SEO
watch(
    article,
    (newArticle) => {
        if (newArticle) {
            document.title = `${newArticle.title} | Bayu Aksana Portfolio`;

            // Simple Meta Update (In a real app use @vueuse/head or Nuxt)
            const updateMeta = (name: string, content: string) => {
                let el = document.querySelector(`meta[name="${name}"]`);
                if (!el) {
                    el = document.createElement('meta');
                    el.setAttribute('name', name);
                    document.head.appendChild(el);
                }
                el.setAttribute('content', content);
            };

            const updateOG = (property: string, content: string) => {
                let el = document.querySelector(`meta[property="${property}"]`);
                if (!el) {
                    el = document.createElement('meta');
                    el.setAttribute('property', property);
                    document.head.appendChild(el);
                }
                el.setAttribute('content', content);
            };

            updateMeta('description', newArticle.highlight);
            updateOG('og:title', newArticle.title);
            updateOG('og:description', newArticle.highlight);
            updateOG('og:type', 'article');
            // If we had image assets: updateOG('og:image', ...);
        }
    },
    { immediate: true },
);

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
