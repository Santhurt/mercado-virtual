import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface CategoryPillProps {
    icon: LucideIcon;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const CategoryPill = ({
    icon: Icon,
    label,
    isActive = false,
    onClick,
}: CategoryPillProps) => {
    return (
        <Button
            variant={isActive ? "default" : "outline"}
            className={`rounded-full gap-2 px-6 h-10 transition-all ${isActive
                    ? "shadow-md scale-105"
                    : "hover:border-primary/50 hover:bg-accent"
                }`}
            onClick={onClick}
        >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{label}</span>
        </Button>
    );
};

export default CategoryPill;
