<template>
  <div v-if="about" class="text-justify hyphens-auto leading-relaxed snap-y snap-mandatory overflow-y-auto">
    <section class="content-narrow pt-8 pb-4" id="context">
      <p v-for="(paragraph, index) in about.intro" :key="index">
        {{ paragraph }}
      </p>
    </section>

    <section class="content-narrow py-8 snap-start" id="principles">
      <p class="label-overline mb-4">{{ about.principles.title }}</p>
      <ul class="list-none p-0 m-0">
        <li
          v-for="(item, index) in about.principles.items"
          :key="index"
          class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0"
        >
          <strong>{{ item.title }}</strong><br>
          {{ item.description }}
        </li>
      </ul>
    </section>

    <section class="content-narrow mt-9 pt-9 border-t border-border-subtle" id="orientation">
      <p v-for="(link, index) in about.links" :key="index">
        <router-link :to="link.to">{{ link.text }}</router-link>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { data: about } = useI18n('home/about')
</script>
