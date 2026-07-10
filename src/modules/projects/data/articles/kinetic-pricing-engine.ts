import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/kinetic-pricing-engine.webp';

export const KINETIC_PRICING_ENGINE_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "kinetic-pricing-engine",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Kinetic Pricing Engine",
        subtitle: "An Event-Driven, Human-in-the-Loop Revenue Management Feature",
        hook: "Managing daily rate adjustments in hospitality often traps Revenue Operations (RevOps) teams between two extremes: bleeding revenue due to slow manual updates, or risking disastrous rate dumps through unmonitored automation. To solve this within our booking platform, I built the Kinetic Pricing Engine—an integrated feature that calculates micro-batched price adjustments using a transparent heuristic matrix, while maintaining strict human-in-the-loop control through a seamless web and mobile approval system.",
        techStack: [
            "Laravel (PHP)",
            "React Native (Mobile Companion)",
            "Redis (In-Memory State & Queues)",
            "TimescaleDB (Event Sourcing)",
            "PostgreSQL",
            "TypeScript"
        ],
        deploymentStatus: "In Production",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "In the fast-paced hospitality market, a sudden demand spike or a competitor's flash sale requires an immediate pricing response. However, when talking with our clients, I learned that RevOps managers were deeply hesitant to adopt fully automated pricing systems that push rates to external channels without human oversight. They needed the massive processing power of software to monitor the market, but they demanded the safety of deterministic logic.",
                    "I designed Kinetic to act as the pricing brain of our existing Laravel-based platform. I built it around a highly optimized, multi-layered heuristic matrix powered by Laravel's robust queue system. It ingests massive amounts of real-time data—occupancy shifts, competitor rate changes, and booking velocity—and generates precise recommendations that a human operator can definitively trace, understand, and approve before they go live."
                ]
            },
            {
                id: "heuristic-architecture",
                label: "The Multi-Layered Weight Matrix",
                variant: "standard",
                paragraphs: [
                    "Rather than hardcoding a massive, unmanageable block of if/then spaghetti code into our backend, I structured the pricing rules into decoupled, weighted layers. Each layer evaluates the current state of the market and generates a pricing modifier."
                ],
                items: [
                    "*The Base Engine:* Establishes the floor rate based on historical seasonality.",
                    "*Layer 1 (Occupancy Scarcity):* Triggers percentage increases as physical room inventory drops.",
                    "*Layer 2 (Booking Velocity):* Monitors high-frequency spikes (e.g., 10 bookings in an hour) to detect viral demand before occupancy is fully depleted.",
                    "*Layer 3 (Competitor Index):* Adjusts rates to maintain a specific parity delta against local rival properties.",
                    "*The Guardrail Layer:* A strict, final boundary check I added to ensure the aggregated recommendation never falls below a hard minimum or exceeds a ceiling rate."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Pricing Engine",
                challenges: [
                    {
                        id: "data-decay-approvals",
                        challenge: [
                            "The Delayed Approval Problem: If a massive booking velocity spike triggers a +15% rate hike recommendation at 2:00 PM, but the human manager doesn't click 'Approve' until 4:30 PM, the underlying market conditions have completely changed. Pushing that outdated rate could stall their evening sales."
                        ],
                        solution: {
                            paragraph: [
                                "I engineered a Time-to-Live (TTL) and Just-in-Time (JIT) validation system for all recommendations."
                            ],
                            items: [
                                "Every pricing recommendation is bound by an expiration countdown. Highly volatile triggers (like velocity) expire in 15-30 minutes.",
                                "When a manager clicks 'Approve' in the UI, the system intercepts the command and performs a micro-check against the live Redis state.",
                                "If the market conditions have drifted beyond a 5% threshold since the recommendation was generated, the engine rejects the approval and forces a real-time recalculation."
                            ]
                        }
                    },
                    {
                        id: "immutable-audit-trail",
                        challenge: [
                            "The Auditability Requirement: When a hotel owner audits the system weeks later and demands to know why the engine recommended a $500 rate on a random Tuesday, our live PostgreSQL databases couldn't answer because their state is constantly overwritten."
                        ],
                        solution: {
                            paragraph: [
                                "I implemented Event Sourcing using TimescaleDB to create an undeniable 'receipt' for every single calculation."
                            ],
                            items: [
                                "When a recommendation is generated, the engine writes an immutable JSON snapshot to the time-series database.",
                                "This payload captures the exact microsecond state of the world: current occupancy, 1-hour booking velocity, competitor averages, and exactly which heuristic rules fired.",
                                "This allows RevOps managers to pull up any historical rate change in our app and see the definitive mathematical proof of why the engine made that specific decision."
                            ]
                        }
                    },
                    {
                        id: "data-acquisition-limits",
                        challenge: [
                            "API Constraints and IP Bans: Constant polling of external competitor OTAs results in immediate IP bans. Simultaneously, legacy Property Management Systems (PMS) impose draconian API rate limits, crashing if we queried them continuously for occupancy updates."
                        ],
                        solution: {
                            paragraph: [
                                "I built Kinetic to rely entirely on a passive 'Shadow Ledger' fed by external webhooks and strategic micro-batching."
                            ],
                            items: [
                                "Competitor rate scraping is offloaded to specialized B2B Rate Shopper APIs, querying at strategic micro-batched intervals via scheduled Laravel jobs.",
                                "Instead of polling the PMS, Kinetic ingests real-time webhooks from our Channel Manager integration every time a reservation occurs.",
                                "These webhooks instantly update a highly performant Redis cache. The pricing engine calculates its complex math exclusively against this internal memory, completely shielding legacy upstream APIs from traffic."
                            ]
                        }
                    }
                ]
            },
            {
                id: "trade-offs",
                label: "Architectural Trade-Offs",
                variant: "trade-off",
                paragraphs: [
                    "The Human Bottleneck: By strictly enforcing a Human-in-the-Loop constraint at the core of the feature, the platform inherently sacrifices the ability to capture micro-revenue opportunities during off-hours or sudden, explosive demand spikes.",
                    "If a viral event causes a massive run on inventory while the manager is away from their desk, the hotel bleeds revenue while the engine waits for a manual approval."
                ],
                items: [
                    "To mitigate the accessibility block, I developed a companion Mobile App with real-time push notifications. Managers receive high-priority alerts (e.g., 'Velocity Spike: +15% Rec') directly to their phones and can approve or reject them with a single tap, completely untethering them from their desks.",
                    "As a secondary fail-safe for deep off-hours, users can configure 'Bleeding Edge Auto-Publish' protocols.",
                    "Managers can define maximum allowed variance thresholds for sleep hours (e.g., 'Auto-approve any rate increase up to 20%, but hold any rate decreases for manual review')."
                ]
            }
        ],
        glossary: [
            {
                term: "Human-in-the-loop (HITL)",
                definition: "A system architecture where automated processes analyze data and generate decisions, but require human validation and approval before execution."
            },
            {
                term: "Event Sourcing",
                definition: "An architectural pattern in which all changes to application state are stored as a sequence of immutable events, allowing exact historical reconstruction and auditing."
            },
            {
                term: "Data Decay",
                definition: "The phenomenon where time-sensitive variables (such as booking velocity or live competitor pricing) lose their validity and operational relevance the longer they wait to be acted upon."
            }
        ]
    },
    id: null,
};

export default KINETIC_PRICING_ENGINE_ARTICLE_BY_LOCALE;