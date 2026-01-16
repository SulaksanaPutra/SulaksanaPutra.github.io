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
import rawFooter from '@/data/common/footer';
import { Footer } from '@/types/footer.ts';

const footer: Footer = rawFooter;
</script>
