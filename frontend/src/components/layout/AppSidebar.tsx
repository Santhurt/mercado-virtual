import {
    Home,
    Package,
    Tag,
    MessageSquare,
    ShoppingCart,
    Store,
    ChevronDown,
    Settings,
    User,
    LogOut,
} from "lucide-react";
import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarContent,
    SidebarGroup,
    SidebarFooter,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenuBadge,
} from "../ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import type React from "react";
import { Link } from "react-router-dom";
import type { MenuItem } from "@/types/AppTypes";
import { useCart } from "../../context/CartContext";
import { useAuthContext } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";

type Props = {
    activeItem: string;
    setActiveItem: React.Dispatch<React.SetStateAction<string>>;
};

const AppSidebar = ({ activeItem, setActiveItem }: Props) => {
    const { toggleCart } = useCart();
    const { user, isAuthenticated } = useAuthContext();
    const logout = useLogout();

    const mainMenu: MenuItem[] = [
        { id: "home", label: "Inicio", icon: Home, to: "/home" },
        {
            id: "productos",
            label: "Productos",
            icon: Package,
            badge: 124,
            to: "/",
        },
        { id: "ofertas", label: "Ofertas", icon: Tag, to: "/" },
        {
            id: "mensajes",
            label: "Mensajes",
            icon: MessageSquare,
            badge: 3,
            to: "/messages",
        },
    ];

    // Build secondary menu based on user role
    const secondaryMenu: MenuItem[] = [
        { id: "carrito", label: "Mi Carrito", icon: ShoppingCart, to: "#" },
    ];

    // Only show "Mi Tienda" if user is seller or admin
    const isSeller = user?.role === "seller" || user?.role === "admin";
    if (isSeller) {
        secondaryMenu.push({ id: "tienda", label: "Mi Tienda", icon: Store, to: "/dashboard" });
    }

    const handleItemClick = (e: React.MouseEvent, item: MenuItem) => {
        if (item.id === "carrito") {
            e.preventDefault();
            toggleCart();
        }
        setActiveItem(item.id);
    };

    const handleLogout = () => {
        logout();
    };

    // Get display name for user
    const displayName = user?.fullName || "Usuario";

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Store className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        Marketplace
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Pro
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainMenu.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <Link
                                            to={item.to}
                                            onClick={(e) =>
                                                handleItemClick(e, item)
                                            }
                                        >
                                            <SidebarMenuButton
                                                isActive={
                                                    activeItem === item.id
                                                }
                                                tooltip={item.label}
                                            >
                                                <Icon />
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <SidebarMenuBadge>
                                                        {item.badge}
                                                    </SidebarMenuBadge>
                                                )}
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Descubrir</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryMenu.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <SidebarMenuItem key={item.id}>
                                        <Link
                                            to={item.to}
                                            onClick={(e) =>
                                                handleItemClick(e, item)
                                            }
                                        >
                                            <SidebarMenuButton
                                                isActive={
                                                    activeItem === item.id
                                                }
                                                tooltip={item.label}
                                            >
                                                <Icon />
                                                <span>{item.label}</span>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            isActive={activeItem === "settings"}
                            onClick={() => setActiveItem("settings")}
                            tooltip="Configuración"
                            asChild
                        >
                            <Link to="/settings">
                                <Settings />
                                <span>Configuración</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User />
                                    <span className="truncate">
                                        {isAuthenticated ? displayName : "Iniciar sesión"}
                                    </span>
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                {isAuthenticated ? (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link to="/profile">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Perfil</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/settings">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Configuración</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Cerrar sesión</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem asChild>
                                        <Link to="/login">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Iniciar sesión</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
