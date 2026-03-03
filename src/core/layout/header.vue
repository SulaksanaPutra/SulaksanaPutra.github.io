<template>
    <header
        ref="headerRef"
        class="sticky top-0 z-[70] bg-bg-main py-3 border-b border-border-subtle transition-colors duration-300"
    >
        <div class="relative mx-auto px-6 md:px-8 flex items-center justify-between flex-wrap">
            <div class="flex items-center w-full md:w-auto">
                <div class="flex items-center mr-4 md:mr-8 text-text-primary">
                    <button
                        type="button"
                        class="flex items-center justify-center w-8 h-8"
                        :class="{ 'text-bg-main': isDrawerEmpty }"
                        :disabled="isDrawerEmpty"
                        aria-label="Toggle menu"
                        @click="toggleDrawer"
                    >
                        <Menu />
                    </button>
                </div>
                <div class="flex items-center justify-between w-full">
                    <router-link
                        :to="'/'"
                        class="mb-4 hover:no-underline md:mb-0 cursor-pointer text-accent-primary font-semibold text-[1.125rem] leading-[1.35] tracking-[-0.015em]"
                        style="
                            font-family:
                                Zalando Sans,
                                sans-serif;
                        "
                    >
                        BayuAksana
                        <div class="text-base">dotcom</div>
                    </router-link>
                    <div
                        class="md:hidden items-center gap-1 rounded-full border border-border-subtle p-1 text-sm ml-4"
                    >
                        <button
                            v-for="lang in ['EN', 'ID']"
                            :key="lang"
                            class="px-2 py-0.5 rounded-full transition-colors"
                            :class="
                                language === lang
                                    ? 'bg-bg-muted text-text-primary'
                                    : 'text-text-secondary hover:bg-bg-muted'
                            "
                            @click="setLanguage(lang)"
                        >
                            {{ lang }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="relative ml-8 hidden md:block">
                <div class="relative">
                    <Search
                        class="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary"
                        :size="16"
                    />
                    <input
                        ref="searchInputRef"
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search…"
                        class="w-56 md:w-72 pl-8 bg-bg-muted border border-border-subtle rounded-md py-1.5 px-2 text-sm focus:outline-none"
                        @keydown="handleSearchKeydown"
                    />
                </div>
                <ul
                    v-if="searchQuery && filteredLinks.length"
                    class="absolute left-0 mt-2 w-[28rem] max-w-[90vw] bg-bg-main border border-border-subtle rounded-md shadow-lg z-[100] max-h-[70vh] overflow-y-auto"
                >
                    <li
                        v-for="(item, index) in filteredLinks"
                        :key="item.id"
                        class="px-4 py-3 hover:bg-bg-muted cursor-pointer transition-colors"
                        :class="{ 'bg-bg-muted': selectedIndex === index }"
                        @mouseenter="selectedIndex = index"
                    >
                        <router-link :to="item.href" class="block" @click="searchQuery = ''">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-text-primary">
                                    {{ item.label }}
                                </span>
                                <span
                                    v-if="item.category"
                                    class="text-[10px] uppercase tracking-wider text-text-secondary px-1.5 py-0.5 rounded bg-bg-muted border border-border-subtle"
                                >
                                    {{ item.category }}
                                </span>
                            </div>
                            <div class="text-xs text-text-secondary mt-0.5 line-clamp-1">
                                {{ item.description }}
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
            <nav class="flex items-center ml-auto w-full md:w-auto">
                <ul
                    class="flex flex-wrap justify-center md:justify-start gap-x-4 md:gap-x-9 gap-y-3 list-none p-0 m-0 w-full md:w-auto"
                >
                    <li
                        v-for="nav in navLinks"
                        :key="nav.href"
                        :class="nav.hiddenOnMd ? 'hidden md:block' : ''"
                    >
                        <router-link
                            :to="nav.href"
                            class="text-base text-text-secondary hover:text-text-primary hover:no-underline magnetic-hover"
                            active-class="text-text-primary font-semibold"
                        >
                            {{ nav.label }}
                        </router-link>
                    </li>
                </ul>
                <button
                    type="button"
                    class="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-bg-muted ml-auto md:ml-6"
                    aria-label="Toggle theme"
                    @click="toggleTheme"
                >
                    <Moon v-if="!isDark" :size="20" class="text-text-primary" />
                    <Sun v-else :size="20" class="text-text-primary" />
                </button>
                <div
                    class="hidden md:flex items-center gap-1 rounded-full border border-border-subtle p-1 text-sm ml-4"
                >
                    <button
                        v-for="lang in ['EN', 'ID']"
                        :key="lang"
                        class="px-2 py-0.5 rounded-full transition-colors"
                        :class="
                            language === lang
                                ? 'bg-bg-muted text-text-primary'
                                : 'text-text-secondary hover:bg-bg-muted'
                        "
                        @click="setLanguage(lang)"
                    >
                        {{ lang }}
                    </button>
                </div>
            </nav>
        </div>
        <div
            class="absolute bottom-0 left-0 h-[2px] bg-accent-primary transition-all duration-75 ease-out z-50"
            :style="{ width: `${scrollProgress}%`, opacity: scrollProgress > 0 ? 1 : 0 }"
        />
    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Menu, Moon, Search, Sun } from 'lucide-vue-next';
import { headerComponentRef, isDark, isDrawerEmpty, language, scrollProgress } from '@/store';

import { useHeaderData } from '@/core/data/header.data.ts';
import { CASE_STUDIES_BY_LOCALE } from '@/modules/case-studies/data/case-studies.data.ts';
import { SYSTEMS_BY_LOCALE } from '@/modules/systems/data/systems.data.ts';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';

const page = useHeaderData();
const router = useRouter();
const { toggleDrawer } = useDrawerManagement();

const headerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref<string>('');

const searchLinks = computed(() => page.value?.searchLinks || []);
const navLinks = computed(() => page.value?.navigations || []);

const selectedIndex = ref(-1);

const searchablePool = computed(() => {
    const localeKey = language.value.toLowerCase() as 'en' | 'id';

    return [
        ...searchLinks.value.map((l) => ({ ...l, category: 'Page' })),
        ...SYSTEMS_BY_LOCALE[localeKey].map((s) => ({
            id: s.id,
            label: s.title,
            description: s.highlight,
            href: `/case-studies?systemId=${s.id}`,
            category: 'System',
        })),
        ...CASE_STUDIES_BY_LOCALE[localeKey].map((c) => ({
            id: c.id,
            label: c.title,
            description: c.highlight,
            href: c.link.href,
            category: 'Case Study',
        })),
    ];
});

const filteredLinks = computed(() => {
    if (!searchQuery.value) return [];
    const query = searchQuery.value.toLowerCase();
    return searchablePool.value.filter(
        (item) =>
            item.label.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query),
    );
});

watch(searchQuery, () => {
    selectedIndex.value = -1;
});

const handleSearchKeydown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex.value = (selectedIndex.value + 1) % filteredLinks.value.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex.value =
            (selectedIndex.value - 1 + filteredLinks.value.length) % filteredLinks.value.length;
    } else if (e.key === 'Enter') {
        if (selectedIndex.value >= 0 && filteredLinks.value[selectedIndex.value]) {
            const item = filteredLinks.value[selectedIndex.value];
            searchQuery.value = '';
            router.push(item.href);
        }
    } else if (e.key === 'Escape') {
        searchQuery.value = '';
        searchInputRef.value?.blur();
    }
};

const toggleTheme = (): void => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

const setLanguage = (lang: string): void => {
    language.value = lang;
    if (typeof window !== 'undefined') {
        window.localStorage.setItem('language', lang);
    }
};

const handleKeydown = (e: KeyboardEvent): void => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.value?.focus();
    }
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    headerComponentRef.value = { headerRef: headerRef.value };

    if (headerRef.value) {
        resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.target.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--header-height', `${height}px`);
            }
        });
        resizeObserver.observe(headerRef.value);
    }
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});
</script>
