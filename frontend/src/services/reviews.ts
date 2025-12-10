import type { IReviewsResponse } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_STORAGE_KEY = "mercafacil_auth";

const getAuthHeaders = () => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    const token = stored ? JSON.parse(stored).token : null;
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const reviewService = {
    async getProductReviews(productId: string, page = 1, limit = 10): Promise<IReviewsResponse> {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        const response = await fetch(`${API_URL}/api/reviews/${productId}?${params.toString()}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Error fetching reviews");
        const data = await response.json();
        return data.data;
    },
};
