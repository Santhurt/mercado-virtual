// src/App.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import MainLayout from "./components/layout/MainLayout";
import { ThemeProvider } from "./context/theme-provider";

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <MainLayout />
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;
