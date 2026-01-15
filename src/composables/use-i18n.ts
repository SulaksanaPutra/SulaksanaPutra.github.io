import { ref, watch } from 'vue';
import { language } from '@/store';

const dataFiles = import.meta.glob('../data/**/*.json');

export function useI18n<T>(basePath: string) {
    const data = ref<T | null>(null);

    const loadData = async () => {
        const lang = language.value.toLowerCase();
        let loadedData: T | null = null;

        if (lang !== 'en') {
            const key = `../data/${basePath}.${lang}.json`;
            if (key in dataFiles) {
                try {
                    const module = (await dataFiles[key]()) as any;
                    if (module.default && Object.keys(module.default).length > 0) {
                        loadedData = module.default;
                    }
                } catch {
                    // File not found will fallback to default
                }
            }
        }

        if (!loadedData) {
            const key = `../data/${basePath}.json`;
            if (key in dataFiles) {
                try {
                    const module = (await dataFiles[key]()) as any;
                    loadedData = module.default;
                } catch (error) {
                    console.error(`Could not load data for ${basePath}`, error);
                }
            } else {
                console.error(`Data file not found for: ${basePath}`);
            }
        }

        data.value = loadedData;
    };

    watch(language, loadData, { immediate: true });

    return { data };
}
