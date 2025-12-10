import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IChatParticipant } from "@/types/ChatTypes";
import { ArrowLeft, MoreVertical, Wifi, WifiOff } from "lucide-react";

interface ChatHeaderProps {
    participant: IChatParticipant;
    onBack?: () => void;
    showBackButton?: boolean;
    isConnected?: boolean;
    className?: string;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatLastSeen(date?: Date): string {
    if (!date) return "";

    const now = new Date();
    const lastSeen = new Date(date);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 5) return "Activo hace un momento";
    if (diffMins < 60) return `Activo hace ${diffMins} min`;
    if (diffHours < 24) return `Activo hace ${diffHours}h`;
    return `Últ. vez ${lastSeen.toLocaleDateString("es-CO", { day: "numeric", month: "short" })}`;
}

export function ChatHeader({ participant, onBack, showBackButton = false, isConnected, className }: ChatHeaderProps) {
    return (
        <div className={cn("flex items-center gap-3 p-4 border-b bg-background", className)}>
            {showBackButton && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="shrink-0 md:hidden"
                >
                    <ArrowLeft className="size-5" />
                </Button>
            )}

            <div className="relative shrink-0">
                <Avatar className="size-10">
                    <AvatarImage src={participant.profileImage} alt={participant.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                        {getInitials(participant.fullName)}
                    </AvatarFallback>
                </Avatar>
                {participant.isOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-background rounded-full" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{participant.fullName}</h3>
                <p className="text-xs text-muted-foreground truncate">
                    {participant.isOnline ? (
                        <span className="text-green-600 dark:text-green-400">En línea</span>
                    ) : (
                        formatLastSeen(participant.lastSeen)
                    )}
                </p>
            </div>

            {/* Connection status indicator */}
            {isConnected !== undefined && (
                <div className="shrink-0" title={isConnected ? "Conectado" : "Sin conexión"}>
                    {isConnected ? (
                        <Wifi className="size-4 text-green-500" />
                    ) : (
                        <WifiOff className="size-4 text-destructive" />
                    )}
                </div>
            )}

            <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="size-5" />
            </Button>
        </div>
    );
}
