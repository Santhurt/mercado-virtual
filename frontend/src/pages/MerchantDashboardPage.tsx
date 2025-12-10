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
import { Plus, Package, Tags, Percent, ShoppingBag, Loader2 } from "lucide-react";
import ProductManagementCard from "@/components/custom/ProductManagementCard";
import ProductForm from "@/components/custom/ProductForm";
import OrdersSection from "@/components/custom/OrdersSection";
import CategoryManagement from "@/components/custom/CategoryManagement";
import ConfirmDialog from "@/components/custom/ConfirmDialog";
import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useToast } from "@/components/ui/use-toast";
import { getFirstImageUrl } from "@/lib/imageUtils";
import type { IProduct } from "@/types/AppTypes";

const MerchantDashboardPage = () => {
    const { toast } = useToast();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<IProduct | null>(null);
    const { data: products = [], isLoading, error } = useProducts();
    const deleteMutation = useDeleteProduct();

    // State for delete confirmation
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleOpenDeleteDialog = (product: IProduct) => {
        setProductToDelete(product);
        setIsDeleteDialogOpen(true);
    };

    const handleOpenEditSheet = (product?: IProduct) => {
        setProductToEdit(product || null);
        setIsSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setIsSheetOpen(false);
        setProductToEdit(null);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await deleteMutation.mutateAsync(productToDelete._id);
            toast({ title: "Producto eliminado exitosamente" });
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "No se pudo eliminar el producto",
                variant: "destructive",
            });
        }
    };

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

                    <Sheet open={isSheetOpen} onOpenChange={(open) => !open && handleCloseSheet()}>
                        <SheetTrigger asChild>
                            <Button className="gap-2 shadow-lg" onClick={() => handleOpenEditSheet()}>
                                <Plus className="h-4 w-4" />
                                Nuevo Producto
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="overflow-y-auto sm:max-w-md">
                            <SheetHeader>
                                <SheetTitle>{productToEdit ? "Editar Producto" : "Crear Nuevo Producto"}</SheetTitle>
                                <SheetDescription>
                                    {productToEdit ? "Modifica la información del producto." : "Completa la información para publicar tu producto."}
                                </SheetDescription>
                            </SheetHeader>
                            <ProductForm onClose={handleCloseSheet} product={productToEdit || undefined} />
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
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                            </div>
                        ) : error ? (
                            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                                Error al cargar los productos.
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                                <p className="text-muted-foreground mb-4">No tienes productos registrados aún.</p>
                                <Button onClick={() => handleOpenEditSheet()}>Crear Primer Producto</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.map((product: IProduct) => (
                                    <ProductManagementCard
                                        key={product._id}
                                        {...product}
                                        id={product._id}
                                        image={getFirstImageUrl(product.images)}
                                        onEdit={() => handleOpenEditSheet(product)}
                                        onDelete={() => handleOpenDeleteDialog(product)}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="categorias">
                        <CategoryManagement />
                    </TabsContent>

                    <TabsContent value="descuentos">
                        <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg text-muted-foreground">
                            Gestión de Descuentos Globales (Próximamente)
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Eliminar Producto"
                description={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.title}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
                variant="destructive"
            />
        </MainLayout>
    );
};

export default MerchantDashboardPage;

