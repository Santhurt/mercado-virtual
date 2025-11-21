import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import CommentItem from "./CommentItem";

const ProductCommentSection = ({
    comments,
    comment,
    setComment,
    handleAddComment,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Comentarios y Reseñas ({comments.length})</CardTitle>
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
                    {comments.map((c, index) => (
                        <CommentItem
                            key={c.id}
                            commentData={c}
                            isLast={index === comments.length - 1}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCommentSection;
