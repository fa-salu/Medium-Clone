import type { Response } from "express";
import Topic from "../models/topicsModel";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";

// Fetch all topics
export const getTopics = async (req: CustomRequest, res: Response) => {
  const topic = await Topic.findOne();
  if (topic) {
    return res.status(200).json(new StandardResponse("Success", topic.topics));
  }
  throw new CustomError("No topics found", 404);
};

// Create or update topics
export const createOrUpdateTopics = async (
  req: CustomRequest,
  res: Response
) => {
  const { topics } = req.body;

  if (!topics || !Array.isArray(topics)) {
    return res
      .status(400)
      .json(new StandardResponse("Error", "Topics should be an array"));
  }

  let topic = await Topic.findOne();

  if (topic) {
    topic.topics = [...new Set([...topic.topics, ...topics])];
    await topic.save();
    return res.status(200).json(new StandardResponse("Success", topic));
  }

  topic = new Topic({ topics });
  await topic.save();
  return res.status(201).json(new StandardResponse("Success", topic));
};
