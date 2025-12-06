import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Package, Tags, Percent, ShoppingBag } from "lucide-react";
import ProductManagementCard from "@/components/custom/ProductManagementCard";
import ProductForm from "@/components/custom/ProductForm";
import OrdersSection from "@/components/custom/OrdersSection";
import { useState } from "react";

const MerchantDashboardPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const products = [
        {
            id: 1,
            title: "iPhone 15 Pro Max - Nuevo en caja",
            price: "$1,299",
            stock: 5,
            status: "Activo",
            image: "https://placehold.co/200",
        },
        {
            id: 2,
            title: "Lote de ropa de marca - 50 piezas",
            price: "$2,500",
            stock: 1,
            status: "Activo",
            image: "https://placehold.co/200",
        },
        {
            id: 3,
            title: "Laptop Gaming RTX 4070",
            price: "$1,799",
            stock: 0,
            status: "Inactivo",
            image: "https://placehold.co/200",
        },
    ];

    return (
        <MainLayout>
            <div className="space-y-6 pb-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Panel de Control
                        </h1>
                        <p className="text-muted-foreground">
                            Gestiona tus productos, órdenes, inventario y promociones.
                        </p>
                    </div>

                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button className="gap-2 shadow-lg">
                                <Plus className="h-4 w-4" />
                                Nuevo Producto
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto sm:max-w-md">
                            <SheetHeader>
                                <SheetTitle>Crear Nuevo Producto</SheetTitle>
                                <SheetDescription>
                                    Completa la información para publicar tu
                                    producto.
                                </SheetDescription>
                            </SheetHeader>
                            <ProductForm />
                        </SheetContent>
                    </Sheet>
                </div>

                <Tabs defaultValue="ordenes" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[550px]">
                        <TabsTrigger value="ordenes" className="gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Órdenes
                        </TabsTrigger>
                        <TabsTrigger value="productos" className="gap-2">
                            <Package className="h-4 w-4" />
                            Productos
                        </TabsTrigger>
                        <TabsTrigger value="categorias" className="gap-2">
                            <Tags className="h-4 w-4" />
                            Categorías
                        </TabsTrigger>
                        <TabsTrigger value="descuentos" className="gap-2">
                            <Percent className="h-4 w-4" />
                            Descuentos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ordenes" className="space-y-4">
                        <OrdersSection />
                    </TabsContent>

                    <TabsContent value="productos" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <ProductManagementCard
                                    key={product.id}
                                    {...product}
                                    onEdit={() => setIsSheetOpen(true)}
                                    onDelete={() => { }}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="categorias">
                        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg text-muted-foreground">
                            Gestión de Categorías (Próximamente)
                        </div>
                    </TabsContent>

                    <TabsContent value="descuentos">
                        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg text-muted-foreground">
                            Gestión de Descuentos Globales (Próximamente)
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
};

export default MerchantDashboardPage;
