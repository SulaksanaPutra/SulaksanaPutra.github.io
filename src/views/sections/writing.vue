<template>
    <section
        v-if="writing"
        class="content-narrow py-8 min-h-screen"
    >
        <h1 class="text-3xl font-bold mb-6">
            {{ writing.title }}
        </h1>
        <div class="text-justify hyphens-auto leading-relaxed space-y-4">
            <p
                v-for="(paragraph, index) in writing.paragraphs"
                :key="index"
            >
                {{ paragraph }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import type { Writing } from '@/data/types';

const { data: writing } = useI18n<Writing>('home/sections/writing');
</script>
