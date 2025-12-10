import type { ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const categoryService = {
    async getCategories(): Promise<ICategory[]> {
        const response = await fetch(`${API_URL}/api/categories`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Error fetching categories");
        const data = await response.json();
        return data.data || data; // Adjust based on consistency of API wrapper
    },

    async createCategory(payload: ICreateCategoryPayload): Promise<ICategory> {
        const response = await fetch(`${API_URL}/api/categories`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error creating category");
        }
        const data = await response.json();
        return data.data || data;
    },

    async updateCategory(id: string, payload: IUpdateCategoryPayload): Promise<ICategory> {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error updating category");
        }
        const data = await response.json();
        return data.data || data;
    },

    async deleteCategory(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/categories/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error deleting category");
        }
    },
};
