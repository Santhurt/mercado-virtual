import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";
import type { ICategory, ICreateCategoryPayload } from "@/types/AppTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ConfirmDialog from "./ConfirmDialog";

const CategoryManagement = () => {
    const { toast } = useToast();
    const { data: categories = [], isLoading, error } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [formData, setFormData] = useState<ICreateCategoryPayload>({
        name: "",
        description: "",
        image: "",
    });

    // State for delete confirmation
    const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleOpenDialog = (category?: ICategory) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || "",
                image: category.image || "",
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", description: "", image: "" });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", image: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateMutation.mutateAsync({ id: editingCategory._id, payload: formData });
                toast({ title: "Categoría actualizada exitosamente" });
            } else {
                await createMutation.mutateAsync(formData);
                toast({ title: "Categoría creada exitosamente" });
            }
            handleCloseDialog();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Ocurrió un error al guardar la categoría",
                variant: "destructive",
            });
        }
    };

    const handleOpenDeleteDialog = (category: ICategory) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteMutation.mutateAsync(categoryToDelete._id);
            toast({ title: "Categoría eliminada exitosamente" });
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "No se pudo eliminar la categoría",
                variant: "destructive",
            });
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
    if (error) return <div className="p-4 text-red-500">Error cargando categorías</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Listado de Categorías</h3>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Nueva Categoría
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="w-[100px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                    No hay categorías registradas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>{category.description || "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDialog(category)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleOpenDeleteDialog(category)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
                        <DialogDescription>
                            {editingCategory ? "Modifica los detalles de la categoría." : "Crea una nueva categoría para organizar tus productos."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {(createMutation.isPending || updateMutation.isPending) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Guardar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Eliminar Categoría"
                description={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                isLoading={deleteMutation.isPending}
                variant="destructive"
            />
        </div>
    );
};

export default CategoryManagement;
