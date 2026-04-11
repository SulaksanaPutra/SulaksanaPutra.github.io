<template>
    <div class="prose-content content-narrow pt-8">
        <div v-if="page" class="flex-1 min-w-0">
            <section
                v-for="section in page.sections"
                :id="section.id"
                :key="section.id"
                class="mb-12 group"
            >
                <div class="skills-section-header">
                    <h2 class="skills-section-title">
                        {{ section.label }}
                    </h2>
                    <div class="skills-section-line"></div>
                </div>

                <p class="text-text-secondary mb-4 leading-relaxed">
                    {{ section.description }}
                </p>

                <ul class="skills-list">
                    <li
                        v-for="(point, index) in section.points"
                        :key="index"
                        class="skills-list-item"
                    >
                        <span class="skills-list-bullet">•</span>
                        <span class="skills-list-text">{{ point }}</span>
                    </li>
                </ul>
            </section>
        </div>

        <LanguageFallback 
            v-else-if="availability.length > 0" 
            :availability="availability"
            :back-link="{ href: '/', label: 'Back to home' }"
        />

        <div v-else class="py-16 text-center">
            <p class="text-text-secondary">No skills data available.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSkillsAvailability, useSkillsData } from '@/modules/skills/data/skills.data.ts';
import { useSeo } from '@/core/composables/use-seo';
import LanguageFallback from '@/core/components/language-fallback.vue';

const page = useSkillsData();
const availability = useSkillsAvailability();

useSeo(
    computed(() => ({
        title: 'Skills & Expertise',
        description: 'Technical stack, core competencies, and professional execution frameworks.',
    })),
);
</script>
