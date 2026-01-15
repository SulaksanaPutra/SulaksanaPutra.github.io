import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'

import SystemsDrawer from '@/components/drawers/systems-drawer.vue'
import { isDrawerOpen, activeSection, headerComponentRef } from '@/store'

function setInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
    writable: true,
  })
}

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/systems', component: { template: '<div />' } }],
  })
}

describe('systems-drawer.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    isDrawerOpen.value = false
    activeSection.value = ''
    headerComponentRef.value = { headerRef: null }
  })

  it('opens by default on desktop and persists state', async () => {
    setInnerWidth(1024)
    const router = makeRouter()
    await router.push('/systems')
    await router.isReady()

    const wrapper = mount(SystemsDrawer, { global: { plugins: [router] } })
    const aside = wrapper.get('aside')

    expect(aside.classes().join(' ')).toContain('translate-x-0')
    expect(localStorage.getItem('systemsDrawerOpen')).toBe('true')
  })

  it('is closed by default on mobile', async () => {
    setInnerWidth(375)
    const router = makeRouter()
    await router.push('/systems')
    await router.isReady()

    const wrapper = mount(SystemsDrawer, { global: { plugins: [router] } })
    const aside = wrapper.get('aside')

    expect(aside.classes().join(' ')).toContain('-translate-x-full')
  })

  it('scroll link sets active section and closes drawer on mobile', async () => {
    setInnerWidth(375)
    const router = makeRouter()
    await router.push('/systems')
    await router.isReady()

    const target = document.createElement('div')
    target.id = 'system-twin-v2-wms'
    document.body.appendChild(target)

    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    isDrawerOpen.value = true
    const wrapper = mount(SystemsDrawer, { global: { plugins: [router] } })
    await wrapper.get('a[href="#system-twin-v2-wms"]').trigger('click')

    expect(scrollSpy).toHaveBeenCalled()
    expect(activeSection.value).toBe('system-twin-v2-wms')
    expect(isDrawerOpen.value).toBe(false)

    scrollSpy.mockRestore()
    target.remove()
  })
})

