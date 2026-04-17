import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const TWIN_FMS_ROUTING_CASE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'fms-uom-routing-abstraction',
        systemIds: ['system-twin-v2-fms'],
        title: 'Fleet Management System (FMS) Routing Logic: Virtual UOM Abstraction',
        heading: 'FMS Routing & UOM Abstraction',
        highlight:
            'Twin FMS — Navigating the conflict between standardized volumetric routing and virtual Unit of Measure (UOM) abstraction.',
        keywords: 'Fleet Management System, FMS, Routing Logic, Virtual Unit of Measure, UOM Abstraction, Logistics Automation, Vehicle Capacity Scheduling, Decoupled Priority Logic',
        subtitle:
            'Implementing a Fleet Management System (FMS) with virtual UOM abstraction and decoupled priority logic to enable automated scheduling without breaking operational workflows.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'Twin FMS was designed as a SaaS-oriented miniservice to decouple delivery management from the legacy Twin v1 monolith. The objective was precision: once an order was loaded by the warehouse, the FMS would take over to manage the "last mile"—scheduling which orders went on which vehicles and in what sequence.',
                    'The vision was to build a semi-automated routing engine. We wanted to move away from manual dispatching toward a system that could calculate vehicle capacity and enforce First-In-First-Out (FIFO) logic with mathematical certainty.',
                ],
            },
            {
                id: 'problem',
                label: 'Problem',
                paragraphs: [
                    'To achieve automation, a routing engine requires rigid, calculable parameters like volume (m³) and weight (kg). However, we hit an immediate wall with operational habits. For decades, the business had operated using "Boxes" and "Pieces" as their primary units of measure (UOM).',
                    'While a "Box" sounds like a unit, it lacks physical consistency—a box of tissues and a box of canned goods occupy vastly different volumes. More critically, the business requirement to prioritize by Order Value rather than physical capacity introduced significant domain leakage. This forced financial data into an FMS that should have remained value-agnostic, coupling the logistics engine to ERP-level sales logic that was entirely outside its intended scope.',
                ],
            },
            {
                id: 'constraints',
                label: 'Constraints',
                paragraphs: [
                    'The business model was unmovable. Management refused to transition to volumetric measurements because "Boxes" were the language spoken by every driver and dispatcher in the field. If we forced a change to m³, we risked a total breakdown in communication between the office and the loading dock.',
                    'At the same time, we had to maintain the modular integrity of the FMS. As a SaaS product, it needed to remain decoupled from the sales modules of other systems, meaning we could not directly store or process financial data within the delivery logic.',
                ],
            },
            {
                id: 'solution',
                label: 'Solution',
                paragraphs: [
                    'I recognized that forcing a rigid technical ideal onto an established business model was a losing strategy. Instead of trying to rewrite decades of operational habits, I designed an abstraction layer to bridge the gap between human habits and digital logic.',
                    'We implemented two key architectural solutions:',
                ],
                items: [
                    '`Normalized UOM Mapping`: We introduced "Calculable Units." This allowed users to continue using the term "Box" in the UI, while the system mapped each product to a decimal equivalent of a Standardized Volume. This enabled the routing engine to perform precise mathematical capacity checks in the background without forcing the warehouse staff to change their vocabulary.',
                    '`Decoupled Priority Logic`: To respect the business’s need for "Order Value" priority without contaminating the FMS domain, we implemented a metadata-driven flag system. The Sales system (ERP) would calculate urgency based on financial value and pass a simple priority label (e.g., High, Medium, Low) to the FMS. This kept the service modular and focused strictly on physical logistics, ensuring it remained "price-blind" while still respecting commercial priorities.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'This compromise successfully removed the biggest blocker to our automation goals. We achieved a high-precision routing schedule that could finally predict vehicle capacity with minimal error. The frequent "schedule revisions" and manual overrides that plagued the manual system were significantly reduced.',
                    'Technically, we preserved the "miniservice" vision. The FMS remained a clean, sellable product that handled delivery logic without being tethered to the specific financial rules of the parent company.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'While using "Boxes" as a routing parameter remains technically imprecise, I have learned that senior software engineering is often the art of negotiating with human habit. Forcing a theoretically ideal unit like m³ on a workforce that thinks in "Boxes" doesn\'t produce better data—it creates friction that encourages users to bypass the system entirely.',
                    'My role on this project shifted from being a pure developer to a translator between technical rigor and operational reality. I learned that success isn\'t always about a "perfect" data model; it’s about finding a best-fit abstraction that protects the architectural vision while respecting the unmovable workflows of the business.',
                ],
            },
        ],
        glossary: [
            {
                term: 'UOM',
                definition:
                    'A standard magnitude of a physical quantity. In logistics, this refers to how items are counted or sized, such as Pieces, Boxes, Kilograms, or Cubic Meters.',
            },
            {
                term: 'Domain Leakage',
                definition:
                    'A design flaw where logic or data from one specific business area (like Finance) inadvertently "leaks" into an unrelated system (like Logistics), creating unnecessary coupling.',
            },
            {
                term: 'Miniservice',
                definition:
                    'An architectural style that sits between a monolith and microservices. It is a decoupled, independent service focused on a specific business capability, like fleet management.',
            },
            {
                term: 'Last Mile',
                definition:
                    'The final and most complex stage of the logistics process, involving the movement of goods from a distribution hub to the final customer destination.',
            },
            {
                term: 'Abstraction Layer',
                definition:
                    'A technical bridge that hides complex logic (like volumetric math) behind a simplified interface (like the term "Box"), allowing users to work in familiar ways while the system stays precise.',
            },
            {
                term: 'Metadata-Driven',
                definition:
                    'A design approach where a system changes its behavior based on "tags" or "flags" passed along with the data, rather than having hardcoded rules for every specific scenario.',
            },
            {
                term: 'FIFO',
                definition:
                    'An inventory and logistics management principle where the oldest orders or items are prioritized for processing and delivery first.',
            },
            {
                term: 'Decoupling',
                definition:
                    'The process of separating software components so they can operate, scale, and be updated independently without affecting the rest of the system.',
            },
        ],
        qnas: [
            {
                question:
                    'How did you handle products that were significantly larger or smaller than a standard box?',
                answer: 'We used a decimal mapping system. If a standard box was 1.0, a larger item might be registered as 2.5 "Box-Units." This allowed us to keep the math consistent for the routing engine while letting the users keep their familiar terminology.',
            },
        ],
    },
    id: null,
};

export function useTwinFmsRoutingCaseData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () => TWIN_FMS_ROUTING_CASE_BY_LOCALE[locale.value] ?? TWIN_FMS_ROUTING_CASE_BY_LOCALE.en,
    );
}

export default TWIN_FMS_ROUTING_CASE_BY_LOCALE.en;
