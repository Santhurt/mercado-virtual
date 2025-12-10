import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    ShoppingBag,
    Clock,
    TrendingUp,
    Package,
    Loader2,
    AlertCircle,
} from "lucide-react";
import OrderCard from "./OrderCard";
import OrderDetailSheet from "./OrderDetailSheet";
import type { IOrder, OrderStatus } from "@/types/AppTypes";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { orderService } from "@/services/orders";
import { userService } from "@/services/user";
import { useToast } from "@/components/ui/use-toast";

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
    const { user, token, isAuthenticated } = useAuthContext();
    const { toast } = useToast();

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [sellerId, setSellerId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    // Fetch seller ID on mount
    useEffect(() => {
        const fetchSellerId = async () => {
            if (!isAuthenticated || !user || !token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await userService.getSellerByUserId(user._id, token);
                if (response && response.data) {
                    const sellersData = response.data as any;
                    if (sellersData.sellers && sellersData.sellers.length > 0) {
                        setSellerId(sellersData.sellers[0]._id);
                    } else if (sellersData._id) {
                        setSellerId(sellersData._id);
                    } else {
                        setError("No tienes un perfil de vendedor activo");
                        setIsLoading(false);
                    }
                } else {
                    setError("No tienes un perfil de vendedor activo");
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al obtener perfil de vendedor");
                setIsLoading(false);
            }
        };

        fetchSellerId();
    }, [isAuthenticated, user, token]);

    // Fetch orders once we have the seller ID
    useEffect(() => {
        const fetchOrders = async () => {
            if (!sellerId || !token) return;

            setIsLoading(true);
            setError(null);

            try {
                const data = await orderService.getOrdersBySeller(sellerId, token);
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar las órdenes");
                console.error("Error fetching seller orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [sellerId, token]);

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

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        if (!token || !user) return;

        setIsChangingStatus(true);
        try {
            await orderService.updateOrderStatus(orderId, newStatus, user._id, token);
            toast({
                title: "Estado actualizado",
                description: `La orden ha sido marcada como "${getStatusLabel(newStatus)}"`,
            });
            // Refetch orders
            if (sellerId) {
                const data = await orderService.getOrdersBySeller(sellerId, token);
                setOrders(data);
                // Update selected order if it's still open
                if (selectedOrder && selectedOrder._id === orderId) {
                    const updated = data.find((o: IOrder) => o._id === orderId);
                    if (updated) setSelectedOrder(updated);
                }
            }
        } catch (err) {
            toast({
                title: "Error al actualizar",
                description: err instanceof Error ? err.message : "No se pudo actualizar el estado",
                variant: "destructive",
            });
        } finally {
            setIsChangingStatus(false);
        }
    };

    const getStatusLabel = (status: OrderStatus): string => {
        const labels: Record<OrderStatus, string> = {
            pending: "Pendiente",
            processing: "Procesando",
            shipped: "Enviado",
            delivered: "Entregado",
            cancelled: "Cancelado",
        };
        return labels[status];
    };

    // Stats calculations
    const todayOrders = orders.filter(
        (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
    ).length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const monthRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((acc, o) => acc + (o.sellerSubtotal || o.total), 0);
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

    // Not authenticated state
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Debes iniciar sesión para ver las órdenes</p>
            </div>
        );
    }

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
                                {isLoading ? "..." : stat.value}
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

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Cargando órdenes...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-lg">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
                    <p className="text-muted-foreground text-center max-w-md">{error}</p>
                </div>
            ) : filteredOrders.length > 0 ? (
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
                onStatusChange={handleStatusChange}
                isChangingStatus={isChangingStatus}
            />
        </div>
    );
};

export default OrdersSection;
