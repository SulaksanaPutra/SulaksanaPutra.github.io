import { computed, ref } from 'vue';

const dataFiles = import.meta.glob('../data/**/*.ts');
const buildLocale = (import.meta.env.VITE_LOCALE || 'en').toLowerCase();

export function useI18n<T>(basePath: string) {
    const data = ref<T | null>(null);
    const value = computed(() => data.value);

    const loadData = async () => {
        const lang = buildLocale;
        let loadedData: T | null = null;

        if (lang !== 'en') {
            const localizedKey = `../data/${basePath}.${lang}.ts`;
            if (localizedKey in dataFiles) {
                try {
                    const module = (await dataFiles[localizedKey]()) as any;
                    if (module.default) {
                        loadedData = module.default;
                    }
                } catch (error) {
                    console.error(
                        `Could not load localized data for ${basePath} and locale ${lang}`,
                        error,
                    );
                }
            } else {
                console.error(
                    `Localized data file not found for locale ${lang} and path ${basePath}`,
                );
            }
        } else {
            const defaultKey = `../data/${basePath}.ts`;
            if (defaultKey in dataFiles) {
                try {
                    const module = (await dataFiles[defaultKey]()) as any;
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

    loadData();

    return { data: value };
}
