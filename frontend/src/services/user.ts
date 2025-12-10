import type { IUser, ICreateSellerPayload, ISeller } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL;

export interface UpdateUserPayload {
    fullName?: string;
    email?: string;
    documentNumber?: string;
    age?: number;
    phone?: string;
    role?: "customer" | "seller" | "admin";
    password?: string;
}

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: IUser;
}

export interface CreateSellerResponse {
    success: boolean;
    message: string;
    data: ISeller;
}

export interface GetSellerResponse {
    success: boolean;
    data: ISeller;
}

export const userService = {
    /**
     * Update user profile including role
     */
    async updateUser(userId: string, data: UpdateUserPayload, token: string): Promise<UpdateUserResponse> {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al actualizar usuario");
        }

        return response.json();
    },

    /**
     * Create a seller profile for the user
     */
    async createSeller(userId: string, payload: ICreateSellerPayload, token: string): Promise<CreateSellerResponse> {
        const response = await fetch(`${API_URL}/api/sellers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                userId,
                ...payload,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al crear perfil de vendedor");
        }

        return response.json();
    },

    /**
     * Get seller profile by user ID
     */
    async getSellerByUserId(userId: string, token: string): Promise<GetSellerResponse | null> {
        const response = await fetch(`${API_URL}/api/sellers?userId=${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener perfil de vendedor");
        }

        return response.json();
    },

    /**
     * Delete seller profile
     */
    async deleteSeller(sellerId: string, token: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${API_URL}/api/sellers/${sellerId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al eliminar perfil de vendedor");
        }

        return response.json();
    },
};
