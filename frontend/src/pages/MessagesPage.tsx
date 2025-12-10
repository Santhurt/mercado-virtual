import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";
import {
    ChatList,
    ChatHeader,
    MessageList,
    MessageInput,
    EmptyChat,
} from "@/components/custom/messages";
import type { IChat, IMessage } from "@/types/ChatTypes";
import { useChat } from "@/context/ChatContext";
import { useAuthContext } from "@/context/AuthContext";
import { chatService } from "@/services/chats";
import { messageService } from "@/services/messages";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
    const { user, token, isAuthenticated } = useAuthContext();
    const {
        messages,
        setMessages,
        chats,
        setChats,
        activeChat,
        typingUsers,
        isConnected,
        joinChat,
        leaveChat,
        sendMessage,
        setTyping,
        markAsSeen,
        setActiveChat,
    } = useChat();

    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const previousChatRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const currentUserId = user?._id || "";

    // Transform API chat to frontend structure
    const transformChat = useCallback((apiChat: any): IChat => {
        return {
            _id: apiChat._id,
            participants: apiChat.participants.map((p: any) => ({
                _id: p._id,
                fullName: p.fullName || p.username || "Usuario",
                email: p.email,
                username: p.username,
                profileImage: p.profileImage,
                isOnline: false, // Not available from API
            })),
            lastMessage: apiChat.lastMessage,
            createdAt: apiChat.createdAt,
            updatedAt: apiChat.updatedAt,
        };
    }, []);

    // Transform API message to frontend structure
    const transformMessage = useCallback((apiMsg: any): IMessage => {
        return {
            _id: apiMsg._id,
            chatId: apiMsg.chatId,
            senderId: apiMsg.senderId,
            receiverId: apiMsg.receiverId,
            content: apiMsg.content,
            status: apiMsg.isRead ? "seen" : "delivered",
            isRead: apiMsg.isRead,
            createdAt: apiMsg.createdAt,
            updatedAt: apiMsg.updatedAt,
        };
    }, []);

    // Load chats on mount
    useEffect(() => {
        const loadChats = async () => {
            if (!isAuthenticated || !token || !user?._id) {
                setIsLoadingChats(false);
                return;
            }

            try {
                setIsLoadingChats(true);
                setError(null);
                const response = await chatService.getChatsByUser(user._id, token);
                const transformedChats = response.data.chats.map(transformChat);
                setChats(transformedChats);
            } catch (err) {
                console.error("Error loading chats:", err);
                setError("Error al cargar los chats");
            } finally {
                setIsLoadingChats(false);
            }
        };

        loadChats();
    }, [isAuthenticated, token, user?._id, setChats, transformChat]);

    // Load messages when active chat changes
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeChat || !token) return;

            // Leave previous chat
            if (previousChatRef.current && previousChatRef.current !== activeChat) {
                leaveChat(previousChatRef.current);
            }

            // Join new chat
            joinChat(activeChat);
            previousChatRef.current = activeChat;

            // Only load if we don't have messages for this chat
            if (messages[activeChat] && messages[activeChat].length > 0) return;

            try {
                setIsLoadingMessages(true);
                const response = await messageService.getMessagesByChat(activeChat, token);
                // Messages come in descending order, reverse to ascending for display
                const transformedMessages = response.data.messages
                    .map(transformMessage)
                    .reverse();
                setMessages((prev) => ({
                    ...prev,
                    [activeChat]: transformedMessages,
                }));
            } catch (err) {
                console.error("Error loading messages:", err);
            } finally {
                setIsLoadingMessages(false);
            }
        };

        loadMessages();
    }, [activeChat, token, joinChat, leaveChat, messages, setMessages, transformMessage]);

    // Mark messages as seen when viewing
    useEffect(() => {
        if (!activeChat || !currentUserId) return;

        const chatMessages = messages[activeChat] || [];
        const unreadIds = chatMessages
            .filter((msg) => {
                const senderId = typeof msg.senderId === "string" ? msg.senderId : msg.senderId._id;
                return senderId !== currentUserId && msg.status !== "seen";
            })
            .map((msg) => msg._id);

        if (unreadIds.length > 0) {
            markAsSeen(activeChat, unreadIds);
        }
    }, [activeChat, messages, currentUserId, markAsSeen]);

    const activeChatData = chats.find((c) => c._id === activeChat);
    const activeMessages = activeChat ? messages[activeChat] || [] : [];
    const otherParticipant = activeChatData?.participants.find(
        (p) => p._id !== currentUserId
    );

    const handleSendMessage = (content: string) => {
        if (!activeChat || !otherParticipant) return;
        sendMessage(activeChat, otherParticipant._id, content);
        // Stop typing indicator
        setTyping(activeChat, false);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };

    const handleTyping = (isTypingNow: boolean) => {
        if (!activeChat) return;

        setTyping(activeChat, isTypingNow);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (isTypingNow) {
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(activeChat, false);
            }, 2000);
        }
    };

    const handleChatSelect = (chatId: string) => {
        setActiveChat(chatId);
    };

    const handleBack = () => {
        if (activeChat) {
            leaveChat(activeChat);
        }
        setActiveChat(null);
    };

    // Check if other user is typing in active chat
    const isOtherUserTyping =
        activeChat &&
        typingUsers[activeChat] &&
        typingUsers[activeChat]?.userId !== currentUserId;

    const typingUserName = isOtherUserTyping
        ? typingUsers[activeChat]?.userName
        : null;

    if (!isAuthenticated) {
        return (
            <MainLayout>
                <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
                    <p className="text-muted-foreground">
                        Inicia sesión para ver tus mensajes
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="h-[calc(100vh-4rem)] flex bg-background">
                {/* Chat List - hidden on mobile when chat is active */}
                <div
                    className={cn(
                        "w-full md:w-1/3 lg:w-1/4 border-r bg-card",
                        activeChat && "hidden md:block"
                    )}
                >
                    {isLoadingChats ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full p-4">
                            <p className="text-destructive text-center">{error}</p>
                        </div>
                    ) : (
                        <ChatList
                            chats={chats}
                            currentUserId={currentUserId}
                            activeChatId={activeChat || undefined}
                            onChatSelect={handleChatSelect}
                        />
                    )}
                </div>

                {/* Chat Window */}
                <div
                    className={cn(
                        "flex-1 flex flex-col",
                        !activeChat && "hidden md:flex"
                    )}
                >
                    {activeChatData && otherParticipant ? (
                        <>
                            <ChatHeader
                                participant={otherParticipant}
                                onBack={handleBack}
                                showBackButton={true}
                                isConnected={isConnected}
                            />
                            {isLoadingMessages ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <MessageList
                                    messages={activeMessages}
                                    currentUserId={currentUserId}
                                    className="flex-1"
                                    typingUserName={typingUserName}
                                />
                            )}
                            <MessageInput
                                onSend={handleSendMessage}
                                onTypingChange={handleTyping}
                            />
                        </>
                    ) : (
                        <EmptyChat />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
