const API_URL = import.meta.env.VITE_API_URL;

export interface IChatResponse {
    _id: string;
    participants: Array<{
        _id: string;
        fullName: string;
        email: string;
        username?: string;
    }>;
    lastMessage: {
        text: string;
        sender: string;
        timestamp: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface IChatsListResponse {
    success: boolean;
    data: {
        chats: IChatResponse[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface ISingleChatResponse {
    success: boolean;
    data: IChatResponse;
}

export const chatService = {
    /**
     * Get all chats for a specific user
     */
    async getChatsByUser(
        userId: string,
        token: string,
        page = 1,
        limit = 20
    ): Promise<IChatsListResponse> {
        const response = await fetch(
            `${API_URL}/api/chats/user/${userId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error fetching chats');
        }

        return response.json();
    },

    /**
     * Get a specific chat by ID
     */
    async getChatById(chatId: string, token: string): Promise<ISingleChatResponse> {
        const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error fetching chat');
        }

        return response.json();
    },

    /**
     * Create a new chat between participants
     */
    async createChat(
        participants: string[],
        token: string
    ): Promise<ISingleChatResponse> {
        const response = await fetch(`${API_URL}/api/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ participants }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error creating chat');
        }

        return response.json();
    },
};
