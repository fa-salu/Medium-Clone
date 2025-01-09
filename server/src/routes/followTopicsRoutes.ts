import express from "express";
import {
  followTopics,
  getFollowedTopics,
} from "../controllers/followTopicsController";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";

const router = express.Router();

router.post("/follow-topics", verifyToken, errorCatch(followTopics));
router.get("/follow-topics", verifyToken, errorCatch(getFollowedTopics));

export default router;
