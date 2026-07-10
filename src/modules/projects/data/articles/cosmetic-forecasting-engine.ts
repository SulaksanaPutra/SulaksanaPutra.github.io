import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/cosmetic-inventory-engine.webp';

export const COSMETIC_FORECASTING_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "cosmetic-forecasting-engine",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Cosmetic Inventory Forecasting Engine",
        subtitle: "A Deterministic Math Engine for Supply, Demand, and ROP Calculus",
        hook: "Balancing manufacturing batches against strict cosmetic expiration dates is a logistical tightrope walk. Instead of relying on unpredictable, black-box AI models, I built a highly deterministic forecasting engine using traditional statistical calculus—like Alpha Smoothing and Reorder Point (ROP) mathematics—integrated directly into a Laravel and MySQL architecture.",
        techStack: [
            "Laravel",
            "MySQL",
            "Redis",
            "PHP 8",
            "Task Scheduling / Cron"
        ],
        deploymentStatus: "In Production",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "In the cosmetic manufacturing industry, overproduction leads to massive financial losses due to expired goods, while underproduction leads to stockouts and damaged brand trust. When tasked with building an inventory forecasting system, I explicitly chose to avoid machine learning.",
                    "Why? Because warehouse managers need transparency. If the system suggests producing 10,000 units of a face serum, the manager needs to know exactly how that number was calculated. I designed this engine to rely purely on time-series mathematics and calculus, ensuring every recommendation is transparent, mathematically sound, and auditable."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Pre-Computed Summary Architecture",
                variant: "standard",
                paragraphs: [
                    "Calculating standard deviations and exponential smoothing across thousands of SKUs requires scanning millions of rows. To achieve this in a standard Laravel/MySQL stack without bringing down the live application, I architected a decoupled, pre-computed pipeline."
                ],
                items: [
                    "*The Transactional Buffer:* Live sales are recorded in the standard database without any heavy calculation overhead.",
                    "*The Nightly Aggregator (Laravel Commands):* During off-peak hours, scheduled jobs chunk through daily sales and aggregate them into a `weekly_sales_summaries` table.",
                    "*The Math Engine:* The system runs Single Exponential Smoothing (Alpha Smoothing) and calculates the Reorder Point (ROP) strictly against the summary tables.",
                    "*The Read Layer (Redis):* The final calculus (Safe Stock levels, ROP, Next Period Forecast) is cached so the warehouse dashboard loads instantly for the end-user."
                ]
            },
            {
                id: "forecasting-calculus",
                label: "The Core Forecasting Calculus",
                variant: "standard",
                paragraphs: [
                    "To ensure absolute transparency for the supply chain team, I built the forecasting logic around three traditional mathematical models. By translating these formulas directly into PHP and raw SQL, the system can process and project demand autonomously."
                ],
                items: [
                    "*Single Exponential Smoothing (The Forecast):* To predict future demand without a massive data footprint, I implemented $F_{t+1} = \\alpha D_t + (1 - \\alpha) F_t$. The admin can adjust the Alpha ($\\alpha$) factor dynamically. A higher alpha reacts aggressively to recent viral sales spikes, while a lower alpha favors historical stability.",
                    "*Dynamic Safety Stock (The Buffer):* Instead of warehouse managers manually guessing buffer stock, the engine calculates it dynamically using standard deviation: $SS = Z \\times \\sigma_d \\times \\sqrt{L}$. I utilized MySQL's native `STDDEV()` function on the pre-computed summary tables to measure demand volatility. Erratic items automatically get a higher safety net.",
                    "*Reorder Point (The Trigger):* This algorithm dictates exactly when production must start. The engine evaluates $ROP = (d \\times L) + SS$, factoring in the average daily demand ($d$) and the supplier's lead time ($L$). If live stock dips below the ROP threshold, the dashboard instantly flags a production alert."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Math Engine",
                challenges: [
                    {
                        id: "database-locking",
                        challenge: [
                            "Table Locking and Performance: Running heavy statistical SQL queries (like standard deviation for Safety Stock) on the primary transactional database during peak hours would cause table locks and crash the live application."
                        ],
                        solution: {
                            paragraph: [
                                "I implemented an asynchronous ETL (Extract, Transform, Load) pattern using Laravel's task scheduler and chunking mechanisms."
                            ],
                            items: [
                                "The engine never queries raw daily data for forecasting. Instead, a nightly cron job aggregates the data into weekly summaries.",
                                "I strictly utilized Laravel's `DB::table()->chunk()` combined with raw SQL queries for heavy math (`STDDEV`, `AVG`), entirely bypassing the memory overhead of Eloquent ORM.",
                                "This completely isolated the analytical workload from the transactional workload, keeping the main app blazingly fast."
                            ]
                        }
                    },
                    {
                        id: "cold-start-problem",
                        challenge: [
                            "The 'Cold Start' Dilemma: Alpha smoothing mathematically requires previous historical data to calculate a forecast. When the manufacturer launches a brand new product, there is zero historical data to feed the algorithm."
                        ],
                        solution: {
                            paragraph: [
                                "To solve this, I designed a 'Baseline Inheritance' feature integrated directly into the product creation flow."
                            ],
                            items: [
                                "When a new SKU is created, the system requires an `expected_monthly_demand` integer.",
                                "The admin can optionally select a 'Parent SKU' (e.g., an existing, similar moisturizer) from a dropdown. The UI fetches the parent's historical average and pre-fills the expected demand.",
                                "The math engine uses this static baseline as the 'Previous Forecast' for the first few weeks, seamlessly handing over control to real transactional data as it begins to accumulate."
                            ]
                        }
                    },
                    {
                        id: "shelf-life-constraints",
                        challenge: [
                            "The Shelf-Life vs. Batch Size Conflict: The Economic Order Quantity (EOQ) formula often suggests massive production batches to minimize setup costs. However, cosmetic products have strict expiration dates. Blindly following EOQ would result in spoiled dead stock."
                        ],
                        solution: {
                            paragraph: [
                                "I modified the traditional EOQ calculus by introducing a hard mathematical ceiling tied to the product's lifespan."
                            ],
                            items: [
                                "I added a `shelf_life_months` variable to the core product schema.",
                                "The engine calculates the maximum viable production run: $Max\\_Production = Forecasted\\_Monthly\\_Demand \\times Shelf\\_Life\\_Months$.",
                                "The final production trigger evaluates the minimum value between EOQ and Max Production. This ensures the system never recommends a batch size larger than what the market can consume before the product expires."
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
                    "The Pre-Computation Blindspot: Because the heavy calculations are run nightly, the warehouse dashboard is technically looking at data that is up to 24 hours old. If a massive, unexpected order comes in at 9:00 AM, the ROP won't flag it until the next morning.",
                    "I mitigated this by offering targeted recalculation."
                ],
                items: [
                    "The baseline ROP and forecasts are strictly pre-calculated nightly.",
                    "However, if a warehouse manager manually adjusts a variable on the dashboard (like updating a supplier's Lead Time or tweaking the Alpha Smoothing factor), the system dispatches a dedicated Laravel Job.",
                    "This job recalculates the math for *only that specific SKU* asynchronously, updating the UI via a state refresh without putting undue load on the database."
                ]
            }
        ],
        glossary: [
            {
                term: "Alpha Smoothing",
                definition: "Also known as Single Exponential Smoothing. A time-series forecasting method that assigns exponentially decreasing weights to older data, making the algorithm highly responsive to recent changes in cosmetic demand."
            },
            {
                term: "Reorder Point (ROP)",
                definition: "The exact inventory level that triggers an action to replenish that particular inventory stock. Calculated using average daily demand, lead time, and safety stock."
            },
            {
                term: "Economic Order Quantity (EOQ)",
                definition: "The ideal order quantity a company should purchase/produce to minimize inventory costs such as holding costs, shortage costs, and order costs."
            },
            {
                term: "Safety Stock",
                definition: "An extra quantity of a product which is held in the inventory to prevent stockouts caused by fluctuating demand or supplier lead-time delays, calculated via standard deviation."
            }
        ]
    },
    id: null,
};

export default COSMETIC_FORECASTING_ARTICLE_BY_LOCALE;