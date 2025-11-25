import express from "express";
import cors from "cors";
import { config } from "dotenv";
import mongodbConn from "./src/config/mongo.js";
import morgan from "morgan";
import productRoutes from "./src/routes/productRoutes.js";
import sellerRoutes from "./src/routes/sellerRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

config();

const app = express();

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

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log("Listening on port: " + PORT);
    });
}

export default app;
