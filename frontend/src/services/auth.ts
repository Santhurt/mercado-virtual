import type { IAuthResponse, ILoginPayload, IRegisterPayload } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
    async login(payload: ILoginPayload): Promise<IAuthResponse> {
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al iniciar sesión");
        }

        return response.json();
    },

    async register(payload: IRegisterPayload): Promise<IAuthResponse> {
        const response = await fetch(`${API_URL}/api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al registrar usuario");
        }

        return response.json();
    },
};
