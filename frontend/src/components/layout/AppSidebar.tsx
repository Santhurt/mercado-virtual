import {
    Home,
    Package,
    Tag,
    MessageSquare,
    TrendingUp,
    ShoppingCart,
    Store,
    ChevronDown,
    Settings,
    User,
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

type Props = {
    activeItem: string;
    setActiveItem: React.Dispatch<React.SetStateAction<string>>;
};

const AppSidebar = ({ activeItem, setActiveItem }: Props) => {
    const mainMenu: MenuItem[] = [
        { id: "home", label: "Inicio", icon: Home, to: "/" },
        {
            id: "productos",
            label: "Productos",
            icon: Package,
            badge: 124,
            to: "/profile",
        },
        { id: "ofertas", label: "Ofertas", icon: Tag, to: "#" },
        {
            id: "mensajes",
            label: "Mensajes",
            icon: MessageSquare,
            badge: 3,
            to: "#",
        },
    ];

    const secondaryMenu = [
        { id: "trending", label: "Tendencias", icon: TrendingUp },
        { id: "carrito", label: "Mi Carrito", icon: ShoppingCart },
        { id: "tienda", label: "Mi Tienda", icon: Store },
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
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
                            </a>
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
                                        <Link to={item.to}>
                                            <SidebarMenuButton
                                                isActive={
                                                    activeItem === item.id
                                                }
                                                onClick={() =>
                                                    setActiveItem(item.id)
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
                                        <SidebarMenuButton
                                            isActive={activeItem === item.id}
                                            onClick={() =>
                                                setActiveItem(item.id)
                                            }
                                            tooltip={item.label}
                                        >
                                            <Icon />
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
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
                        >
                            <Settings />
                            <span>Configuración</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User />
                                    <span className="truncate">
                                        Usuario Demo
                                    </span>
                                    <ChevronDown className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Configuración</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
