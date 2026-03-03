<template>
    <aside
        class="fixed z-[60] md:z-30 left-0 w-64 bg-bg-main border-r border-border-subtle transition-transform duration-300 overflow-y-auto"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
        style="top: var(--header-height); height: calc(100vh - var(--header-height))"
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
                    v-for="system in caseStudiesDrawer"
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
                                :href="caseStudy.href"
                                class="block text-sm transition-colors duration-200 relative"
                                :class="
                                    activeSection === caseStudy.id
                                        ? 'text-accent-primary font-medium'
                                        : 'text-text-secondary hover:text-text-primary'
                                "
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
import { computed, ref } from 'vue';
import { activeSection } from '@/store';
import { ChevronDown, X } from 'lucide-vue-next';
import { useCaseStudiesDrawerData } from '@/modules/case-studies/data/case-studies-drawer.data.ts';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';

const caseStudiesDrawer = useCaseStudiesDrawerData();
const { toggleDrawer, isDrawerOpen } = useDrawerManagement();

const allSystemIds = computed<string[]>(() => caseStudiesDrawer.value.map((s) => s.id));

const openSystems = ref<string[]>(allSystemIds.value);

const toggleSystem = (id: string) => {
    const index = openSystems.value.indexOf(id);
    if (index === -1) {
        openSystems.value.push(id);
    } else {
        openSystems.value.splice(index, 1);
    }
};
</script>

