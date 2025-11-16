import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
    Flame
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription, CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [activeItem, setActiveItem] = useState("home");

    const trending = [
        {
            id: 1,
            title: "Smartphones",
            growth: "+24%",
            emoji: "📱",
            products: 234,
        },
        { id: 2, title: "Gaming", growth: "+18%", emoji: "🎮", products: 189 },
        { id: 3, title: "Moda", growth: "+32%", emoji: "👗", products: 156 },
    ];

    const suggested = [
        { id: 1, name: "Tech Store Pro", followers: "2.5k", verified: true },
        { id: 2, name: "Fashion Hub", followers: "1.8k", verified: false },
        { id: 3, name: "Electronics Plus", followers: "3.2k", verified: true },
    ];

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                />

                <SidebarInset className="flex-1 flex flex-col">
                    {/* Header */}
                    <AppHeader />

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto p-4 md:p-6">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Main Feed */}
                                <main className="lg:col-span-8 space-y-6">
                                    {children}
                                </main>

                                {/* Right Sidebar */}
                                <aside className="lg:col-span-4 space-y-6">
                                    {/* Trending Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Flame className="h-5 w-5 text-orange-500" />
                                                Tendencias
                                            </CardTitle>
                                            <CardDescription>
                                                Categorías más buscadas hoy
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-0">
                                            {trending.map((item, index) => (
                                                <div key={item.id}>
                                                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                                        <div className="text-2xl">
                                                            {item.emoji}
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <p className="font-medium text-sm">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {item.products}{" "}
                                                                productos
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge
                                                                variant="outline"
                                                                className="font-semibold"
                                                            >
                                                                #{index + 1}
                                                            </Badge>
                                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                                {item.growth}
                                                            </p>
                                                        </div>
                                                    </button>
                                                    {index <
                                                        trending.length - 1 && (
                                                        <Separator className="my-0" />
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Suggested Sellers Card */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Vendedores sugeridos
                                            </CardTitle>
                                            <CardDescription>
                                                Encuentra nuevos vendedores
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {suggested.map((seller) => (
                                                <div
                                                    key={seller.id}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                                            {seller.name[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate flex items-center gap-1">
                                                            {seller.name}
                                                            {seller.verified && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="h-4 px-1 text-[10px]"
                                                                >
                                                                    ✓
                                                                </Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {seller.followers}{" "}
                                                            seguidores
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Seguir
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                variant="ghost"
                                                className="w-full"
                                            >
                                                Ver más
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </aside>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
