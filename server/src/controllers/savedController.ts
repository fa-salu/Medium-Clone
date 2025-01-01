import type { Response } from "express";
import type { CustomRequest } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import Story from "../models/storyModel";
import { SavedCollectionModel } from "../models/savedModel";
import mongoose from "mongoose";

export const savedStory = async (req: CustomRequest, res: Response) => {
  const { storyId, collectionName } = req.body;
  const userId = req.user?.id;

  if (!storyId || !collectionName) {
    throw new CustomError("Story ID and Collection Name are required.", 400);
  }

  const story = await Story.findById(storyId);
  if (!story) {
    throw new CustomError("Story not found.", 404);
  }

  let userCollections = await SavedCollectionModel.findOne({ userId });

  if (!userCollections) {
    userCollections = new SavedCollectionModel({
      userId,
      collections: [],
    });
  }

  const existingCollection = userCollections.collections.find(
    (entry) => entry.collectionName === collectionName
  );

  if (existingCollection) {
    const existingStoryIndex = existingCollection.storyIds.indexOf(storyId);

    if (existingStoryIndex > -1) {
      existingCollection.storyIds.splice(existingStoryIndex, 1);
      await userCollections.save();
      return res
        .status(200)
        .json(
          new StandardResponse(
            `Story removed from the '${collectionName}' collection.`,
            { storyId, collectionName }
          )
        );
    }

    existingCollection.storyIds.push(storyId);
  } else {
    userCollections.collections.push({
      collectionName,
      storyIds: [storyId],
    });
  }

  await userCollections.save();

  return res
    .status(200)
    .json(
      new StandardResponse(
        `Story added to the '${collectionName}' collection.`,
        { storyId, collectionName }
      )
    );
};

// Get saved stories
export const getSavedStoriesByUser = async (
  req: CustomRequest,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(400)
      .json(new StandardResponse("User ID is required.", null));
  }

  const userSavedCollections = await SavedCollectionModel.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: "$collections",
    },
    {
      $lookup: {
        from: "stories",
        localField: "collections.storyIds",
        foreignField: "_id",
        as: "storyDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$collections.collectionName",
        userId: { $first: "$userId" },
        userDetails: { $first: "$userDetails" },
        stories: { $push: "$storyDetails" },
      },
    },
    {
      $project: {
        collectionName: "$_id",
        userId: 1,
        userDetails: 1,
        stories: 1,
      },
    },
  ]);

  if (!userSavedCollections || userSavedCollections.length === 0) {
    return res
      .status(404)
      .json(
        new StandardResponse("No saved stories found for this user.", null)
      );
  }

  return res
    .status(200)
    .json(
      new StandardResponse(
        "User saved stories, collections, and details fetched successfully.",
        userSavedCollections
      )
    );
};

// Get saved stories by collection name
export const getSavedCollectionByName = async (
  req: CustomRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const { collectionName } = req.params; // Get collectionName from request parameters

  console.log("User ID:", userId);
  console.log("Requested Collection Name:", collectionName);

  if (!userId) {
    return res
      .status(400)
      .json(new StandardResponse("User ID is required.", null));
  }

  if (!collectionName) {
    return res
      .status(400)
      .json(new StandardResponse("Collection name is required.", null));
  }

  const userSavedCollection = await SavedCollectionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId), // Match the userId
      },
    },
    {
      $unwind: "$collections", // Unwind the collections array to get individual collection documents
    },
    {
      $match: {
        "collections.collectionName": collectionName, // Match the specific collection name
      },
    },
    {
      $lookup: {
        from: "stories", // Join with stories collection
        localField: "collections.storyIds",
        foreignField: "_id",
        as: "storyDetails",
      },
    },
    {
      $lookup: {
        from: "users", // Join with users collection
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$collections.collectionName",
        userId: { $first: "$userId" },
        userDetails: { $first: "$userDetails" },
        stories: { $push: "$storyDetails" },
      },
    },
    {
      $project: {
        collectionName: "$_id",
        userId: 1,
        userDetails: 1,
        stories: 1,
      },
    },
  ]);

  console.log("Aggregation Result:", userSavedCollection);

  if (!userSavedCollection || userSavedCollection.length === 0) {
    return res
      .status(404)
      .json(
        new StandardResponse("Collection not found or no stories in it.", null)
      );
  }

  return res
    .status(200)
    .json(
      new StandardResponse(
        `Saved collection "${collectionName}" fetched successfully.`,
        userSavedCollection
      )
    );
};
