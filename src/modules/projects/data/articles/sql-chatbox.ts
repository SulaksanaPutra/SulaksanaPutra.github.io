import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/sql-chatbox.webp';

export const APP_NL2SQL_GATEWAY_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "enterprise-nl2sql-gateway",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "SQL Chatbox",
        subtitle: "Secure, RAG-Driven Natural Language Database Analytics",
        hook: "Data democratization often fails at the query layer. Sending raw database rows to LLMs for analysis introduces massive token costs, latency, and unacceptable data privacy risks. This project introduces a secure paradigm: a retrieval-augmented Text-to-SQL gateway that translates natural language into highly optimized, read-only SQL, keeping sensitive data entirely within the database execution layer.",
        techStack: [
            "LangChain / LlamaIndex (Agentic Workflow)",
            "Vector Database (pgvector / Pinecone)",
            "Abstract Syntax Tree (AST) Parsers (sqlglot)",
            "Asynchronous Task Queues (Celery + Redis)"
        ],
        deploymentStatus: "Production-Ready Architecture",
        thumbnail: thumbnail,
        date: "2026-07-10",
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "Bridging the gap between non-technical business users and complex relational databases is a historic challenge. Traditional BI tools require high technical literacy, while naive AI wrappers attempt to ingest millions of rows into their context windows—an architectural anti-pattern that guarantees failure.",
                    "The vision for this gateway is to build a highly secure, context-aware translation layer. By wrapping the LLM in a strict Agentic workflow fueled by a Semantic Layer, the system can parse ambiguous human intent, retrieve only the relevant data dictionaries, and generate syntactically perfect SQL. The AI writes the code, but the trusted, mathematically accurate database executes it."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Decoupled Execution Architecture",
                variant: "standard",
                paragraphs: [
                    "To prevent runaway queries and ensure a seamless UI experience, the architecture strictly decouples query generation from database execution using asynchronous worker pipelines."
                ],
                items: [
                    "*The Semantic Vector Store:* A dedicated database storing embeddings of the client's table schemas, column descriptions, and predefined business metrics. This translates poorly named legacy columns (e.g., `usr_dt_3`) into AI-readable concepts.",
                    "*The Agentic Linter Pipeline:* An LLM node that generates the initial SQL, followed by a deterministic AST parser that intercepts the query. It verifies structural integrity and automatically blocks mutative commands before they ever touch the database engine.",
                    "*The Async Execution Queue:* A background worker system that receives the sanitized SQL, executes it against a Read Replica, and streams the JSON payload back to the client UI via WebSockets, preventing HTTP gateway timeouts on long-running analytical queries."
                ]
            },
            {
                id: 'the-challenges',
                label: 'The Challenges',
                challenges: [
                    {
                        id: "schema-exhaustion",
                        challenge: [
                            "Context Window Exhaustion: Enterprise databases often contain thousands of tables and poorly named columns. Injecting the entire schema into an LLM prompt maxes out token limits and causes severe hallucinations."
                        ],
                        solution: {
                            paragraph: [
                                "We implemented a Retrieval-Augmented Generation (RAG) pipeline to isolate the schema."
                            ],
                            items: [
                                "The system parses all tables, columns, and semantic definitions into vector embeddings.",
                                "When a user asks a question, a semantic search retrieves only the top 3-5 most relevant table structures.",
                                "The LLM receives a highly focused, micro-context window, exponentially increasing query accuracy while slashing token costs."
                            ]
                        }
                    },
                    {
                        id: "cartesian-bomb",
                        challenge: [
                            "The Cartesian Bomb: LLMs are prone to writing unoptimized queries. A `CROSS JOIN` without constraints on two massive tables creates an $O(N \\times M)$ complexity calculation, which can instantly pin the database CPU at 100%."
                        ],
                        solution: {
                            paragraph: [
                                "We engineered a deterministic pre-flight `EXPLAIN` circuit breaker."
                            ],
                            items: [
                                "Before execution, the background worker prepends `EXPLAIN (FORMAT JSON)` to the AI-generated SQL.",
                                "The database's query planner returns an estimated cost and total row count without actually executing the calculation.",
                                "If the estimated compute cost or processed row count exceeds a predefined safety threshold, the system aborts execution, preventing the Cartesian bomb from detonating in production."
                            ]
                        }
                    },
                    {
                        id: "ambiguous-logic",
                        challenge: [
                            "Silent Analytical Failures: If a user asks for 'best customers', the AI might guess the definition, resulting in a perfectly executed SQL query that returns completely inaccurate business data."
                        ],
                        solution: {
                            paragraph: [
                                "We enforced a strict 'Ask, Don't Guess' protocol anchored to a Semantic Layer."
                            ],
                            items: [
                                "Subjective terms (like 'active user' or 'churn') are explicitly hardcoded into the Semantic Layer as verifiable mathematical formulas.",
                                "If a user requests a metric that lacks a semantic definition, the agent is instructed to pause SQL generation and request clarification from the user.",
                                "The UI enforces an Explainable AI dual-output: displaying the data chart alongside a plain-English explanation of exactly how the data was filtered, ensuring complete analytical auditing."
                            ]
                        }
                    }
                ]
            },
            {
                id: "trade-offs",
                label: "Architectural Trade-Offs & Limitations",
                variant: "trade-off",
                paragraphs: [
                    "This architecture explicitly sacrifices complex predictive capabilities for guaranteed mathematical accuracy. Because we rely purely on the SQL engine for aggregation, this system cannot fulfill requests for machine learning forecasting, sentiment analysis, or complex anomaly detection that require Python-based data frames (like Pandas).",
                    "Furthermore, the defense-in-depth approach adds latency. Routing the query through a Vector DB, an LLM generation node, an AST linter, and an asynchronous worker queue means that even simple queries take a few seconds to resolve, requiring robust loading states in the frontend application."
                ],
                items: [
                    "Predictive Analytics & ML capabilities are sacrificed for SQL accuracy.",
                    "System latency is increased due to the multi-step security and validation pipeline."
                ]
            }
        ],
        glossary: [
            {
                term: "Text-to-SQL (NL2SQL)",
                definition: "The process of translating Natural Language (English) into structured query language using LLMs, enabling non-technical users to interact with databases."
            },
            {
                term: "Semantic Layer",
                definition: "A curated data dictionary that maps obscure database column names to easily understandable business concepts and defines the exact formulas for complex metrics."
            },
            {
                term: "Abstract Syntax Tree (AST)",
                definition: "A tree representation of the abstract syntactic structure of source code (in this case, SQL), allowing the backend to programmatically verify that the query is a safe SELECT statement."
            },
            {
                term: "Read Replica",
                definition: "A synchronized copy of a master database that allows read-only queries, ensuring that heavy analytical workloads do not degrade performance for the core application."
            }
        ]
    },
    id: null,
};

export default APP_NL2SQL_GATEWAY_ARTICLE_BY_LOCALE;