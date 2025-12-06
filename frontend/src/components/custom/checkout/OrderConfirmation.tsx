import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderConfirmationProps {
    orderNumber: string;
    email?: string;
    onContinueShopping: () => void;
    onViewOrder?: () => void;
}

const OrderConfirmation = ({
    orderNumber,
    email = "tu correo electrónico",
    onContinueShopping,
    onViewOrder,
}: OrderConfirmationProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <Card className="w-full max-w-lg border-0 shadow-xl overflow-hidden">
                {/* Success Header */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white">
                    <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-in zoom-in-50 duration-500">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                        ¡Pedido Confirmado!
                    </h1>
                    <p className="text-green-100 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                        Tu compra se ha realizado exitosamente
                    </p>
                </div>

                <CardContent className="p-6 space-y-6">
                    {/* Order Number */}
                    <div className="text-center py-4 bg-muted/50 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">
                            Número de Pedido
                        </p>
                        <p className="text-2xl font-bold font-mono tracking-wider text-primary">
                            #{orderNumber}
                        </p>
                    </div>

                    {/* Info Message */}
                    <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                        <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-blue-900 dark:text-blue-100">
                                ¿Qué sigue?
                            </p>
                            <p className="text-blue-700 dark:text-blue-300 mt-1">
                                Te enviaremos un correo a <span className="font-medium">{email}</span> con los detalles de tu pedido y el seguimiento del envío.
                            </p>
                        </div>
                    </div>

                    {/* Delivery Estimate */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Tiempo estimado de entrega:</p>
                        <p className="font-semibold text-foreground text-lg">3-5 días hábiles</p>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-3">
                        {onViewOrder && (
                            <Button
                                onClick={onViewOrder}
                                className="w-full gap-2"
                                size="lg"
                            >
                                <Package className="h-4 w-4" />
                                Ver Mi Pedido
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={onContinueShopping}
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Home className="h-4 w-4" />
                            Seguir Comprando
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderConfirmation;
