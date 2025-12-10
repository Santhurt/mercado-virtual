import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
    Package,
    MapPin,
    CreditCard,
    ImageIcon,
    Store,
    Calendar,
    Hash,
    XCircle,
} from "lucide-react";
import OrderStatusBadge from "../OrderStatusBadge";
import type { IOrder, IOrderProduct } from "@/types/AppTypes";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { orderService } from "@/services/orders";
import { useToast } from "@/components/ui/use-toast";

interface OrderProductsModalProps {
    order: IOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOrderUpdated?: () => void;
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

const getImageUrl = (imagePath?: string): string | undefined => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
};

const getPaymentMethodLabel = (method: string): string => {
    const methods: Record<string, string> = {
        credit_card: "Tarjeta de Crédito",
        pse: "PSE",
        nequi: "Nequi",
        cash_on_delivery: "Contra Entrega",
    };
    return methods[method] || method;
};

const ProductItem = ({ product }: { product: IOrderProduct }) => {
    // Handle seller - can be string (ID) or populated object
    const getSellerName = (seller: any): string => {
        if (!seller) return "No disponible";
        if (typeof seller === "string") return seller;
        if (typeof seller === "object" && seller.businessName) return seller.businessName;
        return "No disponible";
    };

    return (
        <div className="flex gap-4 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center border border-border/50">
                {product.image ? (
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                    {product.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Store className="h-3 w-3" />
                    <span>Vendedor: {getSellerName(product.seller)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="font-normal">
                            x{product.quantity}
                        </Badge>
                        <span className="text-muted-foreground">
                            @ {formatCurrency(product.unitPrice)}
                        </span>
                    </div>
                    <span className="font-semibold text-primary">
                        {formatCurrency(product.subtotal)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const OrderProductsModal = ({ order, open, onOpenChange, onOrderUpdated }: OrderProductsModalProps) => {
    const { user, token } = useAuthContext();
    const { toast } = useToast();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    if (!order) return null;

    const canBeCancelled = order.status === "pending" || order.status === "processing";

    const handleCancelOrder = async () => {
        if (!token || !user) {
            toast({
                title: "Error",
                description: "Debes estar autenticado para cancelar una orden",
                variant: "destructive",
            });
            return;
        }

        setIsCancelling(true);
        try {
            await orderService.updateOrderStatus(order._id, "cancelled", user._id, token);
            toast({
                title: "Orden cancelada",
                description: "Tu orden ha sido cancelada exitosamente",
            });
            setShowCancelDialog(false);
            onOpenChange(false);
            onOrderUpdated?.();
        } catch (error) {
            toast({
                title: "Error al cancelar",
                description: error instanceof Error ? error.message : "No se pudo cancelar la orden",
                variant: "destructive",
            });
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-muted-foreground" />
                            <span className="font-mono">
                                {order._id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        <OrderStatusBadge status={order.status} />
                    </DialogTitle>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.createdAt)}</span>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    {/* Products List */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                            <Package className="h-4 w-4" />
                            Productos ({order.products.length})
                        </h3>
                        <div className="space-y-3">
                            {order.products.map((product, index) => (
                                <ProductItem
                                    key={`${product.productId}-${index}`}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold text-foreground">
                            Resumen del Pedido
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Envío</span>
                                <span>{formatCurrency(order.shippingCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Impuestos</span>
                                <span>{formatCurrency(order.taxes)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Descuento</span>
                                    <span>-{formatCurrency(order.discount)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                            <MapPin className="h-4 w-4" />
                            Dirección de Envío
                        </h3>
                        <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-1">
                            <p className="font-medium text-foreground">
                                {order.shippingAddress.fullName}
                            </p>
                            <p className="text-muted-foreground">
                                {order.shippingAddress.addressLine}
                            </p>
                            <p className="text-muted-foreground">
                                {order.shippingAddress.city}
                            </p>
                            <p className="text-muted-foreground">
                                Tel: {order.shippingAddress.phone}
                            </p>
                            {order.shippingAddress.details && (
                                <p className="text-muted-foreground italic">
                                    {order.shippingAddress.details}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                            <CreditCard className="h-4 w-4" />
                            Método de Pago
                        </h3>
                        <div className="bg-muted/30 rounded-lg p-4">
                            <Badge variant="outline" className="text-sm">
                                {getPaymentMethodLabel(order.deliveryMethod || "No especificado")}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Footer with Cancel Button */}
                {canBeCancelled && (
                    <div className="flex-shrink-0 border-t pt-4 px-6 pb-2">
                        <Button
                            variant="destructive"
                            className="w-full gap-2"
                            onClick={() => setShowCancelDialog(true)}
                        >
                            <XCircle className="h-4 w-4" />
                            Cancelar Orden
                        </Button>
                    </div>
                )}
            </DialogContent>

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar esta orden?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. La orden #{order._id.slice(-8).toUpperCase()}
                            será marcada como cancelada y no podrás reactivarla.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isCancelling}>
                            No, mantener orden
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelOrder}
                            disabled={isCancelling}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isCancelling ? "Cancelando..." : "Sí, cancelar orden"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default OrderProductsModal;
