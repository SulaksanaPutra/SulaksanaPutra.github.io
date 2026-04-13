<template>
    <template v-if="!hasFormatting">
        <GlossaryText :text="text" :items="items" />
    </template>
    <template v-else>
        <template v-for="(part, index) in parts" :key="index">
            <div v-if="part.isBlockCode" class="mt-6 mb-8 group">
                <div
                    class="rounded-xl overflow-hidden border border-border-subtle bg-bg-muted/40 shadow-sm relative"
                >
                    <div
                        v-if="part.language"
                        class="px-4 py-2 bg-bg-muted border-b border-border-subtle flex justify-between items-center text-[10px] text-text-secondary font-mono uppercase tracking-wider"
                    >
                        <span class="opacity-70">{{ part.language }}</span>
                    </div>
                    <div
                        class="p-4 overflow-x-auto text-sm font-mono text-text-primary leading-relaxed text-left"
                    >
                        <CodeHighlighter :code="part.text" :language="part.language" />
                    </div>
                </div>
            </div>
            <code
                v-else-if="part.isCode"
                class="inline-code bg-bg-muted text-accent-primary px-1.5 py-0.5 rounded-md text-[0.85em] font-mono border border-border-subtle"
                >{{ part.text }}</code
            >
            <strong v-else-if="part.isBold" class="font-bold font-heading">{{ part.text }}</strong>
            <a
                v-else-if="part.isLink"
                :href="part.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent-primary hover:text-accent-primary/80 underline underline-offset-4 decoration-accent-primary/30 hover:decoration-accent-primary transition-all inline-flex items-center gap-0.5"
            >
                {{ part.text }}
                <ExternalLink v-if="isExternal(part.href)" class="w-3 h-3 opacity-60" />
            </a>
            <span
                v-else-if="part.isMath"
                v-html="renderMath(part.text)"
                class="inline-block"
            ></span>
            <GlossaryText v-else-if="part.text" :text="part.text" :items="items" />
        </template>
    </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ExternalLink } from 'lucide-vue-next';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import GlossaryText from './glossary-text.vue';
import CodeHighlighter from './code-highlighter.vue';
import { GlossaryItem } from '@/core/types/glossary.types';

const props = defineProps<{
    text: string;
    items?: GlossaryItem[];
}>();

const hasFormatting = computed(
    () =>
        props.text?.includes('`') ||
        props.text?.includes('*') ||
        props.text?.includes('[') ||
        props.text?.includes('<a') ||
        props.text?.includes('$'),
);

const isExternal = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('//');
};

const renderMath = (mathString: string) => {
    try {
        return katex.renderToString(mathString, { throwOnError: false });
    } catch (e) {
        console.error('KaTeX error:', e);
        return mathString;
    }
};

const parts = computed(() => {
    if (!props.text) return [];

    const result: {
        text: string;
        isCode?: boolean;
        isBlockCode?: boolean;
        language?: string;
        isBold?: boolean;
        isLink?: boolean;
        href?: string;
        isMath?: boolean;
    }[] = [];
    const regex =
        /(```[\s\S]+?```|`[^`]+`|\*[^*]+\*|\$[^$]+\$|\[[^\]]+]\([^)]+\)|<a\s+[^>]*>.*?<\/a>)/g;
    const pieces = props.text.split(regex);

    pieces.forEach((piece) => {
        if (!piece) return;

        if (piece.startsWith('```') && piece.endsWith('```') && piece.length >= 6) {
            const match = piece.match(/^```([a-zA-Z0-9]+)?\s*?\n?([\s\S]*?)```$/);
            if (match) {
                result.push({ text: match[2].trim(), isBlockCode: true, language: match[1] || '' });
            } else {
                result.push({ text: piece.slice(3, -3).trim(), isBlockCode: true });
            }
        } else if (piece.startsWith('`') && piece.endsWith('`') && piece.length >= 2) {
            result.push({ text: piece.slice(1, -1), isCode: true });
        } else if (piece.startsWith('*') && piece.endsWith('*') && piece.length >= 2) {
            result.push({ text: piece.slice(1, -1), isBold: true });
        } else if (piece.startsWith('[') && piece.includes('](') && piece.endsWith(')')) {
            const match = piece.match(/\[([^\]]+)]\(([^)]+)\)/);
            if (match) {
                result.push({ text: match[1], href: match[2], isLink: true });
            } else {
                result.push({ text: piece });
            }
        } else if (piece.startsWith('<a') && piece.endsWith('</a>')) {
            const hrefMatch = piece.match(/href="([^"]+)"/);
            const textMatch = piece.match(/>(.*?)<\/a>/);
            if (hrefMatch && textMatch) {
                result.push({ text: textMatch[1], href: hrefMatch[1], isLink: true });
            } else {
                result.push({ text: piece });
            }
        } else if (piece.startsWith('$') && piece.endsWith('$') && piece.length >= 3) {
            result.push({ text: piece.slice(1, -1), isMath: true });
        } else {
            result.push({ text: piece });
        }
    });

    return result;
});
</script>
