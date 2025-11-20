import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, FileText, Star } from "lucide-react";
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

    const products = Array(6)
        .fill(null)
        .map((_, i) => ({
            id: i + 1,
            title: `Producto ${i + 1}`,
            price: "$299",
            image: null,
            status: "Disponible",
        }));

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
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    title={product.title}
                                    price={product.price}
                                    status={product.status}
                                />
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
