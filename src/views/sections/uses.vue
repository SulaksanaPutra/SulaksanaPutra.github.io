<template>
  <section v-if="uses" class="content-narrow py-8 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">{{ uses.title }}</h1>
    <div class="text-justify hyphens-auto leading-relaxed space-y-4">
      <p v-for="(paragraph, index) in uses.paragraphs" :key="index">
        {{ paragraph }}
      </p>
      <ul class="list-disc pl-5 space-y-2">
        <li v-for="(item, index) in uses.items" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n.ts'
import {Uses} from "@/data/types.ts";

const { data: uses } = useI18n<Uses>('home/sections/uses')
</script>
