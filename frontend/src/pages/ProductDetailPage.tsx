import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
// Importaciones de Componentes Reutilizables
import ProductHeader from "@/components/custom/product/ProductHeader";
import ProductFeaturesCard from "@/components/custom/product/ProductFeaturesCard";
import ProductSpecificationsCard from "@/components/custom/product/ProductSpecsCard";
import ProductCommentSection from "@/components/custom/product/ProductCommentSection";

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

    // Se elimina la función renderStars ya que se movió al componente RatingStars.jsx

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* 1. Encabezado e Información Principal del Producto */}
                <ProductHeader product={product} />

                {/* 2. Detalles y Especificaciones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ProductFeaturesCard features={product.features} />
                    <ProductSpecificationsCard
                        specifications={product.specifications}
                    />
                </div>

                {/* 3. Sección de Comentarios */}
                <ProductCommentSection
                    comments={comments}
                    comment={comment}
                    setComment={setComment}
                    handleAddComment={handleAddComment}
                />
            </div>
        </MainLayout>
    );
};

export default ProductDetailPage;
