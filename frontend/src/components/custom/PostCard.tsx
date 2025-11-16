import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
    MoreVertical,
    Bookmark,
    Share2,
    Heart,
    MessageCircle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import type { IPost } from "@/types/AppTypes";

type PostCardProps = {
    post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
    return (
        <Card
            key={post.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-500 text-white font-semibold">
                                {post.user[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold leading-none">
                                    {post.user}
                                </p>
                                {post.role.includes("Verificado") && (
                                    <Badge
                                        className="h-5 text-xs"
                                    >
                                        Verificado
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {post.timestamp} • {post.category}
                            </p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Bookmark className="h-4 w-4 mr-2" />
                                Guardar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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

            <CardContent className="space-y-4 pb-3">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">
                        {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {post.description}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                        {post.price}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {[...Array(Math.min(post.images, 4))].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer"
                        >
                            {i === 3 && post.images > 4 && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-3xl font-bold">
                                        +{post.images - 3}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-1 border-t pt-4">
                <Button variant="ghost" size="sm" className="gap-2 flex-1">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 flex-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 flex-1">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Compartir</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bookmark className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};
export default PostCard;
