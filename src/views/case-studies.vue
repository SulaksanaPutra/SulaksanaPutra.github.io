<template>
    <div class="space-y-8 my-8 text-justify hyphens-auto leading-relaxed">
        <section class="content-narrow">
            <div class="grid gap-8">
                <article
                    v-for="caseStudy in caseStudies"
                    :key="caseStudy.id"
                    class="pb-8 border-b border-border-subtle last:border-0"
                >
                    <h2 class="text-xl font-semibold text-left mb-2 leading-snug">
                        <router-link
                            :to="caseStudy.link.href"
                            class="text-text-primary hover:text-accent-primary no-underline"
                        >
                            {{ caseStudy.title }}
                        </router-link>
                    </h2>

                    <p class="text-text-secondary max-w-2xl mb-4">
                        {{ caseStudy.highlight }}
                    </p>

                    <p class="mb-4 max-w-prose">
                        {{ caseStudy.description }}
                    </p>

                    <router-link :id="caseStudy.link.id" :to="caseStudy.link.href">
                        {{ caseStudy.link.label }}
                    </router-link>
                </article>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import { CaseStudy } from '@/types/case-study.ts';
import defaultCaseStudies from '@/data/case-studies/case-studies-page';
import { computed, type Ref } from 'vue';

const { data }: { data: Ref<CaseStudy[] | null> } = useI18n<CaseStudy[]>(
    'case-studies/case-studies-page',
);

const caseStudies = computed<CaseStudy[]>(() => data.value ?? (defaultCaseStudies as CaseStudy[]));
</script>
