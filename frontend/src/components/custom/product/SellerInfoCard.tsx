import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ISellerProfile } from "@/types/AppTypes";
import { Star, MapPin } from "lucide-react";

type SellerInfoCardProps = {
    seller?: ISellerProfile;
};

const SellerInfoCard = ({ seller }: SellerInfoCardProps) => {
    if (!seller) return null;

    // TODO: Fields not yet in API response, using defaults
    const rating = 4.8;
    const sales = 150;
    const location = "Colombia";
    const verified = true;

    // Construct simplified image URL if logo is a relative path
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const logoUrl = seller.logo
        ? (seller.logo.startsWith("http") ? seller.logo : `${API_URL}${seller.logo}`)
        : undefined;

    return (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border bg-background">
                    {logoUrl && <AvatarImage src={logoUrl} alt={seller.businessName} />}
                    <AvatarFallback className="bg-primary/10 text-primary">
                        {seller.businessName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{seller.businessName}</span>
                        {verified && (
                            <Badge variant="secondary" className="text-xs px-1 h-5">
                                Verificado
                            </Badge>
                        )}
                    </div>
                    {seller.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                            {seller.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                        <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {rating}
                        </div>
                        <span className="text-xs">•</span>
                        <span className="text-xs">{sales} ventas</span>
                        <span className="text-xs">•</span>
                        <div className="flex items-center gap-0.5 text-xs">
                            <MapPin className="h-3 w-3" />
                            {location}
                        </div>
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
