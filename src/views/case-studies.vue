<template>
  <div class="space-y-8 my-8 text-justify hyphens-auto leading-relaxed">
    <section class="content-narrow">
      <div class="grid gap-8">
        <article
          v-for="study in caseStudies"
          :key="study.id"
          class="pb-8 border-b border-border-subtle last:border-0"
        >
          <h2 class="text-xl font-semibold text-left mb-2 leading-snug">
            <router-link
              :to="study.link"
              class="text-text-primary hover:text-accent-primary no-underline"
            >
              {{ study.title }}
            </router-link>
          </h2>

          <p class="text-text-secondary max-w-2xl mb-4">
            {{ study.subtitle }}
          </p>

          <p class="mb-4 max-w-prose">
            {{ study.description }}
          </p>

          <router-link :to="study.link">
            Read case study →
          </router-link>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { data: caseStudies } = useI18n('case-studies/case-studies')
</script>
