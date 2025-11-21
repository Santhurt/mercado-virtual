import { Truck, Shield, Package } from "lucide-react";
import React from "react";

const InfoItem = ({ Icon, title, subtitle }) => (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
        <div className="text-xs">
            <div className="font-semibold">{title}</div>
            <div className="text-muted-foreground">{subtitle}</div>
        </div>
    </div>
);

const ProductQuickInfo = ({ stock }) => {
    return (
        <div className="grid grid-cols-3 gap-3">
            <InfoItem Icon={Truck} title="Envío rápido" subtitle="2-3 días" />
            <InfoItem Icon={Shield} title="Garantía" subtitle="30 días" />
            <InfoItem
                Icon={Package}
                title="Stock"
                subtitle={`${stock} unidades`}
            />
        </div>
    );
};

export default ProductQuickInfo;
