import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

const SellerInfoCard = ({ seller }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        {seller.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{seller.name}</span>
                        {seller.verified && (
                            <Badge variant="secondary" className="text-xs">
                                Verificado
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {seller.rating}
                        </div>
                        <span>•</span>
                        <span>{seller.sales} ventas</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {seller.location}
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="sm">
                Ver Perfil
            </Button>
        </div>
    );
};

export default SellerInfoCard;
