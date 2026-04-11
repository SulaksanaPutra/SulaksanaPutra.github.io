<template>
    <div class="prose-content py-8">
        <section v-if="systems.length > 0" class="content-narrow relative mx-auto">
            <TransitionGroup name="list" tag="div">
                <article
                    v-for="system in systems"
                    :id="system.id"
                    :key="system.id"
                    class="article-item mb-16"
                >
                    <h2 class="article-title">
                        {{ system.title }}
                    </h2>

                    <p class="article-meta">
                        {{ system.subtitle }}
                    </p>

                    <div class="flex flex-wrap gap-2 mb-6">
                        <span v-for="tag in system.tags" :key="tag" class="tag-pill">
                            {{ tag }}
                        </span>
                    </div>

                    <div class="space-y-6 text-text-primary">
                        <div v-for="(section, index) in system.sections" :key="index">
                            <p class="article-section-title">
                                {{ section.label }}
                            </p>
                            <p>{{ section.description }}</p>
                        </div>

                        <p v-if="system.link && system.link.label">
                            <router-link :to="system.link.href" class="magnetic-hover font-medium">
                                {{ system.link.label }}
                            </router-link>
                        </p>
                    </div>
                </article>
            </TransitionGroup>
        </section>

        <LanguageFallback 
            v-else-if="availability.length > 0" 
            :availability="availability"
        />

        <div v-else class="py-16 text-center">
            <p class="text-text-secondary">No systems available.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { activeSection } from '@/store';
import { useSystemsAvailability, useSystemsData } from '@/modules/systems/data/systems.data.ts';
import { useSeo } from '@/core/composables/use-seo';
import LanguageFallback from '@/core/components/language-fallback.vue';

const systems = useSystemsData();
const availability = useSystemsAvailability();

useSeo(
    computed(() => ({
        title: 'System Architecture',
        description: 'Deep dive into the architecture and systems I have built.',
    })),
);

let sectionObserver: IntersectionObserver | null = null;

const observeSections = () => {
    if (sectionObserver) sectionObserver.disconnect();

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id;
                }
            });
        },
        {
            rootMargin: '-20% 0px -50% 0px',
        },
    );

    const ids = systems.value.map((s) => s.id);
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });

    sectionObserver = observer;
};

watch(
    systems,
    () => {
        nextTick(() => {
            observeSections();
        });
    },
    { immediate: true },
);

onMounted(() => {
    // isDrawerEmpty now handled by useDrawerManagement
});

onUnmounted(() => {
    if (sectionObserver) sectionObserver.disconnect();
    activeSection.value = '';
});
</script>
