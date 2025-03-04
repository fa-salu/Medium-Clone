import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoute";
import storyRoutes from "./routes/storyRoutes";
import savedStory from "./routes/saveRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import topicRoutes from "./routes/topicsRoutes";
import commentRoutes from "./routes/commentRoutes";
import followTopiceRoutes from "./routes/followTopicsRoutes";
import followPeopleRoutes from "./routes/followPeopleRoutes";
import profileUpdateRoutes from "./routes/profileRoute";
import startCronJob from "./jobs/cronjob";

dotenv.config();
const app = express();
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(globalErrorHandler);
app.use(express.json());

startCronJob();

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use(
  "/api",
  storyRoutes,
  savedStory,
  uploadRoutes,
  topicRoutes,
  commentRoutes,
  followTopiceRoutes,
  followPeopleRoutes,
  profileUpdateRoutes
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
