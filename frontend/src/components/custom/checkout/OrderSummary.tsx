import { Package, MapPin, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ICartItem, IShippingAddress, PaymentMethod } from "@/types/AppTypes";

interface OrderSummaryProps {
    items: ICartItem[];
    shippingAddress?: IShippingAddress | null;
    paymentMethod?: PaymentMethod | null;
    subtotal: number;
    shippingCost?: number;
    taxRate?: number;
    onConfirm?: () => void;
    onBack?: () => void;
    showActions?: boolean;
    isReviewStep?: boolean;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
    credit_card: "Tarjeta de Crédito/Débito",
    pse: "PSE - Transferencia Bancaria",
    nequi: "Nequi",
    cash_on_delivery: "Pago Contraentrega",
};

const OrderSummary = ({
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost = 8000,
    taxRate = 0.19,
    onConfirm,
    onBack,
    showActions = false,
    isReviewStep = false,
}: OrderSummaryProps) => {
    const taxes = subtotal * taxRate;
    const total = subtotal + shippingCost + taxes;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Card className="border-0 shadow-lg sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-primary" />
                    Resumen del Pedido
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Products List */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-3">
                            <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                        IMG
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    Cantidad: {item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-medium whitespace-nowrap">
                                ${(item.price * item.quantity).toLocaleString("es-CO")}
                            </p>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                        </span>
                        <span>${subtotal.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Envío
                        </span>
                        <span>${shippingCost.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">IVA (19%)</span>
                        <span>${taxes.toLocaleString("es-CO", { maximumFractionDigits: 0 })}</span>
                    </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl text-primary">
                        ${total.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                    </span>
                </div>

                {/* Review Step: Show shipping and payment info */}
                {isReviewStep && (
                    <>
                        <Separator />

                        {shippingAddress && (
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    Enviar a
                                </h4>
                                <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                                    <p className="font-medium text-foreground">{shippingAddress.fullName}</p>
                                    <p>{shippingAddress.addressLine}</p>
                                    <p>{shippingAddress.city}</p>
                                    <p>{shippingAddress.phone}</p>
                                </div>
                            </div>
                        )}

                        {paymentMethod && (
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Método de Pago</h4>
                                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                                    {paymentMethodLabels[paymentMethod]}
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Actions */}
                {showActions && (
                    <div className="space-y-2 pt-2">
                        <Button onClick={onConfirm} className="w-full" size="lg">
                            Confirmar Pedido
                        </Button>
                        {onBack && (
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="w-full"
                                size="sm"
                            >
                                Volver
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderSummary;
