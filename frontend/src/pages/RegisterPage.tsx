import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Phone,
    CreditCard,
    Calendar,
    ShoppingBag,
    Loader2,
    ArrowLeft,
} from "lucide-react";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        documentNumber: "",
        age: "",
        phone: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    const registerMutation = useRegister();

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setValidationError("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setValidationError("Las contraseñas no coinciden");
            return;
        }

        if (formData.password.length < 6) {
            setValidationError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        const age = parseInt(formData.age);
        if (isNaN(age) || age < 18 || age > 120) {
            setValidationError("Ingresa una edad válida (mínimo 18 años)");
            return;
        }

        registerMutation.mutate({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            documentNumber: formData.documentNumber,
            age: age,
            phone: formData.phone,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-8 relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />

            {/* Animated floating shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Glassmorphism card */}
            <Card className="w-full max-w-lg relative backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    {/* Back to login */}
                    <Link
                        to="/login"
                        className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-1 text-sm transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Link>

                    {/* Logo */}
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
                        <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        Crear cuenta
                    </CardTitle>
                    <CardDescription className="text-white/70">
                        Únete a MercaFácil y comienza a comprar
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-white/90 font-medium">
                                Nombre completo
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={formData.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    required
                                    className="pl-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white/90 font-medium">
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    required
                                    className="pl-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                />
                            </div>
                        </div>

                        {/* Two columns: Document and Age */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="documentNumber" className="text-white/90 font-medium">
                                    Documento
                                </Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <Input
                                        id="documentNumber"
                                        type="text"
                                        placeholder="123456789"
                                        value={formData.documentNumber}
                                        onChange={(e) => updateField("documentNumber", e.target.value)}
                                        required
                                        className="pl-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-white/90 font-medium">
                                    Edad
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                    <Input
                                        id="age"
                                        type="number"
                                        min="18"
                                        max="120"
                                        placeholder="25"
                                        value={formData.age}
                                        onChange={(e) => updateField("age", e.target.value)}
                                        required
                                        className="pl-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white/90 font-medium">
                                Teléfono
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="300 123 4567"
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    required
                                    className="pl-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white/90 font-medium">
                                Contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    required
                                    className="pl-11 pr-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white/90 font-medium">
                                Confirmar contraseña
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                                    required
                                    className="pl-11 pr-11 h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error messages */}
                        {(validationError || registerMutation.isError) && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                                {validationError || registerMutation.error?.message || "Error al registrar"}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col space-y-4">
                        {/* Submit button */}
                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full h-12 bg-white text-teal-700 hover:bg-white/90 font-semibold text-base shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                        >
                            {registerMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Creando cuenta...
                                </>
                            ) : (
                                "Crear cuenta"
                            )}
                        </Button>

                        {/* Login link */}
                        <p className="text-white/70 text-sm text-center">
                            ¿Ya tienes cuenta?{" "}
                            <Link
                                to="/login"
                                className="text-white font-medium hover:underline transition-all"
                            >
                                Inicia sesión
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
