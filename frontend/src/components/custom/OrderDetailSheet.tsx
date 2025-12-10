import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Truck,
    MapPin,
    Phone,
    Copy,
    Clock,
    ImageIcon,
    Loader2,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import type { IOrder, OrderStatus } from "@/types/AppTypes";
import { cn } from "@/lib/utils";

interface OrderDetailSheetProps {
    order: IOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusChange?: (orderId: string, newStatus: OrderStatus) => Promise<void>;
    isChangingStatus?: boolean;
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

const getImageUrl = (imagePath?: string): string | undefined => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
};

const statusOptions: { value: OrderStatus; label: string; description: string }[] = [
    { value: "pending", label: "Pendiente", description: "Orden recibida, pendiente de procesamiento" },
    { value: "processing", label: "Procesando", description: "Orden en preparación" },
    { value: "shipped", label: "Enviado", description: "Orden en camino al cliente" },
    { value: "delivered", label: "Entregado", description: "Orden entregada exitosamente" },
    { value: "cancelled", label: "Cancelado", description: "Orden cancelada" },
];

const OrderDetailSheet = ({
    order,
    open,
    onOpenChange,
    onStatusChange,
    isChangingStatus = false,
}: OrderDetailSheetProps) => {
    const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    if (!order) return null;

    const handleStatusSelect = (newStatus: string) => {
        if (newStatus === order.status) return;
        setPendingStatus(newStatus as OrderStatus);
        setShowConfirmDialog(true);
    };

    const handleConfirmStatusChange = async () => {
        if (!pendingStatus || !onStatusChange) return;
        await onStatusChange(order._id, pendingStatus);
        setShowConfirmDialog(false);
        setPendingStatus(null);
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(order._id);
    };

    const getStatusLabel = (status: OrderStatus): string => {
        return statusOptions.find(s => s.value === status)?.label || status;
    };

    return (
        <>
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
                        {/* Status Change Section */}
                        {onStatusChange && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Cambiar Estado
                                </h3>
                                <Select
                                    value={order.status}
                                    onValueChange={handleStatusSelect}
                                    disabled={isChangingStatus}
                                >
                                    <SelectTrigger className="w-full">
                                        {isChangingStatus ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Actualizando...</span>
                                            </div>
                                        ) : (
                                            <SelectValue placeholder="Seleccionar estado" />
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                disabled={option.value === order.status}
                                                className={cn(
                                                    option.value === "cancelled" && "text-destructive"
                                                )}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{option.label}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {option.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                                    src={getImageUrl(product.image)}
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
                                {order.sellerSubtotal !== undefined && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground font-medium">Tu Subtotal</span>
                                        <span className="text-foreground font-semibold">
                                            {formatCurrency(order.sellerSubtotal)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="font-bold text-foreground">Total Orden</span>
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

            {/* Confirmation Dialog */}
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingStatus === "cancelled"
                                ? "¿Cancelar esta orden?"
                                : "¿Cambiar estado de la orden?"
                            }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingStatus === "cancelled" ? (
                                <>
                                    Esta acción marcará la orden <strong>#{order._id.slice(-8).toUpperCase()}</strong> como cancelada.
                                    El cliente será notificado del cambio.
                                </>
                            ) : (
                                <>
                                    La orden <strong>#{order._id.slice(-8).toUpperCase()}</strong> será marcada como{" "}
                                    <strong>"{pendingStatus && getStatusLabel(pendingStatus)}"</strong>.
                                    Se registrará en el historial de la orden.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isChangingStatus}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmStatusChange}
                            disabled={isChangingStatus}
                            className={cn(
                                pendingStatus === "cancelled" &&
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            )}
                        >
                            {isChangingStatus ? "Actualizando..." : "Confirmar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default OrderDetailSheet;
