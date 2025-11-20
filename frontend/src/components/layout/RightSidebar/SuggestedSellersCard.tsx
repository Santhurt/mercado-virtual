import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const suggested = [
    { id: 1, name: "Tech Store Pro", followers: "2.5k", verified: true },
    { id: 2, name: "Fashion Hub", followers: "1.8k", verified: false },
    { id: 3, name: "Electronics Plus", followers: "3.2k", verified: true },
];

const SuggestedSellersCard = () => {
    return (
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
                                    <Badge
                                        variant="secondary"
                                        className="h-4 px-1 text-[10px]"
                                    >
                                        ✓
                                    </Badge>
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
    );
};

export default SuggestedSellersCard;
