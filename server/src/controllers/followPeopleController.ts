import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { UserModel } from "../models/userModel";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import { FollowModel } from "../models/followPeopleModel";

export const followUser = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const { followId } = req.body;

  const user = await UserModel.findById(userId);
  const followUser = await UserModel.findById(followId);

  if (!user || !followUser) {
    throw new CustomError("User not found", 404);
  }

  const existingFollow = await FollowModel.findOne({
    follower: userId,
    following: followId,
  });

  if (existingFollow) {
    await FollowModel.deleteOne({ _id: existingFollow._id });
    return res
      .status(200)
      .json(new StandardResponse("Unfollowed the user successfully", {}));
  }
  const newFollow = new FollowModel({ follower: userId, following: followId });
  await newFollow.save();
  return res
    .status(200)
    .json(new StandardResponse("Followed the user successfully", newFollow));
};

// Get followers of a user
export const getFollowers = async (req: CustomRequest, res: Response) => {
  const userId = req.params.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const followers = await FollowModel.find({ following: userId }).populate(
    "follower",
    "name email imageUri"
  );

  return res
    .status(200)
    .json(new StandardResponse("Followers fetched successfully", followers));
};

// Get users that a user is following
export const getFollowing = async (req: CustomRequest, res: Response) => {
  const userId = req.params.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const following = await FollowModel.find({ follower: userId }).populate(
    "following",
    "name email imageUri"
  );

  return res
    .status(200)
    .json(
      new StandardResponse("Following list fetched successfully", following)
    );
};
