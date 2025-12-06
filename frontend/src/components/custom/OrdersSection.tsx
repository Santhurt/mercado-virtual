import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    ShoppingBag,
    Clock,
    TrendingUp,
    Package,
} from "lucide-react";
import OrderCard from "./OrderCard";
import OrderDetailSheet from "./OrderDetailSheet";
import type { IOrder, OrderStatus } from "@/types/AppTypes";
import { cn } from "@/lib/utils";

// Mock data para demostración
const mockOrders: IOrder[] = [
    {
        _id: "674f8a3b2c1d4e5f60718293",
        customerId: "customer_001",
        merchantId: "merchant_001",
        status: "pending",
        products: [
            {
                productId: "prod_001",
                title: "iPhone 15 Pro Max - 256GB Titanio Natural",
                unitPrice: 5299000,
                quantity: 1,
                subtotal: 5299000,
                image: "https://placehold.co/200x200/6366f1/ffffff?text=iPhone",
            },
            {
                productId: "prod_002",
                title: "AirPods Pro 2da Generación",
                unitPrice: 1199000,
                quantity: 2,
                subtotal: 2398000,
                image: "https://placehold.co/200x200/8b5cf6/ffffff?text=AirPods",
            },
        ],
        subtotal: 7697000,
        shippingCost: 0,
        taxes: 1462430,
        discount: 500000,
        total: 8659430,
        shippingAddress: {
            fullName: "Carlos Andrés Martínez",
            phone: "+57 300 123 4567",
            city: "Bogotá D.C.",
            addressLine: "Cra 15 #82-34 Apto 501",
            details: "Torre A, dejar con portería",
        },
        deliveryMethod: "delivery",
        trackingNumber: null,
        history: [
            { status: "pending", timestamp: new Date("2024-12-06T10:30:00"), actorId: "customer_001" },
        ],
        createdAt: new Date("2024-12-06T10:30:00"),
        updatedAt: new Date("2024-12-06T10:30:00"),
    },
    {
        _id: "674f7c2a1b0c3d4e5f607182",
        customerId: "customer_002",
        merchantId: "merchant_001",
        status: "processing",
        products: [
            {
                productId: "prod_003",
                title: "MacBook Air M3 15 pulgadas",
                unitPrice: 7499000,
                quantity: 1,
                subtotal: 7499000,
                image: "https://placehold.co/200x200/0ea5e9/ffffff?text=MacBook",
            },
        ],
        subtotal: 7499000,
        shippingCost: 25000,
        taxes: 1424810,
        discount: 0,
        total: 8948810,
        shippingAddress: {
            fullName: "María José López",
            phone: "+57 311 987 6543",
            city: "Medellín",
            addressLine: "Cll 10 #43A-27 Casa 12",
            details: "Unidad Cerrada Los Robles",
        },
        deliveryMethod: "delivery",
        trackingNumber: "COL123456789",
        history: [
            { status: "pending", timestamp: new Date("2024-12-05T14:20:00"), actorId: "customer_002" },
            { status: "processing", timestamp: new Date("2024-12-05T16:45:00"), actorId: "merchant_001" },
        ],
        createdAt: new Date("2024-12-05T14:20:00"),
        updatedAt: new Date("2024-12-05T16:45:00"),
    },
    {
        _id: "674f6e1b0a9b2c3d4e5f6071",
        customerId: "customer_003",
        merchantId: "merchant_001",
        status: "shipped",
        products: [
            {
                productId: "prod_004",
                title: "Apple Watch Ultra 2",
                unitPrice: 4299000,
                quantity: 1,
                subtotal: 4299000,
                image: "https://placehold.co/200x200/f59e0b/ffffff?text=Watch",
            },
            {
                productId: "prod_005",
                title: "Correa Alpine Loop",
                unitPrice: 449000,
                quantity: 1,
                subtotal: 449000,
                image: "https://placehold.co/200x200/10b981/ffffff?text=Correa",
            },
            {
                productId: "prod_006",
                title: "Cargador Magnético Rápido",
                unitPrice: 199000,
                quantity: 2,
                subtotal: 398000,
                image: "https://placehold.co/200x200/ec4899/ffffff?text=Cargador",
            },
            {
                productId: "prod_007",
                title: "Case Protector Ocean",
                unitPrice: 299000,
                quantity: 1,
                subtotal: 299000,
            },
        ],
        subtotal: 5445000,
        shippingCost: 15000,
        taxes: 1034550,
        discount: 200000,
        total: 6294550,
        shippingAddress: {
            fullName: "Andrés Felipe Gómez",
            phone: "+57 315 456 7890",
            city: "Cali",
            addressLine: "Av 3N #45-12",
        },
        deliveryMethod: "delivery",
        trackingNumber: "COL987654321",
        history: [
            { status: "pending", timestamp: new Date("2024-12-04T09:15:00"), actorId: "customer_003" },
            { status: "processing", timestamp: new Date("2024-12-04T11:30:00"), actorId: "merchant_001" },
            { status: "shipped", timestamp: new Date("2024-12-05T08:00:00"), actorId: "merchant_001" },
        ],
        createdAt: new Date("2024-12-04T09:15:00"),
        updatedAt: new Date("2024-12-05T08:00:00"),
    },
    {
        _id: "674f5f0c0918ab2c3d4e5f60",
        customerId: "customer_004",
        merchantId: "merchant_001",
        status: "delivered",
        products: [
            {
                productId: "prod_008",
                title: "iPad Pro 12.9\" M2",
                unitPrice: 6999000,
                quantity: 1,
                subtotal: 6999000,
                image: "https://placehold.co/200x200/3b82f6/ffffff?text=iPad",
            },
        ],
        subtotal: 6999000,
        shippingCost: 0,
        taxes: 1329810,
        discount: 0,
        total: 8328810,
        shippingAddress: {
            fullName: "Laura Valentina Ruiz",
            phone: "+57 320 234 5678",
            city: "Barranquilla",
            addressLine: "Cll 84 #51B-35",
        },
        deliveryMethod: "pickup",
        trackingNumber: null,
        history: [
            { status: "pending", timestamp: new Date("2024-12-01T18:00:00"), actorId: "customer_004" },
            { status: "processing", timestamp: new Date("2024-12-01T19:30:00"), actorId: "merchant_001" },
            { status: "shipped", timestamp: new Date("2024-12-02T10:15:00"), actorId: "merchant_001" },
            { status: "delivered", timestamp: new Date("2024-12-03T14:45:00"), actorId: "merchant_001" },
        ],
        createdAt: new Date("2024-12-01T18:00:00"),
        updatedAt: new Date("2024-12-03T14:45:00"),
    },
    {
        _id: "674f500d0807ab1c2d3e4f5f",
        customerId: "customer_005",
        merchantId: "merchant_001",
        status: "cancelled",
        products: [
            {
                productId: "prod_009",
                title: "HomePod mini",
                unitPrice: 549000,
                quantity: 3,
                subtotal: 1647000,
                image: "https://placehold.co/200x200/f43f5e/ffffff?text=HomePod",
            },
        ],
        subtotal: 1647000,
        shippingCost: 10000,
        taxes: 312930,
        discount: 0,
        total: 1969930,
        shippingAddress: {
            fullName: "Pedro Alejandro Sánchez",
            phone: "+57 318 765 4321",
            city: "Cartagena",
            addressLine: "Bocagrande Cll 5 #4-56",
        },
        deliveryMethod: "delivery",
        trackingNumber: null,
        history: [
            { status: "pending", timestamp: new Date("2024-11-28T12:00:00"), actorId: "customer_005" },
            { status: "cancelled", timestamp: new Date("2024-11-29T09:00:00"), actorId: "customer_005" },
        ],
        createdAt: new Date("2024-11-28T12:00:00"),
        updatedAt: new Date("2024-11-29T09:00:00"),
    },
];

const statusFilters: { value: OrderStatus | "all"; label: string }[] = [
    { value: "all", label: "Todas" },
    { value: "pending", label: "Pendientes" },
    { value: "processing", label: "Procesando" },
    { value: "shipped", label: "Enviadas" },
    { value: "delivered", label: "Entregadas" },
    { value: "cancelled", label: "Canceladas" },
];

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(amount);
};

const OrdersSection = () => {
    const [orders] = useState<IOrder[]>(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch =
            searchQuery === "" ||
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleViewDetails = (order: IOrder) => {
        setSelectedOrder(order);
        setIsSheetOpen(true);
    };

    // Stats calculations
    const todayOrders = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const monthRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((acc, o) => acc + o.total, 0);
    const processingOrders = orders.filter((o) => o.status === "processing" || o.status === "shipped").length;

    const stats = [
        {
            label: "Órdenes Hoy",
            value: todayOrders,
            icon: ShoppingBag,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-950/50",
        },
        {
            label: "Pendientes",
            value: pendingOrders,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-100 dark:bg-amber-950/50",
        },
        {
            label: "En Proceso",
            value: processingOrders,
            icon: Package,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-950/50",
        },
        {
            label: "Ingresos del Mes",
            value: formatCurrency(monthRevenue),
            icon: TrendingUp,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-950/50",
            isLarge: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-4 flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">
                                {stat.label}
                            </p>
                            <p className={cn(
                                "font-bold text-foreground",
                                stat.isLarge ? "text-lg" : "text-2xl"
                            )}>
                                {stat.value}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por ID, cliente o ciudad..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Status Pills */}
                <div className="flex gap-2 flex-wrap">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                                statusFilter === filter.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {filter.label}
                            {filter.value !== "all" && (
                                <Badge
                                    variant="secondary"
                                    className="ml-1.5 h-5 px-1.5 text-[10px] bg-background/50"
                                >
                                    {orders.filter((o) => o.status === filter.value).length}
                                </Badge>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredOrders.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg text-muted-foreground">
                    <ShoppingBag className="h-12 w-12 mb-4 opacity-50" />
                    <p className="font-medium">No hay órdenes</p>
                    <p className="text-sm">
                        {searchQuery || statusFilter !== "all"
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "Las órdenes de tus clientes aparecerán aquí"}
                    </p>
                </div>
            )}

            {/* Order Detail Sheet */}
            <OrderDetailSheet
                order={selectedOrder}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </div>
    );
};

export default OrdersSection;
