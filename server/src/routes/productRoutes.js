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

const router = express.Router();

// Rutas de productos
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/images", upload.array("images", 5), uploadProductImages);
router.delete("/:id/images", removeProductImage);

export default router;

