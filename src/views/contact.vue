<template>
  <div v-if="contact" class="content-narrow py-8">
    <section id="contact-info" class="content-narrow">
      <h1 class="text-3xl font-bold mb-6">{{ contact.title }}</h1>
      <div class="text-justify hyphens-auto leading-relaxed space-y-4">
        <p v-for="(paragraph, index) in contact.paragraphs" :key="index" v-html="paragraph"></p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { data: contact } = useI18n('contact/contact')
</script>
