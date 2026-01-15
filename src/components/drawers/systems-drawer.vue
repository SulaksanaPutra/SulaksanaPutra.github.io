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
                ✕
            </button>

            <ul class="space-y-6">
                <li
                    v-for="item in systemsItems"
                    :key="item.id"
                    class="flex gap-3"
                >
                    <div class="w-full">
                        <a
                            :href="`#${item.id}`"
                            class="block font-medium text-base transition-colors duration-200"
                            :class="
                                activeSection === item.id
                                    ? 'text-accent-primary'
                                    : 'text-text-primary hover:text-accent-primary'
                            "
                            @click.prevent="scrollToSection(item.id)"
                        >
                            {{ item.label }}
                        </a>
                        <p class="text-sm text-text-secondary mt-1 leading-relaxed">
                            {{ item.description }}
                        </p>
                        <div
                            v-if="item.details && item.details.length"
                            class="mt-2 space-y-1.5 border-l-2 border-border-subtle pl-3"
                        >
                            <p
                                v-for="(detail, index) in item.details"
                                :key="index"
                                class="text-xs text-text-secondary"
                            >
                                <span class="text-text-primary font-medium">{{ detail.label }}:</span>
                                {{ detail.text }}
                            </p>
                        </div>
                        <div
                            v-if="item.tags && item.tags.length"
                            class="flex flex-wrap gap-1.5 mt-2"
                        >
                            <span
                                v-for="tag in item.tags"
                                :key="tag"
                                class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50"
                            >
                                {{ tag }}
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { activeSection, drawerTop, headerComponentRef, isDrawerOpen } from '@/store';
import rawSystemsItems from '@/data/systems/systems-drawer.json';
import { SystemsDrawer } from '@/data/types.ts';

const systemsItems = rawSystemsItems as SystemsDrawer[];

const route = useRoute();

watch(
    () => route.path,
    () => {
        if (window.innerWidth < 768) {
            isDrawerOpen.value = false;
            return;
        }

        const savedState = localStorage.getItem('systemsDrawerOpen');
        if (savedState !== null) {
            isDrawerOpen.value = savedState === 'true';
        } else {
            isDrawerOpen.value = true;
            localStorage.setItem('systemsDrawerOpen', 'true');
        }
    },
    { immediate: true },
);

const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
    if (window.innerWidth >= 768) {
        localStorage.setItem('systemsDrawerOpen', isDrawerOpen.value.toString());
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
