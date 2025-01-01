import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import {
  getSavedCollectionByName,
  getSavedStoriesByUser,
  savedStory,
} from "../controllers/savedController";

const router = express.Router();

router.post("/save-story", verifyToken, errorCatch(savedStory));
router.get("/save-collection", verifyToken, errorCatch(getSavedStoriesByUser));
router.get(
  "/saved-collections/:collectionName",
  verifyToken,
  errorCatch(getSavedCollectionByName)
);

export default router;
