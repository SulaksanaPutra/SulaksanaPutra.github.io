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
        <CookieConsent />
    </div>
</template>

<script setup lang="ts">
import Header from '@/core/layout/header.vue';
import Footer from '@/core/layout/footer.vue';
import ChatBox from '@/modules/chat/components/chat-box.vue';
import CookieConsent from '@/core/components/cookie-consent.vue';
import { computed, onMounted } from 'vue';
import JsonLd from '@/core/components/json-ld.vue';
import { getPersonSchema, getWebSiteSchema, getOrganizationSchema } from '@/core/utils/schema';
import { useTheme } from '@/core/composables/use-theme';
import { useScrollProgress } from '@/core/composables/use-scroll-progress';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';
import { useAppLayout } from '@/core/composables/use-app-layout';

// --- Redirection ---
onMounted(() => {
    if (window.location.hostname === 'www.bayuaksana.com') {
        window.location.replace(
            'https://bayuaksana.com' + window.location.pathname + window.location.search,
        );
    }
});

// --- Global Schema ---
const globalSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@graph': [getPersonSchema(), getWebSiteSchema(), getOrganizationSchema()],
}));

// --- Composables ---
useTheme();
useScrollProgress();
const { currentDrawer, isDrawerOpen, sectionRoutes } = useDrawerManagement();
const { shouldTransition, getRouteKey } = useAppLayout(sectionRoutes);
</script>
