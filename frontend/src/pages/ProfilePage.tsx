import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, FileText } from "lucide-react";
import ProductCard from "@/components/custom/ProductCard";
import UserProfileCard from "@/components/custom/UserProfileCard";

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("productos");

    const userProfile = {
        name: "Usuario",
        username: "@usuario",
        bio: "Vendedor de productos de calidad",
        location: "Pereira, Risaralda",
        joinDate: "Marzo 2024",
        stats: {
            productos: 24,
            seguidores: 1200,
            siguiendo: 350,
            ventas: 156,
        },
        badges: ["Verificado", "Top Seller", "Premium"],
        rating: 4.8,
    };

    const products = [
        {
            title: "Zapatillas Running Pro Max",
            price: "$89.99",
            status: "Nuevo",
            discount: "20%",
            rating: 4.8,
            tags: ["Deporte", "Unisex", "Trending"],
        },
        {
            title: "Camiseta Deportiva Premium Fit",
            price: "$34.99",
            status: "Popular",
            rating: 4.6,
            tags: ["Fitness", "Algodón", "Eco"],
        },
        {
            title: "Mochila Urbana Impermeable 30L",
            price: "$59.99",
            status: "Oferta",
            discount: "15%",
            rating: 4.9,
            tags: ["Travel", "Laptop", "Resistente"],
        },
        {
            title: "Reloj Inteligente Fitness Pro",
            price: "$199.99",
            status: "Destacado",
            rating: 4.7,
            tags: ["Tech", "Salud", "GPS"],
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Tarjeta de Perfil */}
                <UserProfileCard userProfile={userProfile} />

                {/* Tabs de contenido */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="productos" className="gap-2">
                            <Package className="h-4 w-4" />
                            Productos
                        </TabsTrigger>
                        <TabsTrigger value="posts" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Posts
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="productos" className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product, index) => (
                                <ProductCard key={index} {...product} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="posts" className="mt-6">
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="rounded-full bg-muted p-4 mb-4">
                                    <FileText className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    No hay posts aún
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Las publicaciones de este usuario aparecerán
                                    aquí
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
