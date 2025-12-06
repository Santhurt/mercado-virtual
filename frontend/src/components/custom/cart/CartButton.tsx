import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CartButton = () => {
    const { itemCount, openCart } = useCart();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
            aria-label="Abrir carrito de compras"
        >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-in zoom-in-50 duration-200">
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </Button>
    );
};

export default CartButton;
