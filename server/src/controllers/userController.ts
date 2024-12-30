import type { Response } from "express";
import { UserModel } from "../models/userModel";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";

// Get user deatails
export const getUser = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new CustomError("Story ID is required", 400);
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new CustomError("Story not found", 404);
  }
  console.log(user);

  res
    .status(200)
    .json(new StandardResponse("Story fetched successfully", user));
};
