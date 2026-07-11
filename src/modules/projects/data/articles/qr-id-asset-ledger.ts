import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/qr-id-asset-ledger.webp';

export const QR_ID_ASSET_LEDGER_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "qr-id-asset-ledger",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "QR-ID Asset Ledger",
        subtitle: "Bridging Physical Engineering Audits with Financial Depreciation Modeling",
        hook: "Ghost assets and zombie assets cost enterprise companies millions in inaccurate tax reporting and insurance premiums. I built QR-ID to close the gap between what engineers see on the factory floor and what accountants see on the balance sheet, utilizing a dual-sided offline-first app and an immutable event-driven depreciation engine.",
        techStack: [
            "Node.js (Express)",
            "Flutter",
            "PostgreSQL",
            "Redis & BullMQ",
            "SQLite (Drift)"
        ],
        deploymentStatus: "In Production",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "In enterprise environments, I noticed a massive disconnect between the engineering teams managing physical hardware and the corporate finance teams managing the balance sheet. If a server rack was damaged or upgraded, that physical reality rarely made it to the financial depreciation schedules in real-time.",
                    "I designed QR-ID Asset Ledger to solve this by creating a unified system: a lightning-fast mobile scanner for field auditors, paired with a robust financial calculation engine that dynamically recalculates non-linear depreciation based on verified physical events."
                ]
            },
            {
                id: "architecture-stack",
                label: "The 'Separation of Duties' Architecture",
                variant: "standard",
                paragraphs: [
                    "To satisfy strict corporate compliance (like SOX), I could not allow field auditors to automatically overwrite financial data. The architecture had to physically and logically separate the engineering audit from the financial write-off."
                ],
                items: [
                    "*The Field Scanner (Flutter):* A mobile app deployed to iOS and Android, optimized for rapid QR scanning, hardware-level encryption, and offline caching.",
                    "*The Approval Gate (Node.js/Express):* An RBAC-enforced middleware layer. When an asset's status changes, it drops into a 'Discrepancy Inbox'. A user with the `finance_admin` role must explicitly approve the change.",
                    "*The Math Engine (Worker Nodes):* Once approved, background processes recalculate the remaining depreciation schedule using high-precision math libraries, ensuring the main API thread remains unblocked.",
                    "*The Ledger (PostgreSQL):* An ACID-compliant database acting as the undisputed source of truth for all historical events and financial states."
                ]
            },
            {
                id: "non-linear-depreciation",
                label: "The Math: Non-Linear Depreciation Modeling",
                variant: "standard",
                paragraphs: [
                    "To make the engine truly valuable for corporate tax reporting, it could not simply rely on straight-line math. Enterprises prefer non-linear depreciation (front-loading the expense) to maximize early tax write-offs.",
                    "I implemented the Double Declining Balance (DDB) mathematical model within the Node.js worker nodes. The algorithm continuously monitors the asset's remaining useful life and applies a 200% acceleration rate against the current book value. A strict validation layer ensures the mathematical engine never depreciates an asset below its defined salvage value.",
                    "The core calculation utilized in the engine is: ", "$\\text{Depreciation Expense} = \\left( \\frac{2}{\\text{Useful Life}} \\right) \\times \\text{Beginning Book Value}$"
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Ledger",
                challenges: [
                    {
                        id: "the-basement-problem",
                        challenge: [
                            "The Connectivity Challenge: Engineering assets are often located in factory basements or remote server rooms with zero WiFi or cell service. An auditor cannot wait for a loading spinner while scanning 500 items."
                        ],
                        solution: {
                            paragraph: [
                                "I engineered an 'Offline-First' architecture in the Flutter app using Drift (SQLite) and background sync queues."
                            ],
                            items: [
                                "Scans are instantly written to a local `PendingActions` SQLite table, assigning a client-generated UUID (Idempotency Key) to every action.",
                                "A background sync listener detects when network connectivity is restored and pushes the queued payload to the Express backend.",
                                "The Express server inspects the Idempotency Key, guaranteeing that even if a network blip causes a retry, the backend processes the scan exactly once, preventing duplicate ledger entries."
                            ]
                        }
                    },
                    {
                        id: "optimistic-locking",
                        challenge: [
                            "The Concurrency Challenge: If Auditor A scans a generator and marks it 'Damaged', and Auditor B scans the exact same generator ten seconds later and marks it 'In Service', a standard 'last-write-wins' database update will silently destroy critical audit data."
                        ],
                        solution: {
                            paragraph: [
                                "I implemented Optimistic Concurrency Control at the PostgreSQL layer."
                            ],
                            items: [
                                "Every asset row in the database has a strict `version` integer column.",
                                "When an update is dispatched, the SQL query explicitly requires the version to match the state the auditor originally saw (e.g., `UPDATE ... WHERE id = X AND version = 4`).",
                                "If Auditor A already updated the row, the version becomes 5. Auditor B's query will affect 0 rows, triggering the backend to throw a `409 Conflict` error and forcing Auditor B's app to fetch the latest state."
                            ]
                        }
                    },
                    {
                        id: "floating-point-math",
                        challenge: [
                            "The Scalability & Precision Challenge: JavaScript inherently uses Double Precision Floating Point math, where $100.01 - $100.00 might equal $0.0000000000001. Furthermore, running non-linear depreciation recalculations on 500,000 assets at month-end will freeze a Node.js single thread."
                        ],
                        solution: {
                            paragraph: [
                                "I decoupled HTTP traffic from math processing using BullMQ and enforced strict precision libraries."
                            ],
                            items: [
                                "All financial calculations strictly utilize `decimal.js` to ensure absolute mathematical precision required for tax auditing.",
                                "When finance triggers a month-end run, Express immediately responds with `202 Accepted` and pushes a job payload to a Redis queue.",
                                "Dedicated background worker processes pull these jobs, execute the heavy floating-point math sequentially, and write the updates to PostgreSQL without ever blocking the main user-facing API."
                            ]
                        }
                    },
                    {
                        id: "immutability",
                        challenge: [
                            "The Immutability Challenge: In financial software, you cannot use destructive `UPDATE` queries to overwrite an asset's past. If the IRS audits a depreciation curve from two years ago, the system must prove exactly how that number was reached."
                        ],
                        solution: {
                            paragraph: [
                                "I moved away from state-based tables and implemented an Append-Only Event Ledger."
                            ],
                            items: [
                                "Instead of modifying an asset's current value, the database stores a continuous chain of events (e.g., `Created -> Depreciated -> Scanned -> Upgraded`).",
                                "The current book value of an asset is not a static number; it is a real-time calculation derived by summing up all historical events.",
                                "This guarantees a mathematically unbroken audit trail where past states are physically impossible to alter or delete without leaving a cryptographic footprint."
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
                    "The Asynchronous Approval Bottleneck: Because we implemented strict Separation of Duties (SoD), field auditors do not see the financial impact of their scans in real-time. Their UI confirms the scan was uploaded, but the asset's financial status remains 'Pending' until a finance admin logs in.",
                    "To mitigate the feeling of a 'black box', I added an active notification stream to the Flutter app, allowing auditors to see when their submitted discrepancies are officially resolved or rejected by the finance team."
                ],
                items: []
            }
        ],
        glossary: [
            {
                term: "Double Declining Balance (DDB)",
                definition: "An accelerated non-linear depreciation method that counts twice as much of the asset's book value each year as an expense compared to straight-line depreciation."
            },
            {
                term: "Ghost Asset",
                definition: "An asset that is listed on the corporate balance sheet and is actively being depreciated, but is physically missing, stolen, or destroyed."
            },
            {
                term: "Separation of Duties (SoD)",
                definition: "An internal control concept in finance/security requiring more than one person to complete a task, preventing fraud and error."
            },
            {
                term: "Optimistic Locking",
                definition: "A concurrency control method that assumes multiple transactions can complete without affecting each other. It checks for conflicts (like version mismatches) just before committing data, rather than locking the database row upfront."
            },
            {
                term: "Idempotency Key",
                definition: "A unique value generated by a client to ensure that an operation is performed exactly once, safely preventing duplicate records if a network timeout causes the client to retry the request."
            }
        ]
    },
    id: null,
};

export default QR_ID_ASSET_LEDGER_ARTICLE_BY_LOCALE;