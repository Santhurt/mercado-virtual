import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface EmptyChatProps {
    className?: string;
}

export function EmptyChat({ className }: EmptyChatProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center h-full p-8", className)}>
            <div className="size-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                <MessageSquare className="size-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Tus mensajes</h3>
            <p className="text-muted-foreground text-center text-sm max-w-xs">
                Selecciona una conversación para comenzar a chatear o inicia una nueva
            </p>
        </div>
    );
}
