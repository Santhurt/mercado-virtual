import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuthContext } from './AuthContext';
import type { IMessage, IChat } from '@/types/ChatTypes';

interface TypingUser {
    userId: string;
    userName: string;
}

interface ChatContextType {
    // Connection state
    isConnected: boolean;
    connectionError: string | null;

    // Chat state
    messages: Record<string, IMessage[]>;
    activeChat: string | null;
    typingUsers: Record<string, TypingUser | null>;
    chats: IChat[];

    // Actions
    setChats: React.Dispatch<React.SetStateAction<IChat[]>>;
    setActiveChat: (chatId: string | null) => void;
    setMessages: React.Dispatch<React.SetStateAction<Record<string, IMessage[]>>>;
    joinChat: (chatId: string) => void;
    leaveChat: (chatId: string) => void;
    sendMessage: (chatId: string, receiverId: string, content: string) => void;
    setTyping: (chatId: string, isTyping: boolean) => void;
    markAsSeen: (chatId: string, messageIds: string[]) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user } = useAuthContext();
    const { socket, isConnected, error } = useSocket(token);
    const [messages, setMessages] = useState<Record<string, IMessage[]>>({});
    const [activeChat, setActiveChatState] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser | null>>({});
    const [chats, setChats] = useState<IChat[]>([]);

    useEffect(() => {
        if (!socket) return;

        // --- Events we LISTEN to (Server → Client) ---

        // New message
        socket.on('new_message', (message: IMessage) => {
            setMessages((prev) => ({
                ...prev,
                [message.chatId]: [...(prev[message.chatId] || []), message],
            }));

            // Update lastMessage in chats list
            setChats((prev) =>
                prev.map((chat) =>
                    chat._id === message.chatId
                        ? { ...chat, lastMessage: message, updatedAt: new Date() }
                        : chat
                )
            );
        });

        // Delivery confirmation
        socket.on('message_delivered', ({ messageId, status }: { messageId: string; status: string }) => {
            console.log(`Message ${messageId} delivered:`, status);
            // Update message status in all chats
            setMessages((prev) => {
                const updated = { ...prev };
                for (const chatId in updated) {
                    updated[chatId] = updated[chatId].map((msg) =>
                        msg._id === messageId ? { ...msg, status: status as IMessage['status'] } : msg
                    );
                }
                return updated;
            });
        });

        // User typing
        socket.on('user_typing', ({ chatId, userId, userName, isTyping }: { chatId: string; userId: string; userName: string; isTyping: boolean }) => {
            setTypingUsers((prev) => ({
                ...prev,
                [chatId]: isTyping ? { userId, userName } : null,
            }));
        });

        // Messages marked as seen
        socket.on('messages_marked_seen', ({ chatId, messageIds }: { chatId: string; messageIds: string[] }) => {
            setMessages((prev) => ({
                ...prev,
                [chatId]: prev[chatId]?.map((msg) =>
                    messageIds.includes(msg._id) ? { ...msg, status: 'seen' } : msg
                ),
            }));
        });

        // Socket errors
        socket.on('error', ({ message }: { message: string }) => {
            console.error('Socket error:', message);
        });

        // Reconnection - rejoin active chat
        socket.on('reconnect', () => {
            console.log('Reconnected to socket');
            if (activeChat) {
                socket.emit('join_chat', { chatId: activeChat });
            }
        });

        return () => {
            socket.off('new_message');
            socket.off('message_delivered');
            socket.off('user_typing');
            socket.off('messages_marked_seen');
            socket.off('error');
            socket.off('reconnect');
        };
    }, [socket, activeChat]);

    // --- Functions we EMIT (Client → Server) ---

    const joinChat = useCallback((chatId: string) => {
        if (socket && isConnected) {
            socket.emit('join_chat', { chatId });
            setActiveChatState(chatId);
        }
    }, [socket, isConnected]);

    const leaveChat = useCallback((chatId: string) => {
        if (socket && isConnected) {
            socket.emit('leave_chat', { chatId });
            if (activeChat === chatId) setActiveChatState(null);
        }
    }, [socket, isConnected, activeChat]);

    const sendMessage = useCallback((chatId: string, receiverId: string, content: string) => {
        if (socket && isConnected) {
            socket.emit('send_message', { chatId, receiverId, content });
        }
    }, [socket, isConnected]);

    const setTyping = useCallback((chatId: string, isTyping: boolean) => {
        if (socket && isConnected) {
            socket.emit('typing', { chatId, isTyping });
        }
    }, [socket, isConnected]);

    const markAsSeen = useCallback((chatId: string, messageIds: string[]) => {
        if (socket && isConnected && messageIds.length > 0) {
            socket.emit('message_seen', { chatId, messageIds });
        }
    }, [socket, isConnected]);

    const setActiveChat = useCallback((chatId: string | null) => {
        setActiveChatState(chatId);
    }, []);

    const value: ChatContextType = {
        isConnected,
        connectionError: error,
        messages,
        activeChat,
        typingUsers,
        chats,
        setChats,
        setActiveChat,
        setMessages,
        joinChat,
        leaveChat,
        sendMessage,
        setTyping,
        markAsSeen,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};
