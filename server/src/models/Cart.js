import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        sessionId: {
            type: String,
            default: null,
        },
        items: [
            {
                seller: {
                    type: Schema.Types.ObjectId,
                    ref: "Seller", // Asumiendo que el modelo de comerciante es "Seller"
                    required: true, // Debe ser requerido en el ítem del carrito
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
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
    { timestamps: true },
);

// Calculate total price before saving
cartSchema.pre("save", async function () {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
