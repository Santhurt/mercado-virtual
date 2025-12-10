import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Star, Package, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/custom/ProductCard";
import { userService } from "@/services/user";
import { productService } from "@/services/products";
import { useAuthContext } from "@/context/AuthContext";
import type { ISeller, IProduct } from "@/types/AppTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SellerProfilePage = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const navigate = useNavigate();
    const { token } = useAuthContext();

    const [seller, setSeller] = useState<ISeller | null>(null);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSellerData = async () => {
            if (!sellerId || !token) {
                setError("No se pudo cargar la información del vendedor");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Fetch seller info
                const sellerResponse = await userService.getSellerById(sellerId, token);
                setSeller(sellerResponse.data);

                // Fetch seller's products
                const productsResponse = await productService.getProductsWithFilters({
                    sellerId: sellerId,
                });
                setProducts(productsResponse.products || []);
            } catch (err) {
                console.error("Error fetching seller data:", err);
                setError(err instanceof Error ? err.message : "Error al cargar datos del vendedor");
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [sellerId, token]);

    // Construct logo URL
    const getLogoUrl = (logo?: string) => {
        if (!logo) return undefined;
        return logo.startsWith("http") ? logo : `${API_URL}${logo}`;
    };

    // Get initials from business name
    const getInitials = (name: string) => {
        if (!name) return "V";
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return parts.map((p) => p.charAt(0)).join("").toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    {/* Skeleton for seller card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-6 w-48" />
                                    <Skeleton className="h-4 w-64" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Skeleton for products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-64 rounded-lg" />
                        ))}
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !seller) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <p className="text-destructive text-lg">{error || "Vendedor no encontrado"}</p>
                    <Button onClick={() => navigate(-1)} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Back button */}
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>

                {/* Seller Profile Card */}
                <Card className="w-full shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Avatar */}
                            <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary">
                                {getLogoUrl(seller.logo) && (
                                    <AvatarImage src={getLogoUrl(seller.logo)} alt={seller.businessName} />
                                )}
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                    {getInitials(seller.businessName)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h1 className="text-2xl font-bold">{seller.businessName}</h1>
                                    {seller.accountStatus === "activo" && (
                                        <Badge variant="secondary" className="gap-1">
                                            Verificado
                                        </Badge>
                                    )}
                                </div>

                                {seller.description && (
                                    <p className="text-muted-foreground mb-3">{seller.description}</p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        4.8 rating
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="h-4 w-4" />
                                        {products.length} productos
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Colombia
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-6 border-t">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{products.length}</p>
                                <p className="text-sm text-muted-foreground">Productos</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">150</p>
                                <p className="text-sm text-muted-foreground">Ventas</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">1.2K</p>
                                <p className="text-sm text-muted-foreground">Seguidores</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">4.8</p>
                                <p className="text-sm text-muted-foreground">Rating</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Section */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Productos del vendedor</h2>
                    </div>

                    {products.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Este vendedor aún no tiene productos</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    _id={product._id}
                                    title={product.title}
                                    price={product.price}
                                    status={product.status}
                                    discount={product.discount ? Number(product.discount) : undefined}
                                    rating={product.rating}
                                    reviewCount={product.reviewCount}
                                    tags={product.tags}
                                    images={product.images}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default SellerProfilePage;
