<template>
    <div class="text-justify hyphens-auto leading-relaxed">
        <section class="content-narrow pt-8 relative">
            <TransitionGroup name="list" tag="div">
                <article
                    v-for="system in systems"
                    :id="system.id"
                    :key="system.id"
                    class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
                >
                    <h2 class="text-xl text-left text-text-primary mb-2">
                        {{ system.title }}
                    </h2>

                    <p class="text-text-secondary mb-4">
                        {{ system.subtitle }}
                    </p>

                    <div class="flex flex-wrap gap-2 mb-6">
                        <span
                            v-for="tag in system.tags"
                            :key="tag"
                            class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary"
                        >
                            {{ tag }}
                        </span>
                    </div>

                    <div class="space-y-6 text-text-primary">
                        <div v-for="(section, index) in system.sections" :key="index">
                            <p class="label-overline">
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
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from 'vue';
import { activeSection } from '@/store';
import { useSystemsData } from '@/modules/systems/data/systems.data.ts';

const systems = useSystemsData();

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
