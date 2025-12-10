import type { IOrder, IShippingAddress, IOrderProduct, PaymentMethod } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL;

export interface ICreateOrderPayload {
    customerId: string;
    products: {
        productId: string;
        title: string;
        unitPrice: number;
        quantity: number;
        subtotal: number;
        image?: string;
        seller: string;
    }[];
    subtotal: number;
    shippingCost: number;
    taxes: number;
    discount: number;
    total: number;
    shippingAddress: IShippingAddress;
    deliveryMethod?: string;
    paymentMethod?: PaymentMethod;
}

export interface IOrderResponse {
    message?: string;
    order?: IOrder;
}

export const orderService = {
    /**
     * Create a new order
     */
    async createOrder(payload: ICreateOrderPayload, token: string): Promise<IOrder> {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al crear la orden");
        }

        return response.json();
    },

    /**
     * Get order by ID
     */
    async getOrderById(orderId: string, token: string): Promise<IOrder> {
        const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener la orden");
        }

        return response.json();
    },

    /**
     * Get orders by user ID
     */
    async getOrdersByUser(userId: string, token: string): Promise<IOrder[]> {
        const response = await fetch(`${API_URL}/api/orders/user/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener las órdenes");
        }

        return response.json();
    },

    /**
     * Get orders by seller ID
     */
    async getOrdersBySeller(sellerId: string, token: string): Promise<IOrder[]> {
        const response = await fetch(`${API_URL}/api/orders/seller/${sellerId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener las órdenes del vendedor");
        }

        return response.json();
    },

    /**
     * Update order status
     */
    async updateOrderStatus(
        orderId: string,
        status: string,
        actorId: string | undefined,
        token: string
    ): Promise<IOrder> {
        const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status, actorId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al actualizar el estado de la orden");
        }

        return response.json();
    },
};
