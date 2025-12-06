import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IPaymentDetails } from "@/types/AppTypes";

interface CreditCardFormProps {
    initialData?: IPaymentDetails | null;
    onChange: (data: IPaymentDetails) => void;
}

const CreditCardForm = ({ initialData, onChange }: CreditCardFormProps) => {
    const handleChange = (field: keyof IPaymentDetails, value: string) => {
        onChange({
            ...initialData,
            [field]: value,
        });
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(" ").substring(0, 19) : "";
    };

    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length >= 2) {
            return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
        }
        return cleaned;
    };

    return (
        <Card className="border border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Datos de la Tarjeta
                    </CardTitle>
                    <div className="flex gap-2">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png"
                            alt="Visa"
                            className="h-6 object-contain opacity-60"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png"
                            alt="Mastercard"
                            className="h-6 object-contain opacity-60"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Card Number */}
                <div className="space-y-2">
                    <label htmlFor="cardNumber" className="text-sm font-medium">
                        Número de Tarjeta
                    </label>
                    <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={initialData?.cardNumber ? formatCardNumber(initialData.cardNumber) : ""}
                        onChange={(e) => handleChange("cardNumber", e.target.value.replace(/\s/g, ""))}
                        maxLength={19}
                        className="h-12 text-lg tracking-wider font-mono"
                    />
                </div>

                {/* Card Holder */}
                <div className="space-y-2">
                    <label htmlFor="cardHolder" className="text-sm font-medium">
                        Nombre del Titular
                    </label>
                    <Input
                        id="cardHolder"
                        placeholder="JUAN PEREZ"
                        value={initialData?.cardHolder || ""}
                        onChange={(e) => handleChange("cardHolder", e.target.value.toUpperCase())}
                        className="h-11 uppercase"
                    />
                </div>

                {/* Expiry & CVV Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="expiryDate" className="text-sm font-medium">
                            Fecha de Vencimiento
                        </label>
                        <Input
                            id="expiryDate"
                            placeholder="MM/AA"
                            value={initialData?.expiryDate ? formatExpiryDate(initialData.expiryDate) : ""}
                            onChange={(e) => handleChange("expiryDate", e.target.value.replace(/\D/g, ""))}
                            maxLength={5}
                            className="h-11 text-center font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="cvv" className="text-sm font-medium">
                            CVV
                        </label>
                        <Input
                            id="cvv"
                            type="password"
                            placeholder="•••"
                            value={initialData?.cvv || ""}
                            onChange={(e) => handleChange("cvv", e.target.value.replace(/\D/g, ""))}
                            maxLength={4}
                            className="h-11 text-center font-mono"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CreditCardForm;
