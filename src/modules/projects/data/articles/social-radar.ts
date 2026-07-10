import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/social-radar.webp';

export const SOCIAL_RADAR_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "social-radar",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Social Radar",
        subtitle: "Mapping Social Gravity with Privacy-First Relationship Intelligence",
        hook: "So since i doing a lot of remote work, i kinda have a problem to actually track my real life social interaction, that why i came with this socaial radar thing. Social Radar is an inner-circle relationship intelligence app that tracks real-world meetups. It transforms boring interaction stats into a dynamic orbit, helping you maintain a healthy offline social life.",
        techStack: [
            "React Native",
            "SQLite (Local-First)",
            "D3.js / React Native SVG",
            "Redis (Geospatial In-Memory)",
            "Golang (Match Engine)"
        ],
        deploymentStatus: "Closed Beta",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "Working from home brings a lot of freedom, but I noticed it was creating a subtle distance between me and my real-world connections. I wanted to build a tool to actively count and track how often I was actually seeing my friends offline. However, staring at a dashboard of pure statistics and interaction counts felt sterile and boring.",
                    "That is why I designed the 'Social Gravity' visualization. Instead of charts, the idea is to map the social life as a dynamic solar system. Friends you see often are naturally pulled into your inner planets, while drifting connections slowly move to the outer rings. I intentionally built this as a personal, inner-circle community tool—a private radar to help my group keep our real-world relationships thriving."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Local-First Proximity Architecture",
                variant: "standard",
                paragraphs: [
                    "To achieve passive meetup tracking without relying on battery-heavy continuous GPS polling, Social Radar employs an event-driven, local-first stack."
                ],
                items: [
                    "*The Trigger (Motion API):* Utilizing iOS CoreMotion and Android Activity Recognition, the GPS remains completely disabled while stationary. Tracking only activates when the device detects significant transit.",
                    "*The Verification (BLE):* Bluetooth Low Energy (BLE) proximity detection acts as the ultimate truth-teller. It works indoors, barely touches the battery, and proves two devices are within a few meters of each other.",
                    "*The Client Database (SQLite):* 'Social Gravity' algorithms process locally on the user's device. The actual names, histories, and visual orbits never leave the smartphone.",
                    "*The Matcher (Redis):* A blazing-fast, ephemeral in-memory datastore on the backend that handles grid-based spatial matching before immediately discarding the data."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Radar",
                challenges: [
                    {
                        id: "the-n-squared-problem",
                        challenge: [
                            "The N-Squared Problem: Even for a closed community, if you have hundreds of users moving around a city, cross-referencing every user's location against everyone else requires exponential calculations, skyrocketing cloud hosting costs instantly."
                        ],
                        solution: {
                            paragraph: [
                                "We implemented a dual-layer filtering system using Social Graphs and Spatial Indexing."
                            ],
                            items: [
                                "The backend only calculates distances between users who are already mutually connected in the app's social graph, dropping processing load drastically.",
                                "Instead of raw coordinates, users are placed into Geohash grid buckets (e.g., Uber's H3 system).",
                                "The server only performs exact distance math if two connected users ping from the exact same or adjacent grid cells."
                            ]
                        }
                    },
                    {
                        id: "coincidental-proximity",
                        challenge: [
                            "False Positives: Two users might be stuck in traffic in adjacent lanes, or sitting in different apartments on the 4th and 40th floors of the same high-rise. Raw GPS proximity does not equal a social interaction."
                        ],
                        solution: {
                            paragraph: [
                                "We built a multi-layered Proximity Heuristic Algorithm to filter out coincidental overlaps."
                            ],
                            items: [
                                "Dwell Time Filter: The spatial overlap must persist for a continuous 15-30 minutes; momentary intersections are discarded.",
                                "Velocity Matching: If the OS motion sensors classify either user as 'in_vehicle', the meetup event is instantly rejected to filter out traffic jams.",
                                "Wi-Fi Fingerprinting & BLE: For high-rises, the apps securely hash the strongest nearby Wi-Fi router BSSID. If they don't match, or if a BLE handshake fails, they are on different floors."
                            ]
                        }
                    }
                ]
            },
            {
                id: "trade-offs",
                label: "Architectural Trade-Offs & Vulnerabilities",
                variant: "trade-off",
                paragraphs: [
                    "The Location Honeypot: Storing real-time coordinates and social graphs in a centralized database creates a massive security vulnerability. Even for a community app, a breach would expose sensitive personal movements.",
                    "To mitigate this, the architecture adopts a Zero-Trust Model utilizing Cryptographic Location Blinding."
                ],
                items: [
                    "Clients convert exact coordinates into truncated Geohash bounding boxes locally.",
                    "This grid ID is cryptographically hashed using SHA-256 and a rotating daily secret salt before transmission.",
                    "The backend only compares anonymous hash strings. It never sees, logs, or stores raw coordinates.",
                    "If the database is compromised, hackers only receive mathematically irreversible strings, protecting user privacy at a structural level."
                ]
            }
        ],
        glossary: [
            {
                term: "Geohashing",
                definition: "A public domain geocoding system that encodes a geographic location into a short string of letters and numbers, effectively dividing the map into a grid of buckets."
            },
            {
                term: "Proximity Heuristics",
                definition: "A set of algorithmic rules (like dwell time, velocity, and environmental signals) used to determine the likelihood that two overlapping GPS coordinates represent an actual human interaction."
            },
            {
                term: "Zero-Trust Architecture",
                definition: "A security framework requiring all users and devices to be strictly authenticated and verified, operating on the principle that the central server itself should not be trusted with unencrypted sensitive data."
            }
        ]
    },
    id: null,
};

export default SOCIAL_RADAR_ARTICLE_BY_LOCALE;