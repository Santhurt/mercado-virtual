import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Settings,
    Share2,
    MapPin,
    Calendar,
    Award,
    Package,
    FileText,
    Star,
    ShoppingBag,
} from "lucide-react";

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
                <Card>
                    <CardContent className="pt-6">
                        {/* Avatar y acciones */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                            <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                    U
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h1 className="text-2xl font-bold">
                                        {userProfile.name}
                                    </h1>
                                    {userProfile.badges
                                        .slice(0, 1)
                                        .map((badge, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                <Award className="h-3 w-3" />
                                                {badge}
                                            </Badge>
                                        ))}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {userProfile.username}
                                </p>
                                <p className="text-sm mb-3">
                                    {userProfile.bio}
                                </p>

                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        {userProfile.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Fecha de registro:{" "}
                                        {userProfile.joinDate}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {userProfile.rating} rating
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                                <Button className="flex-1 sm:flex-none">
                                    Seguir
                                </Button>
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                            <div className="text-center">
                                <p className="text-2xl font-bold">
                                    {userProfile.stats.productos}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Productos
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">
                                    {userProfile.stats.ventas}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Ventas
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">
                                    {userProfile.stats.seguidores}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Seguidores
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">
                                    {userProfile.stats.siguiendo}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Siguiendo
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                <Card
                                    key={product.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="aspect-square bg-muted flex items-center justify-center relative">
                                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                                        <Badge
                                            className="absolute top-2 right-2"
                                            variant="secondary"
                                        >
                                            {product.status}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-lg font-bold text-primary">
                                            {product.price}
                                        </p>
                                    </CardContent>
                                </Card>
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
