import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
// Importaciones de Componentes Reutilizables
import ProductHeader from "@/components/custom/product/ProductHeader";
import ProductFeaturesCard from "@/components/custom/product/ProductFeaturesCard";
import ProductSpecificationsCard from "@/components/custom/product/ProductSpecsCard";
import ProductCommentSection from "@/components/custom/product/ProductCommentSection";
import { useProduct } from "@/hooks/useProducts";
import { useProductReviews } from "@/hooks/useReviews";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { IComment, IReview } from "@/types/AppTypes";

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [comment, setComment] = useState("");

    // Fetch product data
    const { data: product, isLoading: isLoadingProduct, error: productError } = useProduct(id || "");

    // Fetch reviews
    const { data: reviewsData, isLoading: isLoadingReviews } = useProductReviews(id || "");

    // Transform API reviews to IComment format for ProductCommentSection
    const comments: IComment[] = useMemo(() => {
        if (!reviewsData?.reviews) return [];
        return reviewsData.reviews.map((review: IReview) => ({
            id: review._id,
            user: review.userId?.fullName || "Usuario",
            username: `@${(review.userId?.fullName || "usuario").toLowerCase().replace(/\s+/g, '_')}`,
            avatar: (review.userId?.fullName || "U").substring(0, 2).toUpperCase(),
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
        }));
    }, [reviewsData?.reviews]);

    const handleAddComment = () => {
        if (comment.trim()) {
            // TODO: Implement API call to add review
            console.log("Adding comment:", comment);
            setComment("");
        }
    };

    // Loading state
    if (isLoadingProduct) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </MainLayout>
        );
    }

    // Error state
    if (productError || !product) {
        return (
            <MainLayout>
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <Package className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                            Producto no encontrado
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-4">
                            El producto que buscas no existe o ha sido eliminado.
                        </p>
                        <Button onClick={() => navigate('/home')}>
                            Volver al inicio
                        </Button>
                    </CardContent>
                </Card>
            </MainLayout>
        );
    }

    // Transform product for ProductHeader - format price as string since that's what it expects
    const productForHeader = {
        ...product,
        price: new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(product.price),
        originalPrice: product.originalPrice
            ? new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
            }).format(Number(product.originalPrice))
            : undefined,
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* 1. Encabezado e Información Principal del Producto */}
                <ProductHeader product={productForHeader as any} />

                {/* 2. Detalles y Especificaciones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProductFeaturesCard features={product.features || []} />
                    <ProductSpecificationsCard
                        specifications={product.specifications || {}}
                    />
                </div>

                {/* 3. Sección de Comentarios */}
                {isLoadingReviews ? (
                    <Card>
                        <CardContent className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </CardContent>
                    </Card>
                ) : (
                    <ProductCommentSection
                        comments={comments}
                        comment={comment}
                        setComment={setComment}
                        handleAddComment={handleAddComment}
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default ProductDetailPage;
