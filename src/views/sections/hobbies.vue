<template>
    <section v-if="page" class="content-narrow py-8 min-h-screen">
        <h1 class="text-3xl font-bold mb-6">
            {{ page.title }}
        </h1>
        <div class="text-justify hyphens-auto leading-relaxed space-y-4">
            <p v-for="(paragraph, index) in page.descriptions" :key="index">
                {{ paragraph }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import { Hobbies } from '@/types/hobbies.ts';
import type { Ref } from 'vue';

const { data: page }: { data: Ref<Hobbies | null> } = useI18n<Hobbies>(
    'home/sections/hobbies-page',
);
</script>
