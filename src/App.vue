<template>
  <div class="min-h-screen flex flex-col">
    <header ref="headerRef" class="sticky top-0 z-[70] bg-bg-main py-3 border-b border-border-subtle transition-colors duration-300">
      <div class="relative mx-auto px-6 md:px-8 flex items-center justify-between flex-wrap">

        <div class="flex items-center ">
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
            <li>
              <router-link to="/" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Home</router-link>
            </li>
            <li>
              <router-link to="/systems" class="text-base text-text-secondary hover:text-text-primary hover:no-underline" active-class="text-text-primary font-semibold">Systems</router-link>
            </li>
            <li class="hidden md:block">
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
            class="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle transition-all duration-300 ease-out hover:scale-105 active:scale-95 hover:bg-bg-muted ml-auto md:ml-6"
            aria-label="Toggle theme"
          >
            <!-- Moon icon (to switch to dark) when in light mode -->
            <Moon v-if="!isDark" :size="20" class="text-text-primary" />
            <!-- Sun icon (to switch to light) when in dark mode -->
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
      <!-- Reading Progress Bar -->
      <div class="absolute bottom-0 left-0 h-[2px] bg-accent-primary transition-all duration-75 ease-out z-50" :style="{ width: `${scrollProgress}%`, opacity: scrollProgress > 0 ? 1 : 0 }"/>
    </header>


    <div class="flex flex-grow transition-all duration-300">
      <aside
        class="fixed z-[60] md:z-30 left-0 h-screen w-64 bg-bg-main border-r border-border-subtle transition-transform duration-300 overflow-y-auto"
        :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
        :style="{ top: drawerTop, height: `calc(100vh - ${drawerTop})` }"
      >
        <nav class="p-6 pt-12 relative">
          <button
            type="button"
            @click="toggleDrawer"
            class="absolute top-4 right-4 md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-bg-muted"
            aria-label="Close menu"
          >
            ✕
          </button>

          <ul v-if="route.path === '/systems'" class="space-y-6">
            <li class="flex gap-3">
              <div class="w-full">
                <a
                  href="#system-laas"
                  @click.prevent="scrollToSection('system-laas')"
                  class="block font-medium text-base transition-colors duration-200"
                  :class="activeSection === 'system-laas' ? 'text-accent-primary' : 'text-text-primary hover:text-accent-primary'"
                >
                  LAAS — Logistics as a Service
                </a>
                <p class="text-sm text-text-secondary mt-1 leading-relaxed">
                  A customer-facing platform exposing logistics capabilities to external clients.
                </p>
                <div class="mt-2 space-y-1.5 border-l-2 border-border-subtle pl-3">
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Architecture:</span> Asynchronous proxy using queues to decouple external traffic from internal operations.
                  </p>
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Outcome:</span> Enabled new B2B/B2C business models while shielding internal systems.
                  </p>
                </div>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Customer-facing
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    B2B
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    B2C
                  </span>
                </div>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="w-full">
                <a
                  href="#system-twin-v2-wms"
                  @click.prevent="scrollToSection('system-twin-v2-wms')"
                  class="block font-medium text-base transition-colors duration-200"
                  :class="activeSection === 'system-twin-v2-wms' ? 'text-accent-primary' : 'text-text-primary hover:text-accent-primary'"
                >
                  Twin V2 — WMS
                </a>
                <p class="text-sm text-text-secondary mt-1 leading-relaxed">
                  A standalone warehouse management system replacing legacy stock handling.
                </p>
                <div class="mt-2 space-y-1.5 border-l-2 border-border-subtle pl-3">
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Architecture:</span> Independent Go services with separate databases for correctness and scalability.
                  </p>
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Outcome:</span> Delivered a reliable SaaS foundation with safer data migration and improved accuracy.
                  </p>
                </div>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Warehouse Management
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Distribution
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Logistics
                  </span>
                </div>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="w-full">
                <a
                  href="#system-twin-v2-fleet"
                  @click.prevent="scrollToSection('system-twin-v2-fleet')"
                  class="block font-medium text-base transition-colors duration-200"
                  :class="activeSection === 'system-twin-v2-fleet' ? 'text-accent-primary' : 'text-text-primary hover:text-accent-primary'"
                >
                  Twin V2 — Fleet
                </a>
                <p class="text-sm text-text-secondary mt-1 leading-relaxed">
                  A dedicated delivery domain isolating fleet and settlement workflows.
                </p>
                <div class="mt-2 space-y-1.5 border-l-2 border-border-subtle pl-3">
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Architecture:</span> Saga-style coordination and strict consistency checks for transaction safety.
                  </p>
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Outcome:</span> Reliable delivery execution with accurate settlement and safe upstream integration.
                  </p>
                </div>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Logistics
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Delivery Operations
                  </span>
                </div>
              </div>
            </li>
            <li class="flex gap-3">
              <div class="w-full">
                <a
                  href="#system-twin-v1"
                  @click.prevent="scrollToSection('system-twin-v1')"
                  class="block font-medium text-base transition-colors duration-200"
                  :class="activeSection === 'system-twin-v1' ? 'text-accent-primary' : 'text-text-primary hover:text-accent-primary'"
                >
                  Twin V1 — Legacy
                </a>
                <p class="text-sm text-text-secondary mt-1 leading-relaxed">
                  The business-critical legacy monolith that unified fragmented distributor operations.
                </p>
                <div class="mt-2 space-y-1.5 border-l-2 border-border-subtle pl-3">
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Context:</span> Centralized operational backbone replacing paper-based workflows.
                  </p>
                   <p class="text-xs text-text-secondary">
                    <span class="text-text-primary font-medium">Outcome:</span> Improved data consistency and enabled real-time visibility across the network.
                  </p>
                </div>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Distribution
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Inventory
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded border border-border-subtle text-text-secondary uppercase tracking-wider bg-bg-muted/50">
                    Sales Operations
                  </span>
                </div>
              </div>
            </li>
          </ul>

          <ul v-else class="space-y-4">
            <li class="flex gap-3">
              <div>
                <router-link
                  to="/"
                  class="block  font-medium text-text-primary hover:text-accent-primary"
                  active-class="text-accent-primary"
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
                  active-class="text-accent-primary"
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
                  to="/projects"
                  class="block font-medium text-text-primary hover:text-accent-primary"
                  active-class="text-accent-primary"
                >
                  Projects
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
                  active-class="text-accent-primary"
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
                  active-class="text-accent-primary"
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
        :class="isDrawerOpen ? 'md:ml-64' : ''"
      >
        <router-view v-slot="{ Component, route }">
          <transition :name="shouldTransition(route) ? 'fade' : ''" mode="out-in">
            <component :is="Component" :key="getRouteKey(route)" />
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
import { useRoute, RouteLocationNormalized } from 'vue-router'
import { Sun, Moon, Menu, Search } from 'lucide-vue-next'

const route = useRoute()
const isDark = ref(false)

// Drawer State Logic
const isDrawerOpen = ref(false)

const getDrawerStateKey = () => route.path === '/systems' ? 'systemsDrawerOpen' : 'drawerOpen'

const syncDrawerState = () => {
  const key = getDrawerStateKey()
  const stored = localStorage.getItem(key)

  if (route.path === '/systems' && stored === null) {
    // First time on systems, default to open
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

// Watch for route changes to sync drawer state
watch(() => route.path, () => {
  syncDrawerState()
})

const language = ref('EN')
const headerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const searchQuery = ref('')
const scrollProgress = ref(0)

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

const handleKeydown = (e: KeyboardEvent) => {
  // Cmd+K or Ctrl+K to focus search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

// --- Active Section Logic for Systems Page ---
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
    rootMargin: '-20% 0px -50% 0px' // Trigger when element is near top/center
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

  const headerOffset = headerRef.value?.offsetHeight || 0
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - headerOffset - 24 // 24px padding

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })

  // Update active section immediately
  activeSection.value = id
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

  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('keydown', handleKeydown)

  // Initialize drawer state
  syncDrawerState()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('keydown', handleKeydown)
  if (sectionObserver) sectionObserver.disconnect()
})

// Added for dynamic drawer top adjustment based on window width
const drawerTop = ref('0px')

const updateDrawerTop = () => {
  if (headerRef.value) {
    drawerTop.value = `${headerRef.value.offsetHeight}px`
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

// --- Route Transition Logic ---
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
