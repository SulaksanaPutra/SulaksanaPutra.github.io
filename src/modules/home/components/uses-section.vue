<template>
    <section v-if="usesData" class="prose-content content-narrow">
        <header class="mb-8">
            <h2 class="heading-section">
                {{ usesData.subtitle }}
            </h2>
        </header>

        <div class="space-y-8">
            <div v-for="group in usesData.groups" :key="group.label">
                <h3 class="uses-group-header">
                    <span class="label-overline">{{ group.label }}</span>
                </h3>

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
import { useUsesData } from '@/modules/home/data/home.data.ts';
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
