import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Truck,
    MapPin,
    Phone,
    Copy,
    Clock,
    ImageIcon,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import type { IOrder, OrderStatus } from "@/types/AppTypes";
import { cn } from "@/lib/utils";

interface OrderDetailSheetProps {
    order: IOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateStatus?: (order: IOrder, newStatus: OrderStatus) => void;
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
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const formatShortDate = (date: Date): string => {
    return new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
};

const statusOrder: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

const OrderDetailSheet = ({
    order,
    open,
    onOpenChange,
    onUpdateStatus,
}: OrderDetailSheetProps) => {
    if (!order) return null;

    const currentStatusIndex = statusOrder.indexOf(order.status);
    const nextStatus = order.status !== "cancelled" && currentStatusIndex < statusOrder.length - 1
        ? statusOrder[currentStatusIndex + 1]
        : null;

    const handleCopyId = () => {
        navigator.clipboard.writeText(order._id);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-lg">
                <SheetHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Orden #{order._id.slice(-8).toUpperCase()}
                        </SheetTitle>
                        <OrderStatusBadge status={order.status} />
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Quick Actions */}
                    {nextStatus && onUpdateStatus && (
                        <div className="flex gap-2">
                            <Button
                                className="flex-1 gap-2"
                                onClick={() => onUpdateStatus(order, nextStatus)}
                            >
                                Marcar como{" "}
                                {nextStatus === "processing" && "Procesando"}
                                {nextStatus === "shipped" && "Enviado"}
                                {nextStatus === "delivered" && "Entregado"}
                            </Button>
                        </div>
                    )}

                    {/* Order Info */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Información
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ID de Orden</span>
                                <button
                                    onClick={handleCopyId}
                                    className="flex items-center gap-1.5 font-mono text-foreground hover:text-primary transition-colors"
                                >
                                    {order._id.slice(-12)}
                                    <Copy className="h-3 w-3" />
                                </button>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Fecha</span>
                                <span className="text-foreground">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Método de Entrega</span>
                                <Badge variant="outline" className="capitalize">
                                    {order.deliveryMethod}
                                </Badge>
                            </div>
                            {order.trackingNumber && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tracking</span>
                                    <span className="font-mono text-foreground flex items-center gap-1.5">
                                        <Truck className="h-3.5 w-3.5" />
                                        {order.trackingNumber}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Products */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Productos ({order.products.length})
                        </h3>
                        <div className="space-y-3">
                            {order.products.map((product) => (
                                <div
                                    key={product.productId}
                                    className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                                >
                                    <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground line-clamp-2">
                                            {product.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                            <span>{formatCurrency(product.unitPrice)} × {product.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">
                                            {formatCurrency(product.subtotal)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Summary */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Resumen de Pago
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Envío</span>
                                <span className="text-foreground">
                                    {order.shippingCost > 0 ? formatCurrency(order.shippingCost) : "Gratis"}
                                </span>
                            </div>
                            {order.taxes > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Impuestos</span>
                                    <span className="text-foreground">{formatCurrency(order.taxes)}</span>
                                </div>
                            )}
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Descuento</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                        -{formatCurrency(order.discount)}
                                    </span>
                                </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between">
                                <span className="font-bold text-foreground">Total</span>
                                <span className="font-extrabold text-xl text-primary">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Dirección de Envío
                        </h3>
                        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {order.shippingAddress.fullName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.shippingAddress.addressLine}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.shippingAddress.city}
                                    </p>
                                    {order.shippingAddress.details && (
                                        <p className="text-xs text-muted-foreground italic">
                                            {order.shippingAddress.details}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-foreground">
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    {order.history.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Historial
                                </h3>
                                <div className="relative pl-4">
                                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-border" />
                                    {order.history.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="relative flex items-start gap-3 pb-4 last:pb-0"
                                        >
                                            <div
                                                className={cn(
                                                    "absolute left-[-4px] top-1.5 h-3 w-3 rounded-full border-2",
                                                    index === 0
                                                        ? "bg-primary border-primary"
                                                        : "bg-background border-border"
                                                )}
                                            />
                                            <div className="flex-1 min-w-0 ml-4">
                                                <div className="flex items-center gap-2">
                                                    <OrderStatusBadge
                                                        status={entry.status}
                                                        size="sm"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {formatShortDate(entry.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default OrderDetailSheet;
