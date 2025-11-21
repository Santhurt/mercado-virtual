import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductFeaturesCardProps = {
    features: string[];
};
const ProductFeaturesCard = ({ features }: ProductFeaturesCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default ProductFeaturesCard;
