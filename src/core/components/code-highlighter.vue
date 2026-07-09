<template>
    <pre class="whitespace-pre-wrap"><code v-html="highlightedCode"></code></pre>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    code: string;
    language?: string;
}>();

const highlightedCode = computed(() => {
    if (!props.code) return '';

    // Escape HTML special characters
    let text = props.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Define rules for highlighting
    // Note: Order matters for some overlaps
    const rules = [
        // Comments (Double slash and multi-line)
        {
            name: 'comment',
            pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
            class: 'text-[var(--code-comment)] italic',
        },
        // Strings (Double quotes, single quotes, backticks)
        {
            name: 'string',
            pattern: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
            class: 'text-[var(--code-string)]',
        },
        // Keywords (Go, JS, TS common)
        {
            name: 'keyword',
            pattern:
                /\b(package|import|func|var|type|struct|interface|return|if|else|switch|case|default|for|range|go|chan|select|map|break|continue|defer|goto|fallthrough|const|nil|true|false|export|let|await|async|try|catch|finally|throw|class|extends|new|this|super|yield|static|private|public|protected|readonly|from|as)\b/g,
            class: 'text-[var(--code-keyword)] font-bold',
        },
        // Numbers
        {
            name: 'number',
            pattern: /\b(\d+(\.\d+)?)\b/g,
            class: 'text-[var(--code-number)]',
        },
        // Function calls
        {
            name: 'function',
            pattern: /\b([a-zA-Z_]\w*)(?=\s*\()/g,
            class: 'text-[var(--code-function)]',
        },
        // Types / Common Classes
        {
            name: 'type',
            pattern:
                /\b(string|int|float64|bool|error|uint64|byte|rune|any|interface|Uint8Array|Array|Promise|Observable|Map|Set|Object|Number|Boolean|String|Symbol)\b/g,
            class: 'text-[var(--code-function)] opacity-80',
        },
        // Booleans
        {
            name: 'boolean',
            pattern: /\b(true|false|nil|null|undefined)\b/g,
            class: 'text-[var(--code-number)] font-medium',
        },
    ];

    // Tokenization logic to prevent nested matching
    interface Token {
        index: number;
        length: number;
        content: string;
        className: string;
    }

    const tokens: Token[] = [];

    // Find all matches for all rules
    rules.forEach((rule) => {
        let match;
        const regex = new RegExp(rule.pattern);
        while ((match = regex.exec(text)) !== null) {
            // Check if this match overlaps with an existing token
            const isOverlapping = tokens.some(
                (token) =>
                    (match!.index >= token.index && match!.index < token.index + token.length) ||
                    (token.index >= match!.index && token.index < match!.index + match![0].length),
            );

            if (!isOverlapping) {
                tokens.push({
                    index: match.index,
                    length: match[0].length,
                    content: match[0],
                    className: rule.class,
                });
            }

            // Avoid infinite loops with zero-length matches
            if (match.index === regex.lastIndex) regex.lastIndex++;
        }
    });

    // Sort tokens by index
    tokens.sort((a, b) => a.index - b.index);

    // Build the final HTML
    let result = '';
    let lastIndex = 0;

    tokens.forEach((token) => {
        // Add plain text before the token
        result += text.substring(lastIndex, token.index);
        // Add the marked token
        result += `<span class="${token.className}">${token.content}</span>`;
        lastIndex = token.index + token.length;
    });

    // Add remaining plain text
    result += text.substring(lastIndex);

    return result;
});
</script>
