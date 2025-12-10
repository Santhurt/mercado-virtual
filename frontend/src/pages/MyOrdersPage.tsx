import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Search,
    ShoppingBag,
    Clock,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import UserOrderCard from "@/components/custom/orders/UserOrderCard";
import OrderProductsModal from "@/components/custom/orders/OrderProductsModal";
import type { IOrder, OrderStatus } from "@/types/AppTypes";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import { orderService } from "@/services/orders";

const statusFilters: { value: OrderStatus | "all"; label: string; icon: React.ElementType }[] = [
    { value: "all", label: "Todas", icon: ShoppingBag },
    { value: "pending", label: "Pendiente", icon: Clock },
    { value: "processing", label: "Procesando", icon: Package },
    { value: "shipped", label: "Enviado", icon: Truck },
    { value: "delivered", label: "Entregado", icon: CheckCircle },
    { value: "cancelled", label: "Cancelado", icon: XCircle },
];

const MyOrdersPage = () => {
    const { user, token, isAuthenticated } = useAuthContext();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated || !user || !token) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const data = await orderService.getOrdersByUser(user._id, token);
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar las órdenes");
                console.error("Error fetching orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, user, token]);

    // Filter orders based on status and search query
    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        const matchesSearch =
            searchQuery === "" ||
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.products.some((p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        return matchesStatus && matchesSearch;
    });

    // Count orders by status
    const getCountByStatus = (status: OrderStatus | "all"): number => {
        if (status === "all") return orders.length;
        return orders.filter((o) => o.status === status).length;
    };

    const handleViewProducts = (order: IOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // If not authenticated
    if (!isAuthenticated) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Inicia sesión para ver tus órdenes</h2>
                    <p className="text-muted-foreground">
                        Debes iniciar sesión para acceder a tu historial de pedidos.
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mis Órdenes</h1>
                        <p className="text-muted-foreground mt-1">
                            Revisa el estado de tus pedidos y su historial
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por ID o producto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => {
                        const Icon = filter.icon;
                        const count = getCountByStatus(filter.value);
                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setStatusFilter(filter.value)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    statusFilter === filter.value
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {filter.label}
                                {count > 0 && (
                                    <Badge
                                        variant={statusFilter === filter.value ? "secondary" : "outline"}
                                        className="ml-1 h-5 px-1.5 text-xs"
                                    >
                                        {count}
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Cargando tus órdenes...</p>
                    </div>
                ) : error ? (
                    <Card className="border-destructive/50">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Error al cargar las órdenes</h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                {error}
                            </p>
                        </CardContent>
                    </Card>
                ) : filteredOrders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {orders.length === 0
                                    ? "Aún no tienes órdenes"
                                    : "No se encontraron órdenes"}
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md">
                                {orders.length === 0
                                    ? "Cuando realices tu primera compra, aparecerá aquí."
                                    : "Intenta ajustar los filtros o el término de búsqueda."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredOrders.map((order) => (
                            <UserOrderCard
                                key={order._id}
                                order={order}
                                onViewProducts={handleViewProducts}
                            />
                        ))}
                    </div>
                )}

                {/* Order Products Modal */}
                <OrderProductsModal
                    order={selectedOrder}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                />
            </div>
        </MainLayout>
    );
};

export default MyOrdersPage;
