import { computed, defineAsyncComponent, h, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isDrawerOpen } from '@/store';

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
                                style: 'top: var(--header-height); height: calc(100vh - var(--header-height))',
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
        const stored = localStorage.getItem(key);

        if (
            ['/systems', '/case-studies', '/skills', '/contact'].includes(route.path) &&
            stored === null
        ) {
            isDrawerOpen.value = true;
            localStorage.setItem(key, 'true');
        } else {
            isDrawerOpen.value = stored === 'true';
        }
    };

    watch(
        () => route.path,
        () => {
            syncDrawerState();
        },
        { immediate: true },
    );

    return {
        currentDrawer,
        isDrawerOpen,
        sectionRoutes,
    };
}
