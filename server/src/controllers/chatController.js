import Chat from "../models/Chat.js";
import User from "../models/User.js";

const populateChat = (queryOrDoc) =>
    queryOrDoc.populate({
        path: "participants",
        select: "-password",
    });

// Obtener todos los chats
export const getAllChats = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;

        // Construir filtros
        const filters = {};
        if (userId) {
            filters.participants = userId;
        }

        // Calcular paginación
        const skip = (Number(page) - 1) * Number(limit);

        // Obtener chats con filtros y paginación
        const chats = await populateChat(
            Chat.find(filters)
                .limit(Number(limit))
                .skip(skip)
                .sort({ updatedAt: -1 }),
        );

        // Contar total de chats
        const total = await Chat.countDocuments(filters);

        res.status(200).json({
            success: true,
            data: {
                chats,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los chats",
            error: error.message,
        });
    }
};

// Obtener un chat por ID
export const getChatById = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await populateChat(Chat.findById(id));

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el chat",
            error: error.message,
        });
    }
};

// Obtener chats de un usuario específico
export const getChatsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        // Calcular paginación
        const skip = (Number(page) - 1) * Number(limit);

        // Obtener chats donde el usuario es participante
        const chats = await populateChat(
            Chat.find({ participants: userId })
                .limit(Number(limit))
                .skip(skip)
                .sort({ updatedAt: -1 }),
        );

        // Contar total de chats
        const total = await Chat.countDocuments({ participants: userId });

        res.status(200).json({
            success: true,
            data: {
                chats,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los chats del usuario",
            error: error.message,
        });
    }
};

// Crear un nuevo chat
export const createChat = async (req, res) => {
    try {
        const { participants, lastMessage } = req.body;

        // Validar campos requeridos
        if (!participants || !Array.isArray(participants)) {
            return res.status(400).json({
                success: false,
                message: "El campo 'participants' es requerido y debe ser un array",
            });
        }

        if (participants.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Un chat debe tener al menos 2 participantes",
            });
        }

        // Eliminar duplicados antes de validar
        const uniqueParticipants = [...new Set(participants.map((p) => p.toString()))];

        // Validar que todos los participantes existan
        const users = await User.find({ _id: { $in: uniqueParticipants } });
        if (users.length !== uniqueParticipants.length) {
            return res.status(404).json({
                success: false,
                message: "Uno o más participantes no existen",
            });
        }

        // Usar participantes únicos para el resto del proceso
        const finalParticipants = uniqueParticipants;

        // Verificar si ya existe un chat con estos mismos participantes
        const existingChat = await Chat.findOne({
            participants: { $all: finalParticipants, $size: finalParticipants.length },
        });

        if (existingChat) {
            await populateChat(existingChat);
            return res.status(200).json({
                success: true,
                message: "Chat ya existe",
                data: existingChat,
            });
        }

        // Crear el chat
        const chat = await Chat.create({
            participants: finalParticipants,
            lastMessage: lastMessage || null,
        });

        await populateChat(chat);

        res.status(201).json({
            success: true,
            message: "Chat creado exitosamente",
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el chat",
            error: error.message,
        });
    }
};

// Actualizar un chat
export const updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { participants, lastMessage } = req.body;

        const updateData = {};

        // Validar participantes si se proporcionan
        if (participants !== undefined) {
            if (!Array.isArray(participants)) {
                return res.status(400).json({
                    success: false,
                    message: "El campo 'participants' debe ser un array",
                });
            }

            if (participants.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Un chat debe tener al menos 2 participantes",
                });
            }

            // Validar que todos los participantes existan
            const users = await User.find({ _id: { $in: participants } });
            if (users.length !== participants.length) {
                return res.status(404).json({
                    success: false,
                    message: "Uno o más participantes no existen",
                });
            }

            updateData.participants = participants;
        }

        // Actualizar lastMessage si se proporciona
        if (lastMessage !== undefined) {
            updateData.lastMessage = lastMessage;
        }

        const chat = await Chat.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat no encontrado",
            });
        }

        await populateChat(chat);

        res.status(200).json({
            success: true,
            message: "Chat actualizado exitosamente",
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el chat",
            error: error.message,
        });
    }
};

// Actualizar solo el último mensaje
export const updateLastMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { lastMessage } = req.body;

        if (lastMessage === undefined) {
            return res.status(400).json({
                success: false,
                message: "El campo 'lastMessage' es requerido",
            });
        }

        const chat = await Chat.findByIdAndUpdate(
            id,
            { lastMessage },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat no encontrado",
            });
        }

        await populateChat(chat);

        res.status(200).json({
            success: true,
            message: "Último mensaje actualizado exitosamente",
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el último mensaje",
            error: error.message,
        });
    }
};

// Eliminar un chat
export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;

        const chat = await Chat.findByIdAndDelete(id);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat eliminado exitosamente",
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el chat",
            error: error.message,
        });
    }
};

