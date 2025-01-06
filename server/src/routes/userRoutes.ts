import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import { getUser, getUserById } from "../controllers/userController";

const router = express.Router();

router.get("/user", verifyToken, errorCatch(getUser));
router.get("/user/:userId", verifyToken, errorCatch(getUserById));

export default router;
