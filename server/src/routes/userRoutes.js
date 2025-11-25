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

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/profile-image", handleProfileUpload, uploadProfileImage);
router.get("/:id/profile-image", getProfileImage);
router.delete("/:id/profile-image", deleteProfileImage);

export default router;

