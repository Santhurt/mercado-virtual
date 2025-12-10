import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./context/theme-provider";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import router from "./context/RouterProvider";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <CartProvider>
                        <SidebarProvider>
                            <RouterProvider router={router} />
                            <Toaster />
                        </SidebarProvider>
                    </CartProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;

