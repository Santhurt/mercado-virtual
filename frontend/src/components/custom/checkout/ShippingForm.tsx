import { MapPin, Phone, Building2, Home, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { IShippingAddress } from "@/types/AppTypes";

interface ShippingFormProps {
    initialData?: IShippingAddress | null;
    onSubmit: (data: IShippingAddress) => void;
    onBack?: () => void;
}

const ShippingForm = ({ initialData, onSubmit, onBack }: ShippingFormProps) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const shippingData: IShippingAddress = {
            fullName: formData.get("fullName") as string,
            phone: formData.get("phone") as string,
            city: formData.get("city") as string,
            addressLine: formData.get("addressLine") as string,
            details: formData.get("details") as string || undefined,
        };

        onSubmit(shippingData);
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Dirección de Envío</CardTitle>
                        <CardDescription>
                            ¿A dónde enviamos tu pedido?
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                            <span>Nombre Completo</span>
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder="Juan Pérez González"
                            defaultValue={initialData?.fullName || ""}
                            required
                            className="h-11"
                        />
                    </div>

                    {/* Phone & City Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>Teléfono</span>
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+57 300 123 4567"
                                defaultValue={initialData?.phone || ""}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>Ciudad</span>
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="city"
                                name="city"
                                placeholder="Bogotá"
                                defaultValue={initialData?.city || ""}
                                required
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Address Line */}
                    <div className="space-y-2">
                        <label htmlFor="addressLine" className="text-sm font-medium flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span>Dirección</span>
                            <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="addressLine"
                            name="addressLine"
                            placeholder="Calle 123 #45-67, Barrio Centro"
                            defaultValue={initialData?.addressLine || ""}
                            required
                            className="h-11"
                        />
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                        <label htmlFor="details" className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>Detalles adicionales</span>
                            <span className="text-muted-foreground text-xs">(opcional)</span>
                        </label>
                        <Textarea
                            id="details"
                            name="details"
                            placeholder="Apartamento 501, Torre B, entregar en recepción..."
                            defaultValue={initialData?.details || ""}
                            className="resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        {onBack && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onBack}
                                className="flex-1"
                            >
                                Volver
                            </Button>
                        )}
                        <Button type="submit" className="flex-1">
                            Continuar al Pago
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ShippingForm;
