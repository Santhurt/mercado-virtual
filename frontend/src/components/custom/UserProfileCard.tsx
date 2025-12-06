import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Award, Share2, Settings } from "lucide-react";
import type { IUserProfile } from "@/types/AppTypes";

type UserProfileCardProps = {
    userProfile: IUserProfile;
};

// Componente auxiliar para una sola estadística
type StatItemProps = {
    value: number;
    label: string;
};

const StatItem = ({ value, label }: StatItemProps) => (
    <div className="text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
    </div>
);

const UserProfileCard = ({ userProfile }: UserProfileCardProps) => {
    // Función auxiliar para obtener las iniciales del nombre
    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return parts
            .map((p) => p.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="w-full mx-auto shadow-lg">
            <CardContent className="pt-6">
                {/* 1. Encabezado: Avatar, Info principal y Acciones */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    {/* Columna de Avatar y Detalles */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary flex-shrink-0">
                            {/* Si hubiera userProfile.avatarUrl, se usaría <AvatarImage src={userProfile.avatarUrl} /> */}
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                {getInitials(userProfile.name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            {/* Nombre y Badges */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h1 className="text-2xl font-bold">
                                    {userProfile.name}
                                </h1>
                                {userProfile.badges
                                    .slice(0, 1) // Limitar a un badge visible
                                    .map((badge, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <Award className="h-3 w-3" />
                                            {badge}
                                        </Badge>
                                    ))}
                            </div>

                            {/* Nombre de Usuario y Bio */}
                            <p className="text-sm text-muted-foreground mb-3">
                                @{userProfile.username}
                            </p>
                            <p className="text-sm mb-3">{userProfile.bio}</p>

                            {/* Metadata (Ubicación, Fecha, Rating) */}
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {userProfile.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Registrado: {userProfile.joinDate}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    {userProfile.rating.toFixed(1)} rating
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna de Botones de Acción */}
                    <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                        <Button className="flex-1 sm:flex-none">Seguir</Button>
                    </div>
                </div>

                {/* 2. Sección de Estadísticas (Separada por un borde) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-6 border-t">
                    <StatItem
                        value={userProfile.stats.productos}
                        label="Productos"
                    />
                    <StatItem value={userProfile.stats.ventas} label="Ventas" />
                    <StatItem
                        value={userProfile.stats.seguidores}
                        label="Seguidores"
                    />
                    <StatItem
                        value={userProfile.stats.siguiendo}
                        label="Siguiendo"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;
