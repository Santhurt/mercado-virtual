// ===== CHAT/MESSAGE TYPES =====

export type MessageStatus = "sent" | "delivered" | "seen";

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    status: MessageStatus;
    createdAt: Date;
    updatedAt?: Date;
}

export interface IChatParticipant {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: Date;
}

export interface IChat {
    _id: string;
    participants: IChatParticipant[];
    lastMessage: IMessage | null;
    unreadCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
