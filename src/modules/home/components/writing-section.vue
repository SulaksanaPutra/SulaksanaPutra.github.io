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
import defaultWriting from '@/modules/home/data/writing.data';
import { computed, type Ref } from 'vue';
import { Writing } from '@/modules/home/types/writing.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';

const { data }: { data: Ref<Writing | null> } = useI18n<Writing>('home/sections/writing-page');

const page = computed<Writing>(() => data.value ?? (defaultWriting as Writing));
</script>
