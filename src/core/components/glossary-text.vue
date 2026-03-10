<template>
    <span v-if="!hasMatches">{{ text }}</span>
    <template v-else>
        <template v-for="(part, index) in parts" :key="index">
            <span v-if="part.isGlossary" class="glossary-term" @click="toggleMobileTooltip(index)">
                {{ part.text }}
                <span
                    v-if="part.definition"
                    class="glossary-tooltip"
                    :class="{ 'is-active': activeTooltipIndex === index }"
                >
                    <div class="flex justify-between items-center md:hidden mb-4">
                        <span
                            class="font-bold text-accent-primary uppercase tracking-widest text-[10px]"
                        >
                            {{ part.text }}
                        </span>
                        <button
                            @click.stop="activeTooltipIndex = null"
                            class="p-1 -mr-2 text-text-secondary hover:text-text-primary"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    {{ part.definition }}
                </span>
                <!-- Mobile Backdrop -->
                <teleport to="body">
                    <div
                        v-if="activeTooltipIndex === index"
                        class="glossary-backdrop md:hidden"
                        @click="activeTooltipIndex = null"
                    ></div>
                </teleport>
            </span>
            <template v-else>{{ part.text }}</template>
        </template>
    </template>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { language } from '@/store';
import { GLOSSARY_BY_LOCALE } from '@/core/data/common-glossary.data';
import { GlossaryItem } from '@/core/types/glossary.types';

const props = defineProps<{
    text: string;
    items?: GlossaryItem[];
}>();

const activeTooltipIndex = ref<number | null>(null);

const toggleMobileTooltip = (index: number) => {
    if (window.innerWidth < 768) {
        activeTooltipIndex.value = activeTooltipIndex.value === index ? null : index;
    }
};

// Inject a shared registry (Set) from parent if available to track matches across components
const glossaryRegistry = inject<Set<string> | null>('glossaryRegistry', null);

// Helper to escape regex special characters
const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const glossary = computed(() => {
    const localeKey = language.value.toLowerCase() as 'en' | 'id';
    const coreItems = GLOSSARY_BY_LOCALE[localeKey] || GLOSSARY_BY_LOCALE.en;

    // Combine core items with modular items
    const glossaryMap = new Map<string, GlossaryItem>();

    // Process core items first
    coreItems.forEach((item) => {
        glossaryMap.set(item.term.toLowerCase(), { ...item });
    });

    // Process modular items second (override core)
    if (props.items && Array.isArray(props.items)) {
        props.items.forEach((item) => {
            if (item && item.term) {
                glossaryMap.set(item.term.toLowerCase(), { ...item });
            }
        });
    }

    // Sort by length descending to match longest phrases first
    return Array.from(glossaryMap.values()).sort((a, b) => b.term.length - a.term.length);
});

const hasMatches = computed(() => {
    if (!props.text || glossary.value.length === 0) return false;
    const lowerText = props.text.toLowerCase();

    // Optimization: check if any term exists in the text
    // Also respect the shared registry - if all possible matches are already in the registry, we don't need to process
    return glossary.value.some((item) => {
        const lowerTerm = item.term.toLowerCase();
        if (glossaryRegistry?.has(lowerTerm)) return false;
        return lowerText.includes(lowerTerm);
    });
});

interface TextPart {
    text: string;
    isGlossary: boolean;
    definition?: string;
}

const parts = computed(() => {
    if (!props.text) return [];

    let result: TextPart[] = [{ text: props.text, isGlossary: false }];

    // Local set for this specific component instance to prevent duplicate tooltips in one block
    const instanceMatched = new Set<string>();

    for (const item of glossary.value) {
        const term = item.term;
        const lowerTerm = term.toLowerCase();

        // If already matched in another component or earlier in this one, skip
        if (glossaryRegistry?.has(lowerTerm) || instanceMatched.has(lowerTerm)) {
            continue;
        }

        const newResult: TextPart[] = [];
        const escapedTerm = escapeRegExp(term);
        const regex = new RegExp(`(\\b${escapedTerm}\\b)`, 'gi');

        let foundMatchInThisComponent = false;

        for (const part of result) {
            if (part.isGlossary || foundMatchInThisComponent) {
                newResult.push(part);
                continue;
            }

            const splitContent = part.text.split(regex);

            for (const subPart of splitContent) {
                if (!foundMatchInThisComponent && subPart.toLowerCase() === lowerTerm) {
                    newResult.push({
                        text: subPart,
                        isGlossary: true,
                        definition: item.definition,
                    });

                    // Mark as found globally and locally
                    glossaryRegistry?.add(lowerTerm);
                    instanceMatched.add(lowerTerm);
                    foundMatchInThisComponent = true;
                } else if (subPart) {
                    newResult.push({
                        text: subPart,
                        isGlossary: false,
                    });
                }
            }
        }
        result = newResult;
    }

    return result;
});
</script>
