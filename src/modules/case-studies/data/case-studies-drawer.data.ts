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
    let systems = SYSTEMS_BY_LOCALE[locale];
    if (!systems || systems.length === 0) {
        systems = SYSTEMS_BY_LOCALE.en;
    }

    const grouped = caseStudies.reduce(
        (acc, study) => {
            const key = study.systemId;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(study);
            return acc;
        },
        {} as Record<string, typeof caseStudies>,
    );

    CASE_STUDIES_DRAWER_BY_LOCALE[locale] = Object.entries(grouped).map(([systemId, studies]) => {
        const system = systems.find((s) => s.id === systemId);

        return {
            id: systemId,
            label: system?.heading ?? 'unknow system ' + systemId,
            cases: studies.map((study) => ({
                id: study.link.id,
                href: study.link.href,
                label: study.heading,
            })),
        };
    });
});

export function useCaseStudiesDrawerData() {
    const { locale } = useI18n();

    return computed<CaseStudiesDrawer>(
        () => CASE_STUDIES_DRAWER_BY_LOCALE[locale.value] ?? CASE_STUDIES_DRAWER_BY_LOCALE.en,
    );
}

export default CASE_STUDIES_DRAWER_BY_LOCALE.en;
