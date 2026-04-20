<template>
    <div class="app-shell">
        <JsonLd :data="globalSchema" />
        <Header />
        <div class="main-layout">
            <component :is="currentDrawer" />
            <main class="main-content" :class="{ 'drawer-open-offset': isDrawerOpen }">
                <router-view v-slot="{ Component: RoutedComponent, route: routedRoute }">
                    <transition :name="shouldTransition(routedRoute) ? 'fade' : ''" mode="out-in">
                        <Suspense :timeout="0">
                            <component :is="RoutedComponent" :key="getRouteKey(routedRoute)" />
                            <template #fallback>
                                <div class="skeleton-wrapper">
                                    <div class="skeleton-title" />
                                    <div class="skeleton-line w-full" />
                                    <div class="skeleton-line w-5/6" />
                                    <div class="skeleton-block" />
                                </div>
                            </template>
                        </Suspense>
                    </transition>
                </router-view>
            </main>
        </div>
        <Footer :class="{ 'footer-drawer-offset': isDrawerOpen }" />
        <ChatBox />
    </div>
</template>

<script setup lang="ts">
import Header from '@/core/layout/header.vue';
import Footer from '@/core/layout/footer.vue';
import ChatBox from '@/modules/chat/components/chat-box.vue';
import { computed } from 'vue';
import JsonLd from '@/core/components/json-ld.vue';
import { getPersonSchema, getWebSiteSchema } from '@/core/utils/schema';
import { useTheme } from '@/core/composables/use-theme';
import { useScrollProgress } from '@/core/composables/use-scroll-progress';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';
import { useAppLayout } from '@/core/composables/use-app-layout';

// --- Global Schema ---
const globalSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@graph': [
        getPersonSchema(),
        getWebSiteSchema()
    ]
}));

// --- Composables ---
useTheme();
useScrollProgress();
const { currentDrawer, isDrawerOpen, sectionRoutes } = useDrawerManagement();
const { shouldTransition, getRouteKey } = useAppLayout(sectionRoutes);
</script>
