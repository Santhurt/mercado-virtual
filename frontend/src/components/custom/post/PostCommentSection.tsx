import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import PostCommentItem from "./PostCommentItem";
import type { IComment } from "@/types/AppTypes";

type PostCommentSectionProps = {
    comments: IComment[];
    comment: string;
    setComment: (comment: string) => void;
    handleAddComment: () => void;
};

const PostCommentSection = ({
    comments,
    comment,
    setComment,
    handleAddComment,
}: PostCommentSectionProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Comentarios ({comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Formulario para agregar comentario */}
                <div className="space-y-3">
                    <Textarea
                        placeholder="Escribe tu comentario..."
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
                    {comments.length > 0 ? (
                        comments.map((c, index) => (
                            <PostCommentItem
                                key={c.id}
                                commentData={c}
                                isLast={index === comments.length - 1}
                            />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No hay comentarios aún. ¡Sé el primero en comentar!
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PostCommentSection;

