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

    // Mock products with updated props format
    const products = [
        {
            _id: "mock_1",
            title: "Zapatillas Running Pro Max",
            price: 89990,
            status: "Nuevo",
            discount: 20,
            rating: 4.8,
            reviewCount: 45,
            tags: ["Deporte", "Unisex", "Trending"],
        },
        {
            _id: "mock_2",
            title: "Camiseta Deportiva Premium Fit",
            price: 34990,
            status: "Popular",
            rating: 4.6,
            reviewCount: 32,
            tags: ["Fitness", "Algodón", "Eco"],
        },
        {
            _id: "mock_3",
            title: "Mochila Urbana Impermeable 30L",
            price: 59990,
            status: "Oferta",
            discount: 15,
            rating: 4.9,
            reviewCount: 67,
            tags: ["Travel", "Laptop", "Resistente"],
        },
        {
            _id: "mock_4",
            title: "Reloj Inteligente Fitness Pro",
            price: 199990,
            status: "Destacado",
            rating: 4.7,
            reviewCount: 128,
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
                            {products.map((product) => (
                                <ProductCard key={product._id} {...product} />
                            ))}
                        </div>
                    </TabsContent>


                </Tabs>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
