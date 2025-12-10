import { Server } from "socket.io";
import socketAuth from "../middleware/socketAuth.js";
import chatHandlers from "../socket/chatHandlers.js";

let io = null;

/**
 * Inicializa el servidor Socket.io
 * @param {Object} httpServer - Servidor HTTP de Node.js
 * @returns {Object} Instancia de Socket.io
 */
export const initSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*", // En producción, especificar los orígenes permitidos
            methods: ["GET", "POST"],
        },
    });

    // Middleware de autenticación
    io.use(socketAuth);

    // Manejar conexiones
    io.on("connection", (socket) => {
        chatHandlers(io, socket);
    });

    console.log("Servidor Socket.io inicializado");

    return io;
};

/**
 * Obtener la instancia de Socket.io
 * @returns {Object|null} Instancia de Socket.io o null si no está inicializado
 */
export const getIO = () => io;

export default { initSocketServer, getIO };
