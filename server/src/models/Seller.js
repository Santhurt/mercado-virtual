import mongoose, { Schema } from "mongoose";

export const SELLER_ACCOUNT_STATUSES = ["aprobado", "no_aprobado", "activo", "no_activo"];

const sellerSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        accountStatus: {
            type: String,
            enum: SELLER_ACCOUNT_STATUSES,
            default: "no_aprobado",
        },
        products: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Seller", sellerSchema);
