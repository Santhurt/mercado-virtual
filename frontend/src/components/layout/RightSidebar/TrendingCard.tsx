import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const trending = [
    { id: 1, title: "Smartphones", growth: "+24%", emoji: "📱", products: 234 },
    { id: 2, title: "Gaming", growth: "+18%", emoji: "🎮", products: 189 },
    { id: 3, title: "Moda", growth: "+32%", emoji: "👗", products: 156 },
];

const TrendingCard = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Tendencias
                </CardTitle>
                <CardDescription>Categorías más buscadas hoy</CardDescription>
            </CardHeader>

            <CardContent className="space-y-0">
                {trending.map((item, index) => (
                    <div key={item.id}>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                            <div className="text-2xl">{item.emoji}</div>

                            <div className="flex-1 text-left">
                                <p className="font-medium text-sm">
                                    {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {item.products} productos
                                </p>
                            </div>

                            <div className="text-right">
                                <Badge
                                    variant="outline"
                                    className="font-semibold"
                                >
                                    #{index + 1}
                                </Badge>
                                <p className="text-xs text-green-600 font-medium mt-1">
                                    {item.growth}
                                </p>
                            </div>
                        </button>

                        {index < trending.length - 1 && (
                            <Separator className="my-0" />
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default TrendingCard;
