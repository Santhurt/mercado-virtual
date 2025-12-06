import { Router } from "express";
import { createMessage, getMessagesByChat } from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Todas las rutas de mensajes requieren autenticación
router.use(authMiddleware);

router.post("/", createMessage);
router.get("/:chatId", getMessagesByChat);

export default router;
