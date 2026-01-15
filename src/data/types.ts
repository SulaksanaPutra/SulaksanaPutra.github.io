type Link = {
    label: string;
    to: string;
};

type ExternalLink = {
    label: string;
    url: string;
    description: string;
};

type DetailItem = {
    label: string;
    text: string;
};

type DrawerBase = {
    id: string;
    label: string;
    description: string;
    details?: DetailItem[];
    tags?: string[];
    to?: string;
};

export interface Footer {
    copyright: string;
    availability: string;
    email: string;
}

export interface Header {
    searchLinks: ExternalLink[];
    navLinks: (Link & {
        hiddenOnMd: boolean;
    })[];
}

export interface Skills {
    title: string;
    description: string;
}
export interface Contact {
    title: string;
    paragraphs: string[];
    email: string;
}
type ContentSection = {
    label: string;
    content: string;
};

export interface Systems {
    id: string;
    title: string;
    titleHighlight?: string;
    description: string;
    tags: string[];
    sections: ContentSection[];
    link?: {
        to: string;
        text: string;
    };
}

export interface SystemsDrawer {
    id: string;
    title: string;
    subtitle: string;
    oneLiner: string;
    signal: string[];
    link: {
        to: string;
        text: string;
    };
}

export interface CaseStudies {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    link: string;
}

export interface CaseStudyItem {
    id: string;
    title: string;
    to: string;
}

export interface CaseStudiesDrawer {
    systemId: string;
    systemTitle: string;
    cases: CaseStudyItem[];
}

export interface VatChangeCase {
    backLink: {
        to: string;
        text: string;
    };
    header: {
        title: string;
        subtitle: string;
    };
    sections: {
        title: string;
        paragraphs?: string[];
        items?: string[];
    }[];
}

export interface Writing {
    title: string;
    paragraphs: string[];
}

export interface Uses {
    title: string;
    paragraphs: string[];
    items: string[];
}

export interface Hobbies {
    title: string;
    paragraphs: string[];
    items: string[];
}

export interface Projects {
    title: string;
    paragraphs: string[];
}

export interface HomeDrawer extends DrawerBase {
    to: string;
    isActive: boolean;
}

export interface About {
    intro: string[];
    principles: {
        title: string;
        items: PrincipleItem[];
    };
    links: NavigationLink[];
}

type PrincipleItem = {
    title: string;
    description: string;
};

type NavigationLink = Link;
