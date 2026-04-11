import { WritingArticle, Writings } from '@/modules/writings/writings.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

const articleModules = import.meta.glob('./articles/*.ts', { eager: true });

const articlesByLocale: Record<'en' | 'id', WritingArticle | null>[] = [];

for (const path in articleModules) {
    const mod = articleModules[path] as any;
    const localeMap = Object.values(mod).find(
        (val: any) => val && typeof val === 'object' && 'en' in val && 'id' in val,
    ) as Record<'en' | 'id', WritingArticle | null> | undefined;

    if (localeMap) {
        articlesByLocale.push(localeMap);
    }
}

export function useWritingsData() {
    const { locale } = useI18n();

    return computed<Writings>(() => {
        return articlesByLocale
            .map((articleMap) => articleMap[locale.value] || articleMap.en || articleMap.id)
            .filter((article): article is WritingArticle => !!article)
            .map((article) => ({
                id: article.id,
                title: article.title,
                subtitle: article.subtitle || '',
                thumbnail: article.thumbnail,
                date: article.date,
                link: {
                    id: 'read-' + article.id,
                    href: '/writing/' + article.id,
                    label: 'Read Article →',
                },
            }));
    });
}

export function useWritingsDataStrict() {
    const { locale } = useI18n();

    return computed<Writings>(() => {
        return articlesByLocale
            .map((articleMap) => articleMap[locale.value])
            .filter((article): article is WritingArticle => !!article)
            .map((article) => ({
                id: article.id,
                title: article.title,
                subtitle: article.subtitle || '',
                thumbnail: article.thumbnail,
                date: article.date,
                link: {
                    id: 'read-' + article.id,
                    href: '/writing/' + article.id,
                    label: 'Read Article →',
                },
            }));
    });
}

export function useWritingsAvailability() {
    return computed(() => {
        const counts: Record<'en' | 'id', number> = { en: 0, id: 0 };
        articlesByLocale.forEach((map) => {
            if (map.en) counts.en++;
            if (map.id) counts.id++;
        });
        return counts;
    });
}

export function useWritingArticle(articleId: string) {
    const { locale } = useI18n();

    return computed<WritingArticle | null>(() => {
        const articleMap = articlesByLocale.find((map) => {
            const article = map.en || map.id;
            return article?.id === articleId;
        });

        return articleMap ? articleMap[locale.value] : null;
    });
}

export function useWritingArticleAvailability(articleId: string) {
    return computed(() => {
        const articleMap = articlesByLocale.find((map) => {
            const article = map.en || map.id;
            return article?.id === articleId;
        });

        if (!articleMap) return null;

        const availableLocales = [];
        if (articleMap.en) availableLocales.push('en');
        if (articleMap.id) availableLocales.push('id');

        return {
            availableLocales,
            fallbackArticle: articleMap.en || articleMap.id
        };
    });
}
