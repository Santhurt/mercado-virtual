import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react"; // Asumo este icono

type ProductCardProps = {
    title: string;
    price: string;
    status: string;
};

const ProductCard = ({ title, price, status }: ProductCardProps) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            {/* Sección de la Imagen/Icono y Badge */}
            <div className="aspect-square bg-muted flex items-center justify-center relative">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <Badge className="absolute top-2 right-2" variant="secondary">
                    {status}
                </Badge>
            </div>

            <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-lg font-bold text-primary">{price}</p>
            </CardContent>
        </Card>
    );
};

// 📤 Exportación
export default ProductCard;
