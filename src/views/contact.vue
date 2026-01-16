<template>
    <div v-if="page" class="content-narrow py-8">
        <section id="contact-info" class="content-narrow">
            <h1 class="text-3xl font-bold mb-6">
                {{ page.title }}
            </h1>
            <div class="text-justify hyphens-auto leading-relaxed space-y-4">
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
import { useI18n } from '@/composables/use-i18n';
import { Contact } from '@/types/contact.ts';
import type { Ref } from 'vue';

const { data: page }: { data: Ref<Contact | null> } = useI18n<Contact>('contact/contact-page');
</script>
