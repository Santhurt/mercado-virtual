import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/reviews";

export const useProductReviews = (productId: string, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["reviews", productId, page, limit],
        queryFn: () => reviewService.getProductReviews(productId, page, limit),
        enabled: !!productId,
    });
};
