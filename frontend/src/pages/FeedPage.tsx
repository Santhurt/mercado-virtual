import ProductCard from "@/components/custom/ProductCard";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, Sparkles, Heart, Search } from "lucide-react";
import { useState } from "react";

const FeedPage = () => {
    const [activeTab, setActiveTab] = useState("productos");

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
    ];
    return (
        <MainLayout>


            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="productos" className="gap-2">
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">Productos</span>
                    </TabsTrigger>
                    <TabsTrigger value="ofertas" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">Ofertas</span>
                    </TabsTrigger>
                    <TabsTrigger value="siguiendo" className="gap-2">
                        <Heart className="h-4 w-4" />
                        <span className="hidden sm:inline">Siguiendo</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="productos" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product, index) => (
                            <ProductCard key={index} {...product} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="ofertas" className="mt-6">
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Sparkles className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                No hay ofertas especiales
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Las mejores ofertas aparecerán aquí cuando estén
                                disponibles
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="siguiendo" className="mt-6">
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <Heart className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                Sigue a vendedores
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                                Sigue a tus vendedores favoritos para ver sus
                                productos aquí
                            </p>
                            <Button variant="outline">
                                <Search className="h-4 w-4 mr-2" />
                                Buscar vendedores
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </MainLayout>
    );
};

export default FeedPage;
