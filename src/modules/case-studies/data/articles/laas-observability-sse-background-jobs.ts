import { CaseStudyArticle } from '@/modules/case-studies/case-studies.types.ts';
import { useI18n } from '@/core/composables/use-i18n.ts';
import { computed } from 'vue';

export const LAAS_OBSERVABILITY_CASE_BY_LOCALE: Record<'en' | 'id', CaseStudyArticle | null> = {
    en: {
        backLink: {
            id: 'case-studies',
            href: '/case-studies',
            label: 'Back to Case Studies',
        },
        id: 'laas-observability-sse-background-jobs',
        systemIds: ['system-laas'],
        title: 'The Silent Failure: Real-Time Observability in Asynchronous Systems',
        heading: 'Solving the Observability Gap',
        highlight:
            'LaaS App — Implementing Server-Sent Events (SSE) and segregated logging to resolve the observability gap in a background-heavy "Hit-and-Forget" architecture.',
        subtitle:
            'How we gave the system a voice by replacing silent background failures with real-time user notifications and worker health monitoring.',
        sections: [
            {
                id: 'context',
                label: 'Context',
                paragraphs: [
                    'As established in the previous architecture, the LaaS system relied heavily on a "Hit-and-Forget" mechanism. This approach was designed for maximum efficiency; the application would accept a request, acknowledge it immediately, and handle the heavy lifting of WMS and FMS integrations in the background. From a stability standpoint, it was successful—as long as the system accepted the request, the user felt the app was working perfectly.',
                ],
            },
            {
                id: 'problem',
                label: 'Problem',
                paragraphs: [
                    'However, this efficiency created a dangerous disconnect. Because the core business logic was encapsulated in background jobs, the user interface remained static once a request was accepted. In a logistics environment where API timeouts, credential expirations, or payload mismatches are inevitable, these background failures were silent.',
                    'A user might see a shipment marked as "In Process" indefinitely, unaware that the integration had failed minutes ago. This lack of feedback led to Data Drift: physical warehouse actions were stalled because the digital command had failed without an alert. We had built a stable engine, but we had failed to provide a real-time dashboard for its failures.',
                ],
            },
            {
                id: 'solution',
                label: 'Solution',
                paragraphs: [
                    'To bridge this gap, I led the implementation of a real-time notification layer and a more granular observability strategy:',
                ],
                items: [
                    '`Server-Sent Events (SSE)`: We implemented SSE to push background job statuses directly to the client. We intentionally chose SSE over WebSockets because our requirements were strictly one-way (Server-to-Client). This provided a lightweight, standard HTTP-based stream without the infrastructure overhead of managing full-duplex WebSocket connections.',
                    '`Domain-Segregated Logging`: We moved away from a single "catch-all" log. Instead, we implemented Encapsulated Logging Tables specifically for Inbound and Outbound integrations. By segregating logs into dedicated database tables, we ensured that high-volume delivery logs didn\'t clutter the context of critical warehouse sync failures.',
                    '`Worker Health` Monitoring: I introduced a "heartbeat" mechanism for our background processes. This ensured that we weren\'t just monitoring the jobs, but the engine itself. If the background worker stalled, the system would immediately flag the lack of activity to the engineering team.',
                ],
            },
            {
                id: 'outcome',
                label: 'Outcome',
                paragraphs: [
                    'The implementation of SSE transformed the LaaS app from a "Black Box" into a Responsive Platform. Users received immediate, actionable feedback on background errors, allowing them to resolve issues—like fixing a bad address or re-authenticating a service—without manual engineering intervention. We didn\'t just reduce failures; we eliminated Silent Failures, which are the most expensive type of error in logistics.',
                ],
            },
            {
                id: 'reflection',
                label: 'Reflection',
                paragraphs: [
                    'This project reinforced that a "Hit-and-Forget" pattern is incomplete without a robust feedback loop. SSE was a pragmatic, high-value win for our web-based platform. However, I recognized a critical constraint: if our target had been a mobile application, SSE’s lack of background persistence would have forced us toward Firebase Cloud Messaging (FCM) or WebSockets.',
                    'The decision to segregate logs into dedicated tables was also a major win; it turned "searching for a needle in a haystack" into a simple filtered query. It’s a small architectural detail that saves hours of "firefighting" during a production incident.',
                ],
            },
        ],
        qnas: [
            {
                question: 'Why not use WebSockets instead of SSE?',
                answer: 'SSE was chosen for its simplicity and lower resource overhead. Since we only needed the server to "push" notifications to the user about job statuses, the bi-directional nature of WebSockets would have added unnecessary complexity to our infrastructure.',
            },
            {
                question:
                    'Storing logs in a database table can lead to massive table growth in high-traffic systems. How did you handle the scaling of these logging tables?',
                answer: 'We treated these as Short-Term Audit Logs. We implemented a rolling retention policy where logs older than 30 days were archived to cold storage or purged. This kept the database performance high while ensuring we had the "Hot Data" needed for immediate troubleshooting.',
            },
        ],
        glossary: [
            {
                term: 'Hit-and-Forget',
                definition:
                    'An asynchronous mechanism where the system acknowledges a request immediately and processes complex logic in the background to ensure a snappy user experience.',
            },
            {
                term: 'Silent Failure',
                definition:
                    'A dangerous disconnect where background processes fail due to timeouts or errors without providing any feedback or alerts to the user interface.',
            },
            {
                term: 'Observability Gap',
                definition:
                    'The lack of real-time visibility into the status of background jobs, leading to a disconnect between the user’s perception and the actual system state.',
            },
            {
                term: 'Server-Sent Events (SSE)',
                definition:
                    'A lightweight, standard HTTP-based technology used to push real-time status updates from the server to the client over a one-way stream without the overhead of WebSockets.',
            },
            {
                term: 'Data Drift',
                definition:
                    'A logistics failure where physical actions are stalled because the digital command failed silently, causing the system data to lose synchronization with reality.',
            },
            {
                term: 'Domain-Segregated Logging',
                definition:
                    'An observability strategy where logs are separated into dedicated database tables based on their specific context to prevent clutter and speed up troubleshooting.',
            },
            {
                term: 'Encapsulated Logging Tables',
                definition:
                    'Specific database tables designed to store high-volume integration logs separately from core application data to maintain performance and focus.',
            },
            {
                term: 'Worker Health',
                definition:
                    'A monitoring mechanism used to track background processes, ensuring the engine itself is running and alerting the team if a worker stalls.',
            },
            {
                term: 'Black Box',
                definition:
                    'A description of a system that performs operations internally without providing visibility or actionable feedback on its background states to the user.',
            },
            {
                term: 'Short-Term Audit Logs',
                definition:
                    'Integration logs kept as "Hot Data" for immediate troubleshooting, usually managed with a rolling retention policy before being archived or purged.',
            },
        ],
    },
    id: null,
};

export function useLaasObservabilityCaseData() {
    const { locale } = useI18n();

    return computed<CaseStudyArticle | null>(
        () =>
            LAAS_OBSERVABILITY_CASE_BY_LOCALE[locale.value] ?? LAAS_OBSERVABILITY_CASE_BY_LOCALE.en,
    );
}

export default LAAS_OBSERVABILITY_CASE_BY_LOCALE.en;
