import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { IUser } from "@/types/AppTypes";

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: IUser, token: string) => void;
    logout: () => void;
    updateUser: (user: IUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "mercafacil_auth";

interface StoredAuth {
    user: IUser;
    token: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            if (stored) {
                const parsed: StoredAuth = JSON.parse(stored);
                setUser(parsed.user);
                setToken(parsed.token);
            }
        } catch (error) {
            console.error("Error loading auth state:", error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (newUser: IUser, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: newUser, token: newToken })
        );
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const updateUser = (updatedUser: IUser) => {
        setUser(updatedUser);
        if (token) {
            localStorage.setItem(
                AUTH_STORAGE_KEY,
                JSON.stringify({ user: updatedUser, token })
            );
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token && !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}

