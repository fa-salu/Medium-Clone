import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { FollowTopicsModel } from "../models/FollowTopicsModel";
import topicsModel from "../models/topicsModel";

export const followTopics = async (req: CustomRequest, res: Response) => {
  const { topic } = req.body;
  const userId = req.user?.id;

  if (!userId || !topic || typeof topic !== "string") {
    return res.status(400).json({ message: "Invalid input" });
  }

  const existingTopic = await topicsModel.findOne({ topics: topic });

  if (!existingTopic) {
    return res.status(400).json({ message: "Topic does not exist" });
  }

  const followDoc = await FollowTopicsModel.findOne({ userId });

  if (followDoc) {
    if (followDoc.topics.includes(topic)) {
      followDoc.topics = followDoc.topics.filter((t: string) => t !== topic);
      await followDoc.save();
      return res
        .status(200)
        .json({ message: "Topic removed successfully", data: followDoc });
    }
    followDoc.topics.push(topic);
    await followDoc.save();
    return res
      .status(200)
      .json({ message: "Topic added successfully", data: followDoc });
  }

  const newFollowDoc = await FollowTopicsModel.create({
    userId,
    topics: [topic],
  });
  return res
    .status(201)
    .json({ message: "Topic followed successfully", data: newFollowDoc });
};

// Get followed topics by user ID
export const getFollowedTopics = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  const followDoc = await FollowTopicsModel.findOne({ userId });

  if (!followDoc) {
    return res
      .status(404)
      .json({ message: "No followed topics found for this user" });
  }

  return res.status(200).json({ data: followDoc });
};
