import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreVertical, ImageIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductManagementCardProps {
    title: string;
    price: string;
    stock: number;
    status: string;
    image?: string;
    onEdit: () => void;
    onDelete: () => void;
}

const ProductManagementCard = ({
    title,
    price,
    stock,
    status,
    image,
    onEdit,
    onDelete,
}: ProductManagementCardProps) => {
    return (
        <Card
            className={'group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50 dark:hover:border-primary'}
        >
            {/* Image Section */}
            <div className="aspect-video w-full bg-muted shrink-0 flex items-center justify-center relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        // Escala más sutil en hover
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                )}

                {/* Overlay de Agotado */}
                {stock <= 0 && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <span className="text-xl font-bold text-destructive/80 p-2 rounded-lg bg-background/80 backdrop-blur-sm">
                            AGOTADO
                        </span>
                    </div>
                )}

                {/* Overlays - Stock Badge (Más prominente) */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge
                        variant="outline" // Usar default para stock positivo
                        className="shadow-md backdrop-blur-md bg-background/90 font-semibold"
                    >
                        {stock > 0 ? `${stock} en stock` : "Agotado"}
                    </Badge>
                </div>

                {/* Dropdown Menu (No necesita cambios mayores) */}
                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={onDelete}
                                className="text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col p-4 gap-4"> {/* Aumentar espaciado a gap-4 */}
                <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {/* Título más grande y con más peso */}
                            {title}
                        </h3>
                    </div>
                    {/* Mover status/SKU a una línea secundaria, más pequeña */}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
                        <Badge variant="outline" className="font-medium text-xs px-2 py-0.5 h-auto">
                            {status}
                        </Badge>
                        <span className="text-xs">SKU: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                </div>

                {/* Precio y Botón - Mejor contraste y jerarquía */}
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/70">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-medium tracking-wider">Precio</span>
                        <p className="font-extrabold text-2xl text-primary">{price}</p> {/* Precio más grande y en color principal */}
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className="h-9 px-4" // Botón un poco más alto
                        onClick={onEdit}
                    >
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Editar
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProductManagementCard;
