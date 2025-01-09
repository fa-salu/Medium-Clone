import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { UserModel } from "../models/userModel";
import { CustomError } from "../utils/error/customError";

export const updateUserDetails = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, imageUri, bio } = req.body;
  if (!name && !imageUri && !bio) {
    throw new CustomError("No updates provided.", 404);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { name, imageUri, bio } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new CustomError("User not found.", 404);
  }

  res
    .status(200)
    .json({ message: "User updated successfully.", user: updatedUser });
};
