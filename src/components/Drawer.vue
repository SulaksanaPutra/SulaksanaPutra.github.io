<template>
  <aside
    class="fixed z-[60] md:z-30 left-0 h-screen w-64 bg-bg-main border-r border-border-subtle transition-transform duration-300 overflow-y-auto"
    :class="isDrawerOpen ? 'translate-x-0' : '-translate-x-full'"
    :style="{ top: drawerTop, height: `calc(100vh - ${drawerTop})` }"
  >
    <nav class="p-6 pt-12 relative">
      <button
        type="button"
        @click="emit('toggleDrawer')"
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
                  @click.prevent="emit('scrollToSection', 'system-laas')"
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
                  @click.prevent="emit('scrollToSection', 'system-twin-v2-wms')"
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
                  @click.prevent="emit('scrollToSection', 'system-twin-v2-fleet')"
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
                  @click.prevent="emit('scrollToSection', 'system-twin-v1')"
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
              class="block font-medium text-text-primary hover:text-accent-primary"
              active-class="text-accent-primary"
              @click="emit('handleDrawerLinkClick')"
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
              @click="emit('handleDrawerLinkClick')"
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
              @click="emit('handleDrawerLinkClick')"
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
              @click="emit('handleDrawerLinkClick')"
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
              @click="emit('handleDrawerLinkClick')"
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
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps<{
  isDrawerOpen: boolean,
  drawerTop: string,
  activeSection: string,
}>()

const emit = defineEmits(['toggleDrawer', 'scrollToSection', 'handleDrawerLinkClick'])
</script>
