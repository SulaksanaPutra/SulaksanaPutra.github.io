<template>
    <div v-if="aboutData" class="prose-content">
        <section id="context" class="content-narrow">
            <p v-for="(paragraph, index) in aboutData.intro" :key="index"
               :itemprop="index === 0 ? 'description' : undefined"
               :role="index === 0 ? 'doc-abstract' : undefined">
                <GlossaryText :text="paragraph" :items="glossaryItems" />
            </p>
        </section>

        <section id="principles" class="content-narrow py-8 snap-start">
            <p class="label-overline mb-4">
                {{ aboutData.principles.title }}
            </p>
            <ul class="list-none p-0 m-0">
                <li
                    v-for="(item, index) in aboutData.principles.items"
                    :key="index"
                    class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0"
                >
                    <strong>{{ item.label }} </strong>
                    <br />
                    <GlossaryText :text="item.description" :items="glossaryItems" />
                </li>
            </ul>
        </section>
        <section id="orientation" class="content-narrow mt-9 pt-9 border-t border-border-subtle">
            <p v-for="(link, index) in aboutData.links" :key="index">
                <router-link :to="link.href"> {{ link.label }} </router-link>
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, provide, watch } from 'vue';
import { useAboutData } from '@/modules/home/data/home.data.ts';
import GlossaryText from '@/core/components/glossary-text.vue';
import { language } from '@/store';

const aboutData = useAboutData();
const glossaryItems = computed(() => aboutData.value?.glossary || []);

const glossaryRegistry = new Set<string>();
provide('glossaryRegistry', glossaryRegistry);

watch(language, () => {
    glossaryRegistry.clear();
});
</script>
