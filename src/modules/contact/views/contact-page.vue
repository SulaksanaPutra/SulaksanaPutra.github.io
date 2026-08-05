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

        <section id="contact-badge" class="content-narrow">
            <div class="p-3 rounded-2xl bg-bg-muted/30 border border-border-subtle">
                <a
                    v-for="social in socials"
                    :key="social.id"
                    :href="social.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-4 p-3 sm:p-4 rounded-xl text-text-primary transition-colors hover:bg-bg-muted/50 hover:text-text-primary hover:no-underline group"
                >
                    <div
                        class="flex items-center justify-center w-11 h-11 rounded-xl bg-bg-muted border border-border-subtle text-text-primary shrink-0"
                    >
                        <svg
                            v-if="social.id === 'linkedin'"
                            viewBox="0 0 34 34"
                            width="24"
                            height="24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                d="M10 13H5v16h5zm.45-5.5a2.88 2.88 0 0 0-2.86-2.9H7.5a2.9 2.9 0 0 0 0 5.8 2.88 2.88 0 0 0 2.95-2.81zM29 19.28c0-4.81-3.06-6.68-6.1-6.68a5.7 5.7 0 0 0-5.06 2.58h-.14V13H13v16h5v-8.51a3.32 3.32 0 0 1 3-3.58h.19c1.59 0 2.77 1 2.77 3.52V29h5z"
                            />
                        </svg>
                        <svg
                            v-else-if="social.id === 'github'"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"
                            />
                        </svg>
                        <svg
                            v-else
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"
                            />
                        </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="font-semibold text-text-primary leading-tight mb-0">
                            {{ social.name }}
                        </p>
                        <p class="text-sm text-text-secondary leading-snug truncate mb-0">
                            {{ social.username }}
                        </p>
                    </div>
                    <ExternalLink
                        :size="16"
                        class="text-text-secondary shrink-0 transition-colors group-hover:text-accent-primary"
                    />
                </a>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ExternalLink } from 'lucide-vue-next';
import { useContactData } from '@/modules/contact/data/contact.data.ts';
import { useSeo } from '@/core/composables/use-seo';
import { SITE_URL } from '@/core/utils/schema';

const route = useRoute();
const page = useContactData();

const socials = [
    {
        id: 'linkedin',
        name: 'LinkedIn',
        username: 'bayu-aksana-dev',
        href: 'https://www.linkedin.com/in/bayu-aksana-dev',
    },
    {
        id: 'github',
        name: 'GitHub',
        username: 'SulaksanaPutra',
        href: 'https://github.com/SulaksanaPutra',
    },
    {
        id: 'instagram',
        name: 'Instagram',
        username: 'bayuaksana.dev',
        href: 'https://www.instagram.com/bayuaksana.dev/',
    },
];

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
