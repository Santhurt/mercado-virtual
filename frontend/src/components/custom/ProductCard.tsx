import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
    title: string;
    price: string;
    status: string;
    discount?: string;
    rating?: number;
    tags?: string[];
};

const ProductCard = ({
    title,
    price,
    status,
    discount,
    rating = 4.5,
    tags = [],
}: ProductCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <Card className="group overflow-hidden hover:shadow-lg cursor-pointer">
            {/* Sección de Imagen/Icono con efecto de zoom */}
            <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {/* Fondo animado con zoom */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:scale-110 transition-transform duration-700" />

                {/* Icono principal con zoom */}
                <ShoppingBag className="relative h-16 w-16 text-muted-foreground group-hover:scale-125 group-hover:text-primary transition-all duration-500 z-10" />

                {/* Badges y controles superiores */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
                    <div className="flex gap-2 flex-wrap">
                        {discount && (
                            <Badge variant="destructive" className="shadow-lg">
                                -{discount}
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
                            className={`h-4 w-4 transition-colors ${
                                isFavorite
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
                                className={`h-3.5 w-3.5 ${
                                    i < Math.floor(rating)
                                        ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
                                        : "fill-muted text-muted-foreground"
                                }`}
                            />
                        ))}
                    </div>
                    <span className="font-medium">{rating}</span>
                    <span className="text-xs text-muted-foreground">(128)</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pb-3">
                {/* Tags de producto */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, index) => (
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

                {/* Precio */}
                <div className="space-y-0.5">
                    {discount && (
                        <p className="text-xs text-muted-foreground line-through">
                            $
                            {(
                                parseFloat(price.replace(/[^0-9.]/g, "")) * 1.3
                            ).toFixed(2)}
                        </p>
                    )}
                    <p className="text-2xl font-bold tracking-tight">{price}</p>
                    <p className="text-xs text-muted-foreground">
                        Envío gratis
                    </p>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full gap-2 font-medium shadow-sm hover:shadow-md transition-all"
                    size="lg"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Añadir al carrito
                </Button>
            </CardFooter>
        </Card>
    );
};

// Demo con múltiples productos y toggle de modo oscuro
export default ProductCard;
