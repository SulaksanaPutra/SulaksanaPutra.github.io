import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/commerce-aggregator.webp';

export const COMMERCE_AGGREGATOR_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "commerce-aggregator",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Commerce Aggregator",
        subtitle: "Conversational Commerce Middleware for WhatsApp-to-ERP Integration",
        hook: "Forcing B2B and B2C customers to navigate complex web portals or download dedicated apps introduces massive friction. I built Commerce Aggregator to meet users where they already are—on WhatsApp—using AI to parse unstructured chat messages into verified ERP orders, protected by strict deterministic validation and a seamless Human-in-the-Loop (HITL) fallback mechanism.",
        techStack: [
            "Golang",
            "Meta WhatsApp Business API",
            "Next.js / WebSockets",
            "PostgreSQL (pgvector / pg_trgm)",
            "Redis / Message Broker",
            "OpenAI / Claude LLMs"
        ],
        deploymentStatus: "Architecture & Prototyping",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "Conversational commerce is the future of customer interaction, but connecting a non-deterministic AI directly to a rigid enterprise ERP is a recipe for inventory disasters. If a customer texts, 'I need 5 pairs of red running shoes,' an LLM might confidently hallucinate a SKU that doesn't exist or misinterpret the quantity, silently corrupting the ERP database.",
                    "I designed Commerce Aggregator as the ultimate middleware bodyguard to solve this. By separating natural language processing from business logic, I restricted the AI to act solely as a semantic translator. The middleware strictly handles exact querying, pricing calculations, and inventory checks. If the AI fails or the request is too ambiguous, my architecture smoothly routes the conversation to a human support dashboard without losing conversational context."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Decoupled Extraction & Validation Pipeline",
                variant: "standard",
                paragraphs: [
                    "To ensure absolute data integrity and low latency, I structured the system around a cascading, asynchronous architecture."
                ],
                items: [
                    "*The Ingestion Gateway & Queue:* A highly concurrent Golang receiver catches Meta webhooks and instantly offloads them into a message broker (like Redis) to absorb traffic spikes and prevent Meta from dropping messages.",
                    "*The Extraction Engine (AI Layer):* A tiered LLM pipeline where simple requests are parsed by fast, cheap models (like GPT-4o-mini), and complex conversational contexts are dynamically escalated to heavier models.",
                    "*The Deterministic Validation Layer:* Custom Golang middleware queries PostgreSQL (using `pg_trgm` and `pgvector`) to map fuzzy extracted text to exact database SKUs and calculate dynamic customer pricing.",
                    "*The Human-in-the-Loop Dashboard:* A real-time Next.js interface powered by WebSockets, allowing call center agents to manually intervene when validation thresholds fail."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Middleware",
                challenges: [
                    {
                        id: "hallucinations-confidence",
                        challenge: [
                            "The Confidence Threshold: AI can be confidently wrong, and relying on an LLM to rate its own accuracy is dangerous. I needed a programmatic, bulletproof way to guarantee data integrity and know exactly when to trigger the manual fallback before sending hallucinated SKUs to the ERP."
                        ],
                        solution: {
                            paragraph: [
                                "I implemented a 'Triple-Layer Deterministic Validation Sandwich' surrounding the LLM."
                            ],
                            items: [
                                "Layer 1: Structural validation using JSON Schemas enforces strict data types at the Golang API level before the payload is even accepted.",
                                "Layer 2: Token Logprobs analysis measures the mathematical probability score of the AI's generated output. If the model's certainty drops below 95%, the system instantly triggers a manual review.",
                                "Layer 3: Vector distance thresholds ensure that if the user's requested item is too far from our database's closest match (e.g., asking for Nikes when we only sell Adidas), the middleware blocks the transaction and alerts a human agent."
                            ]
                        }
                    },
                    {
                        id: "concurrency-locking",
                        challenge: [
                            "Dashboard Race Conditions: With multiple human agents reviewing the fallback queue, there was a high risk of concurrent state mutation. I had to prevent two agents from opening the same ambiguous WhatsApp order, 'fixing' it simultaneously, and inadvertently creating duplicate orders in the ERP."
                        ],
                        solution: {
                            paragraph: [
                                "I engineered an Optimistic Locking mechanism combined with a state-aware WebSocket presence layer."
                            ],
                            items: [
                                "When Agent A clicks into an order, a WebSocket message fires, flagging the order in Redis with a 2-minute Time-To-Live (TTL).",
                                "Agent B's screen instantly updates, graying out the order and showing 'Locked by Agent A'.",
                                "Upon submission, the PostgreSQL database enforces a strict version check (`UPDATE... WHERE version = 1`). If Agent B somehow bypasses the UI and submits simultaneously, the query safely fails, preventing duplicate ERP entries."
                            ]
                        }
                    },
                    {
                        id: "pii-compliance",
                        challenge: [
                            "Data Privacy & PII Leakage: Customers inevitably send sensitive data like home addresses or ID cards via WhatsApp. Passing this raw text to a third-party LLM introduces massive compliance risks (such as GDPR or Indonesia's UU PDP), requiring a way to scrub data before it ever leaves the server environment."
                        ],
                        solution: {
                            paragraph: [
                                "I integrated a localized, deterministic PII Redaction Engine directly into the Golang ingestion gateway before any AI processing occurs."
                            ],
                            items: [
                                "Incoming text passes through a lightweight Named Entity Recognition (NER) and regex parser running entirely on the local servers.",
                                "Sensitive data is masked with structural tokens (e.g., swapping a real ID number for `[NATIONAL_ID_REDACTED]`).",
                                "The AI extracts the commerce intent safely, and the Golang middleware re-hydrates the tokens using a temporary in-memory session map before transmitting the finalized order to the internal ERP."
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
                    "Aggressive Media Deflection: WhatsApp allows users to send voice notes, images, and documents. While an LLM like GPT-4o could technically transcribe audio or OCR handwritten shopping lists, supporting this in the V1 architecture would skyrocket compute costs and drastically increase latency."
                ],
                items: [
                    "I chose to strictly limit input to text-only.",
                    "If the webhook payload type is not `text`, the Golang API instantly drops the media to save storage and automatically fires a polite rejection template: 'I am currently only trained to read text. Please type out your order.'",
                    "This trade-off sacrifices minor edge-case user convenience to guarantee system stability and predictable API margins."
                ]
            }
        ],
        glossary: [
            {
                term: "Human-in-the-Loop (HITL)",
                definition: "A system architecture where an AI handles the majority of processing, but is designed to pause and hand off control to a human operator when it encounters ambiguity or low-confidence data."
            },
            {
                term: "Token Logprobs",
                definition: "Logarithmic probabilities. A mathematical metric returned by modern LLM APIs indicating how confident the model is in each specific word (token) it generated."
            },
            {
                term: "Optimistic Locking",
                definition: "A database concurrency control method that checks if a record has been modified by another user since it was opened, rather than placing a restrictive lock on the record the entire time it is being viewed."
            }
        ]
    },
    id: null,
};

export default COMMERCE_AGGREGATOR_ARTICLE_BY_LOCALE;