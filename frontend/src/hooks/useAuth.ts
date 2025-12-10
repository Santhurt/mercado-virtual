import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { useAuthContext } from "@/context/AuthContext";
import type { ILoginPayload, IRegisterPayload } from "@/types/AppTypes";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const { login } = useAuthContext();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: ILoginPayload) => authService.login(payload),
        onSuccess: (response) => {
            login(response.data.user, response.data.token);
            navigate("/home");
        },
    });
}

export function useRegister() {
    const { login } = useAuthContext();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: IRegisterPayload) => authService.register(payload),
        onSuccess: (response) => {
            login(response.data.user, response.data.token);
            navigate("/home");
        },
    });
}

export function useLogout() {
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    return () => {
        logout();
        navigate("/");
    };
}
