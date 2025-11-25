import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number, 
            required: true,
        },
        originalPrice: {
            type: String,
            required: false,
        },
        discount: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            required: true,
        },
        features: [
            {
                type: String,
                required: true,
            },
        ],
        specifications: {
            type: Map,
            of: String,
            required: true,
        },
        tags: [
            {
                type: String,
                required: true,
            },
        ],
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (value) => value.length <= 5,
                message: "Un producto solo puede tener hasta 5 imágenes",
            },
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            immutable: true,
        },
    },
    { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
