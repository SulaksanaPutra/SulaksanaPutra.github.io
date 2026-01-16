<template>
    <div
        v-if="page"
        class="text-justify hyphens-auto leading-relaxed snap-y snap-mandatory overflow-y-auto"
    >
        <section id="context" class="content-narrow pt-8 pb-4">
            <p v-for="(paragraph, index) in page.intro" :key="index">
                {{ paragraph }}
            </p>
        </section>

        <section id="principles" class="content-narrow py-8 snap-start">
            <p class="label-overline mb-4">
                {{ page.principles.title }}
            </p>
            <ul class="list-none p-0 m-0">
                <li
                    v-for="(item, index) in page.principles.items"
                    :key="index"
                    class="mb-8 pb-8 border-b border-border-subtle last:border-0 last:mb-0 last:pb-0"
                >
                    <strong>{{ item.label }} </strong>
                    <br />
                    {{ item.description }}
                </li>
            </ul>
        </section>
        <section id="orientation" class="content-narrow mt-9 pt-9 border-t border-border-subtle">
            <p v-for="(link, index) in page.links" :key="index">
                <router-link :to="link.href"> {{ link.label }} </router-link>
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/use-i18n';
import { About } from '@/types/about.ts';
import type { Ref } from 'vue';

const { data: page }: { data: Ref<About | null> } = useI18n<About>('home/home-page');
</script>
