import express from "express";
import multer from "multer";
import {
    registerUser,
    loginUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadProfileImage,
    deleteProfileImage,
    getProfileImage,
} from "../controllers/userController.js";
import { uploadUserProfileImage } from "../middlewares/userImageUpload.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const handleProfileUpload = (req, res, next) => {
    uploadUserProfileImage.single("image")(req, res, (err) => {
        if (err) {
            const status = err instanceof multer.MulterError ? 400 : 500;
            return res.status(status).json({
                success: false,
                message: err.message || "Error al procesar la imagen",
            });
        }
        next();
    });
};

// Rutas públicas de usuarios
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id/profile-image", getProfileImage);

// Rutas protegidas de usuarios (requieren autenticación)
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.post("/:id/profile-image", authMiddleware, handleProfileUpload, uploadProfileImage);
router.delete("/:id/profile-image", authMiddleware, deleteProfileImage);

export default router;

