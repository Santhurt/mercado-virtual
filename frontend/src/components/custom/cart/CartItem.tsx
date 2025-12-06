import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ICartItem } from "@/types/AppTypes";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
    item: ICartItem;
}

const CartItem = ({ item }: CartItemProps) => {
    const { updateQuantity, removeItem } = useCart();

    const handleIncrement = () => {
        updateQuantity(item.productId, item.quantity + 1);
    };

    const handleDecrement = () => {
        updateQuantity(item.productId, item.quantity - 1);
    };

    const handleRemove = () => {
        removeItem(item.productId);
    };

    return (
        <div className="flex gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors group">
            {/* Product Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                    <h4 className="font-medium text-sm leading-tight line-clamp-2 text-foreground">
                        {item.title}
                    </h4>
                    <p className="text-primary font-semibold mt-1">
                        ${item.price.toLocaleString("es-CO")}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleDecrement}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={handleIncrement}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
