import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import type { ICreateProductPayload } from "@/types/AppTypes";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface ProductFormProps {
    onClose?: () => void;
}

const ProductForm = ({ onClose }: ProductFormProps) => {
    const { toast } = useToast();
    const { data: categories = [] } = useCategories();
    const createMutation = useCreateProduct();
    // const updateMutation = useUpdateProduct(); // Will be used when editing is implemented

    const [formData, setFormData] = useState<ICreateProductPayload>({
        title: "",
        price: 0,
        description: "",
        stock: 0,
        status: "Available",
        categories: [],
        features: [],
        specifications: {},
        tags: [],
        images: [],
    });

    const [newFeature, setNewFeature] = useState("");
    const [newTag, setNewTag] = useState("");
    const [specKey, setSpecKey] = useState("");
    const [specValue, setSpecValue] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === "price" || id === "stock" ? Number(value) : value
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            categories: selectedOptions
        }));
    };

    const addImage = () => {
        if (newImageUrl) {
            setFormData(prev => ({ ...prev, images: [...(prev.images || []), newImageUrl] }));
            setNewImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const addFeature = () => {
        if (newFeature) {
            setFormData(prev => ({ ...prev, features: [...prev.features, newFeature] }));
            setNewFeature("");
        }
    };

    const addTag = () => {
        if (newTag) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag("");
        }
    };

    const addSpec = () => {
        if (specKey && specValue) {
            setFormData(prev => ({
                ...prev,
                specifications: { ...prev.specifications, [specKey]: specValue }
            }));
            setSpecKey("");
            setSpecValue("");
        }
    };

    const handleSubmit = async () => {
        try {
            await createMutation.mutateAsync(formData);
            toast({ title: "Producto creado exitosamente" });
            if (onClose) onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Error al crear producto",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6 py-4">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Nombre del Producto</Label>
                    <Input id="title" value={formData.title} onChange={handleChange} placeholder="Ej: Zapatillas Running" />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detalles del producto..."
                        className="min-h-[100px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Precio</Label>
                        <Input id="price" type="number" value={formData.price} onChange={handleChange} placeholder="0.00" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="0" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Categoría (Ctrl+Click para múltiple)</Label>
                    <select
                        multiple
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={handleCategoryChange}
                        value={formData.categories}
                    >
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Image Management */}
            <div className="space-y-3">
                <Label>Imágenes del Producto (URL)</Label>
                <div className="flex gap-2">
                    <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <Button type="button" onClick={addImage} variant="secondary">Agregar</Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {(formData.images || []).map((img, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-md relative group overflow-hidden">
                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-100 hover:bg-red-600 transition-colors"
                                onClick={() => removeImage(i)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features & Tags */}
            <div className="space-y-4 border p-4 rounded-md">
                <h4 className="font-medium text-sm">Características y Etiquetas</h4>

                <div className="grid gap-2">
                    <Label>Características</Label>
                    <div className="flex gap-2">
                        <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Ej: GPS Integrado" />
                        <Button type="button" onClick={addFeature} size="sm"><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.features.map((f, i) => (
                            <div key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                {f} <X className="h-3 w-3 cursor-pointer" onClick={() => setFormData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Etiquetas</Label>
                    <div className="flex gap-2">
                        <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Ej: fitness" />
                        <Button type="button" onClick={addTag} size="sm"><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((t, i) => (
                            <div key={i} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                {t} <X className="h-3 w-3 cursor-pointer" onClick={() => setFormData(p => ({ ...p, tags: p.tags.filter((_, idx) => idx !== i) }))} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Specs */}
            <div className="space-y-4 border p-4 rounded-md">
                <h4 className="font-medium text-sm">Especificaciones Técnicas</h4>
                <div className="flex gap-2">
                    <Input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Nombre (ej: Color)" />
                    <Input value={specValue} onChange={(e) => setSpecValue(e.target.value)} placeholder="Valor (ej: Negro)" />
                    <Button type="button" onClick={addSpec} size="sm">Agregar</Button>
                </div>
                <div className="space-y-1">
                    {Object.entries(formData.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center text-sm bg-muted px-2 py-1 rounded">
                            <span><span className="font-semibold">{key}:</span> {val}</span>
                            <Trash2 className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive" onClick={() => {
                                const newSpecs = { ...formData.specifications };
                                delete newSpecs[key];
                                setFormData(p => ({ ...p, specifications: newSpecs }));
                            }} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending}>
                    {createMutation.isPending && <Clock className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Producto
                </Button>
            </div>
        </div>
    );
};

export default ProductForm;
