<template>
    <div class="section-container relative">
        <div
            v-for="section in mountedSections"
            :id="`section-${section.name}`"
            :key="section.name"
            class="section-wrapper"
        >
            <component :is="section.component" />
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    type Component,
    defineAsyncComponent,
    markRaw,
    nextTick,
    onMounted,
    ref,
    watch,
} from 'vue';
import { useRoute } from 'vue-router';

const components: Record<string, Component> = {
    about: markRaw(defineAsyncComponent(() => import('@/views/sections/about.vue'))),
    writing: markRaw(defineAsyncComponent(() => import('@/views/sections/writing.vue'))),
    projects: markRaw(defineAsyncComponent(() => import('@/views/sections/projects.vue'))),
    uses: markRaw(defineAsyncComponent(() => import('@/views/sections/uses.vue'))),
    hobbies: markRaw(defineAsyncComponent(() => import('@/views/sections/hobbies.vue'))),
};

const route = useRoute();

const sectionOrder: string[] = ['about', 'writing', 'projects', 'uses', 'hobbies'];

interface MountedSection {
    name: string;
    component: Component;
}

const mountedSections = ref<MountedSection[]>([]);
const isTransitioning = ref<boolean>(false);
let previousSectionName: string | null = null;
let scrollEndTimeout: ReturnType<typeof window.setTimeout> | undefined;

const scrollToSection = async (
    targetSectionName: string,
    direction: 'up' | 'down',
): Promise<void> => {
    await nextTick();

    const targetElement = document.getElementById(`section-${targetSectionName}`);
    if (!targetElement) return;
    if (direction === 'up' && previousSectionName) {
        const previousElement = document.getElementById(`section-${previousSectionName}`);
        if (previousElement) {
            window.scrollTo({ top: previousElement.offsetTop, behavior: 'instant' });
        }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';
    const targetOffsetTop = targetElement.offsetTop;

    if (Math.abs(window.scrollY - targetOffsetTop) < 1) {
        if (previousSectionName) {
            mountedSections.value = mountedSections.value.filter(
                (s) => s.name !== previousSectionName,
            );
            previousSectionName = null;
        }
        return;
    }

    isTransitioning.value = true;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        window.scrollTo({
            top: targetOffsetTop,
            behavior: scrollBehavior,
        });
    });

    const scrollEndHandler = () => {
        if (Math.abs(window.scrollY - targetOffsetTop) < 5) {
            isTransitioning.value = false;
            document.body.style.overflow = '';
            if (previousSectionName) {
                mountedSections.value = mountedSections.value.filter(
                    (s) => s.name !== previousSectionName,
                );
                previousSectionName = null;
            }
            window.removeEventListener('scroll', onScroll);
            if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
        }
    };

    const onScroll = () => {
        if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
        scrollEndTimeout = setTimeout(scrollEndHandler, 100);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
};

const updateSection = async (newSectionName: string): Promise<void> => {
    if (isTransitioning.value) {
        window.stop();
        if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
        isTransitioning.value = false;
        document.body.style.overflow = '';
        if (previousSectionName) {
            mountedSections.value = mountedSections.value.filter(
                (s) => s.name !== previousSectionName,
            );
        }
    }

    const currentSection = mountedSections.value.find((s) => sectionOrder.includes(s.name));
    const currentSectionName = currentSection ? currentSection.name : null;

    if (currentSectionName === newSectionName) return;

    previousSectionName = currentSectionName;

    const newSection = {
        name: newSectionName,
        component: components[newSectionName as keyof typeof components],
    };

    if (!previousSectionName) {
        mountedSections.value = [newSection];
    } else {
        const currentIndex = sectionOrder.indexOf(previousSectionName);
        const newIndex = sectionOrder.indexOf(newSectionName);

        if (newIndex > currentIndex) {
            mountedSections.value.push(newSection);
            await scrollToSection(newSectionName, 'down');
        } else {
            mountedSections.value.unshift(newSection);
            await scrollToSection(newSectionName, 'up');
        }
    }
};

watch(
    () => route.name,
    (newName) => {
        const sectionName = (newName as string)?.toLowerCase();
        if (sectionName && sectionOrder.includes(sectionName)) {
            updateSection(sectionName);
        }
    },
);

onMounted(() => {
    const sectionName = (route.name as string)?.toLowerCase();
    if (sectionName && sectionOrder.includes(sectionName)) {
        mountedSections.value = [
            {
                name: sectionName,
                component: components[sectionName as keyof typeof components],
            },
        ];
        nextTick(() => window.scrollTo(0, 0));
    }
});
</script>

<style scoped>
.section-wrapper {
    min-height: 100vh;
    width: 100%;
}
</style>
