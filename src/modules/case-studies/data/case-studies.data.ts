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
        .map((article) => ({
            id: article.id,
            title: article.title,
            heading: article.heading,
            highlight: article.highlight,
            description: article.subtitle || article.description || '',
            systemId: article.systemId,
            link: {
                id: 'read-' + article.id,
                href: '/case-studies/' + article.systemId + '/' + article.id,
                label: 'Read Case Study →',
            },
        }));
});

export function useCaseStudiesData(systemId?: string | import('vue').Ref<string | undefined>) {
    const { locale } = useI18n();

    return computed<CaseStudies>(() => {
        const currentLocale = CASE_STUDIES_BY_LOCALE[locale.value] ?? [];

        const resolvedSystemId = unref(systemId);
        if (resolvedSystemId) {
            return currentLocale.filter((caseStudy) => caseStudy.systemId === resolvedSystemId);
        }

        return currentLocale;
    });
}

export function useCaseStudyArticle(articleId: string) {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(() => {
        const articleMap = articlesByLocale.find((map) => {
            const article = map[locale.value] || map.en;
            return article?.id === articleId;
        });

        return articleMap ? articleMap[locale.value] || articleMap.en : null;
    });
}

export default CASE_STUDIES_BY_LOCALE.en;
