import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Eye,
    Truck,
    MapPin,
    ImageIcon,
    User,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import type { IOrder } from "@/types/AppTypes";
import { cn } from "@/lib/utils";

interface OrderCardProps {
    order: IOrder;
    onViewDetails: (order: IOrder) => void;
    onUpdateStatus?: (order: IOrder) => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const OrderCard = ({ order, onViewDetails, onUpdateStatus }: OrderCardProps) => {
    const displayedProducts = order.products.slice(0, 3);
    const remainingCount = order.products.length - 3;

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-foreground">
                            #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <OrderStatusBadge status={order.status} size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                        </DropdownMenuItem>
                        {order.trackingNumber && (
                            <DropdownMenuItem>
                                <Truck className="h-4 w-4 mr-2" />
                                Ver Tracking
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onUpdateStatus?.(order)}>
                            Cambiar Estado
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Products Thumbnails */}
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                    {displayedProducts.map((product, index) => (
                        <div
                            key={product.productId}
                            className={cn(
                                "relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border/50",
                                index > 0 && "-ml-3",
                                "shadow-sm"
                            )}
                            style={{ zIndex: displayedProducts.length - index }}
                        >
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                            )}
                        </div>
                    ))}
                    {remainingCount > 0 && (
                        <div className="h-12 w-12 rounded-lg bg-muted border border-border/50 flex items-center justify-center -ml-3 shadow-sm">
                            <span className="text-xs font-bold text-muted-foreground">
                                +{remainingCount}
                            </span>
                        </div>
                    )}
                    <div className="ml-2 flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {order.products.length} {order.products.length === 1 ? "producto" : "productos"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {displayedProducts.map(p => p.title).join(", ")}
                        </p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[120px]">
                            {order.shippingAddress.fullName}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{order.shippingAddress.city}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/30">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">
                        Total
                    </span>
                    <p className="font-extrabold text-xl text-primary">
                        {formatCurrency(order.total)}
                    </p>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    className="h-9 px-4 gap-2"
                    onClick={() => onViewDetails(order)}
                >
                    <Eye className="h-3.5 w-3.5" />
                    Ver Detalles
                </Button>
            </div>
        </Card>
    );
};

export default OrderCard;
