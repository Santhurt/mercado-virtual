import { cn } from "@/lib/utils";
import type { IMessage } from "@/types/ChatTypes";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageListProps {
    messages: IMessage[];
    currentUserId: string;
    isLoading?: boolean;
    className?: string;
}

function formatDateSeparator(date: Date): string {
    const today = new Date();
    const msgDate = new Date(date);

    if (msgDate.toDateString() === today.toDateString()) {
        return "Hoy";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (msgDate.toDateString() === yesterday.toDateString()) {
        return "Ayer";
    }

    return msgDate.toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
}

function groupMessagesByDate(messages: IMessage[]): Map<string, IMessage[]> {
    const groups = new Map<string, IMessage[]>();

    for (const message of messages) {
        const dateKey = new Date(message.createdAt).toDateString();
        const existing = groups.get(dateKey) || [];
        existing.push(message);
        groups.set(dateKey, existing);
    }

    return groups;
}

function MessageSkeleton() {
    return (
        <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex w-full",
                        i % 2 === 0 ? "justify-start" : "justify-end"
                    )}
                >
                    <Skeleton
                        className={cn(
                            "h-12 rounded-2xl",
                            i % 2 === 0 ? "w-[60%] rounded-bl-md" : "w-[45%] rounded-br-md"
                        )}
                    />
                </div>
            ))}
        </div>
    );
}

export function MessageList({ messages, currentUserId, isLoading = false, className }: MessageListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const groupedMessages = groupMessagesByDate(messages);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    if (isLoading) {
        return <MessageSkeleton />;
    }

    if (messages.length === 0) {
        return (
            <div className={cn("flex-1 flex items-center justify-center p-4", className)}>
                <p className="text-muted-foreground text-sm text-center">
                    No hay mensajes aún. ¡Envía el primero!
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn("flex-1 overflow-y-auto p-4", className)}
        >
            {Array.from(groupedMessages.entries()).map(([dateKey, msgs]) => (
                <div key={dateKey}>
                    {/* Date separator */}
                    <div className="flex items-center justify-center my-4">
                        <span className="px-3 py-1 bg-muted/80 text-muted-foreground text-xs font-medium rounded-full">
                            {formatDateSeparator(new Date(dateKey))}
                        </span>
                    </div>

                    {/* Messages for this date */}
                    {msgs.map((message) => (
                        <MessageBubble
                            key={message._id}
                            message={message}
                            isOwn={message.senderId === currentUserId}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
