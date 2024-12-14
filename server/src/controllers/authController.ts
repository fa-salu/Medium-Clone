import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "sldfkj83owurjfw8eio"; // Replace with a secure key in .env

export const login = async (req: Request, res: Response) => {
  console.log("hello");
  const { name, email, imageUri } = req.body;
  console.log(name, email);

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

  const token = jwt.sign({ id: user._id, email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log(token);
  const response = {
    user,
    token,
  };
  return res
    .status(200)
    .json(new StandardResponse("Login successful", response));
};
