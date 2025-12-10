import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware de autenticación para conexiones Socket.io
 * Valida el JWT token enviado en el handshake
 */
const socketAuth = async (socket, next) => {
    try {
        const authToken = socket.handshake.auth?.token || "";
        const token = authToken.startsWith("Bearer ") ? authToken.split(" ")[1] : authToken;

        if (!token) {
            return next(new Error("Token de autenticación no proporcionado"));
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return next(new Error("Error de configuración del servidor"));
        }

        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next(new Error("Usuario no encontrado"));
        }

        // Adjuntar usuario al socket para uso posterior
        socket.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(new Error("Token inválido"));
        }
        if (error.name === "TokenExpiredError") {
            return next(new Error("Token expirado"));
        }
        return next(new Error("Error de autenticación"));
    }
};

export default socketAuth;
