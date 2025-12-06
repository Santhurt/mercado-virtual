import type React from "react";



export interface IProduct {
    title: string;
    price: string;
    originalPrice?: string; // Opcional, ya que tiene un condicional
    discount?: string; // Opcional
    status: string;
    rating: number;
    reviewCount: number;
    description: string;
    features: string[];
    specifications: Record<string, string>; // Un objeto con claves string y valores string
    tags: string[];
    stock: number;
    seller: ISellerInfo; // Se refiere a la interfaz del vendedor
}
export interface ISellerInfo {
    name: string;
    username: string;
    rating: number;
    sales: number;
    location: string;
    verified: boolean;
}
export interface IComment {
    id: number;
    user: string;
    username: string;
    avatar: string; // Para el texto de fallback del avatar (ej: "MG")
    rating: number;
    comment: string;
    date: string;
}

// Para las rutas
export interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType;
    to: string;
    badge?: number;
}
export interface IUserProfile {
    name: string;
    username: string;
    bio: string;
    location: string;
    joinDate: string; // Asumimos string formateado
    rating: number;
    badges: string[];
    stats: {
        productos: number;
        ventas: number;
        seguidores: number;
        siguiendo: number;
    };
    // avatarUrl?: string; // Si hubiera imagen, se agregaría aquí
}
