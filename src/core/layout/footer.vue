<template>
    <footer class="footer-base">
        <div class="container" v-if="page">
            <p class="mb-1">
                {{ page.copyright }}
            </p>
            <p class="text-text-secondary">
                {{ page.availability }}
                <a :href="`mailto:${page.email}`">{{ page.email }}</a>
                <span class="mx-2">•</span>
                <router-link to="/privacy" class="hover:text-accent-primary">Privacy Policy</router-link>
            </p>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useFooterData } from '@/core/data/footer.data.ts';

const page = useFooterData();
</script>
