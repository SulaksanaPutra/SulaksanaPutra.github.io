<template>
    <aside
        class="drawer-aside"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
        style="top: var(--header-height); height: calc(100dvh - var(--header-height))"
        @mouseleave="onDrawerMouseLeave"
    >
        <nav class="drawer-nav">
            <button
                type="button"
                class="drawer-close-btn"
                aria-label="Close menu"
                @click="toggleDrawer"
            >
                <X />
            </button>

            <ul>
                <template v-for="item in homeDrawer" :key="item.id">
                    <router-link v-slot="{ href, navigate }" :to="item.href || '/'" custom>
                        <li v-show="!item.isActive" class="drawer-item">
                            <div class="w-full">
                                <a
                                    :href="href"
                                    class="drawer-item-label"
                                    @click="
                                        ($event) => {
                                            onItemClicked(item, $event);
                                            navigate($event);
                                            handleDrawerLinkClick();
                                        }
                                    "
                                >
                                    {{ item.label }}
                                </a>
                                <p class="drawer-item-description">
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
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { X } from 'lucide-vue-next';
import { HomeDrawerItem } from '@/modules/home/types/home.types.ts';
import { useHomeDrawerData } from '@/modules/home/data/home-drawer.data.ts';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';

const route = useRoute();
const { toggleDrawer, isDrawerOpen } = useDrawerManagement();

const drawerData = useHomeDrawerData();
const homeDrawer = ref<HomeDrawerItem[]>([]);
const pendingActiveItem = ref<HomeDrawerItem | null>(null);

watch(
    drawerData,
    (newData) => {
        homeDrawer.value = newData.map((item) => ({ ...item, isActive: false }));
        const path = route.path;
        homeDrawer.value.forEach((item) => {
            item.isActive = item.href === path;
        });
    },
    { immediate: true },
);

watch(
    () => route.path,
    (newPath) => {
        homeDrawer.value.forEach((item) => {
            if (pendingActiveItem.value && item.id === pendingActiveItem.value.id) return;
            item.isActive = item.href === newPath;
        });
    },
    { immediate: true },
);

const handleDrawerLinkClick = () => {
    if (window.innerWidth < 768) {
        if (pendingActiveItem.value) {
            pendingActiveItem.value.isActive = true;
            pendingActiveItem.value = null;
        }
        isDrawerOpen.value = false;
    }
};

const onItemClicked = (item: HomeDrawerItem, _event: MouseEvent) => {
    let activeIndex = homeDrawer.value.findIndex((i: HomeDrawerItem) => i.isActive);

    // If there's no active item but there's a pending one,
    // it means the user clicked another item without moving the mouse out.
    if (activeIndex === -1 && pendingActiveItem.value) {
        pendingActiveItem.value.isActive = true;
        activeIndex = homeDrawer.value.findIndex(
            (i: HomeDrawerItem) => i.id === pendingActiveItem.value!.id,
        );
    }

    pendingActiveItem.value = item;

    if (activeIndex !== -1) {
        const [activeItem] = homeDrawer.value.splice(activeIndex, 1);
        activeItem.isActive = false;
        // Move the previously active item to the end of the list
        homeDrawer.value.push(activeItem);
    }
};

const onDrawerMouseLeave = () => {
    if (pendingActiveItem.value) {
        pendingActiveItem.value.isActive = true;
        pendingActiveItem.value = null;
    }
};
</script>
