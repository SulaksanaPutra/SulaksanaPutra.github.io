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
                <li v-for="item in systemsItems" :key="item.id" class="flex gap-3">
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
                    </div>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { computed, type Ref, watch } from 'vue';
import { type RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { activeSection, drawerTop, headerComponentRef, isDrawerOpen } from '@/store.ts';
import { X } from 'lucide-vue-next';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { CaseStudyArticleDrawer } from '@/modules/case-studies/case-studies.types.ts';

const { data }: { data: Ref<CaseStudyArticleDrawer | null> } = useI18n<CaseStudyArticleDrawer>(
    'case-studies/articles/twin-v1/vat-change-case-drawer',
);

const systemsItems = computed<CaseStudyArticleDrawer>(
    () => data.value ?? (defaultCaseStudyArticleDrawer as CaseStudyArticleDrawer),
);

const route: RouteLocationNormalizedLoaded = useRoute();

watch(
    () => route.path,
    () => {
        if (window.innerWidth < 768) {
            isDrawerOpen.value = false;
            return;
        }

        const savedState = localStorage.getItem('articleCaseStudyDrawerOpen');
        if (savedState !== null) {
            isDrawerOpen.value = savedState === 'true';
        } else {
            isDrawerOpen.value = true;
            localStorage.setItem('articleCaseStudyDrawerOpen', 'true');
        }
    },
    { immediate: true },
);

const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
    if (window.innerWidth >= 768) {
        localStorage.setItem('articleCaseStudyDrawerOpen', isDrawerOpen.value.toString());
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
