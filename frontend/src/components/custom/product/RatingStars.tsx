import { Star } from "lucide-react";

// Componente utilitario para renderizar estrellas de calificación
const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className="flex">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${
                        i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    );
};

export default RatingStars;
