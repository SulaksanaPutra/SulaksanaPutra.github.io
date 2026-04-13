import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

function caseStudyDevPlugin() {
    return {
        name: 'case-study-dev-plugin',
        configureServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                if (req.url === '/__dev/save-article' && req.method === 'POST') {
                    var body_1 = '';
                    req.on('data', function (chunk) {
                        body_1 += chunk.toString();
                    });
                    req.on('end', function () {
                        try {
                            var data = JSON.parse(body_1);
                            var articleId = data.id;
                            var articlesDir = path.resolve(
                                __dirname,
                                'src/modules/case-studies/data/articles',
                            );
                            var files = fs.readdirSync(articlesDir);
                            var filepath = null;
                            var content = '';
                            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                                var file = files_1[_i];
                                if (file.endsWith('.ts')) {
                                    var fp = path.join(articlesDir, file);
                                    content = fs.readFileSync(fp, 'utf-8');
                                    // Search for exact id match in the file
                                    if (
                                        content.match(
                                            new RegExp('id:\\s*[\'"`]'.concat(articleId, '[\'"`]')),
                                        )
                                    ) {
                                        filepath = fp;
                                        break;
                                    }
                                }
                            }
                            if (filepath && fs.existsSync(filepath)) {
                                // Replace the "en: { ... }" block before "id: null"
                                var regex = /en:\s*\{[\s\S]*?}(?=\s*,\s*id:\s*null)/;
                                content = content.replace(
                                    regex,
                                    'en: '.concat(JSON.stringify(data, null, 4)),
                                );
                                fs.writeFileSync(filepath, content);
                                try {
                                    execSync('npx prettier --write '.concat(filepath), {
                                        stdio: 'ignore',
                                    });
                                } catch (e) {
                                    console.error('Prettier formatting failed:', e);
                                }
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true }));
                            } else {
                                res.statusCode = 404;
                                res.end(JSON.stringify({ error: 'File not found' }));
                            }
                        } catch (e) {
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
    base: '/', // Adjusted for root hosting (username.github.io)
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
