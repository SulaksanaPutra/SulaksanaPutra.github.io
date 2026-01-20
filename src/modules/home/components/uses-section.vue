<template>
    <section v-if="page" class="content-narrow py-8 min-h-screen">
        <h1 class="text-3xl font-bold mb-6">
            {{ page.title }}
        </h1>
        <div class="text-justify hyphens-auto leading-relaxed space-y-4">
            <p v-for="(paragraph, index) in page.descriptions" :key="index">
                {{ paragraph }}
            </p>
            <ul class="list-disc pl-5 space-y-2">
                <li v-for="(item, index) in page.items" :key="index">
                    {{ item }}
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
import defaultUses from '@/modules/home/data/uses.data.ts';
import { computed, type Ref } from 'vue';
import { Uses } from '@/modules/home/types/uses.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';

const { data }: { data: Ref<Uses | null> } = useI18n<Uses>('home/sections/uses-page');

const page = computed<Uses>(() => data.value ?? (defaultUses as Uses));
</script>
