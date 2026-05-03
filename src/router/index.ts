import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const HomePage = () => import('@/modules/home/views/home-page.vue');
const SystemsPage = () => import('@/modules/systems/views/systems-page.vue');
const CaseStudiesPage = () => import('@/modules/case-studies/views/case-studies-page.vue');
const CaseStudyArticlePage = () =>
    import('@/modules/case-studies/views/case-study-article-page.vue');
const WritingArticlePage = () => import('@/modules/writings/views/writing-article-page.vue');
const SkillsPage = () => import('@/modules/skills/views/skills-page.vue');
const ContactPage = () => import('@/modules/contact/views/contact-page.vue');
const NotFoundPage = () => import('@/modules/error/views/NotFoundPage.vue');
const ServerErrorPage = () => import('@/modules/error/views/ServerErrorPage.vue');
const PrivacyPage = () => import('@/modules/static/views/privacy-page.vue');
const GridMatchPage = () => import('@/games/grid-match/components/grid-match-page.vue');

const HomeDrawer = () => import('@/modules/home/components/home-drawer.vue');
const SystemsDrawer = () => import('@/modules/systems/components/systems-drawer.vue');
const CaseStudiesDrawer = () => import('@/modules/case-studies/components/case-studies-drawer.vue');

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'about',
        component: HomePage,
        meta: { drawer: HomeDrawer },
    },
    {
        path: '/systems',
        name: 'systems',
        component: SystemsPage,
        meta: { drawer: SystemsDrawer },
    },
    {
        path: '/case-studies',
        name: 'case-studies',
        component: CaseStudiesPage,
        meta: { drawer: CaseStudiesDrawer },
    },
    {
        path: '/case-studies/:systemId/:articleId',
        name: 'case-study-article',
        component: CaseStudyArticlePage,
        meta: { drawer: CaseStudiesDrawer },
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
        meta: { drawer: HomeDrawer },
    },
    {
        path: '/writing/:articleId',
        name: 'writing-article',
        component: WritingArticlePage,
        meta: { drawer: HomeDrawer },
    },
    {
        path: '/projects',
        name: 'projects',
        component: HomePage,
        meta: { drawer: HomeDrawer },
    },
    {
        path: '/uses',
        name: 'uses',
        component: HomePage,
        meta: { drawer: HomeDrawer },
    },
    {
        path: '/hobbies',
        name: 'hobbies',
        component: HomePage,
        meta: { drawer: HomeDrawer },
    },
    {
        path: '/500',
        name: 'server-error',
        component: ServerErrorPage,
    },
    {
        path: '/privacy',
        name: 'privacy',
        component: PrivacyPage,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundPage,
    },
    {
        path: '/grid-match',
        name: 'grid-match',
        component: GridMatchPage,
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
