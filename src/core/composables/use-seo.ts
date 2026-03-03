import { watch, type Ref } from 'vue';

interface SeoOptions {
    title: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogType?: 'website' | 'article';
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

    const updateOG = (property: string, content: string) => {
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
            document.title = `${newOptions.title} | Bayu Aksana Portfolio`;

            // Update Metadata
            if (newOptions.description) {
                updateMeta('description', newOptions.description);
            }

            // Update OpenGraph
            updateOG('og:title', newOptions.ogTitle || newOptions.title);
            updateOG('og:description', newOptions.ogDescription || newOptions.description || '');
            updateOG('og:type', newOptions.ogType || 'website');
        },
        { immediate: true },
    );
}
