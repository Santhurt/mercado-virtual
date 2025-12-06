import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X, Clock } from "lucide-react";
import { useState } from "react";

const ProductForm = () => {
    const [images, setImages] = useState<string[]>([]);

    const handleImageUpload = () => {
        // Mock upload
        setImages([...images, "placeholder"]);
    };

    return (
        <div className="space-y-6 py-4">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Nombre del Producto</label>
                    <Input id="title" placeholder="Ej: Zapatillas Running" />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descripción</label>
                    <Textarea
                        id="description"
                        placeholder="Detalles del producto..."
                        className="min-h-[100px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Precio</label>
                        <Input id="price" type="number" placeholder="0.00" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="stock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Stock</label>
                        <Input id="stock" type="number" placeholder="0" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Categoría</label>
                    {/* Fallback to native select if shadcn select is not fully set up or complex */}
                    <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Seleccionar categoría</option>
                        <option value="tech">Tecnología</option>
                        <option value="clothing">Ropa</option>
                        <option value="home">Hogar</option>
                    </select>
                </div>
            </div>

            {/* Image Management */}
            <div className="space-y-3">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Imágenes del Producto</label>
                <div className="grid grid-cols-3 gap-2">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-muted rounded-md relative group"
                        >
                            <img
                                src={`https://placehold.co/200?text=Img+${i + 1}`}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md"
                            />
                            <button
                                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() =>
                                    setImages(images.filter((_, idx) => idx !== i))
                                }
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleImageUpload}
                        className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                        <ImagePlus className="h-6 w-6 mb-1" />
                        <span className="text-xs">Agregar</span>
                    </button>
                </div>
            </div>

            {/* Discount Section */}
            <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <h4 className="font-semibold text-sm">Gestionar Descuento</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="discount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descuento (%)</label>
                        <Input id="discount" type="number" placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="duration" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Duración (días)</label>
                        <Input id="duration" type="number" placeholder="7" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Guardar Producto</Button>
            </div>
        </div>
    );
};

export default ProductForm;
