import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { ICartItem } from "@/types/AppTypes";
import { cartService } from "@/services/cart";
import { useAuthContext } from "./AuthContext";

interface CartContextType {
    items: ICartItem[];
    totalPrice: number;
    itemCount: number;
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    addItem: (item: Omit<ICartItem, "quantity"> & { quantity?: number }) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    refreshCart: () => Promise<void>;
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, token, isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

    // Fetch cart from backend on mount and when user changes
    const refreshCart = useCallback(async () => {
        if (!isAuthenticated || !user?._id || !token) {
            setItems([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const cart = await cartService.getCart(user._id, token);
            setItems(cart.items || []);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err instanceof Error ? err.message : "Error al cargar carrito");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?._id, token]);

    // Load cart when authentication state changes
    useEffect(() => {
        if (!isAuthLoading) {
            refreshCart();
        }
    }, [isAuthLoading, refreshCart]);

    const addItem = useCallback(async (item: Omit<ICartItem, "quantity"> & { quantity?: number }) => {
        if (!isAuthenticated || !user?._id || !token) {
            setError("Debes iniciar sesión para agregar al carrito");
            throw new Error("Usuario no autenticado");
        }

        setIsLoading(true);
        setError(null);
        try {
            const cart = await cartService.addItem({
                userId: user._id,
                productId: item.productId,
                title: item.title,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image,
            }, token);
            setItems(cart.items || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al agregar al carrito";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?._id, token]);

    const removeItem = useCallback(async (productId: string) => {
        if (!isAuthenticated || !user?._id || !token) {
            setError("Debes iniciar sesión");
            throw new Error("Usuario no autenticado");
        }

        setIsLoading(true);
        setError(null);
        try {
            const cart = await cartService.removeItem({
                userId: user._id,
                productId,
            }, token);
            setItems(cart.items || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar del carrito";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?._id, token]);

    const updateQuantity = useCallback(async (productId: string, quantity: number) => {
        if (!isAuthenticated || !user?._id || !token) {
            setError("Debes iniciar sesión");
            throw new Error("Usuario no autenticado");
        }

        if (quantity < 1) {
            return removeItem(productId);
        }

        setIsLoading(true);
        setError(null);
        try {
            const cart = await cartService.updateItemQuantity({
                userId: user._id,
                productId,
                quantity,
            }, token);
            setItems(cart.items || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al actualizar cantidad";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?._id, token, removeItem]);

    const clearCart = useCallback(async () => {
        if (!isAuthenticated || !user?._id || !token) {
            setError("Debes iniciar sesión");
            throw new Error("Usuario no autenticado");
        }

        setIsLoading(true);
        setError(null);
        try {
            const cart = await cartService.clearCart({ userId: user._id }, token);
            setItems(cart.items || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al vaciar carrito";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?._id, token]);

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
            isLoading,
            error,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            openCart,
            closeCart,
            toggleCart,
            refreshCart,
        }),
        [items, totalPrice, itemCount, isOpen, isLoading, error, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart, toggleCart, refreshCart]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
