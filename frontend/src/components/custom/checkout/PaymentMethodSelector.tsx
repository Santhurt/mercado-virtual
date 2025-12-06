import { CreditCard, Building, Smartphone, Banknote, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "@/types/AppTypes";
import { cn } from "@/lib/utils";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod | null;
    onSelect: (method: PaymentMethod) => void;
    onContinue: () => void;
    onBack: () => void;
}

interface PaymentOption {
    id: PaymentMethod;
    name: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    popular?: boolean;
}

const paymentOptions: PaymentOption[] = [
    {
        id: "credit_card",
        name: "Tarjeta Crédito/Débito",
        description: "Visa, Mastercard, American Express",
        icon: CreditCard,
        iconBg: "bg-blue-500/10 text-blue-600",
        popular: true,
    },
    {
        id: "pse",
        name: "PSE",
        description: "Transferencia desde tu banco",
        icon: Building,
        iconBg: "bg-green-500/10 text-green-600",
    },
    {
        id: "nequi",
        name: "Nequi",
        description: "Paga desde tu app Nequi",
        icon: Smartphone,
        iconBg: "bg-purple-500/10 text-purple-600",
    },
    {
        id: "cash_on_delivery",
        name: "Pago Contraentrega",
        description: "Paga cuando recibas tu pedido",
        icon: Banknote,
        iconBg: "bg-amber-500/10 text-amber-600",
    },
];

const PaymentMethodSelector = ({
    selectedMethod,
    onSelect,
    onContinue,
    onBack,
}: PaymentMethodSelectorProps) => {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Método de Pago</CardTitle>
                        <CardDescription>
                            Elige cómo quieres pagar tu pedido
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Payment Options Grid */}
                <div className="grid gap-3">
                    {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedMethod === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => onSelect(option.id)}
                                className={cn(
                                    "relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left",
                                    "hover:border-primary/50 hover:bg-accent/50",
                                    isSelected
                                        ? "border-primary bg-primary/5 shadow-sm"
                                        : "border-border bg-card"
                                )}
                            >
                                {/* Selection Indicator */}
                                <div
                                    className={cn(
                                        "absolute top-3 right-3 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                                        isSelected
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/30"
                                    )}
                                >
                                    {isSelected && (
                                        <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                </div>

                                {/* Icon */}
                                <div className={cn("p-3 rounded-lg", option.iconBg)}>
                                    <Icon className="h-6 w-6" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pr-8">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{option.name}</span>
                                        {option.popular && (
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    <svg
                        className="h-4 w-4 text-green-600 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                    <span>Tus datos están protegidos con encriptación SSL</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1"
                    >
                        Volver
                    </Button>
                    <Button
                        type="button"
                        onClick={onContinue}
                        disabled={!selectedMethod}
                        className="flex-1"
                    >
                        Continuar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentMethodSelector;
