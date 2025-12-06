import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/AppTypes";
import {
    Clock,
    Package,
    Truck,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: "sm" | "md";
}

const statusConfig: Record<
    OrderStatus,
    {
        label: string;
        icon: React.ElementType;
        className: string;
    }
> = {
    pending: {
        label: "Pendiente",
        icon: Clock,
        className:
            "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
    },
    processing: {
        label: "Procesando",
        icon: Package,
        className:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
    },
    shipped: {
        label: "Enviado",
        icon: Truck,
        className:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
    },
    delivered: {
        label: "Entregado",
        icon: CheckCircle,
        className:
            "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
    },
    cancelled: {
        label: "Cancelado",
        icon: XCircle,
        className:
            "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
    },
};

const OrderStatusBadge = ({ status, size = "md" }: OrderStatusBadgeProps) => {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold gap-1.5 transition-colors",
                config.className,
                size === "sm" && "text-[10px] px-1.5 py-0.5",
                size === "md" && "text-xs px-2 py-1"
            )}
        >
            <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
            {config.label}
        </Badge>
    );
};

export default OrderStatusBadge;
