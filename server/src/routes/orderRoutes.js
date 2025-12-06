import express from "express";
import {
    createOrder,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas de órdenes requieren autenticación
router.post("/", authMiddleware, createOrder);
router.get("/:id", authMiddleware, getOrderById);
router.get("/user/:userId", authMiddleware, getOrdersByUser);
router.patch("/:id/status", authMiddleware, updateOrderStatus);

export default router;
