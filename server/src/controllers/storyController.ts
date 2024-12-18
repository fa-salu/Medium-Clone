import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import Story from "../models/storyModel";

// Create a new story
export const createStory = async (req: CustomRequest, res: Response) => {
  console.log("first");
  const { title, content } = req.body;
  console.log("object");
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
  try {
    const stories = await Story.aggregate([
      {
        $lookup: {
          from: "users", // Collection name of the User model (case-sensitive in MongoDB)
          localField: "author", // Field in the Story model to match
          foreignField: "_id", // Field in the User model to match
          as: "authorDetails", // The field name where the joined data will be added
        },
      },
      {
        $unwind: {
          path: "$authorDetails", // Flatten the authorDetails array
          preserveNullAndEmptyArrays: true, // Optional: Keep stories even if no matching user is found
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          createdAt: 1,
          "authorDetails.name": 1,
          "authorDetails.email": 1,
        },
      },
    ]);

    if (!stories || stories.length === 0) {
      throw new CustomError("No stories found.", 404);
    }

    res
      .status(200)
      .json(new StandardResponse("Stories fetched successfully", stories));
  } catch (error) {
    throw new CustomError("Failed to fetch stories.", 500);
  }
};

// Update a story
export const updateStory = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;
  const { title, content } = req.body;
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
