import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const SITEMAP_PATH = path.resolve('public/sitemap.xml');

async function prerender() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('Sitemap not found at', SITEMAP_PATH);
    return;
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const baseUrl = 'https://bayuaksana.com';

  console.log(`Prerendering ${urls.length} routes...`);

  for (const url of urls) {
    const route = url.replace(baseUrl, '');
    if (!route || route === '/') continue;

    // Create directory for the route
    const routeDirPath = path.join(DIST_DIR, route);
    const routeFilePath = path.join(routeDirPath, 'index.html');

    if (!fs.existsSync(routeDirPath)) {
      fs.mkdirSync(routeDirPath, { recursive: true });
    }

    // Copy index.html to the route's index.html
    fs.copyFileSync(path.join(DIST_DIR, 'index.html'), routeFilePath);
    console.log(`Generated: ${route}/index.html`);
  }

  console.log('Prerendering complete! (Static path generation for 200 OK status)');
}

prerender();
