import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

const rawLocale = process.env.VITE_LOCALE ? process.env.VITE_LOCALE.toLowerCase() : 'en';
const locale = rawLocale === 'en' || !rawLocale ? 'en' : rawLocale;

export default defineConfig(({ command }) => {
    const base = locale === 'en' ? '/' : `/${locale}/`;

    return {
        plugins: [vue()],
        base: command === 'build' ? base : '/',
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            outDir: `dist/${locale}`,
            emptyOutDir: false,
        },
        test: {
            environment: 'happy-dom',
            globals: true,
            pool: 'threads',
            setupFiles: ['./tests/unit/setup.ts'],
            include: ['tests/unit/**/*.test.ts'],
            css: true,
        },
    };
});

