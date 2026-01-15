import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { ref } from 'vue'

import Header from '@/components/header.vue'
import { isDark, isDrawerOpen, language } from '@/store'

vi.mock('lucide-vue-next', () => {
  const Stub = {
    name: 'LucideStub',
    template: '<span />',
  }
  return { Sun: Stub, Moon: Stub, Menu: Stub, Search: Stub }
})

vi.mock('@/composables/use-i18n', () => {
  return {
    useI18n: () => ({
      data: ref({
        searchLinks: [
          { label: 'Home', url: '/', description: 'Overview and introduction' },
          { label: 'Systems', url: '/systems', description: 'Architecture notes' },
        ],
        navLinks: [
          { label: 'Home', to: '/', hiddenOnMd: false },
          { label: 'Systems', to: '/systems', hiddenOnMd: false },
          { label: 'Contact', to: '/contact', hiddenOnMd: false },
        ],
      }),
    }),
  }
})

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/systems', component: { template: '<div />' } },
      { path: '/contact', component: { template: '<div />' } },
    ],
  })
}

describe('header.vue', () => {
  beforeEach(() => {
    isDark.value = false
    isDrawerOpen.value = false
    language.value = 'EN'
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('renders navigation links from i18n data', async () => {
    const router = makeRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(Header, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Systems')
    expect(wrapper.text()).toContain('Contact')
  })

  it('toggles theme and persists to localStorage', async () => {
    const router = makeRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(Header, { global: { plugins: [router] } })
    await wrapper.get('button[aria-label="Toggle theme"]').trigger('click')

    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggles drawer and uses per-route storage key', async () => {
    const router = makeRouter()
    await router.push('/systems')
    await router.isReady()

    const wrapper = mount(Header, { global: { plugins: [router] } })
    await wrapper.get('button[aria-label="Toggle menu"]').trigger('click')

    expect(isDrawerOpen.value).toBe(true)
    expect(localStorage.getItem('systemsDrawerOpen')).toBe('true')
  })

  it('Ctrl/Cmd+K focuses search input', async () => {
    const router = makeRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(Header, { global: { plugins: [router] }, attachTo: document.body })
    const input = wrapper.get('input[placeholder="Search…"]').element as HTMLInputElement

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(document.activeElement).toBe(input)
  })
})

