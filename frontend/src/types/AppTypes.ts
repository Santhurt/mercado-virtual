import type React from "react";

export interface IPost {
    id: string;
    user: string;
    role: string;
    timestamp: string;
    category: string;
    title: string;
    description: string;
    price: string;
    images: number;
    likes: number;
    comments: number;
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
