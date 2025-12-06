import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    removeProductImage,
} from "../controllers/productController.js";
import upload from "../config/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas de productos
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas protegidas de productos (requieren autenticación)
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.post("/:id/images", authMiddleware, upload.array("images", 5), uploadProductImages);
router.delete("/:id/images", authMiddleware, removeProductImage);

export default router;

