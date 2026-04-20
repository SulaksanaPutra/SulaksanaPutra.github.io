/**
 * Utilities for generating JSON-LD structured data (Schema.org)
 * to help AI agents understand the "Entities" in this project.
 */

export const SITE_URL = 'https://bayuaksana.com';
export const AUTHOR_NAME = 'Bayu Aksana';

export function getPersonSchema() {
    return {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: SITE_URL,
        jobTitle: 'Software Architect & Fullstack Engineer',
        description: 'Bayu Aksana is a software architect specializing in high-performance web applications, clean architecture, and technical leadership.',
        sameAs: [
            'https://github.com/SulaksanaPutra',
            'https://www.linkedin.com/in/bayu-aksana-dev',
            'https://www.instagram.com/bayuaksana.dev',
            // Add other social links here
        ],
        knowsAbout: [
            'Software Architecture',
            'Clean Architecture',
            'Vue.js',
            'TypeScript',
            'System Design',
            'Performance Optimization'
        ]
    };
}

export function getWebSiteSchema() {
    return {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${AUTHOR_NAME} — Technical Portfolio`,
        publisher: { '@id': `${SITE_URL}/#person` },
        description: 'A digital garden and technical portfolio showcasing case studies and writings on software design.'
    };
}

export function getArticleSchema(article: {
    id: string;
    title: string;
    description: string;
    date?: string;
    image?: string;
    keywords?: string;
    urlPath?: string;
}) {
    const articleUrl = article.urlPath ? `${SITE_URL}${article.urlPath}` : `${SITE_URL}/writing/${article.id}`;
    
    return {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        '@id': `${articleUrl}/#article`,
        headline: article.title,
        description: article.description,
        image: article.image,
        datePublished: article.date,
        author: { '@id': `${SITE_URL}/#person` },
        publisher: { '@id': `${SITE_URL}/#person` },
        keywords: article.keywords,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl
        }
    };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.item}`
        }))
    };
}
