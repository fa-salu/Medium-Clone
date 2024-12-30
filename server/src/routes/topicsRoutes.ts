import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import {
  createOrUpdateTopics,
  getTopics,
} from "../controllers/topicController";

const router = express.Router();

router.get("/topics", verifyToken, errorCatch(getTopics));
router.post("/topic", verifyToken, errorCatch(createOrUpdateTopics));

export default router;
