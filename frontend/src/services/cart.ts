import type { ICart, ICartItem } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL;

export interface IAddToCartPayload {
    userId: string;
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface IUpdateCartItemPayload {
    userId: string;
    productId: string;
    quantity: number;
}

export interface IRemoveCartItemPayload {
    userId: string;
    productId: string;
}

export interface IClearCartPayload {
    userId: string;
}

export const cartService = {
    /**
     * Get the active cart for a user
     */
    async getCart(userId: string, token: string): Promise<ICart> {
        const response = await fetch(`${API_URL}/api/cart?userId=${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener el carrito");
        }

        return response.json();
    },

    /**
     * Add an item to the cart
     */
    async addItem(payload: IAddToCartPayload, token: string): Promise<ICart> {
        const response = await fetch(`${API_URL}/api/cart/add`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al agregar al carrito");
        }

        return response.json();
    },

    /**
     * Update the quantity of an item in the cart
     */
    async updateItemQuantity(payload: IUpdateCartItemPayload, token: string): Promise<ICart> {
        const response = await fetch(`${API_URL}/api/cart/update`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al actualizar cantidad");
        }

        return response.json();
    },

    /**
     * Remove an item from the cart
     */
    async removeItem(payload: IRemoveCartItemPayload, token: string): Promise<ICart> {
        const response = await fetch(`${API_URL}/api/cart/remove`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al eliminar del carrito");
        }

        return response.json();
    },

    /**
     * Clear all items from the cart
     */
    async clearCart(payload: IClearCartPayload, token: string): Promise<ICart> {
        const response = await fetch(`${API_URL}/api/cart/clear`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al vaciar el carrito");
        }

        return response.json();
    },
};
