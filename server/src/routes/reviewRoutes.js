import express from "express";
import { createReview, getProductReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/:productId", getProductReviews);

// Protected routes
router.post("/", authMiddleware, createReview);

export default router;
