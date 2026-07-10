import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/core-event-stream.webp';

export const CORE_EVENT_STREAM_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "core-event-stream",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Core Event Stream (CES)",
        subtitle: "A Resilient Webhook Management Gateway and Integration Ledger",
        hook: "When integrating multiple mini-apps and 3rd-party APIs, relying on synchronous HTTP calls is a recipe for cascading failures. CES acts as a highly resilient Integration Platform as a Service (iPaaS) that safely catches, queues, and guarantees the delivery of webhooks using a Fire-and-Forget architecture.",
        techStack: [
            "Golang",
            "Redpanda",
            "ClickHouse",
            "TypeScript",
            "S3/Glacier (Tiered Storage)"
        ],
        deploymentStatus: "Architecture & Prototyping",
        thumbnail: thumbnail,
        date: "2026-07-10",
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "In my previous projects developing multiple mini-apps, integrating them via external 3rd-party webhooks (like Stripe or Shopify) frequently led to lost data and synchronous bottlenecks. If a payment webhook hits a downstream app that is temporarily offline, or if a traffic spike overwhelms the database, that critical data is lost forever.",
                    "That is why I developed Core Event Stream (CES). Instead of individual apps handling their own fragile API integrations, CES sits in the middle as a centralized iPaaS. It acts as a shock absorber that catches incoming webhooks, logs them to an undeniable ledger, handles intelligent retries, and provides a single pane of glass for tracing the exact lifecycle of any HTTP integration."
                ]
            },
            {
                id: "architecture-stack",
                label: "The 'Dumb Pipe, Smart Gateway' Architecture",
                variant: "standard",
                paragraphs: [
                    "To process massive webhook spikes without overwhelming downstream databases, CES decouples the ingestion layer from the query layer using Golang, Redpanda, and ClickHouse."
                ],
                items: [
                    "*The Ingestion Gateway (Golang):* A blazingly fast public HTTP endpoint that receives incoming webhooks, authenticates them, and instantly offloads them.",
                    "*The Queue (Redpanda):* A disk-backed, durable message broker. Unlike Redis (which can lose data in RAM during a crash), Redpanda writes every webhook to disk instantly, acting as an immutable holding pen.",
                    "*The Dispatcher (Golang Workers):* Background threads read from Redpanda at a controlled pace, executing the actual HTTP POST to the destination app and handling exponential backoff if the app is down.",
                    "*The Observability Layer (ClickHouse):* A column-oriented OLAP database that indexes every attempt, success, failure, and raw payload for sub-second incident tracing."
                ]
            },
            {
                id: 'the-challenges',
                label: 'The Challenges',
                challenges: [
                    {
                        id: "fire-and-forget",
                        challenge: [
                            "Synchronous Cascading Failures: If CES waits for the downstream mini-app to process a webhook before replying to the 3rd-party sender, a slow downstream app will cause the sender to timeout and retry, creating a massive DDoS effect."
                        ],
                        solution: {
                            paragraph: [
                                "We implemented the 'Fire-and-Forget' (Accept and Delegate) pattern using the Golang Gateway."
                            ],
                            items: [
                                "When a webhook hits the ingress endpoint, the Golang API drops the raw payload into the Redpanda queue.",
                                "The gateway immediately severs the connection and returns a `202 Accepted` status to the sender within 2 to 5 milliseconds.",
                                "All heavy lifting (routing, retries, and database indexing) happens completely asynchronously, shielding the platform from upstream timeouts."
                            ]
                        }
                    },
                    {
                        id: "unstructured-webhooks",
                        challenge: [
                            "Unpredictable Payload Schemas: 3rd-party services log webhooks in a thousand different JSON formats. Forcing a rigid database schema on unpredictable data breaks ingestion, but storing raw text ruins search speeds."
                        ],
                        solution: {
                            paragraph: [
                                "CES uses a Schema-on-Write Dynamic Normalization engine powered by ClickHouse."
                            ],
                            items: [
                                "An 'envelope' schema strictly enforces routing metadata (Timestamp, Target URL, Status Code).",
                                "The chaotic JSON payload is pushed into a dynamic `attributes` map.",
                                "ClickHouse dynamically extracts, flattens, and indexes these dynamic keys on the fly, allowing sub-second querying of deeply nested third-party webhook fields without ever running a database migration."
                            ]
                        }
                    },
                    {
                        id: "gdpr-immutability",
                        challenge: [
                            "The Data Deletion Paradox: How do you handle GDPR's 'Right to Be Forgotten' when your architecture relies on an immutable, undeniable, append-only log that forbids data deletion?"
                        ],
                        solution: {
                            paragraph: [
                                "We implement Crypto-Shredding at the ingestion layer. Personally Identifiable Information (PII) is never stored in plain text."
                            ],
                            items: [
                                "When a webhook containing PII arrives, the payload is encrypted using a unique, symmetric key specific to that tenant/user (managed in a separate KMS).",
                                "The immutable log stores only the ciphertext.",
                                "To execute a GDPR deletion request, we simply delete the user's specific key from the KMS. The cryptographic chain remains mathematically unbroken, but the historical data is permanently rendered into undecipherable static."
                            ]
                        }
                    }
                ]
            },
            // Append this object to the `sections` array in CORE_EVENT_STREAM_ARTICLE_BY_LOCALE.en

            {
                id: "trade-offs",
                label: "Architectural Trade-Offs & Vulnerabilities",
                variant: "trade-off",
                paragraphs: [
                    "The Asynchronous Blindspot: Because the ingress gateway immediately returns a `202 Accepted` to the sender, the sender loses synchronous feedback. If the downstream destination permanently rejects the webhook (e.g., a 400 Bad Request), the sender is unaware.",
                    "We compensate for the loss of synchronous feedback by implementing an asynchronous notification engine."

                ],
                items: [
                    "Users can configure 'Reverse Webhooks' in CES.",
                    "If a webhook exhausts its exponential backoff retry budget in the dispatch workers, CES fires an outbound alert back to the original sender's system.",
                    "Users can also query the ClickHouse-backed dashboard for real-time delivery status of any payload."
                ]
            }
        ],
        glossary: [
            {
                term: "iPaaS",
                definition: "Integration Platform as a Service. A centralized platform that connects otherwise disjointed systems to deliver a unified solution to customers, acting as a middleware gateway."
            },
            {
                term: "Fire-and-Forget",
                definition: "An architectural pattern where a server receives an incoming HTTP request, immediately offloads it to a background queue, and responds 'Success' to the client without waiting for the actual processing to finish."
            },
            {
                term: "Crypto-Shredding",
                definition: "The practice of encrypting sensitive data before storing it, and 'deleting' the data by intentionally destroying the encryption key. Used to satisfy GDPR in append-only systems."
            }
        ]
    },
    id: null, // Indonesian translation to be added later
};

export default CORE_EVENT_STREAM_ARTICLE_BY_LOCALE;