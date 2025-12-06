import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
    ShippingForm,
    PaymentMethodSelector,
    CreditCardForm,
    OrderSummary,
    OrderConfirmation,
} from "@/components/custom/checkout";
import type {
    CheckoutStep,
    IShippingAddress,
    PaymentMethod,
    IPaymentDetails,
} from "@/types/AppTypes";
import { cn } from "@/lib/utils";

const steps: { id: CheckoutStep; label: string }[] = [
    { id: "shipping", label: "Envío" },
    { id: "payment", label: "Pago" },
    { id: "review", label: "Resumen" },
    { id: "confirmation", label: "Confirmación" },
];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart, closeCart } = useCart();

    const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
    const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails | null>(null);
    const [orderNumber, setOrderNumber] = useState<string>("");

    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    const handleShippingSubmit = (data: IShippingAddress) => {
        setShippingAddress(data);
        setCurrentStep("payment");
    };

    const handlePaymentContinue = () => {
        setCurrentStep("review");
    };

    const handleConfirmOrder = () => {
        // Generate random order number
        const newOrderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
        setOrderNumber(newOrderNumber);
        clearCart();
        closeCart();
        setCurrentStep("confirmation");
    };

    const handleContinueShopping = () => {
        navigate("/");
    };

    const goBack = () => {
        if (currentStep === "payment") setCurrentStep("shipping");
        else if (currentStep === "review") setCurrentStep("payment");
    };

    // Redirect to home if cart is empty (except on confirmation)
    if (items.length === 0 && currentStep !== "confirmation") {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
                    <p className="text-muted-foreground">
                        Agrega productos antes de proceder al checkout
                    </p>
                    <Button onClick={() => navigate("/")}>Ir a comprar</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>
                    <h1 className="font-semibold text-lg">Checkout</h1>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            {/* Progress Steps */}
            {currentStep !== "confirmation" && (
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
                        {steps.slice(0, -1).map((step, index) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = index < currentStepIndex;

                            return (
                                <div key={step.id} className="flex items-center">
                                    {/* Step Circle */}
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                                                isCompleted
                                                    ? "bg-primary text-primary-foreground"
                                                    : isActive
                                                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                                        : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-5 w-5" />
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs font-medium transition-colors",
                                                isActive || isCompleted
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {step.label}
                                        </span>
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 2 && (
                                        <div
                                            className={cn(
                                                "h-1 w-16 mx-2 rounded-full transition-colors duration-300",
                                                index < currentStepIndex
                                                    ? "bg-primary"
                                                    : "bg-muted"
                                            )}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {currentStep === "confirmation" ? (
                    <OrderConfirmation
                        orderNumber={orderNumber}
                        onContinueShopping={handleContinueShopping}
                    />
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {currentStep === "shipping" && (
                                <ShippingForm
                                    initialData={shippingAddress}
                                    onSubmit={handleShippingSubmit}
                                />
                            )}

                            {currentStep === "payment" && (
                                <div className="space-y-6">
                                    <PaymentMethodSelector
                                        selectedMethod={paymentMethod}
                                        onSelect={setPaymentMethod}
                                        onContinue={handlePaymentContinue}
                                        onBack={goBack}
                                    />

                                    {paymentMethod === "credit_card" && (
                                        <CreditCardForm
                                            initialData={paymentDetails}
                                            onChange={setPaymentDetails}
                                        />
                                    )}
                                </div>
                            )}

                            {currentStep === "review" && (
                                <div className="lg:hidden">
                                    <OrderSummary
                                        items={items}
                                        subtotal={totalPrice}
                                        shippingAddress={shippingAddress}
                                        paymentMethod={paymentMethod}
                                        isReviewStep={true}
                                        showActions={true}
                                        onConfirm={handleConfirmOrder}
                                        onBack={goBack}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className={cn(
                            "hidden lg:block",
                            currentStep === "review" && "lg:col-span-1"
                        )}>
                            <OrderSummary
                                items={items}
                                subtotal={totalPrice}
                                shippingAddress={shippingAddress}
                                paymentMethod={paymentMethod}
                                isReviewStep={currentStep === "review"}
                                showActions={currentStep === "review"}
                                onConfirm={handleConfirmOrder}
                                onBack={goBack}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CheckoutPage;
