import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  Home,
  Package,
  Tag,
  MessageSquare,
  User,
  Settings,
  TrendingUp,
  ShoppingCart,
  Bell,
  Search,
  MoreVertical,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Sparkles,
  ChevronDown,
  Store,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '../custom/mode-toggle';

const AppSidebar = ({ activeItem, setActiveItem }) => {
  const mainMenu = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'productos', label: 'Productos', icon: Package, badge: 124 },
    { id: 'ofertas', label: 'Ofertas', icon: Tag },
    { id: 'mensajes', label: 'Mensajes', icon: MessageSquare, badge: 3 },
  ];

  const secondaryMenu = [
    { id: 'trending', label: 'Tendencias', icon: TrendingUp },
    { id: 'carrito', label: 'Mi Carrito', icon: ShoppingCart },
    { id: 'tienda', label: 'Mi Tienda', icon: Store },
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
                  <span className="font-semibold">Marketplace</span>
                  <span className="text-xs text-muted-foreground">Pro</span>
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
                    <SidebarMenuButton
                      isActive={activeItem === item.id}
                      onClick={() => setActiveItem(item.id)}
                      tooltip={item.label}
                    >
                      <Icon />
                      <span>{item.label}</span>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                    </SidebarMenuButton>
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
                      onClick={() => setActiveItem(item.id)}
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
              isActive={activeItem === 'settings'}
              onClick={() => setActiveItem('settings')}
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
                  <span className="truncate">Usuario Demo</span>
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
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

const MainLayout = () => {
  const [activeItem, setActiveItem] = useState('home');
  const [activeTab, setActiveTab] = useState('productos');

  const posts = [
    {
      id: 1,
      user: 'Ana López',
      role: 'Vendedor Verificado',
      title: 'iPhone 15 Pro Max - Nuevo en caja',
      description: '256GB, Color Titanio Natural. Garantía oficial Apple.',
      price: '$1,299',
      images: 4,
      likes: 124,
      comments: 28,
      timestamp: '2h',
      category: 'Electrónica'
    },
    {
      id: 2,
      user: 'María García',
      role: 'Mayorista Premium',
      title: 'Lote de ropa de marca - 50 piezas',
      description: 'Variedad de tallas y estilos. Stock limitado.',
      price: '$2,500',
      images: 8,
      likes: 85,
      comments: 42,
      timestamp: '5h',
      category: 'Textiles'
    },
    {
      id: 3,
      user: 'Carlos Ruiz',
      role: 'Distribuidor Oficial',
      title: 'Laptop Gaming RTX 4070',
      description: 'Intel i9, 32GB RAM, 1TB SSD. Como nueva.',
      price: '$1,799',
      images: 6,
      likes: 156,
      comments: 63,
      timestamp: '1d',
      category: 'Tecnología'
    }
  ];

  const trending = [
    { id: 1, title: 'Smartphones', growth: '+24%', emoji: '📱', products: 234 },
    { id: 2, title: 'Gaming', growth: '+18%', emoji: '🎮', products: 189 },
    { id: 3, title: 'Moda', growth: '+32%', emoji: '👗', products: 156 },
  ];

  const suggested = [
    { id: 1, name: 'Tech Store Pro', followers: '2.5k', verified: true },
    { id: 2, name: 'Fashion Hub', followers: '1.8k', verified: false },
    { id: 3, name: 'Electronics Plus', followers: '3.2k', verified: true },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            
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
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Publicar</span>
              </Button>
            </div>
            <ModeToggle/>
            
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Feed */}
                <main className="lg:col-span-8 space-y-6">
                  {/* Create Post Card */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            U
                          </AvatarFallback>
                        </Avatar>
                        <Input 
                          placeholder="¿Qué quieres vender hoy?" 
                          className="flex-1"
                        />
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="productos" className="gap-2">
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">Productos</span>
                      </TabsTrigger>
                      <TabsTrigger value="ofertas" className="gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">Ofertas</span>
                      </TabsTrigger>
                      <TabsTrigger value="siguiendo" className="gap-2">
                        <Heart className="h-4 w-4" />
                        <span className="hidden sm:inline">Siguiendo</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="productos" className="space-y-4 mt-6">
                      {posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-11 w-11">
                                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-pink-500 text-white font-semibold">
                                    {post.user[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold leading-none">{post.user}</p>
                                    {post.role.includes('Verificado') && (
                                      <Badge variant="secondary" className="h-5 text-xs">
                                        Verificado
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {post.timestamp} • {post.category}
                                  </p>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Bookmark className="h-4 w-4 mr-2" />
                                    Guardar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Compartir
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Reportar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4 pb-3">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {post.description}
                              </p>
                              <p className="text-2xl font-bold text-primary">
                                {post.price}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              {[...Array(Math.min(post.images, 4))].map((_, i) => (
                                <div 
                                  key={i}
                                  className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer"
                                >
                                  {i === 3 && post.images > 4 && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                      <span className="text-white text-3xl font-bold">
                                        +{post.images - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                          
                          <CardFooter className="flex justify-between gap-1 border-t pt-4">
                            <Button variant="ghost" size="sm" className="gap-2 flex-1">
                              <Heart className="h-4 w-4" />
                              <span className="font-medium">{post.likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 flex-1">
                              <MessageCircle className="h-4 w-4" />
                              <span className="font-medium">{post.comments}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 flex-1">
                              <Share2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Compartir</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="ofertas" className="mt-6">
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="rounded-full bg-muted p-4 mb-4">
                            <Sparkles className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">No hay ofertas especiales</h3>
                          <p className="text-sm text-muted-foreground max-w-sm">
                            Las mejores ofertas aparecerán aquí cuando estén disponibles
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="siguiendo" className="mt-6">
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="rounded-full bg-muted p-4 mb-4">
                            <Heart className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Sigue a vendedores</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mb-4">
                            Sigue a tus vendedores favoritos para ver sus publicaciones aquí
                          </p>
                          <Button variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Buscar vendedores
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </main>

                {/* Right Sidebar */}
                <aside className="lg:col-span-4 space-y-6">
                  {/* Trending Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Flame className="h-5 w-5 text-orange-500" />
                        Tendencias
                      </CardTitle>
                      <CardDescription>
                        Categorías más buscadas hoy
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-0">
                      {trending.map((item, index) => (
                        <div key={item.id}>
                          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                            <div className="text-2xl">{item.emoji}</div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.products} productos
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="font-semibold">
                                #{index + 1}
                              </Badge>
                              <p className="text-xs text-green-600 font-medium mt-1">{item.growth}</p>
                            </div>
                          </button>
                          {index < trending.length - 1 && <Separator className="my-0" />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Suggested Sellers Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vendedores sugeridos</CardTitle>
                      <CardDescription>Encuentra nuevos vendedores</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {suggested.map((seller) => (
                        <div key={seller.id} className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                              {seller.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate flex items-center gap-1">
                              {seller.name}
                              {seller.verified && (
                                <Badge variant="secondary" className="h-4 px-1 text-[10px]">✓</Badge>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {seller.followers} seguidores
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            Seguir
                          </Button>
                        </div>
                      ))}
                      <Button variant="ghost" className="w-full">
                        Ver más
                      </Button>
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
