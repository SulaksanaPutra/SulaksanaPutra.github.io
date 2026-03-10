<template>
    <div v-if="page" class="prose-content content-narrow pt-8">
        <div class="flex-1 min-w-0">
            <section
                v-for="section in page.sections"
                :id="section.id"
                :key="section.id"
                class="article-item mb-8 pb-8"
            >
                <h2 class="article-title" v-if="section.label">
                    {{ section.label }}
                </h2>
                <div v-if="section.paragraphs" class="space-y-4">
                    <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex">
                        {{ paragraph }}
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSkillsData } from '@/modules/skills/data/skills.data.ts';

const page = useSkillsData();
</script>
