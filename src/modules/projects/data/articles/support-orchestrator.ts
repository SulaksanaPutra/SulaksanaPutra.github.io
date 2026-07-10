import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/telecom-orchestrator.webp';

export const TELECOM_ORCHESTRATOR_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "telecom-support-orchestrator",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Telecom Support Orchestrator",
        subtitle: "AI-Driven Triage, Sentiment Analysis, and Automated Dispatch Engine",
        hook: "When a telecom network degrades, support queues don't just grow—they explode. I designed this Support Orchestrator to instantly triage massive ticket spikes, leveraging Laravel Jobs to asynchronously fire payloads at a hot-loaded Python NLP microservice, ensuring high-value enterprise clients never get lost in the noise.",
        techStack: [
            "Laravel (PHP)",
            "FastAPI (Python)",
            "DistilBERT (NLP)",
            "Redis (Queue & State)",
            "PostgreSQL"
        ],
        deploymentStatus: "In Production",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "In local telecom operations, manual ticket triage is a major bottleneck. During a localized outage, human agents are easily overwhelmed by thousands of basic consumer complaints, which often buries critical, high-value enterprise issues. SLA breaches during these spikes were costing us revenue and client trust.",
                    "I built the Support Orchestrator to act as an intelligent, automated frontline dispatcher. Instead of relying purely on fragile 'if-this-then-that' rules or unpredictable machine learning, I engineered a hybrid system. It reads the incoming ticket, understands the sentiment and context using a custom-trained NLP model, evaluates the customer's account tier, and assigns a total priority score before instantly routing it to the most capable, available agent."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Decoupled HTTP-Queue Architecture",
                variant: "standard",
                paragraphs: [
                    "Machine learning inference is computationally heavy, requiring large model weights to stay hot in memory. To shield our primary web servers, I kept all heavy compute isolated within a Python microservice, relying on Laravel's native queuing system to manage the lifecycle asynchronously."
                ],
                items: [
                    "*The Laravel Layer (Ingestion & Sanitization):* The main PHP application intercepts incoming tickets. It instantly runs a local pre-processing pipeline to scrub text and map regional jargon before dispatching a standard Laravel Job to a Redis-backed queue. The user gets a sub-second response, keeping the UI fast.",
                    "*The Laravel Worker (The Bridge):* Background PHP workers (`php artisan queue:work`) pick up the jobs asynchronously and use Laravel's HTTP client to fire a POST request to our internal AI endpoint.",
                    "*The Python Service (FastAPI):* A standalone Python service built with FastAPI. It boots up once, loads our fine-tuned DistilBERT model into memory permanently, and stays 'hot.' It exposes a single lightweight API endpoint that acts as a plug-and-play drop-in replacement for external LLMs, returning pure structured JSON labels in milliseconds.",
                    "*The State Manager (Redis Cache):* To prevent database deadlocks at scale, Laravel evaluates real-time agent availability and skill tags via Redis before updating the final ticket routing.",
                    "*The Telemetry Loop (PostgreSQL):* Human agent manual corrections in the UI are event-sourced directly into a `gold_training_data` table, automating the collection of clean datasets for future Python model retraining cycles."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Orchestrator",
                challenges: [
                    {
                        id: "localization-and-jargon",
                        challenge: [
                            "The Localization & Jargon Trap: Telecom data is incredibly messy. It is packed with regional slang, acronyms, and localized abbreviations that off-the-shelf NLP models completely fail to understand."
                        ],
                        solution: {
                            paragraph: [
                                "I bypassed this by building the Pre-processing Normalization Pipeline directly into the Laravel application layer, keeping the ML model logic incredibly lean."
                            ],
                            items: [
                                "Before the ticket payload is ever queued or sent to the AI, Laravel maps known local jargon (e.g., matching regional phrases for 'dead connection' to a standardized 'no_signal' token).",
                                "Because the normalization and data distillation loops happen at the Laravel app level, the Python microservice functions purely as an input/output engine—receiving clean text and returning categories.",
                                "This decoupling made bootstrapping seamless: I initially pointed Laravel's HTTP client to OpenAI's API to build our data baseline. Once our agents corrected and validated enough samples, I seamlessly redirected the Laravel HTTP calls to our local Python FastAPI service without modifying any core business logic."
                            ]
                        }
                    },
                    {
                        id: "heuristics-vs-ml",
                        challenge: [
                            "Heuristics vs. ML Conflicts: We needed to prioritize Enterprise accounts, but hardcoded overrides create edge cases. If a high-value account sends a positive, low-priority ticket (e.g., 'Thanks for the quick setup!'), forcing a 'Critical' label wastes senior agent time."
                        ],
                        solution: {
                            paragraph: [
                                "I designed a Weighted Scoring Matrix inside Laravel to organically resolve conflicts between hard business rules and fuzzy AI sentiment coming back from the Python service."
                            ],
                            items: [
                                "The system starts with a baseline score based on the account tier queried from the database (e.g., Enterprise = +50 points).",
                                "The ML categorization adds contextual weight (e.g., 'Total Outage' = +40 points).",
                                "The ML sentiment analysis acts as a modifier (e.g., 'Highly Positive' = -30 points, 'Frustrated' = +20 points).",
                                "The orchestrator calculates the final dynamic score (50 + 0 - 30 = 20) and securely routes the 'thank you' ticket to a standard queue, elegantly avoiding a false alarm."
                            ]
                        }
                    },
                    {
                        id: "the-outage-spike",
                        challenge: [
                            "The Outage Spike (DDoS by Customer): In telecom, a downed cell tower doesn't generate 10 tickets; it generates 10,000 in five minutes. This can easily crash inference endpoints and exhaust agent capacity."
                        ],
                        solution: {
                            paragraph: [
                                "To protect the platform, I implemented Geo-Clustering Deduplication and strict Circuit Breakers between Laravel and Python."
                            ],
                            items: [
                                "When a sudden volume spike hits the queue, Laravel groups incoming tickets by Cell Tower ID and ZIP code before firing the API requests.",
                                "If 50 tickets report the same issue in the same sector within 15 minutes, they are clustered into a single 'Master Incident' ticket. Resolving the Master auto-resolves the duplicates.",
                                "If the Python inference latency exceeds 2 seconds during a massive spike, a Circuit Breaker trips within the Laravel HTTP layer. It temporarily bypasses the Python microservice entirely and routes all tickets to a generalized triage queue to ensure 100% platform uptime."
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
                    "The Zero-Shot Penalty: By transitioning away from a massive 3rd-party LLM to our own highly-optimized DistilBERT model running on a Python microservice, we achieved sub-50ms inference times and zero API costs. However, we traded away 'zero-shot' reasoning.",
                    "Our custom model only knows what it has been explicitly trained on. If the business rolls out a brand new 5G hardware product tomorrow, the NLP model will misclassify those specific tickets until we update the training set."
                ],
                items: [
                    "To mitigate this, I implemented Confidence Thresholds.",
                    "If the Python model outputs a prediction with less than 75% confidence, Laravel flags the ticket as 'Uncertain' and routes it for mandatory manual review.",
                    "These low-confidence tickets trigger alerts for the ML engineering team, serving as an early warning system for Model Drift and signaling when it's time to initiate a retraining pipeline."
                ]
            }
        ],
        glossary: [
            {
                term: "FastAPI",
                definition: "A modern, fast (high-performance), web framework for building APIs with Python. Natively async, it is the industry standard for serving machine learning models with minimal overhead."
            },
            {
                term: "Data Distillation",
                definition: "The process of using a massive, computationally expensive AI (like an LLM) to generate labels and training data, which is then used to train a much smaller, faster, and cheaper local AI model."
            },
            {
                term: "Circuit Breaker Pattern",
                definition: "A design pattern used to detect failures and prevent them from constantly recurring. If the Python service slows down, Laravel temporarily stops sending it traffic and falls back to a safe default."
            }
        ]
    },
    id: null,
};

export default TELECOM_ORCHESTRATOR_ARTICLE_BY_LOCALE;