import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const createMessage = async (req, res) => {
    try {
        const { chatId, content, receiverId } = req.body;
        const senderId = req.user._id; // Asumiendo que tenemos el usuario en req.user (middleware de auth)

        if (!chatId || !content || !receiverId) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos requeridos (chatId, content, receiverId)",
            });
        }

        // Verificar que el chat existe
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat no encontrado",
            });
        }

        // Verificar que el sender y receiver son participantes del chat
        const participantIds = chat.participants.map((p) => p.toString());
        if (!participantIds.includes(senderId) || !participantIds.includes(receiverId)) {
            return res.status(403).json({
                success: false,
                message: "El remitente o el destinatario no pertenecen a este chat",
            });
        }

        const newMessage = new Message({
            chatId,
            senderId,
            receiverId,
            content,
        });

        await newMessage.save();

        // Actualizar el último mensaje del chat
        chat.lastMessage = {
            text: content,
            sender: senderId,
            timestamp: newMessage.createdAt,
        };
        await chat.save();

        res.status(201).json({
            success: true,
            data: newMessage,
        });
    } catch (error) {
        console.error("Error al crear mensaje:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};

export const getMessagesByChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat no encontrado",
            });
        }

        // Verificar si el usuario actual tiene acceso al chat
        // (Opcional, pero recomendado por seguridad)
        const userId = req.user.id;
        const participantIds = chat.participants.map((p) => p.toString());
        if (!participantIds.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para ver los mensajes de este chat",
            });
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 }, // Más recientes primero
        };

        // Mongoose no tiene paginación nativa directa en find(), pero podemos simularla
        // O usar skip/limit
        const skip = (options.page - 1) * options.limit;

        const messages = await Message.find({ chatId })
            .sort(options.sort)
            .skip(skip)
            .limit(options.limit);

        const total = await Message.countDocuments({ chatId });

        res.status(200).json({
            success: true,
            data: {
                messages,
                pagination: {
                    page: options.page,
                    limit: options.limit,
                    total,
                    pages: Math.ceil(total / options.limit),
                },
            },
        });
    } catch (error) {
        console.error("Error al obtener mensajes:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message,
        });
    }
};
