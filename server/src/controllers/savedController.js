"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.getSavedCollectionByName = exports.getSavedStoriesByUser = exports.savedStory = void 0;
const customError_1 = require("../utils/error/customError");
const standardResponse_1 = require("../utils/standardResponse");
const storyModel_1 = __importDefault(require("../models/storyModel"));
const savedModel_1 = require("../models/savedModel");
const mongoose_1 = __importDefault(require("mongoose"));
const savedStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { storyId, collectionName } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!storyId || !collectionName) {
        throw new customError_1.CustomError("Story ID and Collection Name are required.", 400);
    }
    const story = yield storyModel_1.default.findById(storyId);
    if (!story) {
        throw new customError_1.CustomError("Story not found.", 404);
    }
    let userCollections = yield savedModel_1.SavedCollectionModel.findOne({ userId });
    if (!userCollections) {
        userCollections = new savedModel_1.SavedCollectionModel({
            userId,
            collections: [],
        });
    }
    const existingCollection = userCollections.collections.find((entry) => entry.collectionName === collectionName);
    if (existingCollection) {
        const existingStoryIndex = existingCollection.storyIds.indexOf(storyId);
        if (existingStoryIndex > -1) {
            existingCollection.storyIds.splice(existingStoryIndex, 1);
            yield userCollections.save();
            return res
                .status(200)
                .json(new standardResponse_1.StandardResponse(`Story removed from the '${collectionName}' collection.`, { storyId, collectionName }));
        }
        existingCollection.storyIds.push(storyId);
    }
    else {
        userCollections.collections.push({
            collectionName,
            storyIds: [storyId],
        });
    }
    yield userCollections.save();
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse(`Story added to the '${collectionName}' collection.`, { storyId, collectionName }));
});
exports.savedStory = savedStory;
// Get saved stories
const getSavedStoriesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res
            .status(400)
            .json(new standardResponse_1.StandardResponse("User ID is required.", null));
    }
    const userSavedCollections = yield savedModel_1.SavedCollectionModel.aggregate([
        {
            $match: { userId: new mongoose_1.default.Types.ObjectId(userId) },
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
            .json(new standardResponse_1.StandardResponse("No saved stories found for this user.", null));
    }
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse("User saved stories, collections, and details fetched successfully.", userSavedCollections));
});
exports.getSavedStoriesByUser = getSavedStoriesByUser;
// Get saved stories by collection name
const getSavedCollectionByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { listName } = req.params;
    if (!userId) {
        return res
            .status(400)
            .json(new standardResponse_1.StandardResponse("User ID is required.", null));
    }
    if (!listName) {
        return res
            .status(400)
            .json(new standardResponse_1.StandardResponse("Collection name is required.", null));
    }
    const userSavedCollection = yield savedModel_1.SavedCollectionModel.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        {
            $unwind: "$collections",
        },
        {
            $match: {
                "collections.collectionName": listName,
            },
        },
        {
            $lookup: {
                from: "stories",
                localField: "collections.storyIds",
                foreignField: "_id",
                as: "stories",
            },
        },
        {
            $unwind: "$stories",
        },
        {
            $lookup: {
                from: "users",
                localField: "stories.author",
                foreignField: "_id",
                as: "stories.authorDetails",
            },
        },
        {
            $unwind: {
                path: "$stories.authorDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: "$collections.collectionName",
                stories: { $push: "$stories" },
            },
        },
        {
            $project: {
                _id: 0,
                collectionName: "$_id",
                stories: 1,
            },
        },
    ]);
    if (!userSavedCollection || userSavedCollection.length === 0) {
        return res
            .status(404)
            .json(new standardResponse_1.StandardResponse("Collection not found or no stories in it.", null));
    }
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse(`Saved collection "${listName}" fetched successfully.`, userSavedCollection[0]));
});
exports.getSavedCollectionByName = getSavedCollectionByName;
// Delete colletions
const deleteCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { collectionName } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!collectionName) {
        throw new customError_1.CustomError("Collection Name is required.", 400);
    }
    // Find the user's saved collections
    const userCollections = yield savedModel_1.SavedCollectionModel.findOne({ userId });
    if (!userCollections) {
        throw new customError_1.CustomError("No saved collections found for the user.", 404);
    }
    // Find the collection to delete
    const collectionIndex = userCollections.collections.findIndex((entry) => entry.collectionName === collectionName);
    if (collectionIndex === -1) {
        throw new customError_1.CustomError(`Collection '${collectionName}' not found for the user.`, 404);
    }
    // Remove the collection and its associated stories
    userCollections.collections.splice(collectionIndex, 1);
    yield userCollections.save();
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse(`Collection '${collectionName}' and all its saved stories have been removed successfully.`, { collectionName }));
});
exports.deleteCollection = deleteCollection;
