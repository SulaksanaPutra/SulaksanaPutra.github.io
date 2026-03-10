<template>
    <template v-if="!hasCode">
        <GlossaryText :text="text" :items="items" />
    </template>
    <template v-else>
        <template v-for="(part, index) in parts" :key="index">
            <code 
                v-if="part.isCode" 
                class="inline-code bg-bg-muted text-accent-primary px-1.5 py-0.5 rounded-md text-[0.85em] font-mono border border-border-subtle"
            >{{ part.text }}</code>
            <GlossaryText v-else-if="part.text" :text="part.text" :items="items" />
        </template>
    </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GlossaryText from './glossary-text.vue';
import { GlossaryItem } from '@/core/types/glossary.types';

const props = defineProps<{
    text: string;
    items?: GlossaryItem[];
}>();

const hasCode = computed(() => props.text?.includes('`'));

const parts = computed(() => {
    if (!props.text) return [];
    
    const result: { text: string; isCode: boolean }[] = [];
    const splitByBackticks = props.text.split('`');
    
    splitByBackticks.forEach((textPiece, i) => {
        // If it's an odd index, it was inside backticks
        if (i % 2 === 1 && splitByBackticks.length > 1) {
            result.push({ text: textPiece, isCode: true });
        } else if (textPiece) {
            result.push({ text: textPiece, isCode: false });
        }
    });
    
    return result;
});
</script>
