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
        <Card className="overflow-hidden flex flex-row h-32 transition-all hover:shadow-md">
            {/* Image Section */}
            <div className="w-32 h-full bg-muted shrink-0 flex items-center justify-center relative">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
                <Badge
                    variant={stock > 0 ? "secondary" : "destructive"}
                    className="absolute top-2 left-2 text-[10px] px-1.5 h-5"
                >
                    {stock > 0 ? `${stock} unid.` : "Agotado"}
                </Badge>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between p-3 min-w-0">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                            {title}
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mr-1 -mt-1 shrink-0"
                                >
                                    <MoreVertical className="h-3.5 w-3.5" />
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
                    <p className="text-xs text-muted-foreground mt-1">
                        Estado: <span className="font-medium text-foreground">{status}</span>
                    </p>
                </div>

                <div className="flex items-end justify-between">
                    <p className="font-bold text-lg">{price}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={onEdit}
                    >
                        Editar
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ProductManagementCard;
