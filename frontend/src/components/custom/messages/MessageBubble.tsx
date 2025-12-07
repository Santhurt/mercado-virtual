import { cn } from "@/lib/utils";
import type { IMessage, MessageStatus } from "@/types/ChatTypes";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
    message: IMessage;
    isOwn: boolean;
}

function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function StatusIcon({ status }: { status: MessageStatus }) {
    switch (status) {
        case "seen":
            return <CheckCheck className="size-4 text-primary" />;
        case "delivered":
            return <CheckCheck className="size-4 text-muted-foreground/70" />;
        case "sent":
        default:
            return <Check className="size-4 text-muted-foreground/70" />;
    }
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
        <div
            className={cn(
                "flex w-full mb-1",
                isOwn ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[75%] px-4 py-2.5 rounded-2xl",
                    "transition-all duration-200",
                    isOwn
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                )}
            >
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                </p>
                <div
                    className={cn(
                        "flex items-center justify-end gap-1 mt-1",
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                >
                    <span className="text-[10px]">{formatTime(message.createdAt)}</span>
                    {isOwn && <StatusIcon status={message.status} />}
                </div>
            </div>
        </div>
    );
}
