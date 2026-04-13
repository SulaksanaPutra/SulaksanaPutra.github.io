import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function caseStudyDevPlugin() {
    return {
        name: 'case-study-dev-plugin',
        configureServer(server: any) {
            server.middlewares.use((req: any, res: any, next: any) => {
                if (req.url === '/__dev/save-article' && req.method === 'POST') {
                    let body = '';
                    req.on('data', (chunk: any) => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            const articleId = data.id;
                            const articlesDir = path.resolve(__dirname, 'src/modules/case-studies/data/articles');
                            const files = fs.readdirSync(articlesDir);
                            let filepath: string | null = null;
                            let content: string = '';

                            for (const file of files) {
                                if (file.endsWith('.ts')) {
                                    const fp = path.join(articlesDir, file);
                                    content = fs.readFileSync(fp, 'utf-8');
                                    // Search for exact id match in the file
                                    if (content.match(new RegExp(`id:\\s*['"\`]${articleId}['"\`]`))) {
                                        filepath = fp;
                                        break;
                                    }
                                }
                            }

                            if (filepath && fs.existsSync(filepath)) {
                                // Replace the "en: { ... }" block before "id: null"
                                const regex = /en:\s*\{[\s\S]*?\}(?=\s*,\s*id:\s*null)/;
                                content = content.replace(regex, `en: ${JSON.stringify(data, null, 4)}`);
                                
                                fs.writeFileSync(filepath, content);
                                
                                try {
                                    execSync(`npx prettier --write ${filepath}`, { stdio: 'ignore' });
                                } catch (e) {
                                    console.error('Prettier formatting failed:', e);
                                }
                                
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true }));
                            } else {
                                res.statusCode = 404;
                                res.end(JSON.stringify({ error: 'File not found' }));
                            }
                        } catch (e: any) {
                            res.statusCode = 500;
                            res.end(JSON.stringify({ error: e.message }));
                        }
                    });
                } else {
                    next();
                }
            });
        },
    };
}

export default defineConfig({
    base: '/personal-website/', // Repository name for GitHub Pages
    plugins: [vue(), caseStudyDevPlugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: {
        environment: 'happy-dom',
        globals: true,
        pool: 'threads',
        setupFiles: ['./tests/unit/setup.ts'],
        include: ['tests/unit/**/*.test.ts'],
        css: true,
    },
});
