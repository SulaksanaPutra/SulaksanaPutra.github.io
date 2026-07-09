import { ProjectArticle, Projects } from '@/modules/projects/projects.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

const articleModules = import.meta.glob('./articles/*.ts', { eager: true });

const articlesByLocale: Record<'en' | 'id', ProjectArticle | null>[] = [];

for (const path in articleModules) {
    const mod = articleModules[path] as any;
    const localeMap = Object.values(mod).find(
        (val: any) => val && typeof val === 'object' && 'en' in val && 'id' in val,
    ) as Record<'en' | 'id', ProjectArticle | null> | undefined;

    if (localeMap) {
        articlesByLocale.push(localeMap);
    }
}

export function useProjectsData() {
    const { locale } = useI18n();

    return computed<Projects>(() => {
        return articlesByLocale
            .map((articleMap) => articleMap[locale.value] || articleMap.en || articleMap.id)
            .filter((article): article is ProjectArticle => !!article)
            .map((article) => ({
                id: article.id,
                title: article.title,
                subtitle: article.subtitle || '',
                thumbnail: article.thumbnail,
                date: article.date,
                link: {
                    id: 'view-' + article.id,
                    href: '/projects/' + article.id,
                    label: 'View Project →',
                },
            }));
    });
}

export function useProjectsDataStrict() {
    const { locale } = useI18n();

    return computed<Projects>(() => {
        return articlesByLocale
            .map((articleMap) => articleMap[locale.value])
            .filter((article): article is ProjectArticle => !!article)
            .map((article) => ({
                id: article.id,
                title: article.title,
                subtitle: article.subtitle || '',
                thumbnail: article.thumbnail,
                date: article.date,
                link: {
                    id: 'view-' + article.id,
                    href: '/projects/' + article.id,
                    label: 'View Project →',
                },
            }));
    });
}

export function useProjectsAvailability() {
    return computed(() => {
        const counts: Record<'en' | 'id', number> = { en: 0, id: 0 };
        articlesByLocale.forEach((map) => {
            if (map.en) counts.en++;
            if (map.id) counts.id++;
        });
        return counts;
    });
}

export function useProjectArticle(articleId: string) {
    const { locale } = useI18n();

    return computed<ProjectArticle | null>(() => {
        const articleMap = articlesByLocale.find((map) => {
            const article = map.en || map.id;
            return article?.id === articleId;
        });

        return articleMap ? articleMap[locale.value] : null;
    });
}

export function useProjectArticleAvailability(articleId: string) {
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
            fallbackArticle: articleMap.en || articleMap.id,
        };
    });
}

export function useProjectsBlendedFallbackData() {
    const { locale } = useI18n();
    const availability = useProjectsAvailability();
    const projects = useProjectsDataStrict();

    return computed(() => {
        const isID = locale.value === 'id';
        const otherCount = isID
            ? availability.value.en - projects.value.length
            : availability.value.id - projects.value.length;

        return {
            otherCount,
            message: isID
                ? `Terdapat ${otherCount} project lainnya dalam Bahasa Inggris`
                : `There are ${otherCount} other projects available in Indonesian`,
            submessage: isID
                ? 'Beberapa konten mungkin belum diterjemahkan sepenuhnya.'
                : 'Some content might not be fully translated yet.',
            button: isID ? 'Switch to English' : 'Beralih ke Indonesia',
        };
    });
}
