import express from "express";
import {
  createStory,
  getAllStories,
  deleteStory,
  updateClaps,
  updateStorys,
  fetchStoryById,
  getStoriesByAuthor,
  getFollowedUsersStories,
} from "../controllers/storyController";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";

const router = express.Router();

router.post("/stories", verifyToken, errorCatch(createStory));
router.put("/stories/:id", verifyToken, errorCatch(updateStorys));
router.get("/stories/:id", verifyToken, errorCatch(fetchStoryById));
router.get("/stories", errorCatch(getAllStories));
router.delete("/stories/:storyId", verifyToken, errorCatch(deleteStory));
router.post("/stories/:storyId/claps", verifyToken, errorCatch(updateClaps));
router.get(
  "/stories/author/:userId",
  verifyToken,
  errorCatch(getStoriesByAuthor)
);
router.get(
  "/followed-stories",
  verifyToken,
  errorCatch(getFollowedUsersStories)
);
export default router;
