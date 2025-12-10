import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useState } from "react";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { getFirstImageUrl } from "@/lib/imageUtils";

type ProductCardProps = {
    _id: string;
    title: string;
    price: number;
    status: string;
    discount?: number | string;
    rating?: number;
    reviewCount?: number;
    tags?: string[];
    image?: string;
    images?: string[];
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const ProductCard = ({
    _id,
    title,
    price,
    status,
    discount,
    rating = 0,
    reviewCount = 0,
    tags = [],
    image,
    images,
}: ProductCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    // Get image URL - prefer explicit image prop, then first from images array
    const displayImage = image || getFirstImageUrl(images);
    const hasValidImage = displayImage && !displayImage.includes("placehold.co");

    const handleViewProduct = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/product/${_id}`);
    };

    const handleCardClick = () => {
        navigate(`/product/${_id}`);
    };

    // Calculate original price if there's a discount
    const discountValue = typeof discount === 'string' ? parseFloat(discount) : discount;
    const originalPrice = discountValue ? price / (1 - discountValue / 100) : null;

    return (
        <Card
            className="group overflow-hidden hover:shadow-lg cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Sección de Imagen con efecto de zoom */}
            <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {/* Fondo animado con zoom */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:scale-110 transition-transform duration-700" />

                {/* Imagen del producto o icono fallback */}
                {hasValidImage ? (
                    <img
                        src={displayImage}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <ShoppingBag className="relative h-16 w-16 text-muted-foreground group-hover:scale-125 group-hover:text-primary transition-all duration-500 z-10" />
                )}

                {/* Badges y controles superiores */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                    <div className="flex gap-2 flex-wrap">
                        {discountValue && (
                            <Badge variant="destructive" className="shadow-lg">
                                -{discountValue}%
                            </Badge>
                        )}
                        <Badge variant="secondary" className="shadow-lg">
                            {status}
                        </Badge>
                    </div>

                    {/* Botón favorito */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full shadow-lg hover:scale-110 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFavorite(!isFavorite);
                        }}
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${isFavorite
                                    ? "fill-destructive text-destructive"
                                    : ""
                                }`}
                        />
                    </Button>
                </div>

                {/* Brillo sutil en las esquinas al hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                </div>
            </div>

            {/* Contenido del card usando CardHeader y CardContent */}
            <CardHeader>
                <CardTitle className="line-clamp-2 leading-snug group-hover:text-primary transition-colors text-lg">
                    {title}
                </CardTitle>

                {/* Rating */}
                <CardDescription className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < Math.floor(rating)
                                        ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
                                        : "fill-muted text-muted-foreground"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({reviewCount})</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
                {/* Tags de producto */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="font-normal hover:bg-accent transition-colors"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <Separator />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col leading-tight">
                        {originalPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(originalPrice)}
                            </p>
                        )}
                        <p className="text-2xl font-bold tracking-tight">
                            {formatCurrency(price)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Envío gratis
                        </p>
                    </div>

                    {/* Tooltip + botón para ver producto */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="rounded-full shadow-sm hover:scale-110 transition px-4 py-2 flex items-center gap-2"
                                    onClick={handleViewProduct}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    Ver
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver producto</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
