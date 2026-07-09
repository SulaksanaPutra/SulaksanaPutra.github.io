import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/offline-first-pos-architecture.webp';

export const OFFLINE_FIRST_POS_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: 'offline-first-pos-architecture',
        backLink: {
            id: 'back-to-projects',
            label: 'Back to Projects',
            href: '/projects',
        },
        title: 'Building a Bulletproof Offline-First POS System',
        subtitle:
            'How I engineered a web app to survive power cuts, internet drops, and data tampering.',
        hook: "Internet outages shouldn't stop commerce. Here is how I designed a Progressive Web App (PWA) Point-of-Sale that operates flawlessly offline, secures data cryptographically in the browser, and seamlessly syncs ledgers when the connection returns.",
        techStack: [
            'React',
            'TypeScript',
            'Vite PWA',
            'RxDB',
            'IndexedDB',
            'Supabase',
            'Web Crypto API',
        ],
        deploymentStatus: 'Production-Ready Architecture',
        thumbnail: thumbnail,
        date: '2026-07-09',
        sections: [
            {
                id: 'the-paradigm-shift',
                label: 'The Background',
                variant: 'standard',
                paragraphs: [
                    'Traditional cloud POS systems fail the moment the router blinks. In a fast-paced retail or F&B environment, a 30-second hang while waiting for a server response means lost revenue and frustrated customers.',
                    "To solve this, I inverted the traditional client-server model. The PWA's local IndexedDB acts as the primary, authoritative database for the cashier. The central Supabase server acts as a background sync engine. Cashiers read, write, and complete transactions entirely on the edge, ensuring sub-second response times regardless of network conditions.",
                ],
            },
            {
                id: 'the-challenges',
                label: 'The Challenges',
                challenges: [
                    {
                        id: 'data-integrity-sync',
                        challenge: [
                            "When multiple offline terminals come back online simultaneously, state-based syncing (sending final numbers) leads to catastrophic ledger overwrites. If Terminal A and Terminal B both sell apples offline, whoever syncs last overwrites the other's math.",
                        ],
                        solution: {
                            paragraph: [
                                'I mitigated this by implementing an Event Sourcing model paired with negative-inventory edge trust.',
                            ],
                            items: [
                                "Instead of syncing final inventory states, terminals sync immutable logs of actions (e.g., 'Terminal 1 subtracted 2 Apples').",
                                'The central server processes these events sequentially upon connection, ensuring mathematically perfect ledgers.',
                                "I utilize a 'Trust the Edge' physical resolution: If an offline sale pushes server inventory below zero, the transaction is accepted, but an anomaly alert is fired to the owner's real-time reporting dashboard.",
                            ],
                        },
                    },
                    {
                        id: 'browser-cryptography',
                        challenge: [
                            'Storing sensitive transaction data locally exposes it to physical tampering.',
                        ],
                        solution: {
                            paragraph: [
                                'Because web applications cannot access OS-level secure hardware enclaves, I built a robust cryptographic layer natively in the browser.',
                            ],
                            items: [
                                'Cashier PINs are mathematically stretched using the Web Crypto API (PBKDF2) and a unique device salt to derive an AES-256 encryption key.',
                                'To prevent RAM scraping and unauthorized access, the derived key is kept strictly in memory and wiped immediately upon tab closure or power loss.',
                                'Every transaction generates a cryptographic hash of the previous transaction, creating a tamper-evident chain.',
                                'During the offline-to-online sync, an HMAC signature is generated. If a malicious actor alters a single byte of the local IndexedDB, the server rejects the batch.',
                            ],
                        },
                    },
                    {
                        id: 'combating-liefi',
                        challenge: [
                            "'Lie-Fi'—when a device is connected to a router with no active internet—is worse than being completely offline. The browser's native navigator.onLine property reports true, causing API calls to hang indefinitely.",
                        ],
                        solution: {
                            paragraph: [
                                'I implemented a strict client-side Circuit Breaker pattern. It uses active background heartbeats and aggressive 3-second abort timeouts to detect latency. When the breaker trips open, the UI instantly routes all actions to the local queue without blocking the cashier.',
                            ],
                            codeBlock: {
                                language: 'typescript',
                                code: `class SyncCircuitBreaker {\n  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';\n  failureCount = 0;\n  threshold = 2;\n\n  async executeSync(payload: SyncPayload) {\n    if (this.state === 'OPEN') return this.queueLocally(payload);\n\n    try {\n      const controller = new AbortController();\n      const timeoutId = setTimeout(() => controller.abort(), 3000);\n      \n      const response = await fetch('/api/sync', { \n        method: 'POST', \n        body: JSON.stringify(payload),\n        signal: controller.signal \n      });\n      \n      clearTimeout(timeoutId);\n      this.resetBreaker();\n      return response;\n      \n    } catch (error) {\n      this.failureCount++;\n      if (this.failureCount >= this.threshold) this.tripBreaker();\n      return this.queueLocally(payload);\n    }\n  }\n}`,
                            },
                        },
                    },
                ],
            },
            {
                id: 'schema-migrations',
                label: 'The Schema Update Trapdoor',
                variant: 'trade-off',
                paragraphs: [
                    'The largest operational risk in offline-first systems is deploying software updates. If the backend API requires a new field, but a tablet has been offline for a week running the old code, its eventual sync attempt will fail, stranding the data.',
                    'To mitigate this, backend schema changes are strictly additive (optional fields only). Furthermore, when the PWA service worker eventually pulls the new client code, RxDB executes a client-side database migration script to reshape the stuck local data before attempting to sync with the new API.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Idempotency',
                definition:
                    'A property of specific operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application. Crucial for preventing double-charges on spotty networks.',
            },
            {
                term: 'Event Sourcing',
                definition:
                    'An architectural pattern where changes to application state are stored as a sequence of events rather than just saving the final current state.',
            },
            {
                term: 'Lie-Fi',
                definition:
                    'A state where a device appears to have a strong Wi-Fi or cellular connection, but data packets are consistently dropping or experiencing extreme latency.',
            },
            {
                term: 'HMAC',
                definition:
                    'Hash-based Message Authentication Code. A specific type of message authentication code involving a cryptographic hash function and a secret cryptographic key, used to verify both data integrity and authenticity.',
            },
            {
                term: 'PBKDF2',
                definition:
                    'Password-Based Key Derivation Function 2. A cryptographic standard used to securely derive a heavy encryption key from a relatively simple password or PIN.',
            },
        ],
    },
    id: null,
};

export default OFFLINE_FIRST_POS_ARTICLE_BY_LOCALE.en;
