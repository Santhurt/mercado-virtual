import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Preloader = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[9999] animate-fade-in",
                className,
            )}
        >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
};

export default Preloader;
