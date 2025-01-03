import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import storyModel from "../models/storyModel";
import Comment from "../models/commentModel";
import mongoose from "mongoose";

export const createComment = async (req: CustomRequest, res: Response) => {
  const { content, storyId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new CustomError("Unauthorized user.", 401);
  }

  const story = await storyModel.findById(storyId);
  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  const newComment = new Comment({
    content,
    author: userId,
    story: storyId,
  });

  await newComment.save();

  res
    .status(201)
    .json(new StandardResponse("Comment added successfully", newComment));
};

// Replay Comment
export const replyToComment = async (req: CustomRequest, res: Response) => {
  const { content, storyId, parentCommentId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new CustomError("Unauthorized user.", 401);
  }

  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new CustomError("Parent comment not found.", 404);
  }

  const newReply = new Comment({
    content,
    author: userId,
    story: storyId,
    parentComment: parentCommentId,
  });

  await newReply.save();

  res
    .status(201)
    .json(new StandardResponse("Reply added successfully", newReply));
};

// Get comment by story
export const getCommentsByStory = async (req: CustomRequest, res: Response) => {
  const { storyId } = req.params;

  const story = await storyModel.findById(storyId);
  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        story: new mongoose.Types.ObjectId(storyId),
        parentComment: null,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    { $unwind: "$authorDetails" },
    {
      $project: {
        content: 1,
        author: "$authorDetails",
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(
      new StandardResponse("Main comments retrieved successfully", comments)
    );
};

// Get replays
export const getRepliesByComment = async (
  req: CustomRequest,
  res: Response
) => {
  const { commentId } = req.params;

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    throw new CustomError("Comment not found.", 404);
  }

  const replies = await Comment.aggregate([
    {
      $match: {
        parentComment: new mongoose.Types.ObjectId(commentId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
      },
    },
    { $unwind: "$authorDetails" },
    {
      $project: {
        content: 1,
        author: "$authorDetails",
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new StandardResponse("Replies retrieved successfully", replies));
};

// Update Comment
export const updateComment = async (req: CustomRequest, res: Response) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    throw new CustomError("Unauthorized user.", 401);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new CustomError("Comment not found.", 404);
  }

  if (comment.author.toString() !== userId) {
    throw new CustomError(
      "You are not authorized to update this comment.",
      403
    );
  }

  comment.content = content;
  await comment.save();

  res
    .status(200)
    .json(new StandardResponse("Comment updated successfully", comment));
};

// Delete Comment
export const deleteComment = async (req: CustomRequest, res: Response) => {
  const { commentId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new CustomError("Unauthorized user.", 401);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new CustomError("Comment not found.", 404);
  }

  if (comment.author.toString() !== userId) {
    throw new CustomError(
      "You are not authorized to delete this comment.",
      403
    );
  }

  await Comment.deleteMany({
    $or: [{ _id: commentId }, { parentComment: commentId }],
  });

  res
    .status(200)
    .json(
      new StandardResponse("Comment and its replies deleted successfully.")
    );
};
