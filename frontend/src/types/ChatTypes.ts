// ===== CHAT/MESSAGE TYPES =====

export type MessageStatus = "sent" | "delivered" | "seen";

export interface IMessageSender {
    _id: string;
    fullName: string;
    profileImage?: string;
}

export interface IMessage {
    _id: string;
    chatId: string;
    senderId: string | IMessageSender;
    receiverId: string;
    content: string;
    status: MessageStatus;
    isRead?: boolean;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export interface IChatParticipant {
    _id: string;
    fullName: string;
    email?: string;
    username?: string;
    profileImage?: string;
    isOnline?: boolean;
    lastSeen?: Date;
}

export interface IChatLastMessage {
    text: string;
    sender: string;
    timestamp: string;
}

export interface IChat {
    _id: string;
    participants: IChatParticipant[];
    lastMessage: IChatLastMessage | IMessage | null;
    unreadCount?: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

// Helper to get sender ID from IMessage
export const getSenderId = (senderId: string | IMessageSender): string => {
    return typeof senderId === 'string' ? senderId : senderId._id;
};

// Helper to get sender name from IMessage
export const getSenderName = (senderId: string | IMessageSender): string | undefined => {
    return typeof senderId === 'string' ? undefined : senderId.fullName;
};
