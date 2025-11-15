import React, { useState } from 'react';
import { Search, Moon, Home, Package, Tag, MessageSquare, User, MoreVertical, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MerchantSocialFeed = () => {
  const [activeTab, setActiveTab] = useState('productos');

  const posts = [
    {
      id: 1,
      user: 'Usuario',
      role: 'Vendedor',
      avatar: '',
      title: 'Nuevo producto a la venta',
      description: 'Revisa nuestras ofertas!',
      images: 4,
      likes: 24,
      comments: 8,
      timestamp: '2h'
    },
    {
      id: 2,
      user: 'María García',
      role: 'Mayorista',
      avatar: '',
      title: 'Oferta especial - 30% descuento',
      description: 'Stock limitado en productos seleccionados',
      images: 2,
      likes: 45,
      comments: 12,
      timestamp: '5h'
    },
    {
      id: 3,
      user: 'Carlos Ruiz',
      role: 'Distribuidor',
      avatar: '',
      title: 'Nueva línea de productos disponible',
      description: 'Contáctame para precios especiales',
      images: 6,
      likes: 38,
      comments: 15,
      timestamp: '1d'
    }
  ];

  const destacados = [
    { id: 1, title: 'Electrónica', count: 234 },
    { id: 2, title: 'Textiles', count: 189 },
    { id: 3, title: 'Alimentos', count: 156 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary" />
          </div>
          
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Tema oscuro
            </Button>
            <Button variant="ghost" size="icon">
              <Moon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Input placeholder="Post..." className="flex-1" />
                  <Button>Publicar</Button>
                </div>
              </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="productos" className="flex-1">Productos</TabsTrigger>
                <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="productos" className="space-y-4 mt-4">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{post.user[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{post.user}</CardTitle>
                            <CardDescription>{post.role}</CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Guardar</DropdownMenuItem>
                            <DropdownMenuItem>Compartir</DropdownMenuItem>
                            <DropdownMenuItem>Reportar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="aspect-square bg-muted rounded-lg" />
                        <div className="aspect-square bg-muted rounded-lg" />
                        <div className="aspect-square bg-muted rounded-lg" />
                        <div className="aspect-square bg-muted rounded-lg relative">
                          {post.images > 4 && (
                            <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                              <span className="text-white text-2xl font-semibold">+{post.images - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="posts" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No hay posts disponibles
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          {/* Right Sidebar - Destacados */}
          <aside className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Destacados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {destacados.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="aspect-video bg-muted rounded-lg" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.title}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MerchantSocialFeed;
