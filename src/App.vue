<template>
    <div class="min-h-screen flex flex-col">
        <Header />
        <div class="flex flex-grow layout-transition">
            <component :is="currentDrawer" />
            <main
                class="container flex-grow pt-0 pb-16 layout-transition"
                :class="isDrawerOpen ? 'md:ml-64' : ''"
            >
                <router-view v-slot="{ Component: RoutedComponent, route: routedRoute }">
                    <transition :name="shouldTransition(routedRoute) ? 'fade' : ''" mode="out-in">
                        <Suspense :timeout="0">
                            <component :is="RoutedComponent" :key="getRouteKey(routedRoute)" />
                            <template #fallback>
                                <div class="w-full animate-pulse space-y-8 pt-8">
                                    <div class="h-10 bg-bg-muted rounded w-3/4" />
                                    <div class="h-4 bg-bg-muted rounded w-full" />
                                    <div class="h-4 bg-bg-muted rounded w-5/6" />
                                    <div class="h-64 bg-bg-muted rounded w-full" />
                                </div>
                            </template>
                        </Suspense>
                    </transition>
                </router-view>
            </main>
        </div>
        <Footer class="layout-transition" :class="isDrawerOpen ? 'md:ml-32' : ''" />
    </div>
</template>

<script setup lang="ts">
import Header from '@/core/layout/header.vue';
import Footer from '@/core/layout/footer.vue';
import { useTheme } from '@/core/composables/use-theme';
import { useScrollProgress } from '@/core/composables/use-scroll-progress';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';
import { useAppLayout } from '@/core/composables/use-app-layout';

// --- Composables ---
useTheme();
useScrollProgress();
const { currentDrawer, isDrawerOpen, sectionRoutes } = useDrawerManagement();
const { shouldTransition, getRouteKey } = useAppLayout(sectionRoutes);
</script>

