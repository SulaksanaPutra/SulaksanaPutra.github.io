<template>
    <div class="min-h-screen flex flex-col">
        <Header />
        <div class="flex flex-grow transition-all duration-300">
            <component :is="currentDrawer" />
            <main
                class="container flex-grow pt-0 pb-16 transition-all duration-300"
                :class="isDrawerOpen ? 'md:ml-64' : ''"
            >
                <router-view v-slot="{ Component: RoutedComponent, route: routedRoute }">
                    <transition :name="shouldTransition(routedRoute) ? 'fade' : ''" mode="out-in">
                        <component :is="RoutedComponent" :key="getRouteKey(routedRoute)" />
                    </transition>
                </router-view>
            </main>
        </div>
        <Footer class="transition-all duration-30" :class="isDrawerOpen ? 'md:ml-32' : ''" />
    </div>
</template>

<script setup lang="ts">
import { type Component, computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouteLocationNormalized, useRoute } from 'vue-router';
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import HomeDrawer from '@/components/drawers/home-drawer.vue';
import SystemsDrawer from '@/components/drawers/systems-drawer.vue';
import CaseStudiesDrawer from '@/components/drawers/case-studies-drawer.vue';
import {
    activeSection,
    drawerTop,
    headerComponentRef,
    isDark,
    isDrawerOpen,
    scrollProgress,
} from '@/store';
import systemsData from '@/data/systems/systems-page.ts';

const route = useRoute();

const drawerMap: Record<string, Component> = {
    '/': HomeDrawer,
    '/writing': HomeDrawer,
    '/projects': HomeDrawer,
    '/uses': HomeDrawer,
    '/hobbies': HomeDrawer,
    '/systems': SystemsDrawer,
    '/case-studies': CaseStudiesDrawer,
};

const currentDrawer = computed(() => drawerMap[route.path] || null);

const getDrawerStateKey = () => {
    if (route.path === '/systems') return 'systemsDrawerOpen';
    if (route.path === '/case-studies') return 'caseStudiesDrawerOpen';
    if (route.path === '/skillsPage') return 'skillsDrawerOpen';
    if (route.path === '/contactPage') return 'contactDrawerOpen';
    return 'drawerOpen';
};

const syncDrawerState = () => {
    const key = getDrawerStateKey();
    const stored = localStorage.getItem(key);

    if (
        ['/systems', '/case-studies', '/skillsPage', '/contactPage'].includes(route.path) &&
        stored === null
    ) {
        isDrawerOpen.value = true;
        localStorage.setItem(key, 'true');
    } else {
        isDrawerOpen.value = stored === 'true';
    }
};

const updateScrollProgress = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (height > 0) {
        scrollProgress.value = (winScroll / height) * 100;
    } else {
        scrollProgress.value = 0;
    }
};

let sectionObserver: IntersectionObserver | null = null;

const observeSections = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id;
                }
            });
        },
        {
            rootMargin: '-20% 0px -50% 0px',
        },
    );

    const ids = systemsData.map((s) => s.id);
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });

    sectionObserver = observer;
};

const updateDrawerTop = () => {
    if (headerComponentRef.value?.headerRef) {
        drawerTop.value = `${headerComponentRef.value.headerRef.offsetHeight}px`;
        return;
    }

    const w = window.innerWidth;
    if (w < 768) {
        drawerTop.value = '0px';
    } else if (w < 1185) {
        drawerTop.value = '116px';
    } else {
        drawerTop.value = '76px';
    }
};

// --- Lifecycle ---
onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
        document.documentElement.classList.toggle('dark', isDark.value);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = prefersDark;
        document.documentElement.classList.toggle('dark', prefersDark);
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    syncDrawerState();
    updateDrawerTop();
    window.addEventListener('resize', updateDrawerTop);
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollProgress);
    if (sectionObserver) sectionObserver.disconnect();
    window.removeEventListener('resize', updateDrawerTop);
});

watch(
    () => route.path,
    (newPath) => {
        syncDrawerState();
        if (newPath === '/systems') {
            setTimeout(() => {
                if (sectionObserver) sectionObserver.disconnect();
                observeSections();
            }, 500);
        } else {
            if (sectionObserver) sectionObserver.disconnect();
            activeSection.value = '';
        }
    },
    { immediate: true },
);

const sectionRoutes = ['About', 'Writing', 'Projects', 'Uses', 'Hobbies'];

const previousRouteName = ref<string | null>(null);
watch(
    () => route.name,
    (_to, from) => {
        previousRouteName.value = (from as string | undefined) ?? null;
    },
    { immediate: true },
);

const shouldTransition = (route: RouteLocationNormalized) => {
    const toName = route.name as string | undefined;
    const fromName = previousRouteName.value ?? undefined;
    return !(
        toName &&
        fromName &&
        sectionRoutes.includes(toName) &&
        sectionRoutes.includes(fromName)
    );
};

const getRouteKey = (route: RouteLocationNormalized) => {
    if (sectionRoutes.includes(route.name as string)) {
        return 'section-container';
    }
    return route.path;
};
</script>
