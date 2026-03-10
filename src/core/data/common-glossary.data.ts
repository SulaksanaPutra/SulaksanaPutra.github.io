import { GlossaryItem } from '../types/glossary.types';

export const GLOSSARY_BY_LOCALE: Record<'en' | 'id', GlossaryItem[]> = {
    en: [
        {
            term: 'Trade-offs',
            definition:
                'A situational decision that involves diminishing or losing one quality, quantity, or property of a set or design in return for gains in other aspects.',
        },
        {
            term: 'Maintainability',
            definition:
                'The ease with which a software system or component can be modified to correct faults, improve performance, or other attributes.',
        },
        {
            term: 'Scalability',
            definition:
                'The capability of a system, network, or process to handle a growing amount of work, or its potential to be enlarged to accommodate that growth.',
        },
    ],
    id: [
        {
            term: 'Trade-offs',
            definition:
                'Keputusan situasional yang melibatkan pengurangan atau kehilangan satu kualitas demi mendapatkan keuntungan di aspek lain.',
        },
        {
            term: 'Maintainability',
            definition:
                'Kemudahan sistem perangkat lunak untuk dimodifikasi guna memperbaiki kesalahan, meningkatkan kinerja, atau atribut lainnya.',
        },
        {
            term: 'Scalability',
            definition:
                'Kemampuan sistem untuk menangani beban kerja yang meningkat atau potensinya untuk diperbesar guna mengakomodasi pertumbuhan tersebut.',
        },
    ],
};
