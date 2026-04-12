export interface ChatBoxData {
    title: string;
    placeholder: string;
    emptyState: {
        title: string;
        description: string;
    };
    ariaLabels: {
        open: string;
        close: string;
    };
}
