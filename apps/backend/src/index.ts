require("dotenv").config();
import express, { NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import { config } from "./config/index";
const app = express();

//middlewares.
app.use(cors());
app.use(express.json());

//routes.
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.listen(config.port, () => {
  console.log("server running at : ", config.port);
});
