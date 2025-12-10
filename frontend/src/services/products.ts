import type { IProduct, ICreateProductPayload, IUpdateProductPayload } from "@/types/AppTypes";

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

const getAuthToken = () => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored).token : null;
};

export const productService = {
    async getProducts(): Promise<IProduct[]> {
        const response = await fetch(`${API_URL}/api/products`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Error fetching products");
        const data = await response.json();
        // Handle nested structure: data.data.products
        if (data.data && Array.isArray(data.data.products)) {
            return data.data.products;
        }
        return data.data || data;
    },

    async getProduct(id: string): Promise<IProduct> {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Error fetching product");
        const data = await response.json();
        return data.data || data;
    },

    async createProduct(payload: ICreateProductPayload): Promise<IProduct> {
        const response = await fetch(`${API_URL}/api/products`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error creating product");
        }
        const data = await response.json();
        return data.data || data;
    },

    async updateProduct(id: string, payload: IUpdateProductPayload): Promise<IProduct> {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error updating product");
        }
        const data = await response.json();
        return data.data || data;
    },

    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error deleting product");
        }
    },

    async uploadProductImages(productId: string, files: File[]): Promise<string[]> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append("images", file);
        });

        const token = getAuthToken();
        const response = await fetch(`${API_URL}/api/products/${productId}/images`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error uploading images");
        }
        const data = await response.json();
        return data.data || data;
    },
};
