<template>
    <div class="text-justify hyphens-auto leading-relaxed">
        <section id="case-twin-v1-vat" class="content-narrow py-8">
            <div class="mb-8">
                <router-link
                    :to="vatChangeCase.backLink.href"
                    class="text-sm text-text-secondary hover:text-text-primary"
                >
                    {{ vatChangeCase.backLink.label }}
                </router-link>
            </div>

            <header class="mb-8">
                <h1 class="text-xl text-left text-text-primary leading-tight mb-2">
                    {{ vatChangeCase.title }}
                </h1>
                <p class="text-text-secondary max-w-2xl">
                    {{ vatChangeCase.highlight }}
                </p>
            </header>

            <article class="space-y-8">
                <section v-for="(section, index) in vatChangeCase.sections" :key="index">
                    <p class="label-overline">
                        {{ section.label }}
                    </p>
                    <div v-if="section.paragraphs" class="space-y-4">
                        <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex">
                            {{ paragraph }}
                        </p>
                    </div>
                    <ul v-if="section.items" class="pl-5 list-disc space-y-2">
                        <li v-for="(item, iIndex) in section.items" :key="iIndex">
                            {{ item }}
                        </li>
                    </ul>
                </section>
            </article>
        </section>
    </div>
</template>

<script setup lang="ts">
import rawVatChangeCase from '@/data/case-studies/articles/twin-v1/vat-change-case';
import { VatChangeCase } from '@/types/case-studies.ts';

const vatChangeCase: VatChangeCase = rawVatChangeCase;
</script>
