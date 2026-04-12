export interface UsesCategory {
    title: string;
    groups: {
        label: string;
        items: string[];
    }[];
    glossary: {
        term: string;
        definition: string;
    }[];
}
