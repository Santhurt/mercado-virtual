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

const router = express.Router();

// Rutas de chats
router.get("/", getAllChats);
router.get("/user/:userId", getChatsByUser);
router.get("/:id", getChatById);
router.post("/", createChat);
router.put("/:id", updateChat);
router.patch("/:id/last-message", updateLastMessage);
router.delete("/:id", deleteChat);

export default router;

