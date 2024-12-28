import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import type { CustomRequest } from "../types/interfaces";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "sldfkj83owurjfw8eio";

export const login = async (req: CustomRequest, res: Response) => {
  const { name, email, imageUri } = req.body;

  if (!name || !email || !imageUri) {
    return res.status(400).json({
      message: "Missing required fields: name, email, imageUri",
    });
  }

  let user = await UserModel.findOne({ email });

  if (!user) {
    user = new UserModel({
      name,
      email,
      imageUri,
    });
    await user.save();
  }

  console.log("userId:", user._id);

  const token = jwt.sign({ id: user._id, email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  const response = {
    user,
    token,
  };
  return res
    .status(200)
    .json(new StandardResponse("Login successful", response));
};
