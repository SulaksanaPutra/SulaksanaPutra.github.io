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
                <!-- Title -->
                <component
                    :is="isDev ? DevInlineEditor : 'div'"
                    v-if="isDev ? editableArticle : article"
                    v-model="editableArticle!.title"
                    @save="saveArticleData"
                    :is-saving="isSavingDraft"
                    :custom-class="'article-title-large !px-0 !py-0 border-none'"
                    :class="!isDev ? 'contents' : ''"
                >
                    <h1 class="article-title-large">
                        {{ isDev ? editableArticle?.title : article?.title }}
                    </h1>
                </component>

                <!-- Highlight -->
                <component
                    :is="isDev ? DevInlineEditor : 'div'"
                    v-if="isDev ? editableArticle?.highlight : article?.highlight"
                    v-model="editableArticle!.highlight"
                    @save="saveArticleData"
                    :is-saving="isSavingDraft"
                    :multiline="true"
                    :class="!isDev ? 'contents' : ''"
                >
                    <p class="article-summary" :class="isDev ? 'mb-0' : ''">
                        {{ isDev ? editableArticle?.highlight : article?.highlight }}
                    </p>
                </component>

                <!-- Subtitle -->
                <component
                    :is="isDev ? DevInlineEditor : 'div'"
                    v-if="isDev"
                    v-model="editableArticle!.subtitle"
                    @save="saveArticleData"
                    :is-saving="isSavingDraft"
                    :multiline="true"
                    :custom-class="'article-subtitle mt-4 text-text-secondary !px-0 !py-0 border-none'"
                    :class="!isDev ? 'contents' : ''"
                >
                    <p
                        class="article-subtitle mt-4 text-text-secondary"
                        :class="isDev ? 'mb-0' : ''"
                    >
                        {{ editableArticle?.subtitle || 'Add subtitle...' }}
                    </p>
                </component>
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
                        v-for="(section, sIndex) in isDev
                            ? editableArticle?.sections
                            : article?.sections"
                        :id="section.id"
                        :key="section.id"
                        class="article-section"
                    >
                        <component
                            :is="isDev ? DevInlineEditor : 'div'"
                            v-if="section.label"
                            v-model="(isDev ? editableArticle!.sections[sIndex] : section).label"
                            @save="saveArticleData"
                            :is-saving="isSavingDraft"
                            :class="!isDev ? 'contents' : ''"
                        >
                            <h3 class="article-section-title" :class="isDev ? 'mb-0' : ''">
                                {{ section.label }}
                            </h3>
                        </component>

                        <div
                            v-if="section"
                            class="space-y-6"
                            :class="isDev ? 'mt-6' : ''"
                        >
                            <div
                                v-for="(paragraph, pIndex) in section.paragraphs"
                                :key="pIndex"
                                class="group/row relative"
                            >
                                <component
                                    :is="isDev ? DevInlineEditor : 'div'"
                                    v-model="
                                        (isDev ? editableArticle!.sections[sIndex] : section)
                                            .paragraphs![pIndex]
                                    "
                                    @save="saveArticleData"
                                    :is-saving="isSavingDraft"
                                    :multiline="true"
                                    :class="!isDev ? 'contents' : ''"
                                >
                                    <div class="article-paragraph" :class="isDev ? 'mb-0' : ''">
                                        <TextBlock :text="paragraph" :items="glossaryItems" />
                                    </div>
                                    <template #actions>
                                        <button
                                            v-if="isDev"
                                            @click="removeRow(Number(sIndex), Number(pIndex), 'paragraphs')"
                                            class="flex items-center justify-center p-1.5 bg-bg-main border border-border-subtle text-text-secondary rounded hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                                            title="Delete Row"
                                        >
                                            <Trash2 class="w-3 h-3" />
                                        </button>
                                    </template>
                                </component>
                            </div>
                        </div>

                        <ul
                            v-if="section.items"
                            class="pl-6 list-disc space-y-3 article-paragraph"
                            :class="isDev ? 'mt-6' : ''"
                        >
                            <div
                                v-for="(item, iIndex) in section.items"
                                :key="iIndex"
                                class="group/row relative"
                            >
                                <component
                                    :is="isDev ? DevInlineEditor : 'div'"
                                    v-model="
                                        (isDev ? editableArticle!.sections[sIndex] : section).items![
                                            iIndex
                                        ]
                                    "
                                    @save="saveArticleData"
                                    :is-saving="isSavingDraft"
                                    :multiline="true"
                                    :class="!isDev ? 'contents' : 'flex-1 w-full relative'"
                                >
                                    <li :class="isDev ? 'mb-0' : ''">
                                        <TextBlock :text="item" :items="glossaryItems" />
                                    </li>
                                    <template #actions>
                                        <button
                                            v-if="isDev"
                                            @click="removeRow(Number(sIndex), Number(iIndex), 'items')"
                                            class="flex items-center justify-center p-1.5 bg-bg-main border border-border-subtle text-text-secondary rounded hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                                            title="Delete Item"
                                        >
                                            <Trash2 class="w-3 h-3" />
                                        </button>
                                    </template>
                                </component>
                            </div>
                        </ul>

                        <!-- Developer Section Toolbar -->
                        <div
                            v-if="isDev"
                            class="mt-4 flex gap-2 items-center opacity-30 hover:opacity-100 transition-opacity"
                        >
                            <button
                                @click="addRow(sIndex, section.paragraphs ? 'paragraphs' : 'items')"
                                class="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-text-secondary bg-bg-muted hover:text-text-primary px-3 py-1.5 rounded-md border border-border-subtle hover:border-text-primary transition-all"
                            >
                                <Plus class="w-3.5 h-3.5" /> Add Row
                            </button>
                            <button
                                @click="toggleSectionType(sIndex)"
                                class="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-text-secondary bg-bg-muted hover:text-accent-primary px-3 py-1.5 rounded-md border border-border-subtle hover:border-accent-primary transition-all"
                            >
                                <List v-if="section.paragraphs" class="w-3.5 h-3.5" />
                                <AlignLeft v-else class="w-3.5 h-3.5" />
                                Change to {{ section.paragraphs ? 'List' : 'Paragraphs' }}
                            </button>
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
                        v-if="isDev ? editableArticle?.qnas?.length : article?.qnas?.length"
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
                                v-for="(qna, index) in isDev ? editableArticle?.qnas : article?.qnas"
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
                                    <component
                                        :is="isDev ? DevInlineEditor : 'div'"
                                        v-model="
                                            (isDev ? editableArticle!.qnas! : article!.qnas!)[index]
                                                .question
                                        "
                                        @save="saveArticleData"
                                        :is-saving="isSavingDraft"
                                        :multiline="true"
                                        :class="!isDev ? 'contents' : ''"
                                        class="w-full relative"
                                    >
                                        <span
                                            ><TextBlock :text="qna.question" :items="glossaryItems"
                                        /></span>
                                        <template #actions>
                                            <button
                                                v-if="isDev"
                                                @click="removeQna(index)"
                                                class="flex items-center justify-center p-1.5 bg-bg-main border border-border-subtle text-text-secondary rounded hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                                                title="Delete Q&A"
                                            >
                                                <Trash2 class="w-3 h-3" />
                                            </button>
                                        </template>
                                    </component>
                                </h3>

                                <div class="flex items-start gap-3 text-left">
                                    <span
                                        class="text-text-secondary opacity-50 font-mono mt-0.5 shrink-0"
                                        >A.</span
                                    >
                                    <component
                                        :is="isDev ? DevInlineEditor : 'div'"
                                        v-model="
                                            (isDev ? editableArticle!.qnas! : article!.qnas!)[index]
                                                .answer
                                        "
                                        @save="saveArticleData"
                                        :is-saving="isSavingDraft"
                                        :multiline="true"
                                        :class="!isDev ? 'contents' : ''"
                                    >
                                        <div class="text-text-secondary leading-relaxed">
                                            <TextBlock :text="qna.answer" :items="glossaryItems" />
                                        </div>
                                    </component>
                                </div>
                            </div>
                        </div>

                        <div v-if="isDev" class="mt-6 flex justify-center">
                            <button
                                @click="addQna"
                                class="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-text-secondary bg-bg-muted hover:text-accent-primary px-4 py-2 rounded-md border border-border-subtle hover:border-accent-primary transition-all shadow-sm"
                            >
                                <Plus class="w-4 h-4" /> Add Q&A Pair
                            </button>
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

        <LanguageFallback 
            v-else-if="availability && availability.availableLocales.length > 0" 
            :availability="availability.availableLocales"
            title="Article Not Available"
            description="This case study is not yet available in your currently selected language. You can read it in the available languages below:"
            :back-link="{ href: '/case-studies', label: 'Back to case studies' }"
        />

        <LanguageFallback 
            v-else 
            :availability="[]"
            title="Case study not found"
            description="The case study you are looking for does not exist or is no longer available."
            :back-link="{ href: '/case-studies', label: 'Back to case studies' }"
        />
    </div>
</template>

<script setup lang="ts">
import LanguageFallback from '@/core/components/language-fallback.vue';
import { computed, defineAsyncComponent, onMounted, onUnmounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWindowScroll } from '@vueuse/core';
import {
    useCaseStudiesData,
    useCaseStudyArticle,
    useCaseStudyArticleAvailability,
} from '@/modules/case-studies/data/case-studies.data.ts';
import type { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { headerComponentRef } from '@/store.ts';
import {
    AlignLeft,
    ArrowLeft,
    ArrowUp,
    BookOpen,
    Clock,
    FileQuestion,
    HelpCircle,
    List,
    Plus,
    Trash2,
} from 'lucide-vue-next';
import TextBlock from '@/core/components/text-block.vue';
import CodeHighlighter from '@/core/components/code-highlighter.vue';

import { useSeo } from '@/core/composables/use-seo';
import { isEditorActive, language } from '@/store';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const articleData = useCaseStudyArticle(articleId);
const availability = useCaseStudyArticleAvailability(articleId);

const isDevEnv = import.meta.env.DEV;
const isDev = computed(() => isDevEnv && isEditorActive.value);

const DevInlineEditor = isDevEnv
    ? defineAsyncComponent(() => import('@/modules/case-studies/components/dev-inline-editor.vue'))
    : null;

// Use a local ref for realtime preview in Dev mode
const editableArticle = ref<CaseStudyArticle | null>(null);
const isSavingDraft = ref(false);

watch(
    articleData,
    (newVal) => {
        if (newVal) {
            editableArticle.value = isDevEnv ? JSON.parse(JSON.stringify(newVal)) : newVal;
        }
    },
    { immediate: true },
);

const saveArticleData = async () => {
    try {
        isSavingDraft.value = true;
        const res = await fetch('/__dev/save-article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editableArticle.value),
        });

        if (!res.ok) {
            throw new Error((await res.json()).error || 'Failed to save');
        }

        const notification = document.createElement('div');
        notification.className =
            'fixed top-4 right-4 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-3 rounded-lg z-50 shadow-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 pointer-events-none';
        notification.innerHTML =
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Saved successfully to TS file';
        document.body.appendChild(notification);
        setTimeout(() => (notification.style.opacity = '0'), 2700);
        setTimeout(() => notification.remove(), 3000);
    } catch (e: any) {
        alert('Error saving: ' + e.message);
    } finally {
        isSavingDraft.value = false;
    }
};

const addRow = (sIndex: number, type: 'paragraphs' | 'items') => {
    if (!editableArticle.value?.sections[sIndex]) return;

    if (!editableArticle.value.sections[sIndex][type]) {
        editableArticle.value.sections[sIndex][type] = [];
    }
    editableArticle.value.sections[sIndex][type]?.push(
        'New ' + (type === 'paragraphs' ? 'paragraph' : 'item'),
    );
    saveArticleData();
};

const removeRow = (sIndex: number, rowIndex: number, type: 'paragraphs' | 'items') => {
    if (confirm('Delete this row?')) {
        editableArticle.value?.sections[sIndex][type]?.splice(rowIndex, 1);
        saveArticleData();
    }
};

const toggleSectionType = (sIndex: number) => {
    const section = editableArticle.value?.sections[sIndex];
    if (!section) return;

    if (section.paragraphs) {
        section.items = [...section.paragraphs];
        delete section.paragraphs;
    } else if (section.items) {
        section.paragraphs = [...section.items];
        delete section.items;
    } else {
        section.paragraphs = ['New paragraph'];
    }
    saveArticleData();
};

const addQna = () => {
    if (!editableArticle.value) return;
    if (!editableArticle.value.qnas) {
        editableArticle.value.qnas = [];
    }
    editableArticle.value.qnas.push({ question: 'New Question?', answer: 'New Answer.' });
    saveArticleData();
};

const removeQna = (index: number) => {
    if (confirm('Delete this Q&A?')) {
        editableArticle.value?.qnas?.splice(index, 1);
        saveArticleData();
    }
};

const currentArticle = computed(() =>
    isDev.value ? editableArticle.value || articleData.value : articleData.value,
);

const glossaryItems = computed(() => currentArticle.value?.glossary || []);
const article = computed(() => currentArticle.value);

const glossaryRegistry = new Set<string>();
provide('glossaryRegistry', glossaryRegistry);

watch([language, articleData, isDev], () => {
    glossaryRegistry.clear();
});

const { y } = useWindowScroll();
const currentActiveSection = ref<string>('');

const allCaseStudies = useCaseStudiesData();
const nextCaseStudies = computed(() => {
    if (!article.value) return [];

    const currentId = article.value.id;
    const currentSystemIds = article.value.systemIds || [];

    const candidates = allCaseStudies.value.filter((cs) => cs.id !== currentId);
    const sameSystem = candidates
        .filter((cs) => currentSystemIds.includes(cs.systemId))
        .sort(() => Math.random() - 0.5);

    const others = candidates
        .filter((cs) => !currentSystemIds.includes(cs.systemId))
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
