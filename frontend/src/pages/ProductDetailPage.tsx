import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    ShoppingCart,
    MessageCircle,
    Star,
    MapPin,
    Share2,
    Heart,
    Send,
    Package,
    Shield,
    Truck,
} from "lucide-react";

const ProductDetailPage = () => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        {
            id: 1,
            user: "María González",
            username: "@maria_g",
            avatar: "MG",
            rating: 5,
            comment:
                "Excelente producto, llegó en perfectas condiciones y muy rápido.",
            date: "Hace 2 días",
        },
        {
            id: 2,
            user: "Carlos Ramírez",
            username: "@carlos_r",
            avatar: "CR",
            rating: 4,
            comment:
                "Muy buena calidad, aunque el envío tardó un poco más de lo esperado.",
            date: "Hace 1 semana",
        },
        {
            id: 3,
            user: "Ana Martínez",
            username: "@ana_m",
            avatar: "AM",
            rating: 5,
            comment:
                "Justo lo que esperaba. El vendedor es muy atento y respondió todas mis dudas.",
            date: "Hace 2 semanas",
        },
    ]);

    const product = {
        title: "Zapatillas Running Pro Max",
        price: "$89.99",
        originalPrice: "$112.49",
        discount: "20%",
        status: "Nuevo",
        rating: 4.8,
        reviewCount: 156,
        description:
            "Zapatillas de alta performance diseñadas para corredores profesionales y amateur. Cuenta con tecnología de amortiguación avanzada, suela antideslizante y materiales respirables de primera calidad. Perfectas para entrenamientos intensivos y carreras de larga distancia.",
        features: [
            "Amortiguación de gel en talón y antepié",
            "Suela de caucho resistente al desgaste",
            "Upper de malla transpirable",
            "Sistema de ajuste rápido",
            "Peso ligero: 280g por zapato",
        ],
        specifications: {
            marca: "ProSport",
            modelo: "Running Pro Max 2024",
            material: "Malla sintética + Caucho",
            tallas: "35-45",
            colores: "Negro, Azul, Rojo",
        },
        tags: ["Deporte", "Unisex", "Trending"],
        stock: 15,
        seller: {
            name: "Usuario",
            username: "@usuario",
            rating: 4.8,
            sales: 156,
            location: "Pereira, Risaralda",
            verified: true,
        },
    };

    const handleAddComment = () => {
        if (comment.trim()) {
            const newComment = {
                id: comments.length + 1,
                user: "Tú",
                username: "@tu_usuario",
                avatar: "TU",
                rating: 5,
                comment: comment,
                date: "Ahora mismo",
            };
            setComments([newComment, ...comments]);
            setComment("");
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${
                    i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header del Producto */}
                <Card>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Imagen del Producto */}
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
                                                    <Badge
                                                        key={i}
                                                        variant="outline"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                            >
                                                <Heart className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                            >
                                                <Share2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex">
                                            {renderStars(product.rating)}
                                        </div>
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

                                    {/* Info rápida */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Truck className="h-5 w-5 text-primary" />
                                            <div className="text-xs">
                                                <div className="font-semibold">
                                                    Envío rápido
                                                </div>
                                                <div className="text-muted-foreground">
                                                    2-3 días
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <div className="text-xs">
                                                <div className="font-semibold">
                                                    Garantía
                                                </div>
                                                <div className="text-muted-foreground">
                                                    30 días
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                            <Package className="h-5 w-5 text-primary" />
                                            <div className="text-xs">
                                                <div className="font-semibold">
                                                    Stock
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {product.stock} unidades
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Acciones principales */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full h-12 text-lg"
                                        size="lg"
                                    >
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
                                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {product.seller.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">
                                                    {product.seller.name}
                                                </span>
                                                {product.seller.verified && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        Verificado
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    {product.seller.rating}
                                                </div>
                                                <span>•</span>
                                                <span>
                                                    {product.seller.sales}{" "}
                                                    ventas
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {product.seller.location}
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Ver Perfil
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detalles y Especificaciones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {product.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Especificaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(product.specifications).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-sm text-muted-foreground capitalize">
                                                {key}:
                                            </span>
                                            <span className="text-sm font-medium">
                                                {value}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección de Comentarios */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Comentarios y Reseñas ({comments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Formulario para agregar comentario */}
                        <div className="space-y-3">
                            <Textarea
                                placeholder="Escribe tu comentario sobre este producto..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                className="resize-none"
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleAddComment}
                                    disabled={!comment.trim()}
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Publicar Comentario
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Lista de comentarios */}
                        <div className="space-y-6">
                            {comments.map((c) => (
                                <div key={c.id} className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-primary/10">
                                                {c.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">
                                                        {c.user}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {c.username}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {c.date}
                                                </span>
                                            </div>
                                            <div className="flex">
                                                {renderStars(c.rating)}
                                            </div>
                                            <p className="text-sm leading-relaxed">
                                                {c.comment}
                                            </p>
                                        </div>
                                    </div>
                                    {c.id !==
                                        comments[comments.length - 1].id && (
                                        <Separator />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ProductDetailPage;
