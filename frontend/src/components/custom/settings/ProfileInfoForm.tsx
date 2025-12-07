import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Phone,
    FileText,
    Calendar,
    Camera,
    Check,
    Loader2,
} from "lucide-react";
import type { IUser } from "@/types/AppTypes";

type ProfileInfoFormProps = {
    user: IUser;
    onSave?: (userData: Partial<IUser>) => void;
};

const ProfileInfoForm = ({ user, onSave }: ProfileInfoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        phone: user.phone,
        age: user.age,
    });

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

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simular guardado
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onSave?.(formData);
        setIsSaving(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            fullName: user.fullName,
            phone: user.phone,
            age: user.age,
        });
        setIsEditing(false);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Card className="w-full overflow-hidden">
            {/* Header con gradiente */}
            <div className="h-24 bg-gradient-to-r from-primary/80 via-primary to-primary/80 relative">
                <div className="absolute -bottom-12 left-6">
                    <div className="relative group">
                        <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                            {user.profileImage ? (
                                <AvatarImage
                                    src={user.profileImage}
                                    alt={user.fullName}
                                />
                            ) : null}
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
                                {getInitials(user.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <button
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            type="button"
                        >
                            <Camera className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            <CardHeader className="pt-16 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl">
                            Información Personal
                        </CardTitle>
                        <CardDescription>
                            Administra tu información de perfil
                        </CardDescription>
                    </div>
                    {!isEditing && (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                        >
                            Editar perfil
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
                {/* Nombre completo */}
                <div className="space-y-2">
                    <Label
                        htmlFor="fullName"
                        className="flex items-center gap-2 text-muted-foreground"
                    >
                        <User className="h-4 w-4" />
                        Nombre completo
                    </Label>
                    {isEditing ? (
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                            }
                            className="transition-all"
                        />
                    ) : (
                        <p className="text-lg font-medium pl-6">
                            {user.fullName}
                        </p>
                    )}
                </div>

                <Separator />

                {/* Email con badge de verificado */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        Correo electrónico
                    </Label>
                    <div className="flex items-center gap-2 pl-6">
                        <p className="text-lg font-medium">{user.email}</p>
                        <Badge
                            variant="secondary"
                            className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                            <Check className="h-3 w-3" />
                            Verificado
                        </Badge>
                    </div>
                </div>

                <Separator />

                {/* Documento de identidad */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Documento de identidad
                    </Label>
                    <p className="text-lg font-medium pl-6">
                        {user.documentNumber}
                    </p>
                </div>

                <Separator />

                {/* Grid de edad y teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Edad */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="age"
                            className="flex items-center gap-2 text-muted-foreground"
                        >
                            <Calendar className="h-4 w-4" />
                            Edad
                        </Label>
                        {isEditing ? (
                            <Input
                                id="age"
                                type="number"
                                min="0"
                                value={formData.age}
                                onChange={(e) =>
                                    handleInputChange(
                                        "age",
                                        parseInt(e.target.value) || 0
                                    )
                                }
                                className="transition-all"
                            />
                        ) : (
                            <p className="text-lg font-medium pl-6">
                                {user.age} años
                            </p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="phone"
                            className="flex items-center gap-2 text-muted-foreground"
                        >
                            <Phone className="h-4 w-4" />
                            Teléfono
                        </Label>
                        {isEditing ? (
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) =>
                                    handleInputChange("phone", e.target.value)
                                }
                                className="transition-all"
                            />
                        ) : (
                            <p className="text-lg font-medium pl-6">
                                {user.phone}
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Fecha de registro */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Fecha de registro
                    </Label>
                    <p className="text-lg font-medium pl-6">
                        {formatDate(user.registrationDate)}
                    </p>
                </div>
            </CardContent>

            {isEditing && (
                <CardFooter className="flex justify-end gap-3 border-t pt-6">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar cambios"
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default ProfileInfoForm;
