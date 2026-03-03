<template>
    <div class="">
        <section class="py-8" v-if="article">
            <div class="mb-8">
                <router-link
                    :to="article.backLink.href"
                    class="text-sm text-text-secondary hover:text-text-primary"
                >
                    {{ article.backLink.label }}
                </router-link>
            </div>

            <header class="mb-8">
                <h1 class="text-xl text-left text-text-primary leading-tight mb-2">
                    {{ article.title }}
                </h1>
                <p class="text-text-secondary max-w-2xl">
                    {{ article.highlight }}
                </p>
            </header>

            <div class="flex flex-col md:flex-row md:gap-12 relative items-start">
                <aside class="hidden md:block w-48 shrink-0 sticky top-24">
                    <nav v-if="article.sections?.length">
                        <h2
                            class="text-sm font-bold uppercase tracking-wider mb-4 text-text-primary"
                        >
                            Contents
                        </h2>
                        <ul class="space-y-3 text-sm border-l pl-4">
                            <li v-for="section in article.sections" :key="section.id">
                                <a
                                    :href="`#${section.id}`"
                                    @click.prevent="scrollToSection(section.id)"
                                    class="block text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {{ section.label }}
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <article class="text-justify hyphens-auto leading-relaxed space-y-8 flex-1 min-w-0">
                    <section v-for="section in article.sections" :id="section.id" :key="section.id">
                        <p class="label-overline" v-if="section.label">
                            {{ section.label }}
                        </p>
                        <div v-if="section.paragraphs" class="space-y-4">
                            <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex">
                                {{ paragraph }}
                            </p>
                        </div>
                        <ul v-if="section.items" class="pl-5 list-disc space-y-2">
                            <li v-for="(item, iIndex) in section.items" :key="iIndex">
                                {{ item }}
                            </li>
                        </ul>
                    </section>
                </article>
            </div>
        </section>
        <section v-else class="py-16 text-center">
            <h1 class="text-xl text-text-primary mb-2">Case study not found</h1>
            <p class="text-text-secondary mb-6">
                The case study you are looking for does not exist or is no longer available.
            </p>
            <router-link to="/case-studies" class="text-sm text-primary hover:underline">
                Back to case studies
            </router-link>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useCaseStudyArticle } from '@/modules/case-studies/data/case-studies.data.ts';
import { headerComponentRef } from '@/store.ts';

const route = useRoute();
const articleId = typeof route.params.articleId === 'string' ? route.params.articleId : '';
const article = useCaseStudyArticle(articleId);

const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = headerComponentRef.value?.headerRef?.offsetHeight || 0;
        const offset = headerOffset + 12;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    }
};
</script>


