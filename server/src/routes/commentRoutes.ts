import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import {
  createComment,
  deleteComment,
  getCommentsByStory,
  getRepliesByComment,
  replyToComment,
  updateComment,
} from "../controllers/commentController";

const router = express.Router();

router.post("/comment", verifyToken, errorCatch(createComment));
router.post("/comment/reply", verifyToken, errorCatch(replyToComment));
router.get("/comments/:storyId", verifyToken, errorCatch(getCommentsByStory));
router.get(
  "/comments/replays/:commentId",
  verifyToken,
  errorCatch(getRepliesByComment)
);
router.put(
  "/comment/update/:commentId",
  verifyToken,
  errorCatch(updateComment)
);
router.delete("/comment/:commentId", verifyToken, errorCatch(deleteComment));

export default router;
