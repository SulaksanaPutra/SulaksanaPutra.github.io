<template>
    <section v-if="usesData" class="content-narrow">
        <header class="mb-12">
            <h1 class="heading-large">
                {{ usesData.title }}
            </h1>
        </header>

        <div class="space-y-12">
            <div v-for="group in usesData.groups" :key="group.label">
                <h2 class="uses-group-header">
                    <span class="label-overline">{{ group.label }}</span>
                </h2>

                <ul class="uses-list">
                    <li v-for="(item, index) in group.items" :key="index" class="uses-list-item">
                        <span class="uses-list-bullet">•</span>
                        <div class="uses-list-content">
                            <GlossaryText :text="item" :items="glossaryItems" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, provide, watch } from 'vue';
import { useUsesData } from '@/modules/home/data/uses.data.ts';
import GlossaryText from '@/core/components/glossary-text.vue';
import { language } from '@/store';

const usesData = useUsesData();
const glossaryItems = computed(() => usesData.value?.glossary || []);

const glossaryRegistry = new Set<string>();
provide('glossaryRegistry', glossaryRegistry);

watch(language, () => {
    glossaryRegistry.clear();
});
</script>
