<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 bg-bg-main py-3 border-b border-border-subtle transition-colors duration-300">
      <div class="relative mx-auto px-6 md:px-8 flex items-center justify-between">
        <div class="flex items-center mr-8 text-gray-600">
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
          class="mb-4 md:mb-0 text-accent-primary font-semibold text-[1.25rem] leading-[1.35] tracking-[-0.015em]"
          style="font-family: Charter, Georgia, 'Times New Roman', serif;"
        >
          BayuAksana
          <div class="text-base">
            dotcom
          </div>
        </div>
        <div class="relative ml-8">
          <div class="relative">
            <Search
              class="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary"
              :size="16"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search…"
              class="w-56 md:w-72 pl-8 bg-bg-muted border border-border-subtle rounded-md py-1.5 px-2 text-sm focus:outline-none"
            />
          </div>

          <ul
            v-if="searchQuery && filteredLinks.length"
            class="absolute left-0 mt-2 w-[28rem] max-w-[90vw] bg-bg-main border border-border-subtle rounded-md shadow-lg z-50"
          >
            <li
              v-for="item in filteredLinks"
              :key="item.url"
              class="px-4 py-3 hover:bg-bg-muted"
            >
              <router-link
                :to="item.url"
                class="block"
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
        <nav class="flex items-center ml-auto">
          <ul class="flex flex-wrap gap-x-9 gap-y-3 list-none p-0 m-0 mr-6">
            <li>
              <router-link to="/" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Home</router-link>
            </li>
            <li>
              <router-link to="/systems" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Systems</router-link>
            </li>
            <li>
              <router-link to="/case-studies" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Case Studies</router-link>
            </li>
            <li>
              <router-link to="/skills" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Skills</router-link>
            </li>
            <li>
              <router-link to="/now" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Now</router-link>
            </li>
          </ul>
          <button
            @click="toggleTheme"
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-bg-muted"
            aria-label="Toggle theme"
          >
            <!-- Moon icon (to switch to dark) when in light mode -->
            <Moon v-if="!isDark" :size="20" class="text-text-primary" />
            <!-- Sun icon (to switch to light) when in dark mode -->
            <Sun v-else :size="20" class="text-text-primary" />
          </button>
          <div class="flex items-center gap-1 rounded-full border border-border-subtle p-1 text-sm ml-4">
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
    </header>

    <div class="flex flex-grow transition-all duration-300">
      <aside
        class="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-bg-main border-r border-border-subtle transition-transform duration-300"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <nav class="p-6 pt-12">
          <ul class="space-y-4">
            <li class="flex gap-3">
              <div>
                <router-link
                  to="/about"
                  class="block  font-medium text-text-primary hover:text-accent-primary"
                >
                  About
                </router-link>
                <p class="text-sm text-text-secondary mt-1">
                  Background, values, and professional summary
                </p>
              </div>
            </li>

            <li class="flex gap-3">
              <div>
                <router-link
                  to="/writing"
                  class="block font-medium text-text-primary hover:text-accent-primary"
                >
                  Writing
                </router-link>
                <p class="text-sm text-text-secondary mt-1">
                  Essays, notes, and long-form thoughts
                </p>
              </div>
            </li>

            <li class="flex gap-3">
              <div>
                <router-link
                  to="/notes"
                  class="block font-medium text-text-primary hover:text-accent-primary"
                >
                  Notes
                </router-link>
                <p class="text-sm text-text-secondary mt-1">
                  Short ideas, experiments, and drafts
                </p>
              </div>
            </li>

            <li class="flex gap-3">
              <div>
                <router-link
                  to="/uses"
                  class="block font-medium text-text-primary hover:text-accent-primary"
                >
                  Uses
                </router-link>
                <p class="text-sm text-text-secondary mt-1">
                  Tools, hardware, and software I use daily
                </p>
              </div>
            </li>

            <li class="flex gap-3">
              <div>
                <router-link
                  to="/contact"
                  class="block font-medium text-text-primary hover:text-accent-primary"
                >
                  Contact
                </router-link>
                <p class="text-sm text-text-secondary mt-1">
                  Ways to get in touch or collaborate
                </p>
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      <main
        class="container flex-grow pt-0 pb-16 transition-all duration-300"
        :class="isDrawerOpen ? 'ml-64' : ''"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <footer class="pt-12 pb-16 border-t border-border-subtle text-sm text-text-secondary mt-18">
      <div class="container">
        <p class="mb-1">© 2025 — This site documents my work and thinking around software systems.</p>
        <p class="text-text-secondary">
          Open to senior full-stack web engineering roles —
          <a href="mailto:info@bayuaksana.com">info@bayuaksana.com</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { Sun, Moon, Menu, Search, User, PenLine, Notebook, Laptop, Mail } from 'lucide-vue-next'

const route = useRoute()
const isDark = ref(false)
const isRestoring = ref(false)
const isDrawerOpen = ref(false)
const language = ref('EN')

const searchQuery = ref('')

const searchLinks = [
  {
    label: 'Home',
    url: '/',
    description: 'Overview and introduction'
  },
  {
    label: 'Systems',
    url: '/systems',
    description: 'Architecture, patterns, and system design notes'
  },
  {
    label: 'Case Studies',
    url: '/case-studies',
    description: 'Deep dives into real-world projects'
  },
  {
    label: 'Skills',
    url: '/skills',
    description: 'Technical stack and core competencies'
  },
  {
    label: 'Now',
    url: '/now',
    description: 'What I am currently focused on'
  },
]

const filteredLinks = computed(() =>
  searchLinks.filter(item =>
    item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// Toggle between light and dark themes by updating a root class
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
}

const setLanguage = (lang: string) => {
  language.value = lang
}

const handleScroll = useDebounceFn(() => {
  if (route.fullPath && !isRestoring.value) {
    sessionStorage.setItem(`scroll-pos-${route.fullPath}`, window.scrollY.toString())
  }
}, 100)

// Watch for route changes to handle restoration period
watch(() => route.fullPath, () => {
  isRestoring.value = true
  // Wait for the transition and scroll restoration to complete
  // scrollBehavior has a 250ms delay, so we wait a bit longer to avoid overwriting with 0
  setTimeout(() => {
    isRestoring.value = false
  }, 500)
})

// Initialize theme based on user system preference or local storage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    document.documentElement.classList.toggle('dark', prefersDark)
  }

  // Handle initial scroll restoration protection
  isRestoring.value = true
  setTimeout(() => {
    isRestoring.value = false
  }, 500)

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
