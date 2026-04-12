import { computed, defineAsyncComponent, h, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isDrawerEmpty, isDrawerOpen, language } from '@/store';
import { SYSTEMS_BY_LOCALE } from '@/modules/systems/data/systems.data.ts';
import { CASE_STUDIES_BY_LOCALE } from '@/modules/case-studies/data/case-studies.data.ts';

const sectionRoutes = ['about', 'writing', 'projects', 'uses', 'hobbies'];

export function useDrawerManagement() {
    const route = useRoute();
    const asyncComponentCache = new Map<any, any>();

    const currentDrawer = computed(() => {
        const drawerLoader = route.meta.drawer;

        if (typeof drawerLoader === 'function') {
            if (!asyncComponentCache.has(drawerLoader)) {
                asyncComponentCache.set(
                    drawerLoader,
                    defineAsyncComponent({
                        loader: drawerLoader as () => Promise<any>,
                        loadingComponent: () =>
                            h('aside', {
                                class: 'fixed left-0 w-64 bg-bg-main border-r border-border-subtle animate-pulse',
                                style: 'top: var(--header-height); height: calc(100dvh - var(--header-height))',
                            }),
                        delay: 150,
                    }),
                );
            }
            return asyncComponentCache.get(drawerLoader);
        }

        return null;
    });

    const getDrawerStateKey = () => {
        if (!route.name) return 'drawerOpen';
        let routeName = typeof route.name === 'string' ? route.name : String(route.name);
        if (sectionRoutes.includes(routeName)) {
            routeName = 'home';
        }
        return routeName + 'DrawerOpen';
    };

    const syncDrawerState = () => {
        const key = getDrawerStateKey();

        // 0. Force hidden if route has no drawer component
        if (!route.meta.drawer) {
            isDrawerOpen.value = false;
            // Persistence is handled by key, but for simple consistency:
            localStorage.setItem(key, 'false');
            return;
        }

        // 1. Force hidden on articles (don't read from storage)
        // We force it to false UI-only to satisfy "always false when the page opened" 
        // without replacing persistent state.
        if (route.name === 'case-study-article' || route.name === 'writing-article') {
            isDrawerOpen.value = false;
            return;
        }

        // 2. Otherwise use the standard persistence logic
        const stored = localStorage.getItem(key);

        if (
            ['/systems', '/case-studies'].includes(route.path) &&
            stored === null
        ) {
            isDrawerOpen.value = true;
            localStorage.setItem(key, 'true');
        } else {
            isDrawerOpen.value = stored === 'true';
        }
    };

    const toggleDrawer = () => {
        isDrawerOpen.value = !isDrawerOpen.value;

        // Only persist state on desktop screens
        if (window.innerWidth >= 768) {
            const key = getDrawerStateKey();
            localStorage.setItem(key, isDrawerOpen.value.toString());
        }
    };

    watch(
        [route, language],
        () => {
            syncDrawerState();

            const drawerLoader = route.meta.drawer;
            if (!drawerLoader) {
                isDrawerEmpty.value = true;
                isDrawerOpen.value = false;
            } else {
                // Check content availability for specific routes
                const localeKey = language.value.toLowerCase() as 'en' | 'id';
                let hasContent = true;

                if (route.name === 'systems') {
                    hasContent = (SYSTEMS_BY_LOCALE[localeKey]?.length || 0) > 0;
                } else if (route.name === 'case-studies' || route.name === 'case-study-article') {
                    hasContent = (CASE_STUDIES_BY_LOCALE[localeKey]?.length || 0) > 0;
                }

                isDrawerEmpty.value = !hasContent;

                // User request: Auto-open if has content, auto-close if empty
                if (!hasContent) {
                    isDrawerOpen.value = false;
                    localStorage.setItem(getDrawerStateKey(), 'false');
                } else if (['systems', 'case-studies'].includes(route.name as string)) {
                    isDrawerOpen.value = true;
                    localStorage.setItem(getDrawerStateKey(), 'true');
                }
            }

            // Auto-close drawer on navigation for mobile screens
            if (window.innerWidth < 768) {
                isDrawerOpen.value = false;
            }
        },
        { immediate: true },
    );

    watch(isDrawerEmpty, (isEmpty) => {
        if (isEmpty) {
            isDrawerOpen.value = false;
            const key = getDrawerStateKey();
            localStorage.setItem(key, 'false');
        }
    });

    return {
        currentDrawer,
        isDrawerOpen,
        isDrawerEmpty,
        toggleDrawer,
        sectionRoutes,
    };
}
