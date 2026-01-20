<template>
    <aside
        class="fixed z-[60] md:z-30 left-0 h-screen w-64 bg-bg-main border-r border-border-subtle transition-transform duration-300 overflow-y-auto"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
        :style="{ top: drawerTop, height: `calc(100vh - ${drawerTop})` }"
        @mouseleave="onDrawerMouseLeave"
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

            <ul>
                <template v-for="(item, _index) in homeDrawerItems" :key="_index">
                    <router-link v-slot="{ href, navigate }" :to="item.href || '/'" custom>
                        <li v-show="!item.isActive" class="flex gap-3 mb-6">
                            <div class="w-full">
                                <a
                                    :href="href"
                                    class="block font-medium text-base text-text-primary hover:text-accent-primary transition-opacity duration-300"
                                    @click="
                                        ($event) => {
                                            navigate($event);
                                            handleDrawerLinkClick();
                                            onItemClicked(item, $event);
                                        }
                                    "
                                >
                                    {{ item.label }}
                                </a>
                                <p
                                    class="text-sm text-text-secondary mt-1 leading-relaxed hyphens-auto snap-y snap-mandatory"
                                >
                                    {{ item.description }}
                                </p>
                            </div>
                        </li>
                    </router-link>
                </template>
            </ul>
        </nav>
    </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue';
import { type RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
import { drawerTop, isDrawerOpen } from '@/store';
import { X } from 'lucide-vue-next';
import { HomeDrawer, HomeDrawerItem } from '@/modules/home/types/home.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import defaultHomeDrawer from '@/modules/home/data/home-drawer.data.ts';

const route: RouteLocationNormalizedLoaded = useRoute();

const { data }: { data: Ref<HomeDrawer | null> } = useI18n<HomeDrawer>('home/home-drawer');

const homeDrawerItems = computed<HomeDrawer>(() => data.value ?? (defaultHomeDrawer as HomeDrawer));

onMounted(() => {
    const path = route.path;
    homeDrawerItems.value.forEach((item) => {
        item.isActive = item.href === path;
    });
});

watch(
    () => route.path,
    () => {
        if (window.innerWidth < 768) {
            isDrawerOpen.value = false;
            return;
        }

        const savedState = localStorage.getItem('drawerOpen');
        if (savedState !== null) {
            isDrawerOpen.value = savedState === 'true';
        } else {
            isDrawerOpen.value = true;
            localStorage.setItem('drawerOpen', 'true');
        }
    },
    { immediate: true },
);

const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value;
    if (window.innerWidth >= 768) {
        localStorage.setItem('drawerOpen', isDrawerOpen.value.toString());
    }
};

const handleDrawerLinkClick = () => {
    if (window.innerWidth < 768) {
        isDrawerOpen.value = false;
    }
};

const pendingActiveItem = ref<HomeDrawerItem | null>(null);

const onItemClicked = (item: HomeDrawerItem, _event: MouseEvent) => {
    pendingActiveItem.value = item;
    const activeIndex = homeDrawerItems.value.findIndex((i: HomeDrawerItem) => i.isActive);
    const clickedIndex = homeDrawerItems.value.findIndex((i: HomeDrawerItem) => i === item);
    if (activeIndex !== -1 && activeIndex !== clickedIndex) {
        const [activeItem] = homeDrawerItems.value.splice(activeIndex, 1);
        activeItem.isActive = false;
        const insertIndex = activeIndex < clickedIndex ? clickedIndex : clickedIndex + 1;
        homeDrawerItems.value.splice(insertIndex, 0, activeItem);
    }
};

const onDrawerMouseLeave = () => {
    if (pendingActiveItem.value) {
        pendingActiveItem.value.isActive = true;
        pendingActiveItem.value = null;
    }
};
</script>
