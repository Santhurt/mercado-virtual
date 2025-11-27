import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        userId: {
            type: String,
            default: null,
        },
        sessionId: {
            type: String,
            default: null,
        },
        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                image: {
                    type: String,
                },
            },
        ],
        totalPrice: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "completed", "abandoned"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Calculate total price before saving
cartSchema.pre("save", async function () {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
