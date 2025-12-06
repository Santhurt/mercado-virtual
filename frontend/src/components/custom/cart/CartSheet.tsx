import { ShoppingBag, ArrowRight } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";

const CartSheet = () => {
    const { items, totalPrice, itemCount, isOpen, closeCart, clearCart } = useCart();

    const isEmpty = items.length === 0;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
                <SheetHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <SheetTitle className="flex items-center gap-2 text-xl">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            Carrito
                        </SheetTitle>
                        {itemCount > 0 && (
                            <Badge variant="secondary" className="font-semibold">
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </Badge>
                        )}
                    </div>
                    <SheetDescription>
                        Revisa tus productos antes de proceder al pago
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-2" />

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto py-2 space-y-3">
                    {isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <div className="rounded-full bg-muted p-6 mb-4">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-1">
                                Tu carrito está vacío
                            </h3>
                            <p className="text-muted-foreground text-sm max-w-[200px]">
                                Agrega productos para comenzar tu compra
                            </p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItem key={item.productId} item={item} />
                        ))
                    )}
                </div>

                {/* Footer */}
                {!isEmpty && (
                    <>
                        <Separator className="my-2" />
                        <SheetFooter className="flex-col gap-3 sm:flex-col">
                            {/* Totals */}
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal ({itemCount} items)
                                    </span>
                                    <span>${totalPrice.toLocaleString("es-CO")}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Envío</span>
                                    <span className="text-green-600">Calculado al pagar</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">
                                        ${totalPrice.toLocaleString("es-CO")}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <Button className="w-full gap-2" size="lg">
                                <span>Proceder al Pago</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground hover:text-destructive"
                                onClick={clearCart}
                            >
                                Vaciar carrito
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartSheet;
