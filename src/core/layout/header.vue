<template>
    <header
        ref="headerRef"
        class="header-main"
    >
        <div class="header-container">
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
                        class="header-logo"
                        style="
                            font-family:
                                Zalando Sans,
                                sans-serif;
                        "
                    >
                        BayuAksana
                        <div class="text-base">dotcom</div>
                    </router-link>
                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            class="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-bg-muted border border-border-subtle transition-colors"
                            :class="{ 'text-accent-primary': isOpen }"
                            aria-label="Toggle chat"
                            @click="toggleChat"
                        >
                            <MessageCircle v-if="!isOpen" :size="18" />
                            <X v-else :size="18" />
                        </button>
                        <div
                            class="md:hidden lang-switcher-container"
                        >
                            <button
                                v-for="lang in ['EN', 'ID']"
                                :key="lang"
                                class="lang-btn"
                                :class="
                                    language === lang
                                        ? 'lang-btn-active'
                                        : 'lang-btn-inactive'
                                "
                                @click="setLanguage(lang)"
                            >
                                {{ lang }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-wrapper">
                <div class="relative">
                    <div class="search-icon-wrapper">
                        <Search :size="16" />
                    </div>
                    <input
                        ref="searchInputRef"
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search…"
                        class="search-input"
                        @keydown="handleSearchKeydown"
                    />
                </div>
                <ul
                    v-if="searchQuery && filteredLinks.length"
                    class="search-result-container"
                >
                    <li
                        v-for="(item, index) in filteredLinks"
                        :key="item.id"
                        class="search-result-item"
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
                                    class="search-category-tag"
                                >
                                    {{ item.category }}
                                </span>
                            </div>
                            <div class="search-result-desc">
                                {{ item.description }}
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
            <nav class="nav-wrapper">
                <ul
                    class="nav-list"
                >
                    <li
                        v-for="nav in navLinks"
                        :key="nav.href"
                        :class="nav.hiddenOnMd ? 'hidden md:block' : ''"
                    >
                        <router-link
                            :to="nav.href"
                            class="nav-link"
                            active-class="nav-link-active"
                        >
                            {{ nav.label }}
                        </router-link>
                    </li>
                </ul>
                <button
                    type="button"
                    class="hidden md:flex btn-icon ml-auto md:ml-6"
                    aria-label="Toggle theme"
                    @click="toggleTheme"
                >
                    <Moon v-if="!isDark" :size="20" class="text-text-primary" />
                    <Sun v-else :size="20" class="text-text-primary" />
                </button>
                <div
                    class="hidden md:flex lang-switcher-container ml-4"
                >
                    <button
                        v-for="lang in ['EN', 'ID']"
                        :key="lang"
                        class="lang-btn"
                        :class="
                            language === lang
                                ? 'lang-btn-active'
                                : 'lang-btn-inactive'
                        "
                        @click="setLanguage(lang)"
                    >
                        {{ lang }}
                    </button>
                </div>
            </nav>
        </div>
        <div
            class="scroll-progress-bar"
            :style="{ width: `${scrollProgress}%`, opacity: scrollProgress > 0 ? 1 : 0 }"
        />
    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Menu, MessageCircle, Moon, Search, Sun, X } from 'lucide-vue-next';
import { headerComponentRef, isDark, isDrawerEmpty, language, scrollProgress } from '@/store';

import { useHeaderData } from '@/core/data/header.data.ts';
import { CASE_STUDIES_BY_LOCALE } from '@/modules/case-studies/data/case-studies.data.ts';
import { SYSTEMS_BY_LOCALE } from '@/modules/systems/data/systems.data.ts';
import { useDrawerManagement } from '@/core/composables/use-drawer-management';
import { useChat } from '@/modules/chat/composables/use-chat';

const page = useHeaderData();
const router = useRouter();
const { toggleDrawer } = useDrawerManagement();
const { toggleChat, isOpen } = useChat();

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
