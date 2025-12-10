import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

/**
 * Manejadores de eventos para el chat en tiempo real
 * @param {Object} io - Instancia del servidor Socket.io
 * @param {Object} socket - Socket del cliente conectado
 */
const chatHandlers = (io, socket) => {
    const userId = socket.user._id.toString();

    console.log(`Usuario conectado: ${socket.user.fullName} (${userId})`);

    /**
     * Unirse a una sala de chat
     * @event join_chat
     * @param {Object} data - { chatId: string }
     */
    socket.on("join_chat", async ({ chatId }) => {
        try {
            const chat = await Chat.findById(chatId);

            if (!chat) {
                return socket.emit("error", { message: "Chat no encontrado" });
            }

            // Verificar que el usuario es participante del chat
            const participantIds = chat.participants.map((p) => p.toString());
            if (!participantIds.includes(userId)) {
                return socket.emit("error", { message: "No tienes acceso a este chat" });
            }

            socket.join(chatId);
            console.log(`Usuario ${userId} se unió al chat ${chatId}`);
        } catch (error) {
            console.error("Error al unirse al chat:", error);
            socket.emit("error", { message: "Error al unirse al chat" });
        }
    });

    /**
     * Abandonar una sala de chat
     * @event leave_chat
     * @param {Object} data - { chatId: string }
     */
    socket.on("leave_chat", ({ chatId }) => {
        socket.leave(chatId);
        console.log(`Usuario ${userId} abandonó el chat ${chatId}`);
    });

    /**
     * Enviar un mensaje
     * @event send_message
     * @param {Object} data - { chatId, receiverId, content }
     */
    socket.on("send_message", async ({ chatId, receiverId, content }) => {
        try {
            if (!chatId || !receiverId || !content) {
                return socket.emit("error", {
                    message: "Faltan campos requeridos (chatId, receiverId, content)",
                });
            }

            const chat = await Chat.findById(chatId);
            if (!chat) {
                return socket.emit("error", { message: "Chat no encontrado" });
            }

            // Verificar que sender y receiver son participantes
            const participantIds = chat.participants.map((p) => p.toString());
            if (!participantIds.includes(userId) || !participantIds.includes(receiverId)) {
                return socket.emit("error", {
                    message: "El remitente o destinatario no pertenecen a este chat",
                });
            }

            // Crear mensaje en la base de datos
            const newMessage = new Message({
                chatId,
                senderId: userId,
                receiverId,
                content,
                status: "sent",
            });

            await newMessage.save();

            // Actualizar último mensaje del chat
            chat.lastMessage = {
                text: content,
                sender: userId,
                timestamp: newMessage.createdAt,
            };
            await chat.save();

            // Poblar datos del remitente para la respuesta
            await newMessage.populate("senderId", "fullName profileImage");

            // Emitir mensaje a todos los participantes en la sala
            io.to(chatId).emit("new_message", {
                _id: newMessage._id,
                chatId: newMessage.chatId,
                senderId: newMessage.senderId,
                receiverId: newMessage.receiverId,
                content: newMessage.content,
                status: newMessage.status,
                createdAt: newMessage.createdAt,
            });

            // Confirmar envío al remitente
            socket.emit("message_delivered", {
                messageId: newMessage._id,
                status: "delivered",
            });
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            socket.emit("error", { message: "Error al enviar el mensaje" });
        }
    });

    /**
     * Indicar que el usuario está escribiendo
     * @event typing
     * @param {Object} data - { chatId, isTyping: boolean }
     */
    socket.on("typing", ({ chatId, isTyping }) => {
        // Emitir a todos excepto al emisor
        socket.to(chatId).emit("user_typing", {
            chatId,
            userId,
            userName: socket.user.fullName,
            isTyping,
        });
    });

    /**
     * Marcar mensajes como vistos
     * @event message_seen
     * @param {Object} data - { chatId, messageIds: string[] }
     */
    socket.on("message_seen", async ({ chatId, messageIds }) => {
        try {
            if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
                return;
            }

            // Actualizar estado de mensajes a 'seen'
            await Message.updateMany(
                {
                    _id: { $in: messageIds },
                    chatId,
                    receiverId: userId,
                },
                { status: "seen" },
            );

            // Notificar a los demás participantes
            socket.to(chatId).emit("messages_marked_seen", {
                chatId,
                messageIds,
                seenBy: userId,
            });
        } catch (error) {
            console.error("Error al marcar mensajes como vistos:", error);
        }
    });

    /**
     * Manejar desconexión
     * @event disconnect
     */
    socket.on("disconnect", () => {
        console.log(`Usuario desconectado: ${socket.user.fullName} (${userId})`);
    });
};

export default chatHandlers;
