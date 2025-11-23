import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import mongodbConn from "./src/config/mongo.js";

config();

const app = express();

app.use(express.json());
app.use(cors);
app.use(morgan("dev"));

mongodbConn();

// Aqui irian las rutas de la aplicacion

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});
