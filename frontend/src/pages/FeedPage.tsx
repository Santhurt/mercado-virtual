import CreatePostCard from "@/components/custom/CreatePostCard";
import PostCard from "@/components/custom/PostCard";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, Sparkles, Heart, Search } from "lucide-react";
import { useState } from "react";

const FeedPage = () => {
    const [activeTab, setActiveTab] = useState("productos");

    const posts = [
        {
            id: 1,
            user: "Ana López",
            role: "Vendedor Verificado",
            title: "iPhone 15 Pro Max - Nuevo en caja",
            description:
                "256GB, Color Titanio Natural. Garantía oficial Apple.",
            price: "$1,299",
            images: 4,
            likes: 124,
            comments: 28,
            timestamp: "2h",
            category: "Electrónica",
        },
        {
            id: 2,
            user: "María García",
            role: "Mayorista Premium",
            title: "Lote de ropa de marca - 50 piezas",
            description: "Variedad de tallas y estilos. Stock limitado.",
            price: "$2,500",
            images: 8,
            likes: 85,
            comments: 42,
            timestamp: "5h",
            category: "Textiles",
        },
        {
            id: 3,
            user: "Carlos Ruiz",
            role: "Distribuidor Oficial",
            title: "Laptop Gaming RTX 4070",
            description: "Intel i9, 32GB RAM, 1TB SSD. Como nueva.",
            price: "$1,799",
            images: 6,
            likes: 156,
            comments: 63,
            timestamp: "1d",
            category: "Tecnología",
        },
    ];
    return (
        <MainLayout>
            <CreatePostCard />

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
                    {posts.map((post) => (
                        <PostCard post={post} />
                    ))}
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
                                publicaciones aquí
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
