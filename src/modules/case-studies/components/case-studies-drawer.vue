<template>
    <aside
        class="fixed z-[60] md:z-30 left-0 h-screen w-64 bg-bg-main border-r border-border-subtle transition-transform duration-300 overflow-y-auto"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
        :style="{ top: drawerTop, height: `calc(100vh - ${drawerTop})` }"
    >
        <nav class="p-6 pt-10 relative">
            <button
                type="button"
                class="absolute top-4 right-4 md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-bg-muted"
                aria-label="Close menu"
                @click="toggleDrawer"
            >
                <X />
            </button>

            <ul class="space-y-6">
                <li
                    v-for="system in caseStudiesDrawerItems"
                    :key="system.id"
                    class="space-y-2"
                    :class="openSystems.includes(system.id) && 'pb-6'"
                >
                    <button
                        type="button"
                        class="flex items-center justify-between w-full text-left font-medium text-base text-text-primary hover:text-accent-primary transition-colors duration-200"
                        @click="toggleSystem(system.id)"
                    >
                        <span>{{ system.label }}</span>
                        <ChevronDown
                            class="w-4 h-4 text-text-secondary transition-transform duration-200 flex-shrink-0"
                            :class="openSystems.includes(system.id) ? 'rotate-180' : ''"
                        />
                    </button>

                    <ul v-show="openSystems.includes(system.id)" class="ml-0.5 space-y-2 relative">
                        <li
                            v-for="(caseStudy, index) in system.cases"
                            :key="caseStudy.id"
                            class="relative pl-3"
                        >
                            <div
                                class="absolute left-0 top-0 bottom-0 w-px bg-border-subtle"
                                :class="index === system.cases.length - 1 ? 'h-3' : 'h-full'"
                            />
                            <div class="absolute left-0 top-3 w-3 h-px bg-border-subtle" />
                            <a
                                :href="`#${caseStudy.id}`"
                                class="block text-sm transition-colors duration-200 relative"
                                :class="
                                    activeSection === caseStudy.id
                                        ? 'text-accent-primary font-medium'
                                        : 'text-text-secondary hover:text-text-primary'
                                "
                                @click.prevent="scrollToSection(caseStudy.id)"
                            >
                                {{ caseStudy.label }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { type RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { activeSection, drawerTop, headerComponentRef, isDrawerOpen } from '@/store';
import { ChevronDown, X } from 'lucide-vue-next';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { CaseStudiesDrawer } from '@/modules/case-studies/case-studies.types.ts';
import defaultCaseStudiesDrawer from '@/modules/case-studies/data/case-studies-drawer.data.ts';

const { data } = useI18n<CaseStudiesDrawer>('case-studies/case-studies-drawer');

const caseStudiesDrawerItems = computed<CaseStudiesDrawer>(
    () => data.value ?? defaultCaseStudiesDrawer,
);

const route: RouteLocationNormalizedLoaded = useRoute();

const allSystemIds = computed<string[]>(() => caseStudiesDrawerItems.value.map((s) => s.id));

const openSystems = ref<string[]>(allSystemIds.value);

const toggleSystem = (id: string) => {
    const index = openSystems.value.indexOf(id);
    if (index === -1) {
        openSystems.value.push(id);
    } else {
        openSystems.value.splice(index, 1);
    }
};

watch(
    () => route.path,
    () => {
        if (window.innerWidth < 768) {
            isDrawerOpen.value = false;
            return;
        }

        const savedState = localStorage.getItem('caseStudiesDrawerOpen');
        if (savedState !== null) {
            isDrawerOpen.value = savedState === 'true';
        } else {
            isDrawerOpen.value = true;
            localStorage.setItem('caseStudiesDrawerOpen', 'true');
        }
    },
    { immediate: true },
);

const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
    if (window.innerWidth >= 768) {
        localStorage.setItem('caseStudiesDrawerOpen', isDrawerOpen.value.toString());
    }
};

const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = headerComponentRef.value?.headerRef?.offsetHeight || 0;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset - 24;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
    });

    activeSection.value = id;

    if (window.innerWidth < 768) {
        isDrawerOpen.value = false;
    }
};
</script>
