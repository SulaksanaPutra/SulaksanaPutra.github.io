<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-50 bg-bg-main py-3 border-b border-border-subtle transition-colors duration-300">
      <div class="relative mx-auto px-6 md:px-8 flex items-center justify-between">
        <div class="flex items-center  mr-4 text-gray-600">
          <Menu />
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
        <div>
          Search
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
        </nav>
      </div>
    </header>

    <main class="container flex-grow pt-0 pb-16">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

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
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { Sun, Moon, Menu } from 'lucide-vue-next'

const route = useRoute()
const isDark = ref(false)
const isRestoring = ref(false)

// Toggle between light and dark themes by updating a root class
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
