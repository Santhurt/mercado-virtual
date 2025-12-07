import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { IChat } from "@/types/ChatTypes";
import { MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
    chats: IChat[];
    currentUserId: string;
    activeChatId?: string;
    onChatSelect?: (chatId: string) => void;
    className?: string;
}

export function ChatList({ chats, currentUserId, activeChatId, onChatSelect, className }: ChatListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredChats = chats.filter((chat) => {
        if (!searchQuery.trim()) return true;
        const otherParticipant = chat.participants.find((p) => p._id !== currentUserId);
        return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold mb-3">Mensajes</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Buscar conversación..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2">
                {filteredChats.length > 0 ? (
                    <div className="space-y-1">
                        {filteredChats.map((chat) => (
                            <ChatListItem
                                key={chat._id}
                                chat={chat}
                                currentUserId={currentUserId}
                                isActive={chat._id === activeChatId}
                                onClick={() => onChatSelect?.(chat._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-3">
                            <MessageCircle className="size-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {searchQuery ? "No se encontraron conversaciones" : "No tienes conversaciones aún"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
