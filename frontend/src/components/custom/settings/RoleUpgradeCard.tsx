import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Store,
    TrendingUp,
    CreditCard,
    BarChart3,
    FileCheck,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Loader2,
} from "lucide-react";
import type { UserRole } from "@/types/AppTypes";
import { useBecomeSeller } from "@/hooks/useRole";

type RoleUpgradeCardProps = {
    currentRole: UserRole;
    onUpgrade?: () => void;
};

const benefits = [
    {
        icon: Store,
        title: "Publica productos",
        description: "Crea y gestiona tu catálogo de productos",
    },
    {
        icon: CreditCard,
        title: "Recibe pagos",
        description: "Acepta pagos de forma segura",
    },
    {
        icon: TrendingUp,
        title: "Dashboard de ventas",
        description: "Visualiza el rendimiento de tu tienda",
    },
    {
        icon: BarChart3,
        title: "Métricas y reportes",
        description: "Analítica detallada de tu negocio",
    },
];

const RoleUpgradeCard = ({ currentRole, onUpgrade }: RoleUpgradeCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const becomeSeller = useBecomeSeller();

    const isSeller = currentRole === "seller" || currentRole === "admin";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!businessName.trim()) {
            setError("El nombre del negocio es requerido");
            return;
        }

        try {
            await becomeSeller.mutateAsync({
                businessName: businessName.trim(),
                description: description.trim() || undefined,
                image: imageFile || undefined,
            });

            setIsDialogOpen(false);
            setBusinessName("");
            setDescription("");
            setImageFile(null);
            setPreviewUrl(null);
            onUpgrade?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al convertirse en vendedor");
        }
    };

    const handleOpenDialog = () => {
        setError(null);
        setIsDialogOpen(true);
    };

    if (isSeller) {
        return (
            <Card className="w-full border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-500/10 dark:bg-green-500/20">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <CardTitle className="text-green-700 dark:text-green-300">
                                ¡Ya eres vendedor!
                            </CardTitle>
                            <CardDescription className="text-green-600/80 dark:text-green-400/80">
                                Tienes acceso a todas las funciones de venta
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-black/20"
                            >
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                                    <benefit.icon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-800 dark:text-green-200 text-sm">
                                        {benefit.title}
                                    </p>
                                    <p className="text-xs text-green-600/70 dark:text-green-400/70">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Badge
                        variant="secondary"
                        className="gap-1 bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                    >
                        <FileCheck className="h-3 w-3" />
                        Cuenta de vendedor activa
                    </Badge>
                </CardFooter>
            </Card>
        );
    }

    return (
        <>
            <Card className="w-full overflow-hidden">
                {/* Banner promocional con gradiente */}
                <div className="relative h-32 bg-gradient-to-r from-primary via-purple-500 to-pink-500 overflow-hidden">
                    {/* Decoración de fondo */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

                    <div className="absolute inset-0 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                <Store className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Conviértete en Vendedor
                                    <Sparkles className="h-5 w-5 text-yellow-300" />
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Empieza a vender hoy mismo
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Círculos decorativos */}
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -right-4 -bottom-12 w-24 h-24 bg-white/5 rounded-full" />
                </div>

                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Únete a nuestra comunidad de vendedores y comienza a
                            generar ingresos con tus productos. Obtén acceso a
                            herramientas profesionales de venta.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <benefit.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">
                                            {benefit.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
                    <Button
                        size="lg"
                        className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        onClick={handleOpenDialog}
                    >
                        Convertirse en Vendedor
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center sm:text-left">
                        Sin costos de inscripción • Comienza gratis
                    </p>
                </CardFooter>
            </Card>

            {/* Dialog para información del vendedor */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-primary" />
                            Información de tu Tienda
                        </DialogTitle>
                        <DialogDescription>
                            Cuéntanos sobre tu negocio para crear tu perfil de vendedor.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="businessName">
                                Nombre del Negocio <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="businessName"
                                placeholder="Ej: Tienda de Juan"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                disabled={becomeSeller.isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (opcional)</Label>
                            <Input
                                id="description"
                                placeholder="Describe brevemente tu negocio..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={becomeSeller.isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo del Negocio (opcional)</Label>
                            <div className="flex items-center gap-4">
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="h-12 w-12 rounded-full object-cover border"
                                    />
                                )}
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={becomeSeller.isPending}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={becomeSeller.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={becomeSeller.isPending}
                                className="gap-2"
                            >
                                {becomeSeller.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Confirmar
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default RoleUpgradeCard;
