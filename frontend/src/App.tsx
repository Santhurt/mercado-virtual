import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./context/theme-provider";
import { CartProvider } from "./context/CartContext";
import { RouterProvider } from "react-router-dom";
import router from "./context/RouterProvider";

function App() {
    return (
        <ThemeProvider>
            <CartProvider>
                <SidebarProvider>
                    <RouterProvider router={router} />
                </SidebarProvider>
            </CartProvider>
        </ThemeProvider>
    );
}

export default App;

