import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/userRoute";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(globalErrorHandler);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
