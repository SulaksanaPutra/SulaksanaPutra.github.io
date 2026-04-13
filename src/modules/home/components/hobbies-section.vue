<template>
    <section v-if="hobbiesData" class="prose-content content-narrow">
        <h1 class="heading-large">
            {{ hobbiesData.title }}
        </h1>
        <div>
            <p v-for="(paragraph, index) in hobbiesData.descriptions" :key="index">
                {{ paragraph }}
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useHobbiesData } from '@/modules/home/data/home.data.ts';

const hobbiesData = useHobbiesData();
</script>
