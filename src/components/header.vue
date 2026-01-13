<template>
  <header ref="headerRef" class="sticky top-0 z-[70] bg-bg-main py-3 border-b border-border-subtle transition-colors duration-300">
    <div class="relative mx-auto px-6 md:px-8 flex items-center justify-between flex-wrap">
      <div class="flex items-center">
        <div class="flex items-center mr-4 md:mr-8 text-text-primary">
          <button
            type="button"
            @click="toggleDrawer"
            class="flex items-center justify-center w-8 h-8"
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
        </div>
        <div
          class="mb-4 md:mb-0 text-accent-primary font-semibold text-[1.125rem] leading-[1.35] tracking-[-0.015em]"
          style="font-family: Zalando Sans, sans-serif;"
        >
          BayuAksana
          <div class="text-base">
            dotcom
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
            v-model="searchQuery"
            type="text"
            placeholder="Search…"
            ref="searchInputRef"
            class="w-56 md:w-72 pl-8 bg-bg-muted border border-border-subtle rounded-md py-1.5 px-2 text-sm focus:outline-none"
          />
        </div>
        <ul
          v-if="searchQuery && filteredLinks.length"
          class="absolute left-0 mt-2 w-[28rem] max-w-[90vw] bg-bg-main border border-border-subtle rounded-md shadow-lg z-[100]"
        >
          <li
            v-for="item in filteredLinks"
            :key="item.url"
            class="px-4 py-3 hover:bg-bg-muted"
          >
            <router-link
              :to="item.url"
              class="block"
              @click="searchQuery = ''"
            >
              <div class="text-sm font-medium text-text-primary">
                {{ item.label }}
              </div>
              <div class="text-xs text-text-secondary mt-0.5">
                {{ item.description }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>
      <nav class="flex items-center ml-auto w-full md:w-auto">
        <ul class="flex flex-wrap justify-center md:justify-start gap-x-4 md:gap-x-9 gap-y-3 list-none p-0 m-0 w-full md:w-auto">
          <li
            v-for="nav in navLinks"
            :key="nav.to"
            :class="nav.hiddenOnMd ? 'hidden md:block' : ''"
          >
            <router-link
              :to="nav.to"
              class="text-base text-text-secondary hover:text-text-primary hover:no-underline"
              active-class="text-text-primary font-semibold"
            >
              {{ nav.label }}
            </router-link>
          </li>
        </ul>
        <button
          @click="toggleTheme"
          type="button"
          class="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-bg-muted ml-auto md:ml-6"
          aria-label="Toggle theme"
        >
          <Moon v-if="!isDark" :size="20" class="text-text-primary" />
          <Sun v-else :size="20" class="text-text-primary" />
        </button>
        <div class="hidden md:flex items-center gap-1 rounded-full border border-border-subtle p-1 text-sm ml-4">
          <button
            v-for="lang in ['EN', 'ID', 'JP']"
            :key="lang"
            @click="setLanguage(lang)"
            class="px-2 py-0.5 rounded-full transition-colors"
            :class="language === lang
              ? 'bg-bg-muted text-text-primary'
              : 'text-text-secondary hover:bg-bg-muted'"
          >
            {{ lang }}
          </button>
        </div>
      </nav>
    </div>
    <div class="absolute bottom-0 left-0 h-[2px] bg-accent-primary transition-all duration-75 ease-out z-50" :style="{ width: `${scrollProgress}%`, opacity: scrollProgress > 0 ? 1 : 0 }"/>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Sun, Moon, Menu, Search } from 'lucide-vue-next'
import { isDark, language, scrollProgress, isDrawerOpen, headerComponentRef } from '../store'
import { useI18n } from '../composables/useI18n'

const { data: headerData } = useI18n('common/header')

const route = useRoute()
const headerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')

const searchLinks = computed(() => headerData.value?.searchLinks || [])
const navLinks = computed(() => headerData.value?.navLinks || [])

const filteredLinks = computed(() =>
  searchLinks.value.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const getDrawerStateKey = () => route.path === '/systems' ? 'systemsDrawerOpen' : 'drawerOpen'

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  localStorage.setItem(getDrawerStateKey(), isDrawerOpen.value.toString())
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const setLanguage = (lang: string) => {
  language.value = lang
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  headerComponentRef.value = { headerRef: headerRef.value }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
