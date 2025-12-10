import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/products";
import type { ICreateProductPayload, IUpdateProductPayload, IProductFilters } from "@/types/AppTypes";

export const useProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: productService.getProducts,
    });
};

export const useProductsFiltered = (filters: IProductFilters) => {
    return useQuery({
        queryKey: ["products", "filtered", filters],
        queryFn: () => productService.getProductsWithFilters(filters),
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ICreateProductPayload) => productService.createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: IUpdateProductPayload }) =>
            productService.updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

export const useUploadProductImages = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, files }: { productId: string; files: File[] }) =>
            productService.uploadProductImages(productId, files),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
