import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import type { Types } from "mongoose";

// Define User interface
interface User {
  _id: Types.ObjectId;
  email: string;
}

// Extend the Request interface to include the user object
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
  console.log("token:", token);

  if (!token) {
    res.status(401).json({ message: "Unauthorized. No token provided." });
    return;
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };
    console.log("decode:", decoded);

    // Find user from the decoded token
    const user = ((await UserModel.findById(decoded.id)) as User) || null;
    console.log("user", user);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Attach user details to request object
    req.user = { id: user._id.toString(), email: user.email };
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
