<template>
    <div v-if="page" class="prose-content">
        <section id="contact-info" class="content-narrow">
            <h1 class="heading-large">
                {{ page.title }}
            </h1>
            <div class="space-y-4">
                <p
                    v-for="(paragraph, index) in page.descriptions"
                    :key="index"
                    v-html="paragraph"
                />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useContactData } from '@/modules/contact/data/contact.data.ts';

const page = useContactData();
</script>
