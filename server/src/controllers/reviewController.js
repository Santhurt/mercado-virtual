import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        const userId = req.user._id;

        if (!rating || !productId) {
            return res.status(400).json({
                success: false,
                message: "Rating y productId son requeridos",
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "Ya has realizado una reseña para este producto",
            });
        }

        const review = await Review.create({
            product: productId,
            user: userId,
            rating,
            comment,
        });

        // Recalcular rating promedio del producto
        const reviews = await Review.find({ product: productId });
        const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = totalRating / reviews.length;

        product.rating = Number(averageRating.toFixed(1));
        product.reviewCount = reviews.length;
        await product.save();

        res.status(201).json({
            success: true,
            message: "Reseña creada exitosamente",
            data: review,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear la reseña",
            error: error.message,
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const reviews = await Review.find({ product: productId })
            .populate("user", "fullName profileImage")
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Review.countDocuments({ product: productId });

        res.status(200).json({
            success: true,
            data: {
                reviews,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las reseñas",
            error: error.message,
        });
    }
};
