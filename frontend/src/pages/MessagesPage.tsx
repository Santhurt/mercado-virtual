import { useState } from "react";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";
import {
    ChatList,
    ChatHeader,
    MessageList,
    MessageInput,
    EmptyChat,
} from "@/components/custom/messages";
import type { IChat, IMessage, IChatParticipant } from "@/types/ChatTypes";

// ============ MOCK DATA ============
const CURRENT_USER_ID = "user-current";

const mockParticipants: Record<string, IChatParticipant> = {
    "user-1": {
        _id: "user-1",
        name: "María García",
        username: "mariagarcia",
        avatar: "https://i.pravatar.cc/150?u=maria",
        isOnline: true,
    },
    "user-2": {
        _id: "user-2",
        name: "Carlos Rodríguez",
        username: "carlosrod",
        avatar: "https://i.pravatar.cc/150?u=carlos",
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    },
    "user-3": {
        _id: "user-3",
        name: "Ana Martínez",
        username: "anamartinez",
        avatar: "https://i.pravatar.cc/150?u=ana",
        isOnline: true,
    },
    "user-4": {
        _id: "user-4",
        name: "Luis Hernández",
        username: "luishernandez",
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
};

const mockCurrentUser: IChatParticipant = {
    _id: CURRENT_USER_ID,
    name: "Yo",
    username: "currentuser",
    isOnline: true,
};

const mockChats: IChat[] = [
    {
        _id: "chat-1",
        participants: [mockCurrentUser, mockParticipants["user-1"]],
        lastMessage: {
            _id: "msg-1-last",
            chatId: "chat-1",
            senderId: "user-1",
            receiverId: CURRENT_USER_ID,
            content: "¡Hola! ¿Tienes disponible el producto que publiqué?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 5),
        },
        unreadCount: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        _id: "chat-2",
        participants: [mockCurrentUser, mockParticipants["user-2"]],
        lastMessage: {
            _id: "msg-2-last",
            chatId: "chat-2",
            senderId: CURRENT_USER_ID,
            receiverId: "user-2",
            content: "Perfecto, te espero entonces",
            status: "delivered",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
        _id: "chat-3",
        participants: [mockCurrentUser, mockParticipants["user-3"]],
        lastMessage: {
            _id: "msg-3-last",
            chatId: "chat-3",
            senderId: "user-3",
            receiverId: CURRENT_USER_ID,
            content: "¡Gracias por la compra! 🎉",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
        _id: "chat-4",
        participants: [mockCurrentUser, mockParticipants["user-4"]],
        lastMessage: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
];

const mockMessages: Record<string, IMessage[]> = {
    "chat-1": [
        {
            _id: "msg-1-1",
            chatId: "chat-1",
            senderId: "user-1",
            receiverId: CURRENT_USER_ID,
            content: "Hola, vi tu publicación del iPhone",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
            _id: "msg-1-2",
            chatId: "chat-1",
            senderId: CURRENT_USER_ID,
            receiverId: "user-1",
            content: "¡Hola! Sí, todavía está disponible",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        },
        {
            _id: "msg-1-3",
            chatId: "chat-1",
            senderId: "user-1",
            receiverId: CURRENT_USER_ID,
            content: "¿Cuál es el precio final?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60),
        },
        {
            _id: "msg-1-4",
            chatId: "chat-1",
            senderId: CURRENT_USER_ID,
            receiverId: "user-1",
            content: "El precio es $1,200,000 COP. Incluye cargador y estuche original.",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
            _id: "msg-1-5",
            chatId: "chat-1",
            senderId: "user-1",
            receiverId: CURRENT_USER_ID,
            content: "¿Puedes hacer envío?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
            _id: "msg-1-6",
            chatId: "chat-1",
            senderId: CURRENT_USER_ID,
            receiverId: "user-1",
            content: "Sí, el envío tiene un costo adicional dependiendo de la ciudad. ¿Dónde te encuentras?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
        },
        {
            _id: "msg-1-7",
            chatId: "chat-1",
            senderId: "user-1",
            receiverId: CURRENT_USER_ID,
            content: "¡Hola! ¿Tienes disponible el producto que publiqué?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 5),
        },
    ],
    "chat-2": [
        {
            _id: "msg-2-1",
            chatId: "chat-2",
            senderId: "user-2",
            receiverId: CURRENT_USER_ID,
            content: "Buenos días, ¿podemos coordinar para mañana?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
        },
        {
            _id: "msg-2-2",
            chatId: "chat-2",
            senderId: CURRENT_USER_ID,
            receiverId: "user-2",
            content: "Claro, ¿a qué hora te queda bien?",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        },
        {
            _id: "msg-2-3",
            chatId: "chat-2",
            senderId: "user-2",
            receiverId: CURRENT_USER_ID,
            content: "Me sirve a las 3pm en el centro comercial",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        },
        {
            _id: "msg-2-4",
            chatId: "chat-2",
            senderId: CURRENT_USER_ID,
            receiverId: "user-2",
            content: "Perfecto, te espero entonces",
            status: "delivered",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
    ],
    "chat-3": [
        {
            _id: "msg-3-1",
            chatId: "chat-3",
            senderId: CURRENT_USER_ID,
            receiverId: "user-3",
            content: "Ya recibí el paquete, todo perfecto!",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25),
        },
        {
            _id: "msg-3-2",
            chatId: "chat-3",
            senderId: "user-3",
            receiverId: CURRENT_USER_ID,
            content: "¡Gracias por la compra! 🎉",
            status: "seen",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
    ],
    "chat-4": [],
};

// ============ COMPONENT ============
export default function MessagesPage() {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Record<string, IMessage[]>>(mockMessages);

    const activeChat = mockChats.find((c) => c._id === activeChatId);
    const activeMessages = activeChatId ? messages[activeChatId] || [] : [];
    const otherParticipant = activeChat?.participants.find((p) => p._id !== CURRENT_USER_ID);

    const handleSendMessage = (content: string) => {
        if (!activeChatId || !otherParticipant) return;

        const newMessage: IMessage = {
            _id: `msg-${Date.now()}`,
            chatId: activeChatId,
            senderId: CURRENT_USER_ID,
            receiverId: otherParticipant._id,
            content,
            status: "sent",
            createdAt: new Date(),
        };

        setMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMessage],
        }));

        // Simular cambio de status
        setTimeout(() => {
            setMessages((prev) => ({
                ...prev,
                [activeChatId]: prev[activeChatId].map((m) =>
                    m._id === newMessage._id ? { ...m, status: "delivered" } : m
                ),
            }));
        }, 1000);
    };

    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
    };

    const handleBack = () => {
        setActiveChatId(null);
    };

    return (
        <MainLayout>
            <div className="h-[calc(100vh-4rem)] flex bg-background">
                {/* Chat List - hidden on mobile when chat is active */}
                <div
                    className={cn(
                        "w-full md:w-1/3 lg:w-1/4 border-r bg-card",
                        activeChatId && "hidden md:block"
                    )}
                >
                    <ChatList
                        chats={mockChats}
                        currentUserId={CURRENT_USER_ID}
                        activeChatId={activeChatId || undefined}
                        onChatSelect={handleChatSelect}
                    />
                </div>

                {/* Chat Window */}
                <div
                    className={cn(
                        "flex-1 flex flex-col",
                        !activeChatId && "hidden md:flex"
                    )}
                >
                    {activeChat && otherParticipant ? (
                        <>
                            <ChatHeader
                                participant={otherParticipant}
                                onBack={handleBack}
                                showBackButton={true}
                            />
                            <MessageList
                                messages={activeMessages}
                                currentUserId={CURRENT_USER_ID}
                                className="flex-1"
                            />
                            <MessageInput onSend={handleSendMessage} />
                        </>
                    ) : (
                        <EmptyChat />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
