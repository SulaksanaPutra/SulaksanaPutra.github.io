import { type Ref, watch } from 'vue';

interface SeoOptions {
    title: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogType?: 'website' | 'article';
    ogImage?: string;
    twitterCard?: 'summary' | 'summary_large_image';
}

export function useSeo(options: Ref<SeoOptions | null | undefined>) {
    const updateMeta = (name: string, content: string) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('name', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    const updateProperty = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute('property', property);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    watch(
        options,
        (newOptions) => {
            if (!newOptions) return;

            // Update Page Title
            const fullTitle = `${newOptions.title} | Bayu Aksana Personal website`;
            document.title = fullTitle;

            // Update Metadata
            updateMeta('title', fullTitle);
            if (newOptions.description) {
                updateMeta('description', newOptions.description);
            }
            if (newOptions.keywords) {
                updateMeta('keywords', newOptions.keywords);
            }

            // Update OpenGraph
            updateProperty('og:title', newOptions.ogTitle || newOptions.title);
            updateProperty(
                'og:description',
                newOptions.ogDescription || newOptions.description || '',
            );
            updateProperty('og:type', newOptions.ogType || 'website');
            if (newOptions.ogImage) {
                updateProperty('og:image', newOptions.ogImage);
            }

            // Update Twitter
            updateMeta('twitter:title', newOptions.ogTitle || newOptions.title);
            updateMeta(
                'twitter:description',
                newOptions.ogDescription || newOptions.description || '',
            );
            if (newOptions.ogImage) {
                updateMeta('twitter:image', newOptions.ogImage);
            }
            updateMeta('twitter:card', newOptions.twitterCard || 'summary_large_image');
        },
        { immediate: true },
    );
}
