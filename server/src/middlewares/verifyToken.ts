import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import type { Types } from "mongoose";

interface User {
  _id: Types.ObjectId;
  email: string;
}

declare module "express" {
  interface Request {
    user?: { id: string; email: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET_KEY || "sldfkj83owurjfw8eio";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };

    const user = ((await UserModel.findById(decoded.id)) as User) || null;
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
