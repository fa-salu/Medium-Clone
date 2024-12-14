// src/routes/userRoutes.ts
import express from "express";
import { login } from "../controllers/authController"; // Import login controller
import { errorCatch } from "../utils/error/errorCatch";

const router = express.Router();

// POST route for user login
router.post("/login", errorCatch(login));

export default router;
