<template>
    <div class="prose-content my-8">
        <section class="content-narrow" v-if="caseStudies.length">
            <div class="grid gap-8">
                <article v-for="caseStudy in caseStudies" :key="caseStudy.id" class="article-item">
                    <h2 class="article-title">
                        <router-link :to="caseStudy.link.href" class="article-link font-semibold">
                            {{ caseStudy.title }}
                        </router-link>
                    </h2>

                    <p class="article-meta text-text-secondary">
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
        
        <LanguageFallback 
            v-else-if="availability.length > 0" 
            :availability="availability"
            :back-link="systemId ? { href: '/case-studies?all=true' } : undefined"
        />

        <section v-else>
            <div class="py-16 text-center">
                <h2 class="text-xl text-text-primary mb-2">No case studies found</h2>
                <p class="text-text-secondary mb-6">
                    There are no case studies available.
                </p>
                <router-link v-if="systemId" to="/case-studies" class="text-sm text-primary hover:underline">
                    View all case studies
                </router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCaseStudiesData, useCaseStudiesAvailability } from '@/modules/case-studies/data/case-studies.data.ts';
import { useSeo } from '@/core/composables/use-seo';
import LanguageFallback from '@/core/components/language-fallback.vue';

const route = useRoute();

const systemId = computed(() => {
    const value = route.query.systemId;
    return typeof value === 'string' ? value : undefined;
});

const caseStudies = useCaseStudiesData(systemId);
const availability = useCaseStudiesAvailability(systemId);

useSeo(
    computed(() => ({
        title: 'Case Studies',
        description: 'Selected projects and deep dives into engineering challenges.',
    })),
);
</script>
