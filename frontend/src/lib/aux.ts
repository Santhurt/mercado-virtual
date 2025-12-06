import type { IComment } from "@/types/AppTypes";

export const findCommentById = (
    comments: IComment[],
    id: number,
): IComment | null => {
    for (const comment of comments) {
        if (comment.id === id) return comment;
        if (comment.replies) {
            const found = findCommentById(comment.replies, id);
            if (found) return found;
        }
    }

    return null;
};

export const getTotalCommentCount = (comments: IComment[]): number => {
    return comments.reduce((total, comment) => {
        return (
            total +
            1 +
            (comment.replies ? getTotalCommentCount(comment.replies) : 0)
        );
    }, 0);
};

export const addReplyToComment = (
    comments: IComment[],
    parentId: number,
    newReply: IComment,
): IComment => {
    return comments.map((comment) => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
            };
        }
        if (comment.replies) {
            return {
                ...comment,
                replies: addReplyToComment(comment.replies, parentId, newReply),
            };
        }
        return comment;
    });
};
