import express from "express";
import cors from "cors";
import { config } from "dotenv";
import mongodbConn from "./src/config/mongo.js";
import morgan from "morgan";
import productRoutes from "./src/routes/productRoutes.js";

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/public", express.static("public"));

mongodbConn();

// Rutas de la aplicacion
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});
