<template>
  <div class="section-container relative">
    <div v-for="section in mountedSections" :key="section.name" :id="`section-${section.name}`" class="section-wrapper">
      <component :is="section.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

// Import section components lazily
const components = {
  about: defineAsyncComponent(() => import('./sections/about.vue')),
  writing: defineAsyncComponent(() => import('./sections/writing.vue')),
  projects: defineAsyncComponent(() => import('./sections/projects.vue')),
  uses: defineAsyncComponent(() => import('./sections/uses.vue')),
  contact: defineAsyncComponent(() => import('./sections/contact.vue'))
}

const route = useRoute()

// Define the order of sections
const sectionOrder = ['about', 'writing', 'projects', 'uses', 'contact']

interface MountedSection {
  name: string
  component: any
}

const mountedSections = ref<MountedSection[]>([])

// Initialize or update based on route
const updateSection = async () => {
  const currentSectionName = (route.name as string)?.toLowerCase()
  if (currentSectionName && sectionOrder.includes(currentSectionName)) {
    mountedSections.value = [{
      name: currentSectionName,
      component: components[currentSectionName as keyof typeof components]
    }]
    await nextTick()
    window.scrollTo(0, 0)
  }
}

watch(() => route.name, () => {
  updateSection()
})

onMounted(() => {
  updateSection()
})
</script>

<style scoped>
.section-wrapper {
  min-height: 100vh;
  width: 100%;
}
</style>
