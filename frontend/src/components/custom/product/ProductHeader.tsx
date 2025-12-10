import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    ShoppingCart,
    MessageCircle,
    Share2,
    Heart,
    Package,
    Plus,
    Minus,
    Loader2,
    Check,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";
import RatingStars from "./RatingStars";
import ProductQuickInfo from "./ProductQuickInfo";
import SellerInfoCard from "./SellerInfoCard";
import type { IProduct } from "@/types/AppTypes";
import { useCart } from "@/context/CartContext";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatService } from "@/services/chats";
import { useChat } from "@/context/ChatContext";

type ProductHeaderProps = {
    product: IProduct;
};

const ProductHeader = ({ product }: ProductHeaderProps) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addStatus, setAddStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "error">("idle");
    const [contactError, setContactError] = useState<string | null>(null);

    const { addItem, openCart } = useCart();
    const { isAuthenticated, user, token } = useAuthContext();
    const { setActiveChat } = useChat();
    const navigate = useNavigate();

    // Get the raw price value (handle both string and number)
    const rawPrice = typeof product.price === "string"
        ? parseFloat(product.price.replace(/[^0-9.-]+/g, ""))
        : product.price;

    const handleQuantityChange = (value: number) => {
        const newQuantity = Math.max(1, Math.min(value, product.stock));
        setQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        setAddStatus("loading");
        setErrorMessage(null);

        try {
            await addItem({
                productId: product._id,
                title: product.title,
                price: rawPrice,
                image: product.images?.[0]
                    ? `${import.meta.env.VITE_API_URL}/${product.images[0]}`
                    : undefined,
                quantity,
                seller: product.seller?._id || "",
            });
            setAddStatus("success");
            setTimeout(() => {
                setAddStatus("idle");
                openCart();
            }, 1500);
        } catch (err) {
            setAddStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Error al agregar");
            setTimeout(() => setAddStatus("idle"), 3000);
        }
    };

    const handleContactSeller = async () => {
        // Check authentication
        if (!isAuthenticated || !user || !token) {
            navigate("/login");
            return;
        }

        // Check if seller exists
        if (!product.seller) {
            setContactError("Vendedor no disponible");
            setContactStatus("error");
            setTimeout(() => setContactStatus("idle"), 3000);
            return;
        }

        // Extract seller user ID (can be populated object or string ID)
        const sellerUserId = typeof product.seller.user === 'string'
            ? product.seller.user
            : product.seller.user?._id;

        if (!sellerUserId) {
            setContactError("Información del vendedor incompleta");
            setContactStatus("error");
            setTimeout(() => setContactStatus("idle"), 3000);
            return;
        }

        // Don't allow contacting yourself
        if (sellerUserId === user._id) {
            setContactError("No puedes contactarte a ti mismo");
            setContactStatus("error");
            setTimeout(() => setContactStatus("idle"), 3000);
            return;
        }

        setContactStatus("loading");
        setContactError(null);

        try {
            // Debug: Log the IDs being sent
            console.log("Creating chat with participants:", {
                currentUser: user._id,
                sellerUser: sellerUserId,
            });

            // Create or get existing chat with seller
            const response = await chatService.createChat(
                [user._id, sellerUserId],
                token
            );

            // Set the chat as active
            setActiveChat(response.data._id);

            // Navigate to messages page
            navigate("/messages");
        } catch (err) {
            console.error("Error creating chat:", err);
            setContactError(err instanceof Error ? err.message : "Error al crear el chat");
            setContactStatus("error");
            setTimeout(() => setContactStatus("idle"), 3000);
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:items-start">
                    {/* Imagen del Producto y Galería */}
                    <div className="space-y-3 lg:sticky lg:top-6">
                        <div className="aspect-square max-w-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${product.images[selectedImageIndex]}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Package className="h-32 w-32 text-blue-300" />
                            )}
                            {product.discount && (
                                <Badge className="absolute top-4 right-4 bg-red-500">
                                    -{product.discount}% OFF
                                </Badge>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.slice(0, 4).map((image, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:ring-2 ring-primary overflow-hidden transition-all ${selectedImageIndex === i ? 'ring-2 ring-primary scale-95' : ''
                                            }`}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/${image}`}
                                            alt={`${product.title} - ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del Producto */}
                    <div className="flex flex-col space-y-4 lg:space-y-5">
                        <div>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 pr-2">
                                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                                        {product.title}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                                <div className="flex gap-2 flex-shrink-0">
                                    <Button size="icon" variant="outline">
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                    <Button size="icon" variant="outline">
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <RatingStars rating={product.rating} />
                                <span className="font-semibold">
                                    {product.rating}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({product.reviewCount} reseñas)
                                </span>
                            </div>

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl lg:text-4xl font-bold text-primary">
                                    {product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-lg lg:text-xl text-muted-foreground line-through">
                                        {product.originalPrice}
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-4">
                                {product.description}
                            </p>

                            <ProductQuickInfo stock={product.stock} />
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cantidad</label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1 || addStatus === "loading"}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="number"
                                    min={1}
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    className="w-20 text-center"
                                    disabled={addStatus === "loading"}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= product.stock || addStatus === "loading"}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-muted-foreground ml-2">
                                    {product.stock} disponibles
                                </span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {addStatus === "error" && errorMessage && (
                            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                {errorMessage}
                            </div>
                        )}

                        {/* Contact Error Message */}
                        {contactStatus === "error" && contactError && (
                            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                {contactError}
                            </div>
                        )}

                        {/* Acciones principales */}
                        <div className="space-y-2 pt-2">
                            <Button
                                className="w-full h-12 text-lg"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={addStatus === "loading" || product.stock === 0}
                            >
                                {addStatus === "loading" ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Agregando...
                                    </>
                                ) : addStatus === "success" ? (
                                    <>
                                        <Check className="h-5 w-5 mr-2" />
                                        ¡Agregado!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Agregar al Carrito
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-12 text-lg"
                                size="lg"
                                onClick={handleContactSeller}
                                disabled={contactStatus === "loading" || !product.seller?.user}
                            >
                                {contactStatus === "loading" ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Conectando...
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle className="h-5 w-5 mr-2" />
                                        Contactar Vendedor
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Info del Vendedor */}
                        <Separator className="my-2" />
                        <SellerInfoCard seller={product.seller} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductHeader;
