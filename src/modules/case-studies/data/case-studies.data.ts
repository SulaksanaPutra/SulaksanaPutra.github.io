import { CaseStudies, CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed, unref } from 'vue';

const articleModules = import.meta.glob('./articles/*.ts', { eager: true });

const articlesByLocale: Record<'en' | 'id', CaseStudyArticle | null>[] = [];

for (const path in articleModules) {
    const mod = articleModules[path] as any;
    const localeMap = Object.values(mod).find(
        (val: any) => val && typeof val === 'object' && 'en' in val && 'id' in val,
    ) as Record<'en' | 'id', CaseStudyArticle | null> | undefined;

    if (localeMap) {
        articlesByLocale.push(localeMap);
    }
}

export const CASE_STUDIES_BY_LOCALE: Record<'en' | 'id', CaseStudies> = {
    en: [],
    id: [],
};

(['en', 'id'] as const).forEach((locale) => {
    CASE_STUDIES_BY_LOCALE[locale] = articlesByLocale
        .map((articleMap) => articleMap[locale])
        .filter((article): article is CaseStudyArticle => !!article)
        .flatMap((article) =>
            article.systemIds.map((systemId) => ({
                id: article.id,
                title: article.title,
                heading: article.heading,
                highlight: article.highlight,
                description: article.subtitle || article.description || '',
                systemId: systemId,
                link: {
                    id: 'read-' + article.id + '-' + systemId,
                    href: '/case-studies/' + systemId + '/' + article.id,
                    label: 'Read Case Study →',
                },
            })),
        );
});

export function useCaseStudiesData(systemId?: string | import('vue').Ref<string | undefined>) {
    const { locale } = useI18n();

    return computed<CaseStudies>(() => {
        const currentLocale = CASE_STUDIES_BY_LOCALE[locale.value] ?? [];

        const resolvedSystemId = unref(systemId);
        if (resolvedSystemId) {
            return currentLocale.filter((caseStudy) => caseStudy.systemId === resolvedSystemId);
        }

        const uniqueCaseStudies: CaseStudies = [];
        const seenIds = new Set<string>();
        for (const caseStudy of currentLocale) {
            if (!seenIds.has(caseStudy.id)) {
                seenIds.add(caseStudy.id);
                uniqueCaseStudies.push(caseStudy);
            }
        }
        return uniqueCaseStudies;
    });
}

export function useCaseStudyArticle(articleId: string) {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(() => {
        const articleMap = articlesByLocale.find((map) => {
            const article = map.en || map.id;
            return article?.id === articleId;
        });

        return articleMap ? articleMap[locale.value] : null;
    });
}

export function useCaseStudiesAvailability(
    systemId?: string | import('vue').Ref<string | undefined>,
) {
    return computed(() => {
        const availableLocales: ('en' | 'id')[] = [];
        const resolvedSystemId = unref(systemId);

        (['en', 'id'] as const).forEach((loc) => {
            const currentLocale = CASE_STUDIES_BY_LOCALE[loc] ?? [];
            const hasData = resolvedSystemId
                ? currentLocale.some((cs) => cs.systemId === resolvedSystemId)
                : currentLocale.length > 0;

            if (hasData) availableLocales.push(loc);
        });

        return availableLocales;
    });
}

export function useCaseStudyArticleAvailability(articleId: string) {
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

export default CASE_STUDIES_BY_LOCALE.en;
