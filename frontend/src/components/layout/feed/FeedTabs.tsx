import PostCard from "@/components/custom/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IPost } from "@/types/AppTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Package, Sparkles, Heart, Search } from "lucide-react";

type FeedTabsProps = {
    activeTab: "productos" | "ofertas" | "siguiendo";
    setActiveTab: (value: string) => void;
    posts: IPost[];
};

const FeedTabs = ({ activeTab, setActiveTab, posts }: FeedTabsProps) => (
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
                <PostCard post={post} />
            ))}
        </TabsContent>

        <TabsContent value="ofertas" className="mt-6">
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Sparkles className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                        No hay ofertas especiales
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Las mejores ofertas aparecerán aquí cuando estén
                        disponibles
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
                    <h3 className="font-semibold text-lg mb-2">
                        Sigue a vendedores
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                        Sigue a tus vendedores favoritos para ver sus
                        publicaciones aquí
                    </p>
                    <Button variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Buscar vendedores
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
);

export default FeedTabs;
