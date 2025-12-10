import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import mongodbConn from "./src/config/mongo.js";
import morgan from "morgan";
import productRoutes from "./src/routes/productRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import { initSocketServer } from "./src/config/socket.js";

config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/public", express.static("public"));

if (process.env.NODE_ENV !== "test") {
    mongodbConn();
}

// Rutas de la aplicacion
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
    // Inicializar Socket.io
    initSocketServer(server);

    server.listen(PORT, () => {
        console.log("Listening on port: " + PORT);
    });
}

export default app;
export { server };
