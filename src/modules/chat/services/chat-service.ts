const ID_KEY = 'chat_session_id';

export const getSessionId = () => {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
        id = crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem(ID_KEY, id);
    }
    return id;
};

export interface Message {
    id: number | string;
    body: string;
    isUser: boolean;
    timestamp: Date;
}

export const chatService = {
    async fetchInitialMessages(): Promise<Message[]> {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=3', {
                headers: {
                    'X-Chat-Session-Id': getSessionId()
                }
            });
            const data = await response.json();
            return data.map((item: any) => ({
                id: item.id,
                body: item.body,
                isUser: false,
                timestamp: new Date()
            }));
        } catch (error) {
            console.error('Failed to fetch initial messages:', error);
            return [];
        }
    },

    async sendMessage(message: string): Promise<Message> {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    body: message,
                    userId: 1,
                    sessionId: getSessionId()
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-Chat-Session-Id': getSessionId()
                },
            });
            const data = await response.json();
            return {
                id: data.id + Date.now(), // Ensure unique ID for UI
                body: data.body,
                isUser: true,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    }
};
