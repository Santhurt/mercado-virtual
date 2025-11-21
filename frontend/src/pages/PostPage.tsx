import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostContent from "@/components/custom/post/PostContent";
import PostCommentSection from "@/components/custom/post/PostCommentSection";
import type { IPost, IComment } from "@/types/AppTypes";

const PostPage = () => {
    const [comment, setComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [comments, setComments] = useState<IComment[]>([
        {
            id: 1,
            user: "María González",
            username: "@maria_g",
            avatar: "MG",
            rating: 0,
            comment:
                "¡Excelente producto! Me encantó la calidad y el precio es muy justo. Definitivamente lo recomiendo.",
            date: "Hace 2 días",
        },
        {
            id: 2,
            user: "Carlos Ramírez",
            username: "@carlos_r",
            avatar: "CR",
            rating: 0,
            comment:
                "Muy buena publicación, las fotos son claras y la descripción es detallada. ¿Tienes más colores disponibles?",
            date: "Hace 1 semana",
        },
        {
            id: 3,
            user: "Ana Martínez",
            username: "@ana_m",
            avatar: "AM",
            rating: 0,
            comment:
                "Interesante, me gustaría saber más sobre el envío. ¿Cuánto tiempo tarda normalmente?",
            date: "Hace 2 semanas",
        },
    ]);

    // Datos de ejemplo del post
    const post: IPost = {
        id: "1",
        user: "Juan Pérez",
        role: "Vendedor Verificado",
        timestamp: "Hace 3 días",
        category: "Electrónica",
        title: "Smartphone Samsung Galaxy S23 Ultra - 256GB - Nuevo",
        description:
            "Vendo este increíble smartphone Samsung Galaxy S23 Ultra en perfecto estado. Incluye todos los accesorios originales: cargador, cable USB-C, auriculares y caja. El dispositivo tiene 256GB de almacenamiento interno, pantalla AMOLED de 6.8 pulgadas, cámara de 200MP y procesador Snapdragon 8 Gen 2. Perfecto para fotografía profesional y gaming. Incluye garantía de 1 año. Precio negociable. Entrega en persona o envío disponible.",
        price: "$899.99",
        images: 5,
        likes: 42,
        comments: comments.length,
    };

    const handleAddComment = () => {
        if (comment.trim()) {
            const newComment: IComment = {
                id: comments.length + 1,
                user: "Tú",
                username: "@tu_usuario",
                avatar: "TU",
                rating: 0,
                comment: comment,
                date: "Ahora mismo",
            };
            setComments([newComment, ...comments]);
            setComment("");
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // Aquí podrías actualizar el contador de likes en el backend
    };

    const handleShare = () => {
        // Lógica para compartir el post
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.description,
                url: window.location.href,
            });
        } else {
            // Fallback: copiar al portapapeles
            navigator.clipboard.writeText(window.location.href);
        }
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // Aquí podrías guardar/eliminar el post de favoritos en el backend
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Contenido del Post */}
                <PostContent
                    post={post}
                    isLiked={isLiked}
                    onLike={handleLike}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                />

                {/* Sección de Comentarios */}
                <PostCommentSection
                    comments={comments}
                    comment={comment}
                    setComment={setComment}
                    handleAddComment={handleAddComment}
                />
            </div>
        </MainLayout>
    );
};

export default PostPage;

