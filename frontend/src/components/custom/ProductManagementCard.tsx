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
        <Card className="group overflow-hidden flex flex-col transition-all hover:shadow-lg border-muted/60">
            {/* Image Section */}
            <div className="aspect-video w-full bg-muted shrink-0 flex items-center justify-center relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                )}

                {/* Overlays */}
                <div className="absolute top-2 left-2 flex gap-2">
                    <Badge
                        variant={stock > 0 ? "secondary" : "destructive"}
                        className="shadow-sm backdrop-blur-md bg-background/90"
                    >
                        {stock > 0 ? `${stock} en stock` : "Agotado"}
                    </Badge>
                </div>

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
            <div className="flex-1 flex flex-col p-4 gap-3">
                <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="font-normal text-xs px-2 py-0.5 h-auto">
                            {status}
                        </Badge>
                        <span>•</span>
                        <span>SKU: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                </div>

                <div className="mt-auto pt-2 flex items-center justify-between border-t">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold">Precio</span>
                        <p className="font-bold text-lg">{price}</p>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className="h-8 px-4"
                        onClick={onEdit}
                    >
                        <Edit className="h-3.5 w-3.5 mr-2" />
                        Gestionar
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProductManagementCard;
