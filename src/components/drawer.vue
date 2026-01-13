<template>
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

      <ul v-if="currentList.length" class="space-y-6">
        <DrawerItem
          v-for="(item, index) in currentList"
          :key="index"
          :item="item"
          :is-active="item.type === 'anchor' ? activeSection === item.id : undefined"
          @click="handleItemClick"
        />
      </ul>
      <div v-else class="p-4 text-text-secondary text-sm">
        <!-- Empty state or dummy text -->
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { isDrawerOpen, activeSection, headerComponentRef, drawerTop } from '../store'
import DrawerItem, { DrawerItemData } from './drawer-item.vue'

import systemsItems from '../data/systems/systems-drawer.json'
import caseStudiesItems from '../data/case-studies/case-studies-drawer.json'
import skillsItems from '../data/skills/skills-drawer.json'
import contactItems from '../data/contact/contact-drawer.json'
import homeItems from '../data/home/home-drawer.json'

const route = useRoute()

const routeLists: Record<string, DrawerItemData[]> = {
  '/systems': systemsItems as DrawerItemData[],
  '/case-studies': caseStudiesItems as DrawerItemData[],
  '/skills': skillsItems as DrawerItemData[],
  '/contact': contactItems as DrawerItemData[],
  '/': homeItems as DrawerItemData[],
  '/writing': homeItems as DrawerItemData[],
  '/projects': homeItems as DrawerItemData[],
  '/uses': homeItems as DrawerItemData[],
}

const currentList = computed(() => routeLists[route.path] || [])

const drawerStateKeys: Record<string, string> = {
  '/systems': 'systemsDrawerOpen',
  '/case-studies': 'caseStudiesDrawerOpen',
  '/skills': 'skillsDrawerOpen',
  '/contact': 'contactDrawerOpen'
}

const getDrawerStateKey = () => drawerStateKeys[route.path] || 'drawerOpen'

watch(
  () => route.path,
  () => {
    // On mobile, always start with the drawer closed.
    if (window.innerWidth < 768) {
      isDrawerOpen.value = false
      return
    }

    const key = getDrawerStateKey()
    const savedState = localStorage.getItem(key)

    // On desktop, restore previous state or default to open.
    if (savedState !== null) {
      isDrawerOpen.value = savedState === 'true'
    } else {
      isDrawerOpen.value = true
      localStorage.setItem(key, 'true')
    }
  },
  { immediate: true }
)

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value
  if (window.innerWidth >= 768) {
    localStorage.setItem(getDrawerStateKey(), isDrawerOpen.value.toString())
  }
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
  }
}

const handleItemClick = (item: DrawerItemData) => {
  if (item.type === 'anchor' && item.id) {
    scrollToSection(item.id)
  } else {
    handleDrawerLinkClick()
  }
}

const handleDrawerLinkClick = () => {
  if (window.innerWidth < 768) {
    isDrawerOpen.value = false
  }
}
</script>
