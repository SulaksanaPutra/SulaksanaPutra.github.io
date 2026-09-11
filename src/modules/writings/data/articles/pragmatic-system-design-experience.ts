import { WritingArticle } from '@/modules/writings/writings.types.ts';
import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';
import thumbnail from '@/assets/images/articles/writings/rethinking-backend-layers.jpg';
import thumbnailDark from '@/assets/images/articles/writings/rethinking-backend-layers.dark.jpg';

export const PRAGMATIC_SYSTEM_DESIGN_EXPERIENCE_BY_LOCALE: Record<
    'en' | 'id',
    WritingArticle | null
> = {
    en: {
        id: 'rethinking-backend-layers',
        backLink: {
            id: 'writing',
            href: '/writing',
            label: 'Back to Writing',
        },
        title: 'Rethinking Backend Layers: Transactions, Repositories, and Pragmatism',
        subtitle:
            'Why textbook Clean Architecture kind of sucks in production, and how I actually handle transactions and domains.',
        highlight:
            'Instead of blindly following architecture diagrams, my backend design rules evolved from debugging actual production disasters. Here is my pragmatic, real-world take on structuring database transactions, setting repository boundaries, and skipping useless boilerplate layers.',
        keywords:
            'Backend Architecture, Unit of Work, CQRS, Clean Architecture, Database Transactions, Domain-Driven Design',
        thumbnail: {
            light: thumbnail,
            dark: thumbnailDark,
        },
        date: '2026-08-27',
        sections: [
            {
                id: 'the-legacy-trap',
                label: 'The Legacy Mess',
                paragraphs: [
                    "Early on, I inherited a legacy codebase at my previous company that was just pure chaos. Business rules, raw SQL, and routing were all crammed into one massive controller function, and it wasn't even consistent across different modules. Honestly, it was a nightmare.",
                    'To clean it up, I did what everyone does: I added a Service layer for the logic and a Repository layer for the database. I felt pretty great about it at first. But once I hit real, multi-step database operations, I ran into a massive wall trying to figure out where database transactions actually belonged.',
                ],
            },
            {
                id: 'unit-of-actions',
                label: 'Transaction Trap',
                paragraphs: [
                    "At first, I just shoved DB transactions right inside the Service layer. Since that's where the business logic lives, it seemed to make sense—services control the business logic, right? I saw a lot of other people doing this too, so I thought it was the correct direction at first.",
                    "But that turned out to be a huge problem. Here's what happened: someone wrote an `UpdateStockService` that opened and committed its own transaction. Later on, we built a checkout flow and called it right next to a `DeductWalletService`. One day, the wallet deduction failed. But since the stock service had already committed its part... the stock didn't roll back. We ended up with missing inventory and fatal data inconsistencies.",
                    "Of course, we could theoretically solve this with 'proper' code—like creating separate functions just for transactions to make it clear what's happening inside. But in my experience, that actually just introduces unnecessary complexity and ruins the service's ability to act as a specific, isolated domain.",
                    "For example, if you have a service function that creates an order and you put a DB transaction inside it, that function is now locked. If you later need a flow that creates an order AND processes a payment in one single transaction, you are forced to write a completely new function to accommodate it. Sure, you could extract the core logic into transaction-less helper functions, but now you're just creating boilerplate and extra layers. If your service had 4 actions, this approach means you end up with 8. It's repetitive and adds way too much cognitive load.",
                    "So my solution is simple: I completely stripped database locks out of my services and started leaning into the 'Unit of Work' pattern. Now, my services are completely stateless. The inbound layer—like the controller—holds the transaction lock, runs the services, and rolls everything back if even a single step fails. The inbound layer essentially acts as the unit of work; it dictates exactly what the app is going to accomplish in one single run or request.",
                ],
            },
            {
                id: 'rethinking-repositories',
                label: 'Rethinking Repositories',
                paragraphs: [
                    "When it comes to repositories, my rule is practical: a repository handles one domain entity, or a tight cluster of tables that must act as a 'single package'.",
                    "Take `Order` and `Order_Details`, for example. A domain entity does not always map to just one table. If the system is relatively small and these tables fundamentally operate together as a unit, it makes perfect sense to treat them as a single entity under one unified repository.",
                    "However, as a system scales and table behaviors diverge, you have to adapt. If I need a background cron job to bulk-update 1,000 order statuses to 'Shipped', I don't want to load a massive unified `Order` entity that pulls unnecessary detail logic into memory. In that scenario, it is much more efficient to separate them and use a lightweight service that strictly touches the `orders` table. Keeping layers standardized is important, but true pragmatism is defining your domain units based on context, scale, and performance.",
                ],
            },
            {
                id: 'pragmatic-reads',
                label: 'Dedicated Read Models',
                paragraphs: [
                    "I am highly strict about write operations, but reading data requires a completely different mindset. Domain-Driven Design principles are primarily focused on maintaining strict boundaries and consistency when mutating state. Forcing those exact same boundaries onto read models is a very common pitfall.",
                    "Take an 'Invoice' feature, for instance. To generate one, you typically need combined data from `orders`, `order_details`, and `users`. If you rigidly apply write-domain boundaries, you might be tempted to fetch data through the Order Service, then the User Service, and manually stitch it all together. In production, this is a fantastic way to bloat memory and trigger horrific N+1 query issues.",
                    "Instead, I treat the 'Invoice' as its own dedicated read entity. I create an `InvoiceRepository` that executes a blazing fast, highly optimized SQL `JOIN` across those tables to return exactly what the frontend needs. By treating this joined data as a standalone entity—much like a database view—we keep our layers standardized and pattern-consistent. This approach naturally aligns with CQRS principles, delivering high performance without muddying the core write domains.",
                ],
            },
            {
                id: 'manager-layer-debate',
                label: 'Boilerplate Trap',
                paragraphs: [
                    "Lately, there's this weird trend where people feel the need to always add a 'Manager' or 'Use Case' layer right between the controllers and the services. I strongly disagree with making this the default setup for every single project.",
                    "If an endpoint is just doing a basic CRUD operation, forcing the flow through a Controller, then a Manager, then a Service, and finally a Repository is just writing boilerplate for the sake of feeling 'clean'. I let the 'Unit of Work' live right inside the HTTP controller.",
                    'I only ever introduce a Manager layer when things actually get complicated enough to justify it. For example, recently I built a checkout flow that was triggered by both a REST API endpoint AND an async RabbitMQ consumer. To avoid writing the exact same transaction locks and service calls twice, I pulled that flow into a `CheckoutManager`. Layers should exist to solve code duplication, not to make your codebase harder to read.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Unit of Work',
                definition:
                    'Managing database transactions at the highest level of the request (like the controller). This ensures your underlying services stay stateless, allowing you to chain them together without worrying about partial database commits if something fails.',
            },
            {
                term: 'Single Package Entity',
                definition:
                    'The idea that a repository should only handle a specific group of tables if they absolutely have to be updated together to keep the database valid. It stops your repositories from turning into messy, god-object files.',
            },
            {
                term: 'Pragmatic Layering',
                definition:
                    'My philosophy of keeping the app architecture flat by default (Controller -> Repository or Controller -> Service) and only adding extra abstraction layers when you actually have shared logic that desperately needs it.',
            },
        ],
        qnas: [
            {
                question: "Why shouldn't database transactions live inside the Service layer?",
                answer: "Because it locks your application flow to that single service. If you try to reuse that service alongside another one and the second service crashes, your first service won't roll back because it already committed its own internal transaction. Pushing the transaction lock up to the controller fixes this entirely.",
            },
            {
                question:
                    'Is it bad practice to skip the Manager/Application layer for simple CRUD?',
                answer: 'Not at all. Layering is supposed to solve complexity, not create it. If your use case is incredibly simple, building extra abstractions just to make your architecture diagram look nice is a massive waste of time. Only add that layer when your orchestration actually starts getting messy.',
            },
        ],
    },
    id: null,
};

export function usePragmaticSystemDesignExperienceArticleData() {
    const { locale } = useI18n();
    return computed<WritingArticle | null>(
        () =>
            PRAGMATIC_SYSTEM_DESIGN_EXPERIENCE_BY_LOCALE[locale.value] ??
            PRAGMATIC_SYSTEM_DESIGN_EXPERIENCE_BY_LOCALE.en,
    );
}

export default PRAGMATIC_SYSTEM_DESIGN_EXPERIENCE_BY_LOCALE.en;