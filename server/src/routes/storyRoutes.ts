import express from "express";
import {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
  updateLikes,
  updateClaps,
} from "../controllers/storyController";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";

const router = express.Router();

// Routes for Stories
router.post("/stories", verifyToken, errorCatch(createStory));
router.get("/stories", errorCatch(getAllStories));
router.put("/stories/:storyId", verifyToken, errorCatch(updateStory));
router.delete("/stories/:storyId", verifyToken, errorCatch(deleteStory));
router.post("/stories/:storyId/likes", verifyToken, errorCatch(updateLikes));
router.post("/stories/:storyId/claps", verifyToken, errorCatch(updateClaps));

export default router;
