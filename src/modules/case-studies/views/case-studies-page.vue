<template>
    <div class="space-y-8 my-8 text-justify hyphens-auto leading-relaxed">
        <section class="content-narrow" v-if="caseStudies.length">
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

                    <router-link
                        :id="caseStudy.link.id"
                        :to="caseStudy.link.href"
                        class="magnetic-hover font-medium"
                    >
                        {{ caseStudy.link.label }}
                    </router-link>
                </article>
            </div>
        </section>
        <section v-else>
            <div class="py-16 text-center">
                <h2 class="text-xl text-text-primary mb-2">No case studies found</h2>
                <p class="text-text-secondary mb-6">
                    There are no case studies available for the selected system.
                </p>
                <router-link to="/case-studies" class="text-sm text-primary hover:underline">
                    View all case studies
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCaseStudiesData } from '@/modules/case-studies/data/case-studies.data.ts';

const route = useRoute();

const systemId = computed(() => {
    const value = route.query.systemId;
    return typeof value === 'string' ? value : undefined;
});

const caseStudies = useCaseStudiesData(systemId);
</script>
