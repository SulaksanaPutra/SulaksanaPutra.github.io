<template>
  <div class="text-justify hyphens-auto leading-relaxed">
    <section class="content-narrow pt-8">
      <article
        v-for="system in systems"
        :key="system.id"
        :id="system.id"
        class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
      >
        <h2 class="text-xl text-left text-text-primary mb-2">
          <template v-if="system.titleHighlight">
            {{ system.title.split(system.titleHighlight)[0] }}
            <span class="text-base font-bold">{{ system.titleHighlight }}</span>
            {{ system.title.split(system.titleHighlight)[1] }}
          </template>
          <template v-else>
            {{ system.title }}
          </template>
        </h2>

        <p class="text-text-secondary mb-4">
          {{ system.description }}
        </p>

        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in system.tags"
            :key="tag"
            class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary"
          >
            {{ tag }}
          </span>
        </div>

        <div class="space-y-6">
          <div v-for="(section, index) in system.sections" :key="index">
            <p class="label-overline">{{ section.label }}</p>
            <p>{{ section.content }}</p>
          </div>

          <p v-if="system.link">
            <router-link :to="system.link.to">
              {{ system.link.text }}
            </router-link>
          </p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { data: systems } = useI18n('systems/systems')
</script>
