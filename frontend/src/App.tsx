import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./context/theme-provider";
import { RouterProvider } from "react-router-dom";
import router from "./context/RouterProvider";

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <RouterProvider router={router} />
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;
