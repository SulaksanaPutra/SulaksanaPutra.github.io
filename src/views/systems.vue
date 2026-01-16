<template>
    <div class="text-justify hyphens-auto leading-relaxed">
        <section class="content-narrow pt-8">
            <article
                v-for="system in systems"
                :id="system.id"
                :key="system.id"
                class="mb-16 pb-8 border-b border-border-subtle last:border-b-0"
            >
                <h2 class="text-xl text-left text-text-primary mb-2">
                    {{ system.title }}
                </h2>

                <p class="text-text-secondary mb-4">
                    {{ system.highlight }}
                </p>

                <div class="flex flex-wrap gap-2 mb-6">
                    <span
                        v-for="tag in system.tags"
                        :key="tag"
                        class="text-sm px-2 py-1 rounded border border-border-subtle text-text-secondary"
                    >
                        {{ tag }}
                    </span>
                </div>

                <div class="space-y-6">
                    <div v-for="(section, index) in system.sections" :key="index">
                        <p class="label-overline">
                            {{ section.label }}
                        </p>
                        <p>{{ section.description }}</p>
                    </div>

                    <p v-if="system.link && system.link.label">
                        <router-link :to="system.link.href">
                            {{ system.link.label }}
                        </router-link>
                    </p>
                </div>
            </article>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue';
import { useI18n } from '@/composables/use-i18n';
import type { System } from '@/types/system.ts';
import defaultSystems from '@/data/systems/systems-page';

const { data }: { data: Ref<System[] | null> } = useI18n<System[]>('systems/systems-page');

const systems = computed<System[]>(() => data.value ?? (defaultSystems as System[]));
</script>
