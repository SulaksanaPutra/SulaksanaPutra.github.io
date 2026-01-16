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
import defaultSkills from '@/data/skills/skills-page';
import { computed, type Ref } from 'vue';

const { data }: { data: Ref<Skills | null> } = useI18n<Skills>('skills/skills-page');

const page = computed<Skills>(() => data.value ?? (defaultSkills as Skills));
</script>
