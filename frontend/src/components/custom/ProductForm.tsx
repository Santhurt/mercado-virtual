import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Clock, Plus, Trash2, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct, useUpdateProduct, useUploadProductImages } from "@/hooks/useProducts";
import type { ICreateProductPayload, ISeller, IProduct, ICategory } from "@/types/AppTypes";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/AuthContext";
import { userService } from "@/services/user";
import CategoryMultiSelect from "./CategoryMultiSelect";
import { getImageUrl } from "@/lib/imageUtils";

interface ProductFormProps {
    onClose?: () => void;
    product?: IProduct; // Product to edit (optional)
}

const ProductForm = ({ onClose, product }: ProductFormProps) => {
    const { toast } = useToast();
    const { user, token } = useAuthContext();
    const { data: categories = [] } = useCategories();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const uploadImagesMutation = useUploadProductImages();

    const isEditMode = !!product;

    const [sellerInfo, setSellerInfo] = useState<ISeller | null>(null);
    const [isLoadingSeller, setIsLoadingSeller] = useState(true);
    const [sellerError, setSellerError] = useState<string | null>(null);

    // Helper to extract category IDs from product
    const getCategoryIds = (categories: ICategory[] | string[] | undefined): string[] => {
        if (!categories) return [];
        return categories.map(cat => typeof cat === 'string' ? cat : cat._id);
    };

    const [formData, setFormData] = useState<Omit<ICreateProductPayload, 'sellerId'>>({
        title: product?.title || "",
        price: product?.price || 0,
        description: product?.description || "",
        stock: product?.stock || 0,
        status: product?.status || "Available",
        categories: getCategoryIds(product?.categories),
        features: product?.features || [],
        specifications: product?.specifications || {},
        tags: product?.tags || [],
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<string[]>([]);
    // Store existing images (URLs from the product being edited)
    const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newFeature, setNewFeature] = useState("");
    const [newTag, setNewTag] = useState("");
    const [specKey, setSpecKey] = useState("");
    const [specValue, setSpecValue] = useState("");

    // Fetch seller info on mount
    useEffect(() => {
        const fetchSellerInfo = async () => {
            if (!user || !token) {
                setSellerError("Usuario no autenticado");
                setIsLoadingSeller(false);
                return;
            }

            try {
                const response = await userService.getSellerByUserId(user._id, token);
                console.log("[ProductForm] Seller API Response:", response);

                if (response && response.data) {
                    // API returns sellers array in data.sellers
                    const sellersData = response.data as any;
                    console.log("[ProductForm] Sellers data:", sellersData);

                    // Check if data.sellers exists (array format)
                    if (sellersData.sellers && Array.isArray(sellersData.sellers) && sellersData.sellers.length > 0) {
                        const seller = sellersData.sellers[0];
                        console.log("[ProductForm] Selected seller:", seller);
                        setSellerInfo(seller);
                    }
                    // Check if data is directly the seller object
                    else if (sellersData._id) {
                        console.log("[ProductForm] Direct seller object:", sellersData);
                        setSellerInfo(sellersData);
                    }
                    // Check if data is an array
                    else if (Array.isArray(sellersData) && sellersData.length > 0) {
                        console.log("[ProductForm] Seller from array:", sellersData[0]);
                        setSellerInfo(sellersData[0]);
                    }
                    else {
                        console.error("[ProductForm] No seller profile found in response");
                        setSellerError("No tienes un perfil de vendedor activo");
                    }
                } else {
                    console.error("[ProductForm] Empty response from seller API");
                    setSellerError("No tienes un perfil de vendedor activo");
                }
            } catch (error: any) {
                console.error("[ProductForm] Error fetching seller:", error);
                setSellerError(error.message || "Error al cargar perfil de vendedor");
            } finally {
                setIsLoadingSeller(false);
            }
        };

        fetchSellerInfo();
    }, [user, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === "price" || id === "stock" ? Number(value) : value
        }));
    };

    const handleCategoryChange = (ids: string[]) => {
        setFormData(prev => ({
            ...prev,
            categories: ids
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files).slice(0, 5 - selectedFiles.length);
        setSelectedFiles(prev => [...prev, ...newFiles]);

        // Create previews
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setFilePreviews(prev => prev.filter((_, i) => i !== index));
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
        if (!sellerInfo && !isEditMode) {
            toast({
                title: "Error",
                description: "No tienes un perfil de vendedor activo",
                variant: "destructive"
            });
            return;
        }

        try {
            if (isEditMode && product) {
                // Update existing product
                const payload = {
                    ...formData,
                };

                await updateMutation.mutateAsync({ id: product._id, payload });

                // Upload new images if any
                if (selectedFiles.length > 0) {
                    await uploadImagesMutation.mutateAsync({
                        productId: product._id,
                        files: selectedFiles,
                    });
                }

                toast({ title: "Producto actualizado exitosamente" });
            } else {
                // Create new product
                const payload: ICreateProductPayload = {
                    ...formData,
                    sellerId: sellerInfo!._id,
                };

                const createdProduct = await createMutation.mutateAsync(payload);

                // Upload images if any
                if (selectedFiles.length > 0 && createdProduct._id) {
                    await uploadImagesMutation.mutateAsync({
                        productId: createdProduct._id,
                        files: selectedFiles,
                    });
                }

                toast({ title: "Producto creado exitosamente" });
            }

            if (onClose) onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} producto`,
                variant: "destructive"
            });
        }
    };

    if (isLoadingSeller) {
        return (
            <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (sellerError) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <p className="text-destructive font-medium">{sellerError}</p>
                <p className="text-sm text-muted-foreground">
                    Debes tener un perfil de vendedor para crear productos.
                </p>
                <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </div>
        );
    }

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
                    <Label>Categorías</Label>
                    <CategoryMultiSelect
                        categories={categories}
                        selectedIds={formData.categories}
                        onChange={handleCategoryChange}
                        placeholder="Seleccionar categorías..."
                    />
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
                <Label>Imágenes del Producto (máx. 5)</Label>

                {/* Existing Images (edit mode) */}
                {existingImages.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Imágenes actuales:</p>
                        <div className="grid grid-cols-3 gap-2">
                            {existingImages.map((img, i) => (
                                <div key={`existing-${i}`} className="aspect-square bg-muted rounded-md relative group overflow-hidden">
                                    <img src={getImageUrl(img)} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                >
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Haz clic para seleccionar imágenes
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {existingImages.length + selectedFiles.length}/5 imágenes
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
                {filePreviews.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Nuevas imágenes:</p>
                        <div className="grid grid-cols-3 gap-2">
                            {filePreviews.map((preview, i) => (
                                <div key={i} className="aspect-square bg-muted rounded-md relative group overflow-hidden">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        onClick={() => removeFile(i)}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
                <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || uploadImagesMutation.isPending}
                >
                    {(createMutation.isPending || uploadImagesMutation.isPending) && (
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Guardar Producto
                </Button>
            </div>
        </div>
    );
};

export default ProductForm;
