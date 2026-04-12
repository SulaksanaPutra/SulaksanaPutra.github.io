<template>
    <section v-if="projectsData" class="content-narrow">
        <h1 class="heading-large">
            {{ projectsData.title }}
        </h1>
        <div class="prose-content">
            <p v-for="(paragraph, index) in projectsData.descriptions" :key="index">
                {{ paragraph }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useProjectsData } from '@/modules/home/data/projects.data.ts';

const projectsData = useProjectsData();
</script>
