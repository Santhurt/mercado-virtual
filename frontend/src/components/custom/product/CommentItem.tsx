import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import RatingStars from "./RatingStars";
import type { IComment } from "@/types/AppTypes";

type CommentItemProps = {
    commentData: IComment;
    isLast: boolean;
};

const CommentItem = ({ commentData, isLast }: CommentItemProps) => {
    return (
        <>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <Avatar>
                        <AvatarFallback className="bg-primary/10">
                            {commentData.avatar}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold">
                                    {commentData.user}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {commentData.username}
                                </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {commentData.date}
                            </span>
                        </div>
                        <RatingStars rating={commentData.rating} />
                        <p className="text-sm leading-relaxed">
                            {commentData.comment}
                        </p>
                    </div>
                </div>
            </div>
            {!isLast && <Separator />}
        </>
    );
};

export default CommentItem;
