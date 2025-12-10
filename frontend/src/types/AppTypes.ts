import type React from "react";

// ===== USER TYPES =====

export type UserRole = "admin" | "seller" | "customer";

export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    documentNumber: string;
    age: number;
    phone: string;
    registrationDate: Date;
    role: UserRole;
    profileImage?: string | null;
}

export interface ICategory {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISellerProfile {
    _id: string;
    user: IUser;
    businessName: string;
    accountStatus: string;
}

export interface IProduct {
    _id: string;
    title: string;
    price: number;
    status: string;
    rating: number;
    reviewCount: number;
    description: string;
    features: string[];
    specifications: Record<string, string>;
    tags: string[];
    stock: number;
    images: string[];
    seller?: ISellerProfile;
    categories: ICategory[] | string[]; // Can be IDs during creation or Objects after population
    createdAt: Date;
    updatedAt: Date;
    originalPrice?: number | string;
    discount?: number | string;
}

// Payloads
export interface ICreateCategoryPayload {
    name: string;
    description?: string;
    image?: string;
}

export interface IUpdateCategoryPayload extends Partial<ICreateCategoryPayload> { }

export interface ICreateProductPayload {
    title: string;
    price: number;
    status: string;
    description: string;
    features: string[];
    specifications: Record<string, string>;
    tags: string[];
    stock: number;
    categories: string[]; // IDs
    images?: string[];
}

export interface IUpdateProductPayload extends Partial<ICreateProductPayload> { }

// ===== ORDER TYPES =====

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderProduct {
    productId: string;
    title: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    image?: string;
}

export interface IShippingAddress {
    fullName: string;
    phone: string;
    city: string;
    addressLine: string;
    details?: string;
}

export interface IOrderHistoryEntry {
    status: OrderStatus;
    timestamp: Date;
    actorId?: string;
}

export interface IOrder {
    _id: string;
    customerId: string;
    merchantId: string;
    status: OrderStatus;
    products: IOrderProduct[];
    subtotal: number;
    shippingCost: number;
    taxes: number;
    discount: number;
    total: number;
    shippingAddress: IShippingAddress;
    deliveryMethod: string;
    trackingNumber?: string | null;
    history: IOrderHistoryEntry[];
    createdAt: Date;
    updatedAt: Date;
}

// ===== CART TYPES =====

export type CartStatus = "active" | "completed" | "abandoned";

export interface ICartItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface ICart {
    userId?: string | null;
    sessionId?: string | null;
    items: ICartItem[];
    totalPrice: number;
    status: CartStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

// ===== CHECKOUT TYPES =====

export type PaymentMethod = "credit_card" | "pse" | "nequi" | "cash_on_delivery";

export type CheckoutStep = "shipping" | "payment" | "review" | "confirmation";

export interface IPaymentDetails {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
    bankCode?: string; // Para PSE
    phoneNumber?: string; // Para Nequi
}

export interface ICheckoutState {
    step: CheckoutStep;
    shippingAddress: IShippingAddress | null;
    paymentMethod: PaymentMethod | null;
    paymentDetails: IPaymentDetails | null;
    orderNumber?: string;
}

// ===== AUTH TYPES =====

export interface ILoginPayload {
    email: string;
    password: string;
}

export interface IRegisterPayload {
    fullName: string;
    email: string;
    password: string;
    documentNumber: string;
    age: number;
    phone: string;
    role?: UserRole;
    registrationDate?: string;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        token: string;
    };
}
