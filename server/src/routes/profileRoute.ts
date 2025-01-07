import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/error/errorCatch";
import { updateUserDetails } from "../controllers/profileUpdateController";

const router = express.Router();

router.put("/me/account/update", verifyToken, errorCatch(updateUserDetails));

export default router;
