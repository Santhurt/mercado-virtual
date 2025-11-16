// src/App.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./context/theme-provider";
import FeedPage from "./pages/FeedPage";

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <FeedPage/>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;
