import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import Story from "../models/storyModel";
import { UserModel } from "../models/userModel";
import mongoose from "mongoose";

// Create a new story
export const createStory = async (req: CustomRequest, res: Response) => {
  const { title, content, category, coverImage } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new CustomError("Unauthorized user.", 401);
  }

  const newStory = new Story({
    title,
    content,
    category,
    coverImage: coverImage || "",
    author: userId,
    createdAt: Date.now(),
  });

  await newStory.save();

  res
    .status(201)
    .json(new StandardResponse("Story created successfully", newStory));
};

// update story
export const updateStorys = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, category, coverImage } = req.body;

  const story = await Story.findById(id);

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  story.title = title;
  story.content = content;
  story.category = category;

  if (coverImage !== undefined && !story.coverImage) {
    story.coverImage = coverImage;
  }

  await story.save();

  res.status(200).json({ message: "Story updated successfully", story });
};

// Fetch Story
export const fetchStoryById = async (req: CustomRequest, res: Response) => {
  const storyId = req.params.id;

  if (!storyId) {
    throw new CustomError("Story ID is required", 400);
  }

  const story = await Story.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(storyId) } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    { $unwind: "$authorDetails" },
  ]);

  if (!story.length) {
    throw new CustomError("Story not found", 404);
  }

  res
    .status(200)
    .json(new StandardResponse("Story fetched successfully", story[0]));
};

// Get all stories
export const getAllStories = async (req: CustomRequest, res: Response) => {
  const { category } = req.query;
  const filter = category && category !== "For You" ? { category } : {};

  const stories = await Story.aggregate([
    {
      $match: filter,
    },
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
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        coverImage: 1,
        category: 1,
        claps: 1,
        likes: 1,
        createdAt: 1,
        "authorDetails._id": 1,
        "authorDetails.name": 1,
        "authorDetails.email": 1,
        "authorDetails.imageUri": 1,
      },
    },
  ]);

  if (!stories || stories.length === 0) {
    return res
      .status(404)
      .json({ message: "No stories found in this category." });
  }

  res
    .status(200)
    .json(new StandardResponse("Stories fetched successfully", stories));
};

// Get all stories by author
export const getStoriesByAuthor = async (req: CustomRequest, res: Response) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const stories = await Story.find({ author: userId });

  if (stories.length === 0) {
    return res.status(404).json({ message: "No stories found for this user." });
  }

  res.status(200).json({ message: "Stories fetched successfully", stories });
};

// Update a story
// export const updateStory = async (req: CustomRequest, res: Response) => {
//   const { storyId } = req.params;
//   const { title, content, category } = req.body;
//   const userId = req.user?.id;

//   if (!storyId) {
//     throw new CustomError("Story ID is required.", 400);
//   }

//   const story = await Story.findById(storyId);

//   if (!story) {
//     throw new CustomError("Story not found.", 404);
//   }

//   if (story.author.toString() !== userId) {
//     throw new CustomError("Unauthorized to update this story.", 403);
//   }

//   story.title = title || story.title;
//   story.content = content || story.content;
//   story.category = category || story.category;

//   await story.save();

//   res
//     .status(200)
//     .json(new StandardResponse("Story updated successfully", story));
// };

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

// Update claps
export const updateClaps = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;
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

  const hasClapped = user.clappedPosts.includes(storyObjectId);

  if (hasClapped) {
    user.clappedPosts = user.clappedPosts.filter(
      (id) => id.toString() !== storyObjectId.toString()
    );
    story.claps = Math.max(0, story.claps - 1);
  } else {
    user.clappedPosts.push(storyObjectId);
    story.claps += 1;
  }

  await user.save();
  await story.save();

  res
    .status(200)
    .json(new StandardResponse("Likes toggled successfully", story));
};
