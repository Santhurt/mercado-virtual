import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageInputProps {
    onSend?: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export function MessageInput({
    onSend,
    disabled = false,
    placeholder = "Escribe un mensaje...",
    className,
}: MessageInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [message]);

    const handleSend = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || disabled) return;

        onSend?.(trimmedMessage);
        setMessage("");

        // Reset height
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={cn("p-4 border-t bg-background", className)}>
            <div className="flex items-end gap-2">
                <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="min-h-[44px] max-h-[150px] resize-none py-3"
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="shrink-0 size-11 rounded-full"
                >
                    <SendHorizontal className="size-5" />
                </Button>
            </div>
        </div>
    );
}
