import express from "express";
import {
    createSeller,
    deleteSeller,
    getSellerById,
    getSellers,
    updateSeller,
} from "../controllers/sellerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadSellerImages } from "../middlewares/sellerImageUpload.js";

const router = express.Router();

// Todas las rutas de vendedores requieren autenticación
router.post("/", authMiddleware, uploadSellerImages.single("image"), createSeller);
router.get("/", authMiddleware, getSellers);
router.get("/:id", authMiddleware, getSellerById);
router.put("/:id", authMiddleware, updateSeller);
router.delete("/:id", authMiddleware, deleteSeller);

export default router;

