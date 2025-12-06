import CategoryPill from "@/components/custom/CategoryPill";
import ProductCard from "@/components/custom/ProductCard";
import PromoBanner from "@/components/custom/PromoBanner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Package,
    Sparkles,
    Heart,
    Search,
    Shirt,
    Home,
    Dumbbell,
    Smartphone,
    Gamepad,
    Watch,
    Bell,
    ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const FeedPage = () => {
    const { addItem } = useCart();
    useEffect(() => {
        addItem({ productId: "123", title: "Producto", price: 25000 });
    }, [])
    const [activeTab, setActiveTab] = useState("productos");
    const [activeCategory, setActiveCategory] = useState("Todo");

    const categories = [
        { label: "Todo", icon: Package },
        { label: "Tecnología", icon: Smartphone },
        { label: "Ropa", icon: Shirt },
        { label: "Hogar", icon: Home },
        { label: "Deportes", icon: Dumbbell },
        { label: "Gaming", icon: Gamepad },
        { label: "Accesorios", icon: Watch },
    ];

    const products = [
        {
            title: "iPhone 15 Pro Max - Nuevo en caja",
            price: "$1,299",
            status: "Nuevo",
            rating: 4.8,
            tags: ["Electrónica", "Apple", "Garantía"],
        },
        {
            title: "Lote de ropa de marca - 50 piezas",
            price: "$2,500",
            status: "Mayorista",
            rating: 4.5,
            tags: ["Ropa", "Lote", "Negocio"],
        },
        {
            title: "Laptop Gaming RTX 4070",
            price: "$1,799",
            status: "Usado - Como nuevo",
            rating: 4.9,
            tags: ["Gaming", "Laptop", "High-End"],
        },
        {
            title: "Sony WH-1000XM5",
            price: "$349",
            status: "Oferta",
            discount: "15%",
            rating: 4.7,
            tags: ["Audio", "Sony", "Noise Cancelling"],
        },
        {
            title: "Nike Air Jordan 1 High",
            price: "$180",
            status: "Nuevo",
            rating: 4.6,
            tags: ["Moda", "Sneakers", "Original"],
        },
        {
            title: "Smart TV Samsung 55' 4K",
            price: "$499",
            status: "Reacondicionado",
            rating: 4.3,
            tags: ["Hogar", "TV", "Samsung"],
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-8 pb-10">
                {/* Header Section with Search */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar productos, marcas o categorías..."
                            className="pl-10 h-11 rounded-full bg-muted/40 border-transparent focus:bg-background transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
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

                {/* Promo Banner */}
                <PromoBanner />

                {/* Categories Scroll */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Categorías</h3>
                        <Button variant="link" className="text-primary h-auto p-0">
                            Ver todas
                        </Button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {categories.map((cat) => (
                            <CategoryPill
                                key={cat.label}
                                icon={cat.icon}
                                label={cat.label}
                                isActive={activeCategory === cat.label}
                                onClick={() => setActiveCategory(cat.label)}
                            />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <ProductCard key={index} {...product} />
                            ))}
                        </div>
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
