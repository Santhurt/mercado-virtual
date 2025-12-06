import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package } from "lucide-react";
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
                    <TabsList className="w-full grid grid-cols-1">
                        <TabsTrigger value="productos" className="gap-2">
                            <Package className="h-4 w-4" />
                            Productos
                        </TabsTrigger>

                    </TabsList>

                    <TabsContent value="productos" className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <ProductCard key={index} {...product} />
                            ))}
                        </div>
                    </TabsContent>


                </Tabs>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
