import express from "express";
import {
    createSeller,
    deleteSeller,
    getSellerById,
    getSellers,
    updateSeller,
} from "../controllers/sellerController.js";

const router = express.Router();

router.post("/", createSeller);
router.get("/", getSellers);
router.get("/:id", getSellerById);
router.put("/:id", updateSeller);
router.delete("/:id", deleteSeller);

export default router;

