import { useMutation } from "@tanstack/react-query";
import { userService, type UpdateUserPayload } from "@/services/user";
import { useAuthContext } from "@/context/AuthContext";
import type { ICreateSellerPayload } from "@/types/AppTypes";

export interface BecomeSellerPayload extends ICreateSellerPayload { }

/**
 * Hook to upgrade user role to seller
 * Creates seller profile and updates user role
 */
export function useBecomeSeller() {
    const { user, token, updateUser } = useAuthContext();

    return useMutation({
        mutationFn: async (sellerData: BecomeSellerPayload) => {
            if (!user || !token) {
                throw new Error("Usuario no autenticado");
            }

            // 1. Create seller profile
            const sellerResponse = await userService.createSeller(user._id, sellerData, token);

            // 2. Update user role to seller
            const userResponse = await userService.updateUser(
                user._id,
                { role: "seller" },
                token
            );

            return {
                seller: sellerResponse.data,
                user: userResponse.data,
            };
        },
        onSuccess: (data) => {
            // Update auth context with new user data
            updateUser(data.user);
        },
    });
}

/**
 * Hook to update user profile (including role)
 */
export function useUpdateUser() {
    const { user, token, updateUser } = useAuthContext();

    return useMutation({
        mutationFn: async (data: UpdateUserPayload) => {
            if (!user || !token) {
                throw new Error("Usuario no autenticado");
            }

            const response = await userService.updateUser(user._id, data, token);
            return response.data;
        },
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
        },
    });
}

/**
 * Hook to downgrade from seller to customer
 * Deletes seller profile and updates user role
 */
export function useDowngradeToCustomer() {
    const { user, token, updateUser } = useAuthContext();

    return useMutation({
        mutationFn: async (sellerId: string) => {
            if (!user || !token) {
                throw new Error("Usuario no autenticado");
            }

            // 1. Delete seller profile
            await userService.deleteSeller(sellerId, token);

            // 2. Update user role to customer
            const userResponse = await userService.updateUser(
                user._id,
                { role: "customer" },
                token
            );

            return userResponse.data;
        },
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
        },
    });
}
