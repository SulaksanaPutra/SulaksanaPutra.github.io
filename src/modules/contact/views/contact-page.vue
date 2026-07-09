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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useContactData } from '@/modules/contact/data/contact.data.ts';
import { useSeo } from '@/core/composables/use-seo';
import { SITE_URL } from '@/core/utils/schema';

const route = useRoute();
const page = useContactData();

useSeo(
    computed(() => {
        const normalizedPath = route.path.replace(/\/$/, '');
        const currentUrl = `${SITE_URL}${normalizedPath}/`;
        return {
            title: page.value?.title || 'Contact',
            description:
                'Get in touch for architectural consulting or software engineering inquiries.',
            ogUrl: currentUrl,
            canonical: currentUrl,
        };
    }),
);
</script>
