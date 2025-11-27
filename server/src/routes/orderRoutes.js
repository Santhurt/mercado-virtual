import express from "express";
import {
    createOrder,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/:id", getOrderById);
router.get("/user/:userId", getOrdersByUser);
router.patch("/:id/status", updateOrderStatus);

export default router;
