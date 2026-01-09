<template>
  <div class="min-h-screen flex flex-col">
    <Header
      ref="headerComponentRef"
      :is-dark="isDark"
      :language="language"
      :scroll-progress="scrollProgress"
      @toggle-drawer="toggleDrawer"
      @toggle-theme="toggleTheme"
      @set-language="setLanguage"
    />

    <div class="flex flex-grow transition-all duration-300">
      <Drawer
        :is-drawer-open="isDrawerOpen"
        :drawer-top="drawerTop"
        :active-section="activeSection"
        @toggle-drawer="toggleDrawer"
        @scroll-to-section="scrollToSection"
        @handle-drawer-link-click="handleDrawerLinkClick"
      />

      <main
        class="container flex-grow pt-0 pb-16 transition-all duration-300"
        :class="isDrawerOpen ? 'md:ml-64' : ''"
      >
        <router-view v-slot="{ Component, route }">
          <transition :name="shouldTransition(route) ? 'fade' : ''" mode="out-in">
            <component :is="Component" :key="getRouteKey(route)" />
          </transition>
        </router-view>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, RouteLocationNormalized } from 'vue-router'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isDark = ref(false)
const isDrawerOpen = ref(false)
const language = ref('EN')
const scrollProgress = ref(0)
const headerComponentRef = ref<{ headerRef: HTMLElement | null } | null>(null)

const getDrawerStateKey = () => route.path === '/systems' ? 'systemsDrawerOpen' : 'drawerOpen'

const syncDrawerState = () => {
  const key = getDrawerStateKey()
  const stored = localStorage.getItem(key)

  if (route.path === '/systems' && stored === null) {
    isDrawerOpen.value = true
    localStorage.setItem(key, 'true')
  } else {
    isDrawerOpen.value = stored === 'true'
  }
}

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  localStorage.setItem(getDrawerStateKey(), isDrawerOpen.value.toString())
}

const handleDrawerLinkClick = () => {
  if (window.innerWidth < 768) {
    isDrawerOpen.value = false
    localStorage.setItem(getDrawerStateKey(), 'false')
  }
}

watch(() => route.path, () => {
  syncDrawerState()
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const setLanguage = (lang: string) => {
  language.value = lang
}

const updateScrollProgress = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight

  if (height > 0) {
    scrollProgress.value = (winScroll / height) * 100
  } else {
    scrollProgress.value = 0
  }
}

const activeSection = ref('')
let sectionObserver: IntersectionObserver | null = null

const observeSections = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, {
    rootMargin: '-20% 0px -50% 0px'
  })

  const ids = ['system-laas', 'system-twin-v2-wms', 'system-twin-v2-fleet', 'system-twin-v1']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return observer
}

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (!element) return

  const headerOffset = headerComponentRef.value?.headerRef?.offsetHeight || 0
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - headerOffset - 24

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })

  activeSection.value = id

  if (window.innerWidth < 768) {
    isDrawerOpen.value = false
    localStorage.setItem(getDrawerStateKey(), 'false')
  }
}

watch(() => route.path, (newPath) => {
  if (newPath === '/systems') {
    setTimeout(() => {
       if (sectionObserver) sectionObserver.disconnect()
       sectionObserver = observeSections()
    }, 500)
  } else {
    if (sectionObserver) sectionObserver.disconnect()
    activeSection.value = ''
  }
}, { immediate: true })

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

  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  syncDrawerState()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  if (sectionObserver) sectionObserver.disconnect()
})

const drawerTop = ref('0px')

const updateDrawerTop = () => {
    if (headerComponentRef.value?.headerRef) {
    drawerTop.value = `${headerComponentRef.value.headerRef.offsetHeight}px`
    return
  }

  const w = window.innerWidth
  if (w < 768) {
    drawerTop.value = '0px'
  } else if (w < 1185) {
    drawerTop.value = '116px'
  } else {
    drawerTop.value = '76px'
  }
}

onMounted(() => {
  updateDrawerTop()
  window.addEventListener('resize', updateDrawerTop)
})

onUnmounted(() => window.removeEventListener('resize', updateDrawerTop))

const sectionRoutes = ['About', 'Writing', 'Projects', 'Uses', 'Contact']

const shouldTransition = (route: RouteLocationNormalized) => {
  return !sectionRoutes.includes(route.name as string)
}

const getRouteKey = (route: RouteLocationNormalized) => {
  if (sectionRoutes.includes(route.name as string)) {
    return 'section-container'
  }
  return route.path
}
</script>
