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
                        'Reliable systems are built on strong patterns and clear principles. When the team follows them, failures are predictable, diagnosable, and easier to resolve.',
                },
                {
                    label: 'Vision & Cost Awareness',
                    description:
                        'Every project has trade-offs. Early decisions about the app’s purpose, vision, and cost shape maintainability, scalability, and long-term success.',
                },
                {
                    label: 'Simplicity',
                    description:
                        'Complexity incurs a cost. My system designs prioritize simplicity, ease of use, and the ability to scale to accommodate future needs and the overall vision.',
                },
                {
                    label: 'Clean boundaries',
                    description:
                        'A clear assignment of responsibilities makes it easy to identify and fix problems quickly and ensures accountability across teams and tasks.',
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
            'Hai, saya Bayu. Saya mengerjakan sistem di balik operasional sehari-hari—pemesanan, keuangan, pembayaran, gudang dan armada, platform internal, serta alat bisnis multi-tenant.',
            'Selama lebih dari enam tahun, saya membangun dan memelihara sistem produksi yang digunakan setiap hari. Dalam empat tahun terakhir, saya bekerja secara remote, memiliki fitur dari desain hingga produksi, menjalankan sistem dengan trafik nyata, serta berperan sebagai technical lead pada proyek tertentu.',
            'Saya merancang sistem yang dapat beradaptasi seiring berkembangnya kebutuhan, ketika pertumbuhan trafik tidak merata dan kegagalan bersifat halus namun berdampak besar, sehingga memerlukan trade-off yang matang antara kecepatan, biaya, dan ketepatan.',
        ],
        principles: {
            title: 'Cara saya memandang engineering',
            items: [
                {
                    label: 'Keandalan',
                    description:
                        'Sistem yang andal dibangun di atas pola yang kuat dan prinsip yang jelas. Ketika tim mengikutinya, kegagalan menjadi lebih mudah diprediksi, didiagnosis, dan diselesaikan.',
                },
                {
                    label: 'Visi & Kesadaran Biaya',
                    description:
                        'Setiap proyek memiliki trade-off. Keputusan awal tentang tujuan, visi, dan biaya aplikasi sangat memengaruhi maintainability, skalabilitas, dan keberhasilan jangka panjang.',
                },
                {
                    label: 'Kesederhanaan',
                    description:
                        'Kompleksitas memiliki biaya. Desain sistem saya mengutamakan kesederhanaan, kemudahan penggunaan, serta kemampuan untuk berkembang mengikuti kebutuhan dan visi ke depan.',
                },
                {
                    label: 'Batasan yang jelas',
                    description:
                        'Pembagian tanggung jawab yang jelas memudahkan identifikasi dan perbaikan masalah, serta memastikan akuntabilitas di seluruh tim dan tugas.',
                },
            ],
        },
        links: [
            {
                id: 'systemsPage',
                href: '/systems',
                label: '→ Sistem yang pernah saya kerjakan',
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
