import tseslint from 'typescript-eslint';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

// Normalise Vue flat config so we don't try to spread `undefined`
// Use the official Vue 3 flat recommended config key: 'flat/recommended'
const vueFlatConfig = vuePlugin.configs?.['flat/recommended'] ?? [];

// Derive a TypeScript-only config from the recommended preset so that
// we don't override the Vue SFC parser on `.vue` files.
const [tsBaseConfig, tsEslintRecommendedConfig, tsRecommendedConfig] = tseslint.configs.recommended;

// #region agent log
fetch('http://127.0.0.1:7242/ingest/e8c53a36-48f8-4b00-9c98-d01169ff9f85', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'eslint.config.mjs:12',
        message: 'ESLint flat config initialization',
        data: {
            hasVueFlatConfig: !!vueFlatConfig,
            vueFlatConfigIsArray: Array.isArray(vueFlatConfig),
        },
        timestamp: Date.now(),
    }),
}).catch(() => {});
// #endregion

const config = [
    // Global ignores (replacement for .eslintignore)
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'playwright-report/**', '.vite/**'],
    },

    // Vue 3 + SFC recommended rules (includes vue-eslint-parser for .vue)
    ...(Array.isArray(vueFlatConfig) ? vueFlatConfig : [vueFlatConfig]),

    // Ensure Vue SFCs use vue-eslint-parser + TypeScript parser for <script setup lang="ts">
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsBaseConfig.languageOptions.parser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
        },
        processor: 'vue/vue',
    },

    // TypeScript recommended rules for .ts / .tsx files only
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
        languageOptions: {
            parser: tsBaseConfig.languageOptions.parser,
            sourceType: 'module',
        },
        plugins: tsBaseConfig.plugins,
        rules: {
            ...tsEslintRecommendedConfig.rules,
            ...tsRecommendedConfig.rules,
        },
    },

    // Apply custom rules
    {
        rules: {
            // Your custom tweaks
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'vue/html-indent': ['warn', 4],
        },
    },

    // Test files: add globals for Vitest
    {
        files: ['tests/**/*.{js,ts,vue}'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                vi: 'readonly',
            },
        },
    },
];

// #region agent log
fetch('http://127.0.0.1:7242/ingest/e8c53a36-48f8-4b00-9c98-d01169ff9f85', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'eslint.config.mjs:64',
        message: 'ESLint flat config shape',
        data: {
            configLength: config.length,
        },
        timestamp: Date.now(),
    }),
}).catch(() => {});
// #endregion

export default config;
