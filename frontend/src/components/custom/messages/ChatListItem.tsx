import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { IChat, IChatParticipant } from "@/types/ChatTypes";
import { Check, CheckCheck } from "lucide-react";

interface ChatListItemProps {
    chat: IChat;
    currentUserId: string;
    isActive?: boolean;
    onClick?: () => void;
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function getOtherParticipant(participants: IChatParticipant[], currentUserId: string): IChatParticipant {
    return participants.find((p) => p._id !== currentUserId) || participants[0];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function ChatListItem({ chat, currentUserId, isActive = false, onClick }: ChatListItemProps) {
    const otherParticipant = getOtherParticipant(chat.participants, currentUserId);
    const lastMessage = chat.lastMessage;
    const isOwnMessage = lastMessage?.senderId === currentUserId;

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                "hover:bg-accent/50 cursor-pointer text-left",
                isActive && "bg-accent"
            )}
        >
            {/* Avatar con indicador online */}
            <div className="relative shrink-0">
                <Avatar className="size-12">
                    <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(otherParticipant.name)}
                    </AvatarFallback>
                </Avatar>
                {otherParticipant.isOnline && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background rounded-full" />
                )}
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">
                        {otherParticipant.name}
                    </span>
                    {lastMessage && (
                        <span className="text-xs text-muted-foreground shrink-0">
                            {formatRelativeTime(lastMessage.createdAt)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                    {/* Status icon para mensajes propios */}
                    {lastMessage && isOwnMessage && (
                        <span className="shrink-0">
                            {lastMessage.status === "seen" ? (
                                <CheckCheck className="size-4 text-primary" />
                            ) : lastMessage.status === "delivered" ? (
                                <CheckCheck className="size-4 text-muted-foreground" />
                            ) : (
                                <Check className="size-4 text-muted-foreground" />
                            )}
                        </span>
                    )}

                    <p className="text-sm text-muted-foreground truncate">
                        {lastMessage?.content || "Sin mensajes"}
                    </p>
                </div>
            </div>

            {/* Badge de mensajes no leídos */}
            {chat.unreadCount && chat.unreadCount > 0 && (
                <span className="shrink-0 size-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                </span>
            )}
        </button>
    );
}
