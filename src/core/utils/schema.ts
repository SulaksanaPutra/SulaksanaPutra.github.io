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
        description:
            'Bayu Aksana is a software architect specializing in high-performance web applications, clean architecture, and technical leadership.',
        sameAs: [
            'https://github.com/SulaksanaPutra',
            'https://www.linkedin.com/in/bayu-aksana-dev',
            'https://www.instagram.com/bayuaksana.dev',
            // --- Future Entity Grounding ---
            // Once you have a Google Knowledge Panel or Wikidata entry, add the links here:
            // 'https://www.wikidata.org/wiki/YOUR_ID',
            // 'https://kg.google.com/k/g/YOUR_KG_ID'
        ],
        knowsAbout: [
            'Software Architecture',
            'Clean Architecture',
            'Vue.js',
            'TypeScript',
            'System Design',
            'Performance Optimization',
        ],
        // identifier: 'KNOW_KEY_HERE' // Add your Knowledge Graph ID here once claimed
    };
}

export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: `${AUTHOR_NAME} Studio`,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.ico`,
        contactPoint: {
            '@type': 'ContactPoint',
            email: 'hello@bayuaksana.com',
            contactType: 'technical support',
        },
        sameAs: [
            'https://github.com/SulaksanaPutra',
            'https://www.linkedin.com/in/bayu-aksana-dev',
        ],
    };
}

export function getProductSchema(product: {
    name: string;
    description: string;
    image?: string;
    brand?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
            '@type': 'Brand',
            name: product.brand || AUTHOR_NAME,
        },
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            price: '0',
            priceCurrency: 'USD',
        },
    };
}

export function getWebSiteSchema() {
    return {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${AUTHOR_NAME} — Technical Portfolio`,
        publisher: { '@id': `${SITE_URL}/#person` },
        description:
            'A digital garden and technical portfolio showcasing case studies and writings on software design.',
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
    const articleUrl = article.urlPath
        ? `${SITE_URL}${article.urlPath}`
        : `${SITE_URL}/writing/${article.id}`;

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
            '@id': articleUrl,
        },
    };
}

export function getFAQSchema(qnas: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: qnas.map((qna) => ({
            '@type': 'Question',
            name: qna.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: qna.answer,
            },
        })),
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
            item: `${SITE_URL}${item.item}`,
        })),
    };
}
