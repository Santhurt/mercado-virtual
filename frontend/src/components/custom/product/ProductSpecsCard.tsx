import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductSpecsProps = {
    specifications: Record<string, string>;
};

const ProductSpecificationsCard = ({ specifications }: ProductSpecsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {Object.entries(specifications).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex justify-between items-center"
                        >
                            <span className="text-sm text-muted-foreground capitalize">
                                {key}:
                            </span>
                            <span className="text-sm font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductSpecificationsCard;
