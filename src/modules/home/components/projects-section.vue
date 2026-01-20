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
import defaultProjects from '@/modules/home/data/projects.data.ts';
import { computed, type Ref } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { Projects } from '@/modules/home/types/projects.types.ts';

const { data }: { data: Ref<Projects | null> } = useI18n<Projects>('home/sections/projects-page');

const page = computed<Projects>(() => data.value ?? (defaultProjects as Projects));
</script>
