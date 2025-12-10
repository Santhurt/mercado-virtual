import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Eye,
    MapPin,
    ImageIcon,
    Calendar,
    Package,
} from "lucide-react";
import OrderStatusBadge from "../OrderStatusBadge";
import type { IOrder } from "@/types/AppTypes";
import { cn } from "@/lib/utils";

interface UserOrderCardProps {
    order: IOrder;
    onViewProducts: (order: IOrder) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const getImageUrl = (imagePath?: string): string | undefined => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith("http")) return imagePath;
    // Remove leading slash if present and prepend API_URL
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
};

const UserOrderCard = ({ order, onViewProducts }: UserOrderCardProps) => {
    const displayedProducts = order.products.slice(0, 4);
    const remainingCount = order.products.length - 4;

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 dark:hover:border-primary/50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                            #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <OrderStatusBadge status={order.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(order.createdAt)}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider block">
                        Total
                    </span>
                    <p className="font-extrabold text-xl text-primary">
                        {formatCurrency(order.total)}
                    </p>
                </div>
            </div>

            {/* Products Preview */}
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        {displayedProducts.map((product, index) => (
                            <div
                                key={`${product.productId}-${index}`}
                                className={cn(
                                    "relative h-14 w-14 rounded-lg overflow-hidden bg-muted flex items-center justify-center border-2 border-background shadow-md",
                                    index > 0 && "-ml-4"
                                )}
                                style={{ zIndex: displayedProducts.length - index }}
                            >
                                {product.image ? (
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                                )}
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="h-14 w-14 rounded-lg bg-primary/10 border-2 border-background flex items-center justify-center -ml-4 shadow-md">
                                <span className="text-sm font-bold text-primary">
                                    +{remainingCount}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {order.products.length} {order.products.length === 1 ? "producto" : "productos"}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {displayedProducts.map(p => p.title).join(", ")}
                        </p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                        <p className="truncate">{order.shippingAddress.addressLine}</p>
                        <p>{order.shippingAddress.city}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-4 border-t border-border/50 bg-muted/20">
                <Button
                    variant="default"
                    size="sm"
                    className="h-9 px-5 gap-2"
                    onClick={() => onViewProducts(order)}
                >
                    <Eye className="h-4 w-4" />
                    Ver Productos
                </Button>
            </div>
        </Card>
    );
};

export default UserOrderCard;
