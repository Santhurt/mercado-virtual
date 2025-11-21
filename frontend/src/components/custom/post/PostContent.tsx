import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Bookmark,
    Share2,
    Heart,
    MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IPost } from "@/types/AppTypes";

type PostContentProps = {
    post: IPost;
    isLiked?: boolean;
    onLike?: () => void;
    onShare?: () => void;
    onBookmark?: () => void;
};

const PostContent = ({
    post,
    isLiked = false,
    onLike,
    onShare,
    onBookmark,
}: PostContentProps) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-500 text-white font-semibold text-lg">
                                {post.user[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="text-base font-semibold leading-none">
                                    {post.user}
                                </p>
                                {post.role.includes("Verificado") && (
                                    <Badge className="h-5 text-xs">
                                        Verificado
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {post.timestamp} • {post.category}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onBookmark}>
                                <Bookmark className="h-4 w-4 mr-2" />
                                Guardar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onShare}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Compartir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                Reportar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pb-4">
                <div className="space-y-3">
                    <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-base text-muted-foreground leading-relaxed">
                        {post.description}
                    </p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl lg:text-4xl font-bold text-primary">
                            {post.price}
                        </span>
                    </div>
                </div>

                {post.images > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[...Array(Math.min(post.images, 6))].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer"
                            >
                                {i === 5 && post.images > 6 && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-white text-3xl font-bold">
                                            +{post.images - 5}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <Separator />

            <CardFooter className="flex justify-between gap-2 pt-4">
                <Button
                    variant={isLiked ? "default" : "ghost"}
                    size="sm"
                    className="gap-2 flex-1"
                    onClick={onLike}
                >
                    <Heart
                        className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span className="font-medium">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 flex-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{post.comments}</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 flex-1"
                    onClick={onShare}
                >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Compartir</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={onBookmark}
                >
                    <Bookmark className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PostContent;

