<template>
    <section
        v-if="hobbies"
        class="content-narrow py-8 min-h-screen"
    >
        <h1 class="text-3xl font-bold mb-6">
            {{ hobbies.title }}
        </h1>
        <div class="text-justify hyphens-auto leading-relaxed space-y-4">
            <p
                v-for="(paragraph, index) in hobbies.paragraphs"
                :key="index"
            >
                {{ paragraph }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import type { Hobbies } from '@/data/types';

const { data: hobbies } = useI18n<Hobbies>('home/sections/hobbies');
</script>
