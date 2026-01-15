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
                    v-for="system in caseStudiesItems"
                    :key="system.systemId"
                    class="space-y-2"
                    :class="openSystems.includes(system.systemId) && 'pb-6'"
                >
                    <button
                        type="button"
                        class="flex items-center justify-between w-full text-left font-medium text-base text-text-primary hover:text-accent-primary transition-colors duration-200"
                        @click="toggleSystem(system.systemId)"
                    >
                        <span>{{ system.systemTitle }}</span>
                        <ChevronDown
                            class="w-4 h-4 text-text-secondary transition-transform duration-200 flex-shrink-0"
                            :class="openSystems.includes(system.systemId) ? 'rotate-180' : ''"
                        />
                    </button>

                    <ul
                        v-show="openSystems.includes(system.systemId)"
                        class="ml-0.5 space-y-2 relative"
                    >
                        <li
                            v-for="(caseStudy, index) in system.cases"
                            :key="caseStudy.id"
                            class="relative pl-3"
                        >
                            <div
                                class="absolute left-0 top-0 bottom-0 w-px bg-border-subtle"
                                :class="index === system.cases.length - 1 ? 'h-3' : 'h-full'"
                            ></div>
                            <div class="absolute left-0 top-3 w-3 h-px bg-border-subtle"></div>
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
                                {{ caseStudy.title }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { activeSection, drawerTop, headerComponentRef, isDrawerOpen } from '@/store';
import { CaseStudiesDrawer } from '@/data/types.ts';
import rawCaseStudiesItems from '@/data/case-studies/case-studies-drawer.json';
import { ChevronDown, X } from 'lucide-vue-next';

const caseStudiesItems = rawCaseStudiesItems as CaseStudiesDrawer[];
const route = useRoute();
const openSystems = ref<string[]>([]);

// Initialize open systems (all open by default or based on logic)
openSystems.value = caseStudiesItems.map((s) => s.systemId);

const toggleSystem = (systemId: string) => {
    const index = openSystems.value.indexOf(systemId);
    if (index === -1) {
        openSystems.value.push(systemId);
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
