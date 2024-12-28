import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import { getUser } from "../controllers/userController";

const router = express.Router();

router.get("/user", verifyToken, errorCatch(getUser));

export default router;
