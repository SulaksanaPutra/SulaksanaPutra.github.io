import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import {
    About,
    Hobbies,
    HomeDrawer,
    Projects,
    UsesCategory,
    Writing,
} from '@/modules/home/types/home.types.ts';

// --- DRAWER DATA ---
const HOME_DRAWER_BY_LOCALE: Record<'en' | 'id', HomeDrawer> = {
    en: [
        {
            id: 'home',
            href: '/',
            label: 'About',
            description: 'Background, values, and professional summary',
        },
        {
            id: 'writing',
            href: '/writing',
            label: 'Writing',
            description: 'Essays, notes, and long-form thoughts',
        },
        {
            id: 'projects',
            href: '/projects',
            label: 'Projects',
            description: 'Short ideas, experiments, and drafts',
        },
        {
            id: 'uses',
            href: '/uses',
            label: 'Uses',
            description: 'Tools, hardware, and software I use daily',
        },
        {
            id: 'hobbies',
            href: '/hobbies',
            label: 'Hobbies',
            description: 'Things I enjoy doing',
        },
    ],
    id: [
        {
            id: 'home',
            href: '/',
            label: 'About',
            description: 'Latar belakang, prinsip, dan rangkuman profesional.',
        },
        {
            id: 'writing',
            href: '/writing',
            label: 'Tulisan',
            description: 'Esai, catatan, dan pemikiran mendalam.',
        },
        {
            id: 'projects',
            href: '/projects',
            label: 'Project',
            description: 'Ide singkat, eksperimen, dan draf.',
        },
        {
            id: 'uses',
            href: '/uses',
            label: 'Uses',
            description: 'Tool, hardware, dan software yang aku pakai sehari-hari.',
        },
        {
            id: 'hobbies',
            href: '/hobbies',
            label: 'Hobi',
            description: 'Hal-hal yang aku nikmati.',
        },
    ],
};

export function useHomeDrawerData() {
    const { locale } = useI18n();
    return computed<HomeDrawer>(
        () => HOME_DRAWER_BY_LOCALE[locale.value] ?? HOME_DRAWER_BY_LOCALE.en,
    );
}

// --- ABOUT SECTION DATA ---
const ABOUT_BY_LOCALE: Record<'en' | 'id', About> = {
    en: {
        intro: [
            'Hi, I’m Bayu. I build the operational backbone for complex business ecosystems—specializing in logistics, financial systems, and multi-tenant internal platforms that keep companies running.',
            'Over six years, I’ve built and maintained production systems under real daily usage. For the last four years, I’ve worked remotely, owning features from design through production, running systems under real traffic, and serving as technical lead on specific projects.',
            'I design systems that evolve alongside the business. Rather than chasing theoretical perfection, I focus on pragmatic architecture—aligning technical decisions with business goals to ensure the system is reliable where it matters most and flexible where it needs to grow.',
        ],
        principles: {
            title: 'How I think about engineering',
            items: [
                {
                    label: 'Reliability',
                    description:
                        'Reliable systems are built on consistent patterns and shared principles. When a team adheres to these, failures become predictable, diagnosable, and easier to resolve.',
                },
                {
                    label: 'Vision & Cost Awareness',
                    description:
                        "Every project involves trade-offs. Decisions regarding an application's purpose, vision, and cost must be clarified early to ensure long-term maintainability.",
                },
                {
                    label: 'Simplicity',
                    description:
                        'Complexity is a permanent cost. I prioritize designs that start with simplicity and ease of use, allowing the system to scale naturally alongside business growth.',
                },
                {
                    label: 'Clean boundaries',
                    description:
                        'Clear assignments—both in task tickets and system ownership—are essential. Defined responsibilities ensure that problems are identified quickly and accountability is maintained across the organization.',
                },
            ],
        },
        links: [
            {
                id: 'systemsPage',
                href: '/systems',
                label: '→ Systems I’ve worked on',
            },
            {
                id: 'case-studies',
                href: '/case-studies',
                label: '→ Selected case studies',
            },
        ],
        glossary: [
            {
                term: 'Multi-tenant',
                definition:
                    'Software architecture where a single application instance serves multiple customers while keeping their data isolated.',
            },
            {
                term: 'fleet operations',
                definition:
                    'Management of commercial vehicles like trucks or vans, including tracking, routing, and maintenance.',
            },
            {
                term: 'internal platforms',
                definition:
                    'Custom software built for employees to use for internal business processes and automation.',
            },
        ],
    },
    id: {
        intro: [
            'Halo, aku Bayu. Aku seorang developer yang fokus membangun operational backbone untuk ekosistem bisnis yang kompleks—especially di bidang logistik, financial systems, dan multi-tenant internal platforms yang menjaga operasional perusahaan tetap berjalan stabil.',
            'Selama lebih dari enam tahun, aku sudah membangun dan me-maintain production systems dengan real daily usage. Dalam empat tahun terakhir, aku bekerja secara remote, memegang ownership fitur mulai dari tahap design sampai production, menjalankan sistem di bawah real traffic, serta menjadi technical lead untuk project tertentu.',
            'Aku merancang sistem yang tumbuh sejalan dengan perkembangan bisnis. Dibanding mengejar theoretical perfection, aku lebih fokus pada pragmatic architecture—menyelaraskan keputusan teknis dengan business goals untuk memastikan sistem tetap reliable di bagian yang krusial, tapi tetap fleksibel untuk dikembangkan.',
        ],
        principles: {
            title: 'How I think about engineering',
            items: [
                {
                    label: 'Reliability',
                    description:
                        'Sistem yang reliable dibangun di atas pola yang konsisten dan shared principles. Saat tim berkomitmen pada hal ini, kegagalan jadi lebih predictable, mudah didiagnosis, dan lebih cepat diselesaikan.',
                },
                {
                    label: 'Vision & Cost Awareness',
                    description:
                        'Tiap project pasti ada trade-offs. Keputusan soal tujuan aplikasi, visi, dan cost harus diperjelas sejak awal untuk menjamin long-term maintainability.',
                },
                {
                    label: 'Simplicity',
                    description:
                        'Complexity is a permanent cost. Aku memprioritaskan design yang dimulai dari simpel dan mudah digunakan, supaya sistemnya bisa scale up secara natural seiring pertumbuhan bisnis.',
                },
                {
                    label: 'Clean Boundaries',
                    description:
                        'Pembagian tugas yang jelas—baik di task tickets maupun system ownership—itu wajib clear. Tanggung jawab yang clear memastikan masalah bisa diidentifikasi dengan cepat dan akuntabilitas tetap terjaga di seluruh organisasi.',
                },
            ],
        },
        links: [
            {
                id: 'systemsPage',
                href: '/systems',
                label: '→ Sistem yang pernah aku kerjakan',
            },
            {
                id: 'case-studies',
                href: '/case-studies',
                label: '→ Studi kasus pilihan',
            },
        ],
        glossary: [
            {
                term: 'Multi-tenant',
                definition:
                    'Arsitektur perangkat lunak di mana satu instansi aplikasi melayani banyak pelanggan, memastikan isolasi data sambil berbagi infrastruktur.',
            },
            {
                term: 'fleet operations',
                definition:
                    'Manajemen kendaraan komersial seperti truk atau van, termasuk pelacakan lokasi, jadwal pengiriman, dan pemeliharaan.',
            },
            {
                term: 'internal platforms',
                definition:
                    'Perangkat lunak yang dibuat khusus untuk digunakan oleh karyawan perusahaan guna mengotomatiskan proses bisnis internal.',
            },
        ],
    },
};

export function useAboutData() {
    const { locale } = useI18n();
    return computed<About>(() => ABOUT_BY_LOCALE[locale.value] ?? ABOUT_BY_LOCALE.en);
}

// --- WRITING SECTION DATA ---
const WRITING_BY_LOCALE: Record<'en' | 'id', Writing> = {
    en: {
        title: 'Writing',
        subtitle: 'Essays, notes, and long-form thoughts',
        descriptions: [
            'Here you will find my essays, notes, and long-form thoughts on software engineering, system design, and other topics that interest me.',
        ],
    },
    id: {
        title: 'Tulisan',
        subtitle: 'Esai, catatan, dan pemikiran mendalam',
        descriptions: [
            'Di sini kamu bisa menemukan esai, catatan, dan pemikiran mendalamku seputar software engineering, system design, serta berbagai topik lain yang aku pikir menarik.',
        ],
    },
};

export function useWritingData() {
    const { locale } = useI18n();
    return computed<Writing>(() => WRITING_BY_LOCALE[locale.value] ?? WRITING_BY_LOCALE.en);
}

// --- PROJECTS SECTION DATA ---
const PROJECTS_BY_LOCALE: Record<'en' | 'id', Projects> = {
    en: {
        title: 'Projects',
        subtitle: 'Short ideas, experiments, and drafts',
        descriptions: [
            "A collection of short ideas, experiments, and drafts. These are projects that I've worked on to explore new technologies or to solve specific problems.",
            'Coming soon!',
        ],
    },
    id: {
        title: 'Project',
        subtitle: 'Ide singkat, eksperimen, dan draf',
        descriptions: [
            'Kumpulan ide singkat, eksperimen, dan draf. Ini adalah project-project yang aku kerjakan untuk eksplorasi teknologi baru atau sekadar menyelesaikan masalah spesifik.',
            'Coming soon!',
        ],
    },
};

export function useProjectsData() {
    const { locale } = useI18n();
    return computed<Projects>(() => PROJECTS_BY_LOCALE[locale.value] ?? PROJECTS_BY_LOCALE.en);
}

// --- USES SECTION DATA ---
const USES_BY_LOCALE: Record<'en' | 'id', UsesCategory> = {
    en: {
        title: 'Uses',
        subtitle: 'Tools, hardware, and software I use daily',
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
        subtitle: 'Tool, hardware, dan software',
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

// --- HOBBIES SECTION DATA ---
const HOBBIES_BY_LOCALE: Record<'en' | 'id', Hobbies> = {
    en: {
        title: 'Hobbies',
        subtitle: 'Things I enjoy doing',
        descriptions: [
            'I often find myself building small, hyper-specific tools for my own use—simple browser extensions, mobile automations, or internal web apps designed to solve a bit of personal friction. I treat these projects as a way to explore new patterns or simply make my daily routine more efficient.',
            "When I’m not at my desk, I tend to keep things low-key. I enjoy novels, comics, and the occasional anime, usually i prefer 'popcorn' or lighthearted stories—narratives that are engaging enough to be a good break, but not so heavy that they linger or affect my focus.",
            'To maintain a baseline of productivity and manage stress, I keep a casual gym routine. It’s a simple way to burn off energy and avoid burnout.',
        ],
    },
    id: {
        title: 'Hobi',
        subtitle: 'Hal-hal yang aku nikmati',
        descriptions: [
            'Aku sering banget bikin tool yang hyper-specific untuk kebutuhan sendiri—kayak browser extension simpel, mobile automation, atau web app internal buat ngurangin friction kecil di keseharian. Aku pakai project-project ini buat eksperimen pattern baru atau sekadar bikin rutinitas harian lebih efisien.',
            "Pas lagi nggak di depan meja kerja, aku biasanya pilih kegiatan yang low-key. Aku suka baca novel, komik, dan sesekali nonton anime. Biasanya aku lebih milih cerita 'popcorn' yang ringan—cerita yang seru buat refreshing tapi nggak terlalu berat sampai kepikiran atau ganggu fokus kerja.",
            'Buat menjaga produktivitas dan manage stress, aku punya rutinitas gym santai. Ini cara simpel buat aku buang energi negatif dan menghindari burnout.',
        ],
    },
};

export function useHobbiesData() {
    const { locale } = useI18n();
    return computed<Hobbies>(() => HOBBIES_BY_LOCALE[locale.value] ?? HOBBIES_BY_LOCALE.en);
}
