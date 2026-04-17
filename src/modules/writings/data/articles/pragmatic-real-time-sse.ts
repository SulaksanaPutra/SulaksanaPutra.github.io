import thumbnail from '@/assets/images/articles/writings/pragmatic-real-time-sse.jpg';
import thumbnailDark from '@/assets/images/articles/writings/pragmatic-real-time-sse.dark.png';
import { WritingArticle } from '@/modules/writings/writings.types.ts';
import { computed } from 'vue';
import { useI18n } from '@/core/composables/use-i18n.ts';

export const SSE_FEEDBACK_ARTICLE_BY_LOCALE: Record<'en' | 'id', WritingArticle | null> = {
    en: {
        id: 'pragmatic-real-time-sse',
        backLink: {
            id: 'writing',
            href: '/writing',
            label: 'Back to Writing',
        },
        title: 'Server-Sent Events (SSE) Implementation: Closing the Observability Gap',
        subtitle:
            'Solving the "Hit-and-Forget" gap in background jobs without the infrastructure overhead of WebSockets.',
        highlight:
            'Explore why Server-Sent Events (SSE) implementation is often the superior architectural choice for real-time monitoring of asynchronous systems.',
        keywords: 'Server-Sent Events, SSE Implementation, Hit-and-Forget Gap, Real-Time Monitoring, Asynchronous Systems, WebSockets vs SSE, Pragmatic Architecture',
        thumbnail: {
            light: thumbnail,
            dark: thumbnailDark,
        },
        date: '2025-09-07',
        sections: [
            {
                id: 'observability-gap',
                label: 'The Observability Gap',
                paragraphs: [
                    'In modern web development, the "Hit-and-Forget" pattern is a common solution for maintaining a snappy user interface. We trigger a heavy background process—like a data export, a cloud sync, or an AI job—and immediately return a "Success" message to the user.',
                    'However, this creates a dangerous visibility gap. If the request is acknowledged but the background work fails three minutes later, the user remains in the dark. To solve this without over-engineering your infrastructure, Server-Sent Events (SSE) offer a remarkably simple, effective feedback loop.',
                ],
            },
            {
                id: 'why-sse',
                label: 'Why SSE? Navigating the Real-Time Landscape',
                paragraphs: [
                    'When you need to move data from the server to the client in real-time, there are usually three paths. Choosing correctly is about understanding the direction of your data.',
                ],
                items: [
                    '`Short and Long Polling`: The client repeatedly asks the server, "Is it done yet?" This is easy to implement but highly inefficient. It wastes resources on empty requests and creates unnecessary lag between the actual event and the UI update.',
                    '`WebSockets`: This provides a full-duplex, "two-way street" connection. While powerful, it is often overkill for monitoring background jobs. It requires a protocol upgrade (from HTTP to WS), handles its own state management, and introduces significant architectural complexity for a problem that is fundamentally one-way.',
                    '`Server-Sent Events (SSE)`: This is a unidirectional "one-way street" where the server pushes updates to the client over standard HTTP. It matches the mental model of background jobs perfectly: the server is the source of truth, and the client is a passive observer waiting for updates.',
                ],
            },
            {
                id: 'how to build',
                label: 'How to Build a Stream: Implementation Fundamentals',
                paragraphs: [
                    "The beauty of SSE lies in its simplicity. It doesn't require complex libraries because it builds on top of the standard HTTP protocol that every web developer already knows.",
                    '1. `The Server-Side Handshake`',
                    'To start an SSE stream, the server responds to a standard GET request with specific headers. This tells the browser to keep the connection open and expect a continuous stream of text.',
                    '```http\n' +
                        'Content-Type: text/event-stream\n' +
                        'Cache-Control: no-cache\n' +
                        'Connection: keep-alive\n' +
                        '```',
                    '2. `The Data Format`',
                    'The server sends data in a plain-text format. Each message is separated by two newlines. You can even label events to help the client-side code differentiate between a "progress" update and a "final" result.',
                    '```text\n' +
                        'event: status-update\n' +
                        'data: {"progress": 45, "step": "Syncing database"}\n' +
                        '\n' +
                        'event: completion\n' +
                        'data: {"jobId": "123", "url": "/downloads/report.pdf"}\n' +
                        '```',
                    '3. `The Client-Side Implementation`',
                    'Browsers have native support for SSE through the EventSource API. It is significantly simpler to manage than a WebSocket connection because it handles the "heavy lifting" of connection management automatically.',
                    '```javascript\n' +
                        "const source = new EventSource('/api/job-updates');\n" +
                        '\n' +
                        "source.addEventListener('status-update', (event) => {\n" +
                        '    const data = JSON.parse(event.data);\n' +
                        '    console.log(`Current progress: ${data.progress}%`);\n' +
                        '});\n' +
                        '\n' +
                        'source.onerror = (err) => {\n' +
                        '    console.error("EventSource failed:", err);\n' +
                        '};\n' +
                        '```',
                ],
            },
            {
                id: 'decision-framework',
                label: 'The Pragmatic Trade-offs',
                paragraphs: [
                    'You should use SSE when you are building web-first dashboards, status monitors, or live notification feeds where data only flows from the server to the user.',
                    'Avoid SSE if you are building high-frequency bi-directional tools like multiplayer games or collaborative editors, or if your primary target is a mobile application where connection persistence is volatile.',
                ],
            },
            {
                id: 'conclusion',
                label: 'The Bottom Line',
                paragraphs: [
                    'In software engineering, honesty is better than silence. A system that acknowledges a request but hides the eventual failure is a system that loses user trust. By implementing SSE, you bridge that gap with minimal complexity, turning a "silent" background process into a transparent, actionable feedback loop. It is a vote for architectural simplicity and a better experience for the end user.',
                ],
            },
        ],
        glossary: [
            {
                term: 'Hit-and-Forget pattern',
                definition:
                    'A common solution for maintaining a snappy user interface where a heavy background process is triggered and a "Success" message is returned immediately, before the work is finished.',
            },
            {
                term: 'Observability Gap',
                definition:
                    'A dangerous visibility gap that occurs when a background request is acknowledged but fails later, leaving the user unaware of the error.',
            },
            {
                term: 'Short and Long Polling',
                definition:
                    'An inefficient real-time method where the client repeatedly asks the server for updates, wasting resources and creating unnecessary lag.',
            },
            {
                term: 'WebSockets',
                definition:
                    'A full-duplex, "two-way street" connection that allows bi-directional communication but introduces significant architectural complexity and requires a protocol upgrade.',
            },
            {
                term: 'Full-duplex',
                definition:
                    'A communication mode that allows data to flow in both directions simultaneously, often used for high-frequency tools like multiplayer games.',
            },
            {
                term: 'Server-Sent Events (SSE)',
                definition:
                    'A unidirectional "one-way street" where the server pushes updates to the client over standard HTTP. It is simpler to implement and matches the mental model of background job monitoring.',
            },
            {
                term: 'Unidirectional',
                definition:
                    'A data flow that moves in only one direction. In this context, data moves strictly from the server to the client.',
            },
            {
                term: 'Protocol upgrade',
                definition:
                    'The process of switching from standard HTTP to a different protocol, such as WebSockets (WS), which adds complexity to infrastructure and state management.',
            },
            {
                term: 'EventSource API',
                definition:
                    'The native browser API used to implement SSE, which handles the "heavy lifting" of connection management automatically.',
            },
            {
                term: 'Automatic connection management',
                definition:
                    'A feature of the EventSource API where the browser automatically handles reconnections and stream health without requiring manual developer intervention.',
            },
        ],
    },
    id: null,
};

export function useSseFeedbackArticleData() {
    const { locale } = useI18n();
    return computed<WritingArticle | null>(
        () =>
            SSE_FEEDBACK_ARTICLE_BY_LOCALE[locale.value as 'en' | 'id'] ??
            SSE_FEEDBACK_ARTICLE_BY_LOCALE.en,
    );
}

export default SSE_FEEDBACK_ARTICLE_BY_LOCALE.en;
