import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://bayuaksana.com';
const PUBLIC_DIR = path.resolve('public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

const routes = [
  '/',
  '/systems',
  '/case-studies',
  '/writing',
  '/skills',
  '/contact',
];

// Scan for writing articles
const writingArticlesDir = path.resolve('src/modules/writings/data/articles');
const writingFiles = fs.readdirSync(writingArticlesDir);
writingFiles.forEach(file => {
  if (file.endsWith('.ts')) {
    const id = file.replace('.ts', '');
    routes.push(`/writing/${id}`);
  }
});

// Scan for case studies
const caseStudyArticlesDir = path.resolve('src/modules/case-studies/data/articles');
if (fs.existsSync(caseStudyArticlesDir)) {
  const caseFiles = fs.readdirSync(caseStudyArticlesDir);
  caseFiles.forEach(file => {
    if (file.endsWith('.ts')) {
      const filePath = path.join(caseStudyArticlesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extract article ID and system IDs using regex
      const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
      const systemsMatch = content.match(/systemIds:\s*\[([^\]]+)\]/);
      
      if (idMatch) {
        const articleId = idMatch[1];
        if (systemsMatch) {
          const systemIds = systemsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
          systemIds.forEach(systemId => {
            routes.push(`/case-studies/${systemId}/${articleId}`);
          });
        }
      }
    }
  });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>monthly</changefreq>
    <priority>${route === '/' ? '1.0' : route.includes('/writing/') || route.includes('/case-studies/') ? '0.8' : '0.6'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(SITEMAP_PATH, sitemap);
console.log(`Sitemap generated with ${routes.length} URLs at ${SITEMAP_PATH}`);
