import ProductCard from "@/components/custom/ProductCard";
import PromoBanner from "@/components/custom/PromoBanner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Package,
    Sparkles,
    Heart,
    Search,
    Bell,
    ShoppingCart,
    Loader2,
    Filter,
    X,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useProductsFiltered } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { IProduct, IProductFilters, ICategory } from "@/types/AppTypes";

const FeedPage = () => {
    const [activeTab, setActiveTab] = useState("productos");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [filters, setFilters] = useState<IProductFilters>({
        limit: 20,
    });
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Fetch products with filters
    const { data: productsData, isLoading, error } = useProductsFiltered(filters);
    const { data: categories = [] } = useCategories();

    // Apply filters
    const applyFilters = () => {
        const newFilters: IProductFilters = {
            limit: 20,
        };
        if (minPrice) newFilters.minPrice = Number(minPrice);
        if (maxPrice) newFilters.maxPrice = Number(maxPrice);
        if (statusFilter !== "all") newFilters.status = statusFilter;
        setFilters(newFilters);
    };

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setStatusFilter("all");
        setFilters({ limit: 20 });
    };

    // Client-side filtering for search and category
    const filteredProducts = useMemo(() => {
        if (!productsData?.products) return [];

        return productsData.products.filter((product: IProduct) => {
            // Search filter (client-side)
            const matchesSearch = searchQuery === "" ||
                product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());

            // Category filter (client-side)
            const matchesCategory = activeCategory === "all" ||
                (product.categories as ICategory[])?.some(
                    (cat) => cat._id === activeCategory || cat.name === activeCategory
                );

            return matchesSearch && matchesCategory;
        });
    }, [productsData?.products, searchQuery, activeCategory]);

    const hasActiveFilters = minPrice || maxPrice || statusFilter !== "all";

    return (
        <MainLayout>
            <div className="space-y-8 pb-10">
                {/* Header Section with Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 rounded-full bg-muted/40 border-transparent focus:bg-background transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={showFilters ? "default" : "ghost"}
                            size="icon"
                            className="rounded-full"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                        >
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <Card className="animate-in slide-in-from-top-2 duration-200">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-6 items-end">
                                {/* Status Filter */}
                                <div className="space-y-2 min-w-[150px]">
                                    <Label>Estado</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="Available">Disponible</SelectItem>
                                            <SelectItem value="Out of Stock">Agotado</SelectItem>
                                            <SelectItem value="Discontinued">Descontinuado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price Range */}
                                <div className="space-y-2">
                                    <Label>Precio mínimo</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-32"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Precio máximo</Label>
                                    <Input
                                        type="number"
                                        placeholder="Sin límite"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-32"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button onClick={applyFilters}>
                                        Aplicar filtros
                                    </Button>
                                    {hasActiveFilters && (
                                        <Button variant="ghost" onClick={clearFilters}>
                                            <X className="h-4 w-4 mr-1" />
                                            Limpiar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Promo Banner */}
                <PromoBanner />

                {/* Categories from API */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Categorías</h3>
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="gap-1">
                                <Filter className="h-3 w-3" />
                                Filtros activos
                            </Badge>
                        )}
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        <Button
                            variant={activeCategory === "all" ? "default" : "outline"}
                            size="sm"
                            className="rounded-full whitespace-nowrap"
                            onClick={() => setActiveCategory("all")}
                        >
                            Todos
                        </Button>
                        {categories.map((cat: ICategory) => (
                            <Button
                                key={cat._id}
                                variant={activeCategory === cat._id ? "default" : "outline"}
                                size="sm"
                                className="rounded-full whitespace-nowrap"
                                onClick={() => setActiveCategory(cat._id)}
                            >
                                {cat.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-xl">
                            Explorar Productos
                        </h3>
                        <TabsList className="bg-muted/50">
                            <TabsTrigger value="productos" className="gap-2">
                                <Package className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Recientes
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="ofertas" className="gap-2">
                                <Sparkles className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Ofertas
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="siguiendo" className="gap-2">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    Siguiendo
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="productos" className="mt-0">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : error ? (
                            <Card className="border-destructive/50 bg-destructive/10">
                                <CardContent className="py-8 text-center">
                                    <p className="text-destructive font-medium">
                                        Error al cargar los productos
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Por favor, intenta de nuevo más tarde.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : filteredProducts.length === 0 ? (
                            <Card className="border-dashed bg-muted/20">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="rounded-full bg-background p-4 mb-4 shadow-sm">
                                        <Package className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        No hay productos
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        {searchQuery || hasActiveFilters
                                            ? "No se encontraron productos con los filtros seleccionados."
                                            : "Aún no hay productos disponibles."}
                                    </p>
                                    {(searchQuery || hasActiveFilters) && (
                                        <Button variant="outline" className="mt-4" onClick={() => {
                                            setSearchQuery("");
                                            clearFilters();
                                        }}>
                                            Limpiar búsqueda
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map((product: IProduct) => (
                                    <ProductCard
                                        key={product._id}
                                        _id={product._id}
                                        title={product.title}
                                        price={product.price}
                                        status={product.status}
                                        rating={product.rating}
                                        reviewCount={product.reviewCount}
                                        tags={product.tags}
                                        images={product.images}
                                        discount={product.discount}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="ofertas" className="mt-0">
                        <Card className="border-dashed bg-muted/20">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="rounded-full bg-background p-4 mb-4 shadow-sm">
                                    <Sparkles className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Ofertas Especiales
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Pronto encontrarás las mejores ofertas
                                    seleccionadas para ti.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="siguiendo" className="mt-0">
                        <Card className="border-dashed bg-muted/20">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="rounded-full bg-background p-4 mb-4 shadow-sm">
                                    <Heart className="h-10 w-10 text-destructive" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Tus Vendedores Favoritos
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                                    Sigue a tus vendedores favoritos para ver
                                    sus productos aquí
                                </p>
                                <Button variant="outline">
                                    <Search className="h-4 w-4 mr-2" />
                                    Buscar vendedores
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

export default FeedPage;
