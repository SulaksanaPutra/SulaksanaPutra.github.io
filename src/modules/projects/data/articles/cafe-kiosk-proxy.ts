import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/cafe-kiosk-proxy.webp';

export const CAFE_KIOSK_PROXY_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "cafe-kiosk-proxy",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Frontline Kiosk Proxy App",
        subtitle: "Bypassing Expensive POS Integrations via Chrome Extension & WebSockets",
        hook: "When a client wanted a high-fidelity, custom pop-art kiosk for their cafe, integrating it with their modern, closed Point of Sale (POS) system would have cost tens of millions of Rupiah in enterprise API fees. Instead, I built a custom proxy architecture using a Chrome Extension to inject orders directly into the cashier's browser, bypassing the API paywall entirely.",
        techStack: [
            "Vue 3",
            "Node.js",
            "WebSockets",
            "Chrome Extension API (Manifest V3)",
            "Vanilla JavaScript (DOM Manipulation)"
        ],
        deploymentStatus: "In Production",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "My client wanted to deploy an interactive customer-facing kiosk interface for building custom cafe beverages. It needed real-time price updates based on ingredient selections, a visual beverage preview system, and a vibrant pop-art aesthetic. I designed the frontend using Vue to deliver that highly polished experience.",
                    "The roadblock was integration. The cafe was already using a web-based POS system (Majoo). The official developer API for this POS cost an exorbitant initial fee plus hefty annual maintenance. Instead of forcing the client to pay this enterprise tax just to connect a custom table app, I decided to treat the existing POS as a 'dumb terminal'. I built a proxy app that communicates with a custom Chrome Extension on the cashier's tablet, acting as a targeted Robotic Process Automation (RPA) tool to auto-fill the orders."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Browser-as-Middleware Architecture",
                variant: "standard",
                paragraphs: [
                    "To achieve real-time order processing without traditional server-to-server API webhooks, I decoupled the customer interface from the cashier input layer using WebSockets."
                ],
                items: [
                    "*The Kiosk App (Vue 3):* A high-fidelity, locked-down table app where customers build their orders. When complete, it fires the payload to a central Node server.",
                    "*The Relay Server (Node.js):* A lightweight intermediary that maintains an active state of all table sessions and manages rate-limiting to prevent malicious spamming.",
                    "*The Background Service (Chrome Extension):* A persistent WebSocket client running silently in the cashier's browser, waiting for order payloads.",
                    "*The Injector (Content Scripts):* The DOM-manipulation layer that takes over the cashier's POS tab to systematically navigate, select items, and inject the customized modifiers."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Proxy Injection",
                challenges: [
                    {
                        id: "virtual-dom-trap",
                        challenge: [
                            "The Virtual DOM Trap: Modern web apps don't use standard HTML forms. If my extension simply executed `document.querySelector('#item').value = 'Latte'`, the input box would visually update, but the underlying Javascript framework (React/Vue) wouldn't register the state change, dropping the data upon submission."
                        ],
                        solution: {
                            paragraph: [
                                "I had to trick the Virtual DOM into thinking a real human was typing the keys."
                            ],
                            items: [
                                "After injecting the value into the specific DOM element, the extension dispatches native browser events programmatically.",
                                "We fire synthetic `input` and `change` events with `bubbles: true` enabled.",
                                "This forces the POS's internal framework state to synchronize with the hijacked DOM elements, ensuring the customized beverage data persists when added to the cart."
                            ]
                        }
                    },
                    {
                        id: "websocket-tunnel",
                        challenge: [
                            "The Inbound Webhook Limitation: Chrome extensions run locally behind a cafe's private NAT router. My Node backend could not send standard HTTP POST webhooks to the cashier's tablet because the extension has no public IP address."
                        ],
                        solution: {
                            paragraph: [
                                "I replaced traditional webhooks with a persistent WebSocket Tunnel."
                            ],
                            items: [
                                "When the cashier logs into the POS in the morning, the extension's `background.js` establishes an outbound WebSocket (WSS) connection to the Node backend.",
                                "When a table submits an order, the Node server broadcasts the JSON payload down that active socket connection.",
                                "The background worker receives the payload and passes it securely to the `content.js` script interacting with the active POS tab."
                            ]
                        }
                    },
                    {
                        id: "cashier-collision",
                        challenge: [
                            "The Race Condition (Screen Hijacking): If a table submits an order at the exact second a cashier is manually ringing up a walk-in customer, the extension would blindly hijack the mouse and keyboard inputs, blending two orders together and causing operational chaos."
                        ],
                        solution: {
                            paragraph: [
                                "I implemented an Order Queuing UI directly injected into the POS layout."
                            ],
                            items: [
                                "The extension monitors the DOM to see if the cashier is mid-transaction. If so, it holds the inbound WebSocket payload in memory.",
                                "Instead of instantly auto-filling, it injects a custom floating notification badge (e.g., '🔔 3 Table Orders Waiting') into the POS screen.",
                                "Once the cashier completes the walk-in order, they click the injected badge, which locks the POS UI and safely executes the automated input sequence."
                            ]
                        }
                    }
                ]
            },
            {
                id: "trade-offs",
                label: "Architectural Trade-Offs: DOM Fragility",
                variant: "trade-off",
                paragraphs: [
                    "The primary trade-off of this 'hacker' architecture is fragility. Because the extension relies on screen-scraping and injecting into a DOM I do not control, an unannounced UI update from the POS provider could break the query selectors (e.g., changing a class from `.btn-submit` to `.submit-v2`).",
                    "To mitigate this, I abstracted all DOM selectors out of the extension's hardcoded source. When the extension boots, it fetches a JSON configuration map from my remote server. If the POS layout changes, I simply update the remote JSON map, and the cafe's extension self-heals on the next page refresh without requiring a lengthy Google Chrome Web Store review."
                ],
                items: [
                    "Avoided Rp25,000,000+ in enterprise API access fees.",
                    "Requires strict Rate Limiting by IP/Session to prevent malicious kiosk abuse.",
                    "Creates a slight dependency on UI consistency from the upstream POS provider."
                ]
            }
        ],
        glossary: [
            {
                term: "Robotic Process Automation (RPA)",
                definition: "The technology used to build software 'robots' that emulate human execution of tasks within digital systems—in this case, clicking and typing within a web browser."
            },
            {
                term: "Synthetic Events",
                definition: "Javascript events (like clicks or keystrokes) generated by a script rather than actual human interaction with the hardware."
            },
            {
                term: "Content Script",
                definition: "A Javascript file executed within the context of web pages by a Chrome Extension, allowing it to read and mutate the DOM of the host page."
            }
        ]
    },
    id: null
};

export default CAFE_KIOSK_PROXY_ARTICLE_BY_LOCALE;