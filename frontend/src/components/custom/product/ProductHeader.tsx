import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    ShoppingCart,
    MessageCircle,
    Star,
    Share2,
    Heart,
    Package,
} from "lucide-react";
import RatingStars from "./RatingStars";
import ProductQuickInfo from "./ProductQuickInfo";
import SellerInfoCard from "./SellerInfoCard";

const ProductHeader = ({ product }) => {
    console.log(product);
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Imagen del Producto y Galería */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <Package className="h-32 w-32 text-blue-300" />
                            {product.discount && (
                                <Badge className="absolute top-4 right-4 bg-red-500">
                                    -{product.discount} OFF
                                </Badge>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary"
                                >
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Información del Producto */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold mb-2">
                                        {product.title}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="secondary">
                                            {product.status}
                                        </Badge>
                                        {product.tags.map((tag, i) => (
                                            <Badge key={i} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="outline">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                    <Button size="icon" variant="outline">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <RatingStars rating={product.rating} />
                                <span className="font-semibold">
                                    {product.rating}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({product.reviewCount} reseñas)
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold text-primary">
                                    {product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {product.originalPrice}
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-6">
                                {product.description}
                            </p>

                            <ProductQuickInfo stock={product.stock} />
                        </div>

                        {/* Acciones principales */}
                        <div className="space-y-3">
                            <Button className="w-full h-12 text-lg" size="lg">
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Agregar al Carrito
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 text-lg"
                                size="lg"
                            >
                                <MessageCircle className="h-5 w-5 mr-2" />
                                Contactar Vendedor
                            </Button>
                        </div>

                        {/* Info del Vendedor */}
                        <Separator />
                        <SellerInfoCard seller={product.seller} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductHeader;
