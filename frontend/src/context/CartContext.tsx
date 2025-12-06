import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ICartItem } from "@/types/AppTypes";

interface CartContextType {
    items: ICartItem[];
    totalPrice: number;
    itemCount: number;
    isOpen: boolean;
    addItem: (item: Omit<ICartItem, "quantity"> & { quantity?: number }) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [items, setItems] = useState<ICartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addItem = useCallback((item: Omit<ICartItem, "quantity"> & { quantity?: number }) => {
        setItems((prev) => {
            const existingItem = prev.find((i) => i.productId === item.productId);
            if (existingItem) {
                return prev.map((i) =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                        : i
                );
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    const totalPrice = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const value = useMemo(
        () => ({
            items,
            totalPrice,
            itemCount,
            isOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            openCart,
            closeCart,
            toggleCart,
        }),
        [items, totalPrice, itemCount, isOpen, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
