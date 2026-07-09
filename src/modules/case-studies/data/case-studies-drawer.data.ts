import { CaseStudiesDrawer } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';
import { CASE_STUDIES_BY_LOCALE } from '@/modules/case-studies/data/case-studies.data.ts';
import { SYSTEMS_BY_LOCALE } from '@/modules/systems/data/systems.data.ts';

const CASE_STUDIES_DRAWER_BY_LOCALE: Record<'en' | 'id', CaseStudiesDrawer> = {
    en: [],
    id: [],
};

(['en', 'id'] as const).forEach((locale) => {
    const caseStudies = CASE_STUDIES_BY_LOCALE[locale];
    const systems = SYSTEMS_BY_LOCALE[locale];

    const articleToSystems: Record<string, string[]> = {};
    caseStudies.forEach((study) => {
        if (!articleToSystems[study.id]) {
            articleToSystems[study.id] = [];
        }
        if (!articleToSystems[study.id].includes(study.systemId)) {
            articleToSystems[study.id].push(study.systemId);
        }
    });

    const combinedGroups: Record<string, typeof caseStudies> = {};
    const processedArticles = new Set<string>();

    caseStudies.forEach((study) => {
        if (processedArticles.has(study.id)) return;
        processedArticles.add(study.id);

        const systemIds = articleToSystems[study.id].sort();
        const key = systemIds.join(',');

        if (!combinedGroups[key]) {
            combinedGroups[key] = [];
        }
        combinedGroups[key].push(study);
    });

    const systemOrder = systems.reduce(
        (acc, s, index) => {
            acc[s.id] = index;
            return acc;
        },
        {} as Record<string, number>,
    );

    CASE_STUDIES_DRAWER_BY_LOCALE[locale] = Object.entries(combinedGroups)
        .map(([key, studies]) => {
            const systemIds = key.split(',');
            const labels = systemIds.map((id) => {
                const s = systems.find((sys) => sys.id === id);
                return s?.heading ?? id;
            });

            let smartLabel = '';
            if (labels.length > 1) {
                // Find common prefix among labels
                let commonPrefix = labels[0];
                for (let i = 1; i < labels.length; i++) {
                    let j = 0;
                    while (
                        j < commonPrefix.length &&
                        j < labels[i].length &&
                        commonPrefix[j] === labels[i][j]
                    ) {
                        j++;
                    }
                    commonPrefix = commonPrefix.substring(0, j);
                }

                // Clean up prefix to end at a word boundary
                const lastSpace = commonPrefix.lastIndexOf(' ');
                if (lastSpace !== -1) {
                    commonPrefix = commonPrefix.substring(0, lastSpace + 1);
                } else if (!labels.every((l) => l.startsWith(commonPrefix))) {
                    commonPrefix = '';
                }

                if (commonPrefix.length > 2) {
                    const suffixes = labels.map((l) => l.replace(commonPrefix, '').trim());
                    smartLabel = `${commonPrefix.trim()} ${suffixes.join(' & ')}`;
                } else {
                    smartLabel = labels.join(' & ');
                }
            } else {
                smartLabel = labels[0];
            }

            // Rank is the minimum index of any system in the group
            const rank = Math.min(...systemIds.map((id) => systemOrder[id] ?? 999));

            return {
                id: key,
                label: smartLabel,
                rank,
                size: systemIds.length,
                cases: studies.map((study) => ({
                    id: study.link.id,
                    href: study.link.href,
                    label: study.heading,
                })),
            };
        })
        .sort((a, b) => a.rank - b.rank || b.size - a.size);
});

export function useCaseStudiesDrawerData() {
    const { locale } = useI18n();

    return computed<CaseStudiesDrawer>(() => CASE_STUDIES_DRAWER_BY_LOCALE[locale.value]);
}

export default CASE_STUDIES_DRAWER_BY_LOCALE.en;
