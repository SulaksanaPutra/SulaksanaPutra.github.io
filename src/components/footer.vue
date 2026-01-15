<template>
    <footer class="pt-12 pb-16 border-t border-border-subtle text-sm text-text-secondary mt-18">
        <div class="container">
            <p class="mb-1">
                {{ footer.copyright }}
            </p>
            <p class="text-text-secondary">
                {{ footer.availability }}
                <a :href="`mailto:${footer.email}`">{{ footer.email }}</a>
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import footerData from '@/data/common/footer.json';
import type { Footer } from '@/data/types';

const footer: Footer = footerData;
</script>
