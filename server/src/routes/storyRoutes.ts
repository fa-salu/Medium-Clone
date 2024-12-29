import express from "express";
import {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
  updateClaps,
  updateStorys,
  fetchStory,
} from "../controllers/storyController";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";

const router = express.Router();

// Routes for Stories
router.post("/stories", verifyToken, errorCatch(createStory));
router.put("/stories/:id", verifyToken, errorCatch(updateStorys));
router.get("/stories/:id", verifyToken, errorCatch(fetchStory));
router.get("/stories", errorCatch(getAllStories));
router.put("/stories/:storyId", verifyToken, errorCatch(updateStory));
router.delete("/stories/:storyId", verifyToken, errorCatch(deleteStory));
router.post("/stories/:storyId/claps", verifyToken, errorCatch(updateClaps));

export default router;
