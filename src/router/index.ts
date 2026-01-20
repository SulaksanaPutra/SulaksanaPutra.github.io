import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import SystemsPage from '@/modules/systems/views/systems-page.vue';
import CaseStudiesPage from '@/modules/case-studies/views/case-studies-page.vue';
import SkillsPage from '@/modules/skills/views/skills-page.vue';
import ContactPage from '@/modules/contact/views/contact-page.vue';
import HomePage from '@/modules/home/views/home-page.vue';
import CaseStudyArticlePage from '@/modules/case-studies/views/case-study-article-page.vue';
import {
    useVatChangeCaseData,
    VAT_CHANGE_CASE_BY_LOCALE,
} from '@/modules/case-studies/data/articles/vat-change-case.ts';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'about',
        component: HomePage,
    },
    {
        path: '/systems',
        name: 'systems',
        component: SystemsPage,
    },
    {
        path: '/case-studies',
        name: 'case-studies',
        component: CaseStudiesPage,
    },
    {
        path: '/case-studies/twin-v1/handling-a-vat-increase-in-a-legacy-real-time-system',
        name: 'TwinV1Vat',
        component: CaseStudyArticlePage,
        props: {
            useArticleData: useVatChangeCaseData,
            defaultContent: VAT_CHANGE_CASE_BY_LOCALE.en,
        },
    },
    {
        path: '/skillsPage',
        name: 'skills',
        component: SkillsPage,
        alias: '/skills',
    },
    {
        path: '/contactPage',
        name: 'contact',
        component: ContactPage,
        alias: '/contact',
    },
    {
        path: '/writing',
        name: 'writing',
        component: HomePage,
    },
    {
        path: '/projects',
        name: 'projects',
        component: HomePage,
    },
    {
        path: '/uses',
        name: 'uses',
        component: HomePage,
    },
    {
        path: '/hobbies',
        name: 'hobbies',
        component: HomePage,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        const sectionRoutes = ['about', 'writing', 'projects', 'uses', 'hobbies'];

        if (
            to.name &&
            from.name &&
            sectionRoutes.includes(to.name as string) &&
            sectionRoutes.includes(from.name as string)
        ) {
            return false;
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                if (to.hash) {
                    resolve({ el: to.hash, behavior: 'smooth' });
                } else if (savedPosition) {
                    resolve(savedPosition);
                } else {
                    const storedPosition = sessionStorage.getItem(to.fullPath);
                    if (storedPosition) {
                        const position = JSON.parse(storedPosition);
                        position.behavior = 'smooth';
                        resolve(position);
                    } else {
                        resolve({ top: 0, behavior: 'auto' });
                    }
                }
            }, 300);
        });
    },
});

router.beforeEach((_to, from, next) => {
    const scrollPosition = {
        top: window.scrollY,
        left: window.scrollX,
    };
    sessionStorage.setItem(from.fullPath, JSON.stringify(scrollPosition));
    next();
});

export default router;
