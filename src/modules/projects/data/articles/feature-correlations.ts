import { ProjectArticle } from '../../projects.types';
import thumbnail from '@/assets/images/articles/projects/feature-correlations.webp';

export const FEATURE_CORRELATIONS_ARTICLE_BY_LOCALE: Record<'en' | 'id', ProjectArticle | null> = {
    en: {
        id: "feature-correlations",
        backLink: {
            id: 'back-to-projects',
            label: "Back to Projects",
            href: "/projects"
        },
        title: "Feature Correlations",
        subtitle: "Automated UI Redundancy Detection & AI-Optimized Architectural Enforcement",
        hook: "Having worked across multiple scaling React teams, I've watched codebases drown in duplicated components and endless PR debates over naming conventions. I built Feature Correlations as a developer-first command center to mathematically identify redundant UI, enforce architectural 'Contracts', and output capsulated, AI-ready Markdown reports designed to feed directly into the tools developers already use.",
        techStack: [
            "TypeScript / Node.js",
            "SWC / Tree-sitter (AST Parsing)",
            "Knip (Dependency Tracing)",
            "Commander.js / Oclif",
            "Markdown Prompt Generation"
        ],
        deploymentStatus: "Closed Beta",
        thumbnail: thumbnail,
        sections: [
            {
                id: "the-vision",
                label: "The Vision",
                variant: "standard",
                paragraphs: [
                    "In my experience, as soon as a React team grows past a few developers, pull requests frequently devolve into battlegrounds over style guide violations, varying coding styles, and duplicated efforts. I found myself spending hours reviewing PRs just to point out that someone had rebuilt a UI component we already had in our shared library, or arguing about prop naming standards. Standard linters like ESLint are great at catching syntax errors, but I realized they are notoriously terrible at understanding a project's high-level architectural intent.",
                    "I wanted to build an automated, objective referee. Instead of just complaining about errors in a terminal, I designed Feature Correlations to establish a 'Project Contract' that enforces our architectural consistency. More importantly, because developers have different workflows, I built it to transform its findings into a highly structured, capsulated Markdown artifact. It serves as a grounded analysis engine that provides the exact context an LLM needs to actually solve the problem, rather than just pointing a finger at the developer."
                ]
            },
            {
                id: "architecture-stack",
                label: "The Analysis Architecture",
                variant: "standard",
                paragraphs: [
                    "To make this tool actually usable day-to-day, I knew I had to parse massive enterprise codebases without slowing down our CI pipeline. Developers will instantly abandon a tool if they have to wait ten minutes for it to check a typo."
                ],
                items: [
                    "*The Engine (SWC/Tree-sitter):* I bypassed traditional, slow JavaScript parsers in favor of Rust-based AST (Abstract Syntax Tree) generation. This allows the CLI to enforce complex custom rules without massive overhead.",
                    "*The Project Contract:* I didn't want teams spending weeks writing config files. This is a living JSON/YAML configuration auto-inferred from a team's previously merged PRs, defining exact styling stacks, naming rules, and directory structures.",
                    "*The CI Orchestrator:* I built a CLI tool for GitHub Actions that acts on an 'Affected Graph.' It only analyzes files changed in a PR and their direct dependents to keep validation sub-10 seconds.",
                    "*The AI-Optimized Reporter:* Instead of raw logs, it outputs a structured `feature-correlations-report.md` artifact containing capsulated issues, raw snippets, and precise prompt directives, optimized for whatever AI tool the developer prefers."
                ]
            },
            {
                id: "engineering-challenges",
                label: "Engineering the Heuristics",
                challenges: [
                    {
                        id: "css-collisions",
                        challenge: [
                            "Cross-Paradigm Visual Redundancy: One of my biggest pet peeves was seeing visually identical components written differently. But identifying redundant UI purely mathematically is nearly impossible if one developer uses Tailwind and another uses Styled Components."
                        ],
                        solution: {
                            paragraph: [
                                "To solve this, I implemented AST Normalization and Structural Hashing."
                            ],
                            items: [
                                "I designed the engine to force the team to declare their styling stack in the Project Contract, which optimizes the parsing strategy.",
                                "For systems like Tailwind, the AST extracts class names, alphabetizes them, and removes whitespace to generate a mathematical hash. This means `<button className='p-4 bg-red-500'>` and `<button className='bg-red-500 p-4'>` yield the exact same signature.",
                                "For generic CSS-in-JS, the tool compares the raw DOM tree structure and prop signatures. If the match is 90%+, it flags the components as 'Highly Correlated' for the team to review."
                            ]
                        }
                    },
                    {
                        id: "dynamic-resolution",
                        challenge: [
                            "Dead vs. Rare Code: Static analysis is tricky. I struggled to determine if a complex, deeply nested component wrapped in an API-driven HOC was truly 'dead code' or just rarely rendered due to edge-case server states."
                        ],
                        solution: {
                            paragraph: [
                                "I shifted the engine away from binary validation to Confidence Scores driven by dependency tracing."
                            ],
                            items: [
                                "The engine maps the full dependency graph from entry points (like Next.js pages). If an import is entirely disconnected from a route, I can confidently flag it as 100% dead.",
                                "For wired-up but potentially unreachable components, I have the CLI issue a 'Triage Report' with a low confidence score, flagging it as an 'Orphaned Interaction Path'.",
                                "This allows the developer's AI agent to review the specific data flow and determine if the required props are ever actually passed down from the current parent components."
                            ]
                        }
                    },
                    {
                        id: "byoai-reporting",
                        challenge: [
                            "The AI Integration Trap: My original plan was to hook this directly to an LLM API in the CI pipeline. I quickly realized this introduced massive friction regarding API costs, hallucination risks, and enterprise data privacy."
                        ],
                        solution: {
                            paragraph: [
                                "I pivoted to a 'Bring Your Own AI' (BYOAI) architecture using Capsulated Markdown Artifacts and Second-Hand Validation."
                            ],
                            items: [
                                "Instead of auto-triggering an LLM, I designed the CLI to output a highly optimized `feature-correlations-report.md` file designed specifically for AI consumption.",
                                "I structured the report to sequentially capsulate issues. It pairs the exact code snippet, the violated Contract rule, and a pre-written prompt instruction, allowing developers to feed isolated issues into Cursor, Copilot, or Claude one at a time to prevent context window bloat.",
                                "I treat AI as a 'Second-Hand Validator'. The grounded static analysis handles the deterministic math natively, but flags complex, low-confidence issues as warnings in the Markdown report for the developer's AI tool to review contextually."
                            ]
                        }
                    }
                ]
            },
            {
                id: "trade-offs",
                label: "Architectural Trade-Offs & Developer Friction",
                variant: "trade-off",
                paragraphs: [
                    "Aggressive Validation vs. Alert Fatigue: I personally despise tools that yell at me without giving me a way out. Any tool that mathematically audits code runs the risk of generating false positives. Furthermore, by choosing a BYOAI Markdown approach instead of a fully automated CI-driven fix, I intentionally introduced a manual step for the developer.",
                    "I compensated for this friction by trading pure automation for perfect security, and by making sure I gave developers an easy 'escape hatch' to teach the tool."
                ],
                items: [
                    "By decoupling the AI step, I can guarantee teams 100% enterprise data privacy, zero API costs, and zero hallucinated code merged blindly via CI loops.",
                    "I provided developers a standard `// feature-correlations-ignore` tag, but it strictly requires a context comment or metadata tag to pass validation so we don't lose the architectural reasoning.",
                    "Observational Learning: If I notice a significant percentage of the engineering team marking a specific UI pattern as a false positive, the engine automatically updates the 'Project Contract' to globally permit that pattern going forward. The tool adapts to the team, not the other way around."
                ]
            }
        ],
        glossary: [
            {
                term: "AST (Abstract Syntax Tree)",
                definition: "A tree representation of the abstract syntactic structure of source code. Parsers like SWC convert React/TypeScript into an AST so our engine can mathematically query code patterns."
            },
            {
                term: "Structural Hashing",
                definition: "The process of stripping away formatting, ordering, and irrelevant syntax from a component (like CSS class names) to generate a unique cryptographic ID, allowing us to definitively prove two components are identical."
            },
            {
                term: "BYOAI (Bring Your Own AI)",
                definition: "An architectural decision to output AI-optimized prompts and artifacts rather than calling an LLM API directly. This allows developers to use their preferred tools (Cursor, Copilot, Claude) while bypassing enterprise data privacy concerns."
            }
        ]
    },
    id: null,
};

export default FEATURE_CORRELATIONS_ARTICLE_BY_LOCALE;