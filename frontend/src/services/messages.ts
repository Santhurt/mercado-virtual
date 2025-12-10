const API_URL = import.meta.env.VITE_API_URL;

export interface IMessageResponse {
    _id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IMessagesListResponse {
    success: boolean;
    data: {
        messages: IMessageResponse[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    };
}

export interface ISingleMessageResponse {
    success: boolean;
    data: IMessageResponse;
}

export const messageService = {
    /**
     * Get messages for a specific chat (paginated)
     */
    async getMessagesByChat(
        chatId: string,
        token: string,
        page = 1,
        limit = 50
    ): Promise<IMessagesListResponse> {
        const response = await fetch(
            `${API_URL}/api/messages/${chatId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error fetching messages');
        }

        return response.json();
    },

    /**
     * Send a new message (REST fallback, prefer WebSocket)
     */
    async sendMessage(
        chatId: string,
        receiverId: string,
        content: string,
        token: string
    ): Promise<ISingleMessageResponse> {
        const response = await fetch(`${API_URL}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ chatId, receiverId, content }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error sending message');
        }

        return response.json();
    },
};
