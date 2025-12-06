import { Search, Bell, Plus } from "lucide-react";
import { ModeToggle } from "../custom/mode-toggle";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import { CartButton, CartSheet } from "../custom/cart";

const AppHeader = () => {
    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />

            <div className="flex-1 flex items-center gap-2 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar productos, vendedores..."
                        className="pl-10 h-10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <CartButton />
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                </Button>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Publicar</span>
                </Button>
            </div>
            <ModeToggle />
            <CartSheet />
        </header>
    );
};

export default AppHeader;

