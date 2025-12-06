import express from "express";
import {
    getAllChats,
    getChatById,
    getChatsByUser,
    createChat,
    updateChat,
    updateLastMessage,
    deleteChat,
} from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas las rutas de chats requieren autenticación
router.get("/", authMiddleware, getAllChats);
router.get("/user/:userId", authMiddleware, getChatsByUser);
router.get("/:id", authMiddleware, getChatById);
router.post("/", authMiddleware, createChat);
router.put("/:id", authMiddleware, updateChat);
router.patch("/:id/last-message", authMiddleware, updateLastMessage);
router.delete("/:id", authMiddleware, deleteChat);

export default router;

