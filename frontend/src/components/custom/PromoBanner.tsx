import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const PromoBanner = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                <div className="space-y-4 max-w-lg text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm border border-white/10">
                        <Sparkles className="h-3 w-3" />
                        <span>Oferta Especial</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Renueva tu estilo con la colección de verano
                    </h2>
                    <p className="text-indigo-100 text-lg">
                        Hasta 50% de descuento en marcas seleccionadas. Solo por
                        tiempo limitado.
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-indigo-600 hover:bg-white/90 font-semibold gap-2 shadow-lg hover:scale-105 transition-transform"
                    >
                        Ver Ofertas
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Decorative Image/Element */}
                <div className="hidden md:block relative h-48 w-48 shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-2xl rotate-6 opacity-80 blur-sm" />
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center">
                        <span className="text-6xl">🔥</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoBanner;
