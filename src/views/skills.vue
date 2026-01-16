<template>
    <div v-if="page" class="content-narrow py-8">
        <h1 class="text-2xl font-semibold mb-6">
            {{ page.title }}
        </h1>
        <p>{{ page.description }}</p>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import { Skills } from '@/types/skills.ts';
import type { Ref } from 'vue';

const { data: page }: { data: Ref<Skills | null> } = useI18n<Skills>('skills/skills-page');
</script>
