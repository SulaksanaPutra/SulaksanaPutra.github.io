import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://bayuaksana.com';
const PUBLIC_DIR = path.resolve('public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

const routes = [
    { path: '/', priority: '1.0' },
    { path: '/systems', priority: '0.6' },
    { path: '/case-studies', priority: '0.6' },
    { path: '/writing', priority: '0.6' },
    { path: '/skills', priority: '0.6' },
    { path: '/contact', priority: '0.6' },
];

// Scan for writing articles
const writingArticlesDir = path.resolve('src/modules/writings/data/articles');
const writingFiles = fs.readdirSync(writingArticlesDir);
writingFiles.forEach((file) => {
    if (file.endsWith('.ts')) {
        const id = file.replace('.ts', '');
        const filePath = path.join(writingArticlesDir, file);
        const stats = fs.statSync(filePath);
        const lastmod = stats.mtime.toISOString().split('T')[0];

        // Simple image detection (thumbnails)
        const content = fs.readFileSync(filePath, 'utf-8');
        const images = [];
        const thumbnailMatch = content.match(/import thumbnail from ['"](.+?)['"]/);
        if (thumbnailMatch) {
            // We can't easily resolve the actual public path here since it's an import,
            // but we can provide the relative path or a placeholder if needed.
            // For SEO, it's better to have something.
            images.push({
                loc: `${BASE_URL}/assets/images/articles/writings/${id}.jpg`,
                title: id.split('-').join(' '),
            });
        }

        routes.push({
            path: `/writing/${id}`,
            priority: '0.8',
            lastmod,
            images,
        });
    }
});

// Scan for case studies
const caseStudyArticlesDir = path.resolve('src/modules/case-studies/data/articles');
if (fs.existsSync(caseStudyArticlesDir)) {
    const caseFiles = fs.readdirSync(caseStudyArticlesDir);
    caseFiles.forEach((file) => {
        if (file.endsWith('.ts')) {
            const filePath = path.join(caseStudyArticlesDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);
            const lastmod = stats.mtime.toISOString().split('T')[0];

            // Step 1: Find all IDs in the file
            const idMatches = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)];

            const reservedIds = [
                'case-studies',
                'writing',
                'systems',
                'skills',
                'contact',
                'context',
                'problem',
                'the-problem',
                'solution',
                'outcome',
                'reflection',
                'constraints',
                'impact',
                'trigger',
                'decision',
                'implementation',
                'decision-and-approach',
                'risk-management-and-verification',
            ];

            const articleId = idMatches.map((m) => m[1]).find((id) => !reservedIds.includes(id));

            const systemsMatch = content.match(/systemIds:\s*\[([\s\S]*?)]/);

            if (articleId && systemsMatch) {
                const systemIds = systemsMatch[1]
                    .split(',')
                    .map((s) => s.trim().replace(/['"]/g, ''))
                    .filter((s) => s.length > 0 && !s.includes('\n'));

                systemIds.forEach((systemId) => {
                    routes.push({
                        path: `/case-studies/${systemId}/${articleId}`,
                        priority: '0.8',
                        lastmod,
                    });
                });
            }
        }
    });
}

// Scan for project articles
const projectArticlesDir = path.resolve('src/modules/projects/data/articles');
if (fs.existsSync(projectArticlesDir)) {
    const projectFiles = fs.readdirSync(projectArticlesDir);
    projectFiles.forEach((file) => {
        if (file.endsWith('.ts')) {
            const filePath = path.join(projectArticlesDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const stats = fs.statSync(filePath);
            const lastmod = stats.mtime.toISOString().split('T')[0];

            const idMatch = content.match(/en:\s*\{\s*id:\s*['"]([^'"]+)['"]/);
            const articleId = idMatch ? idMatch[1] : null;

            if (articleId) {
                routes.push({
                    path: `/projects/${articleId}`,
                    priority: '0.8',
                    lastmod,
                });
            }
        }
    });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes
    .map((route) => {
        const lastmod = route.lastmod
            ? `    <lastmod>${route.lastmod}</lastmod>\n`
            : `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        const imageTags = route.images
            ? route.images
                  .map(
                      (img) => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
    </image:image>`,
                  )
                  .join('\n')
            : '';

        return `  <url>
    <loc>${BASE_URL}${route.path}</loc>
${lastmod}    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
${imageTags}
  </url>`;
    })
    .join('\n')}
</urlset>`;

fs.writeFileSync(SITEMAP_PATH, sitemap);
console.log(`Sitemap generated with ${routes.length} URLs at ${SITEMAP_PATH}`);
