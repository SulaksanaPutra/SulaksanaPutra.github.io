import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { UsesCategory } from '@/modules/home/types/uses.types.ts';

const USES_BY_LOCALE: Record<'en' | 'id', UsesCategory> = {
    en: {
        title: 'Uses',
        groups: [
            {
                label: 'Development Environment',
                items: [
                    'Primary IDE: JetBrains Ecosystem (GoLand, PHPStorm, WebStorm, DataGrip)',
                    'Hardware: MacBook (macOS) / Linux for production parity',
                    'Terminal: Zsh with minimalist configuration for portability',
                    'Font: JetBrains Mono',
                ],
            },
            {
                label: 'Collaboration & Tools',
                items: [
                    'Communication: Slack, Microsoft Teams, and Discord',
                    'Productivity: Jira and Confluence for workflow management',
                    'AI: Tool-agnostic approach (Claude, Cursor, OpenAI)',
                ],
            },
        ],
        glossary: [
            {
                term: 'JetBrains Ecosystem',
                definition:
                    'A suite of specialized IDEs that provide deep static analysis and "batteries-included" tooling, reducing time spent on workspace configuration.',
            },
            {
                term: 'Zsh',
                definition:
                    'A shell designed for interactive use, used here with a focus on speed and standard compatibility.',
            },
            {
                term: 'Tool-agnostic',
                definition:
                    'The practice of choosing software based on specific task efficiency rather than loyalty to a single brand or ecosystem.',
            },
        ],
    },
    id: {
        title: 'Uses',
        groups: [
            {
                label: 'Development Environment',
                items: [
                    'IDE Utama: JetBrains Ecosystem (GoLand, PHPStorm, WebStorm, DataGrip)',
                    'Hardware: MacBook (macOS) / Linux untuk production parity',
                    'Terminal: Zsh dengan konfigurasi minimalis supaya tetap portable',
                    'Font: JetBrains Mono',
                ],
            },
            {
                label: 'Collaboration & Tools',
                items: [
                    'Komunikasi: Slack, Microsoft Teams, dan Discord',
                    'Produktivitas: Jira dan Confluence untuk workflow management',
                    'AI: Pendekatan tool-agnostic (Claude, Cursor, OpenAI)',
                ],
            },
        ],
        glossary: [
            {
                term: 'JetBrains Ecosystem',
                definition:
                    'Kumpulan IDE khusus yang menyediakan deep static analysis dan fitur "batteries-included", jadi aku nggak perlu buang banyak waktu untuk konfigurasi workspace.',
            },
            {
                term: 'Zsh',
                definition:
                    'Shell yang didesain untuk penggunaan interaktif, aku pakai dengan fokus pada kecepatan dan kompatibilitas standar.',
            },
            {
                term: 'Tool-agnostic',
                definition:
                    'Kebiasaan memilih software berdasarkan efisiensi untuk tugas spesifik, alih-alih terpaku pada satu brand atau ekosistem tertentu.',
            },
        ],
    },
};

export function useUsesData() {
    const { locale } = useI18n();

    return computed<UsesCategory>(() => USES_BY_LOCALE[locale.value] ?? USES_BY_LOCALE.en);
}

export default USES_BY_LOCALE.en;
