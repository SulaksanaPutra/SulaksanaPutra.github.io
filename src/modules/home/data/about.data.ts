import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { About } from '@/modules/home/types/about.types.ts';

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

export default ABOUT_BY_LOCALE.en;
