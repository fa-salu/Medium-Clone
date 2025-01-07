import express from "express";

import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import {
  followUser,
  getFollowers,
  getFollowing,
} from "../controllers/followPeopleController";

const router = express.Router();

router.post("/follow", verifyToken, errorCatch(followUser));
router.get("/:userId/followers", verifyToken, errorCatch(getFollowers));
router.get("/:userId/following", verifyToken, errorCatch(getFollowing));

export default router;
