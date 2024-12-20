import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import Story from "../models/storyModel";
import { UserModel } from "../models/userModel";
import mongoose from "mongoose";

// Create a new story
export const createStory = async (req: CustomRequest, res: Response) => {
  const { title, content, category } = req.body;
  const userId = req.user?.id;

  if (!title || !content) {
    throw new CustomError("Title and content are required.", 400);
  }

  if (!userId) {
    throw new CustomError("Unauthorized user.", 401);
  }

  const newStory = new Story({
    title,
    content,
    category,
    author: userId,
    createdAt: Date.now(),
  });

  await newStory.save();

  res
    .status(201)
    .json(new StandardResponse("Story created successfully", newStory));
};

// Get all stories
export const getAllStories = async (req: CustomRequest, res: Response) => {
  const stories = await Story.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    {
      $unwind: {
        path: "$authorDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        category: 1,
        claps: 1,
        likes: 1,
        createdAt: 1,
        "authorDetails.name": 1,
        "authorDetails.email": 1,
        "authorDetails.imageUri": 1,
      },
    },
  ]);

  if (!stories || stories.length === 0) {
    throw new CustomError("No stories found.", 404);
  }

  res
    .status(200)
    .json(new StandardResponse("Stories fetched successfully", stories));
};

// Update a story
export const updateStory = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;
  const { title, content, category } = req.body;
  const userId = req.user?.id;

  if (!storyId) {
    throw new CustomError("Story ID is required.", 400);
  }

  const story = await Story.findById(storyId);

  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  if (story.author.toString() !== userId) {
    throw new CustomError("Unauthorized to update this story.", 403);
  }

  story.title = title || story.title;
  story.content = content || story.content;
  story.category = category || story.category;

  await story.save();

  res
    .status(200)
    .json(new StandardResponse("Story updated successfully", story));
};

// Delete a story
export const deleteStory = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;
  const userId = req.user?.id;

  if (!storyId) {
    throw new CustomError("Story ID is required.", 400);
  }

  const story = await Story.findById(storyId);

  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  if (story.author.toString() !== userId) {
    throw new CustomError("Unauthorized to delete this story.", 403);
  }

  await story.deleteOne();

  res
    .status(200)
    .json(new StandardResponse("Story deleted successfully", null));
};

// Update likes
export const updateLikes = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;
  const { increment } = req.body;
  const userId = req.user?.id;

  if (!storyId) {
    throw new CustomError("Story ID is required.", 400);
  }

  const storyObjectId = new mongoose.Types.ObjectId(storyId);

  const story = await Story.findById(storyObjectId);

  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new CustomError("User not found.", 404);
  }

  if (increment) {
    if (!user.likedPosts.includes(storyObjectId)) {
      user.likedPosts.push(storyObjectId);
      story.likes += 1;
    } else {
      throw new CustomError("You have already liked this story.", 400);
    }
  } else {
    if (user.likedPosts.includes(storyObjectId)) {
      user.likedPosts = user.likedPosts.filter(
        (id) => id.toString() !== storyObjectId.toString()
      );
      story.likes = Math.max(0, story.likes - 1);
    } else {
      throw new CustomError("You have not liked this story yet.", 400);
    }
  }

  await user.save();
  await story.save();

  res
    .status(200)
    .json(new StandardResponse("Likes updated successfully", story));
};

// Update claps
export const updateClaps = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;
  const { increment } = req.body;
  const userId = req.user?.id;

  if (!storyId) {
    throw new CustomError("Story ID is required.", 400);
  }

  const storyObjectId = new mongoose.Types.ObjectId(storyId);

  const story = await Story.findById(storyObjectId);

  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new CustomError("User not found.", 404);
  }

  if (increment) {
    if (!user.clappedPosts.includes(storyObjectId)) {
      user.clappedPosts.push(storyObjectId);
      story.claps += 1;
    } else {
      throw new CustomError("You have already liked this story.", 400);
    }
  } else {
    if (user.clappedPosts.includes(storyObjectId)) {
      user.clappedPosts = user.clappedPosts.filter(
        (id) => id.toString() !== storyObjectId.toString()
      );
      story.claps = Math.max(0, story.claps - 1);
    } else {
      throw new CustomError("You have not liked this story yet.", 400);
    }
  }

  await user.save();
  await story.save();

  res
    .status(200)
    .json(new StandardResponse("Likes updated successfully", story));
};
