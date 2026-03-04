const ID_KEY = 'chat_session_id';

const EDGE_FUNCTION_URL = import.meta.env.VITE_EDGE_FUNCTION_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const getSessionId = () => {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
        // Generate an 8-character lowercase alphanumeric ID
        id = Math.random().toString(36).substring(2, 10);
        localStorage.setItem(ID_KEY, id);
    }
    return id;
};

export interface Message {
    id: string | number;
    uid: string;
    type: 'outgoing' | 'ingoing' | string;
    message: string;
    timestamp?: number;
    created_at?: string;
}

export const chatService = {
    async fetchMessages(): Promise<Message[]> {
        const uid = getSessionId();
        try {
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: 'GET', // Explicitly setting GET
                headers: {
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    apikey: SUPABASE_KEY,
                    'x-uid': uid,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();

            // NOTE: Ensure your Edge Function GET handler actually returns the array
            // inside a "messages" property, or adjust this to just `return data || []`
            return data || [];
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            return [];
        }
    },

    async sendMessage(message: string): Promise<void> {
        const uid = getSessionId();
        try {
            const response = await fetch(EDGE_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    apikey: SUPABASE_KEY,
                    'Content-Type': 'application/json',
                    'x-uid': uid,
                },
                body: JSON.stringify({ message }),
            });
            if (!response.ok) throw new Error('Failed to send message');
        } catch (error) {
            console.error('Failed to send message:', error);
            throw error;
        }
    },
};
