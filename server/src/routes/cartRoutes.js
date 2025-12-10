import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartBySeller,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas de carrito requieren autenticación
router.get("/", authMiddleware, getCart);
router.get("/grouped", authMiddleware, getCartBySeller);
router.post("/add", authMiddleware, addToCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;

