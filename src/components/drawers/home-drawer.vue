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
                @click="toggleDrawer"
                class="absolute top-4 right-4 md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-bg-muted"
                aria-label="Close menu"
            >
                <X />
            </button>

            <ul>
                <template v-for="(item, _index) in homeItems" :key="_index">
                    <router-link :to="item.to || '/'" custom v-slot="{ href, navigate }">
                        <li class="flex gap-3" v-show="!item.isActive">
                            <div class="w-full">
                                <a
                                    :href="href"
                                    class="block font-medium text-text-primary hover:text-accent-primary transition-opacity duration-300"
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
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { isDrawerOpen, drawerTop } from '@/store';
import rawHomeItems from '@/data/home/home-drawer.json';
import { X } from 'lucide-vue-next';
import type { HomeDrawer } from '@/data/types';

const route = useRoute();
const homeItems = ref<HomeDrawer[]>(rawHomeItems as HomeDrawer[]);

onMounted(() => {
    const path = route.path;

    homeItems.value.forEach((item) => {
        item.isActive = item.to === path;
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

const pendingActiveItem = ref<HomeDrawer | null>(null);

const onItemClicked = (item: HomeDrawer, _event: MouseEvent) => {
    pendingActiveItem.value = item;
    const activeIndex = homeItems.value.findIndex((i: HomeDrawer) => i.isActive);
    const clickedIndex = homeItems.value.findIndex((i: HomeDrawer) => i === item);
    if (activeIndex !== -1 && activeIndex !== clickedIndex) {
        const [activeItem] = homeItems.value.splice(activeIndex, 1);
        activeItem.isActive = false;
        const insertIndex = activeIndex < clickedIndex ? clickedIndex : clickedIndex + 1;
        homeItems.value.splice(insertIndex, 0, activeItem);
    }
};

const onDrawerMouseLeave = () => {
    if (pendingActiveItem.value) {
        pendingActiveItem.value.isActive = true;
        pendingActiveItem.value = null;
    }
};
</script>
