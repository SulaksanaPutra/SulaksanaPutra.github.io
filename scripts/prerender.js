import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { spawn } from 'child_process';

const DIST_DIR = path.resolve('dist');
const SITEMAP_PATH = path.resolve('dist/sitemap.xml');

async function prerender() {
  console.log('🚀 Starting "JavaScript Shadow" fix...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('Dist directory not found. Run "npm run build" first.');
    return;
  }

  // 1. Start local preview server in background
  console.log('📡 Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true });
  
  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  const sitemapSource = fs.existsSync(SITEMAP_PATH) ? SITEMAP_PATH : path.resolve('public/sitemap.xml');
  if (!fs.existsSync(sitemapSource)) {
    console.error('Sitemap not found.');
    server.kill();
    return;
  }

  const sitemap = fs.readFileSync(sitemapSource, 'utf-8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const baseUrl = 'https://bayuaksana.com';

  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const url of urls) {
    const route = url.replace(baseUrl, '') || '/';
    const targetDir = path.join(DIST_DIR, route);
    const targetFile = path.join(targetDir, 'index.html');

    console.log(`Rendering: ${route}...`);
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:4173' + route, { waitUntil: 'networkidle' });
      await page.waitForSelector('#app > *', { timeout: 10000 });

      // Get rendered HTML
      const html = await page.content();
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.writeFileSync(targetFile, html);
      console.log(`✅ Fixed: ${route}`);
    } catch (e) {
      console.error(`❌ Failed ${route}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.kill('SIGINT');
  console.log('✨ Prerendering complete! AI-ready HTML generated.');
  process.exit(0);
}

prerender();
