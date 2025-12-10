import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                unitPrice: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                subtotal: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                },
                seller: {
                    type: Schema.Types.ObjectId,
                    ref: "Seller",
                    required: true,
                },
            },
        ],
        subtotal: {
            type: Number,
            required: true,
        },
        shippingCost: {
            type: Number,
            default: 0,
        },
        taxes: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            city: { type: String, required: true },
            addressLine: { type: String, required: true },
            details: { type: String },
        },
        deliveryMethod: {
            type: String,
            default: "delivery",
        },
        trackingNumber: {
            type: String,
            default: null,
        },
        history: [
            {
                status: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                actorId: { type: String },
            },
        ],
    },
    { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
