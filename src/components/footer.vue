<template>
    <footer class="pt-12 pb-16 border-t border-border-subtle text-sm text-text-secondary mt-18">
        <div class="container">
            <p class="mb-1">
                {{ page.copyright }}
            </p>
            <p class="text-text-secondary">
                {{ page.availability }}
                <a :href="`mailto:${page.email}`">{{ page.email }}</a>
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { computed, type Ref } from 'vue';
import { useI18n } from '@/composables/use-i18n.ts';
import { Footer } from '@/types/footer.ts';
import defaultFooter from '@/data/common/footer.ts';

const { data }: { data: Ref<Footer | null> } = useI18n<Footer>('common/footer');
const page = computed<Footer>(() => data.value ?? (defaultFooter as Footer));
</script>
