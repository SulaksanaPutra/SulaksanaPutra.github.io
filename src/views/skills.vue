<template>
    <div
        v-if="skills"
        class="content-narrow py-8"
    >
        <h1 class="text-2xl font-semibold mb-6">
            {{ skills.title }}
        </h1>
        <p>{{ skills.description }}</p>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import type { Skills } from '@/data/types';

const { data: skills } = useI18n<Skills>('skills/skills');
</script>
