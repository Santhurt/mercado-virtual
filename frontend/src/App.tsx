// src/App.tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "./context/theme-provider";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <ThemeProvider>
            <SidebarProvider>
                {/* <FeedPage/> */}
                <ProfilePage/>
            </SidebarProvider>
        </ThemeProvider>
    );
}

export default App;
