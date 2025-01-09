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
exports.getFollowedUsersStories = exports.updateClaps = exports.deleteStory = exports.getStoriesByAuthor = exports.getAllStories = exports.fetchStoryById = exports.updateStorys = exports.createStory = void 0;
const customError_1 = require("../utils/error/customError");
const standardResponse_1 = require("../utils/standardResponse");
const storyModel_1 = __importDefault(require("../models/storyModel"));
const userModel_1 = require("../models/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
const followPeopleModel_1 = require("../models/followPeopleModel");
// Create a new story
const createStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content, category, coverImage } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new customError_1.CustomError("Unauthorized user.", 401);
    }
    const newStory = new storyModel_1.default({
        title,
        content,
        category,
        coverImage: coverImage || "",
        author: userId,
        createdAt: Date.now(),
    });
    yield newStory.save();
    res
        .status(201)
        .json(new standardResponse_1.StandardResponse("Story created successfully", newStory));
});
exports.createStory = createStory;
// update story
const updateStorys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, category, coverImage } = req.body;
    const story = yield storyModel_1.default.findById(id);
    if (!story) {
        return res.status(404).json({ message: "Story not found" });
    }
    story.title = title;
    story.content = content;
    story.category = category;
    if (coverImage !== undefined && !story.coverImage) {
        story.coverImage = coverImage;
    }
    yield story.save();
    res.status(200).json({ message: "Story updated successfully", story });
});
exports.updateStorys = updateStorys;
// Fetch Story
const fetchStoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storyId = req.params.id;
    if (!storyId) {
        throw new customError_1.CustomError("Story ID is required", 400);
    }
    const story = yield storyModel_1.default.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(storyId) } },
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
        throw new customError_1.CustomError("Story not found", 404);
    }
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Story fetched successfully", story[0]));
});
exports.fetchStoryById = fetchStoryById;
// Get all stories
const getAllStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    const filter = category && category !== "For You" ? { category } : {};
    const stories = yield storyModel_1.default.aggregate([
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
        .json(new standardResponse_1.StandardResponse("Stories fetched successfully", stories));
});
exports.getAllStories = getAllStories;
// Get all stories by author
const getStoriesByAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    const stories = yield storyModel_1.default.find({ author: userId });
    if (stories.length === 0) {
        return res.status(404).json({ message: "No stories found for this user." });
    }
    res.status(200).json({ message: "Stories fetched successfully", stories });
});
exports.getStoriesByAuthor = getStoriesByAuthor;
// Delete a story
const deleteStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { storyId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!storyId) {
        throw new customError_1.CustomError("Story ID is required.", 400);
    }
    const story = yield storyModel_1.default.findById(storyId);
    if (!story) {
        throw new customError_1.CustomError("Story not found.", 404);
    }
    if (story.author.toString() !== userId) {
        throw new customError_1.CustomError("Unauthorized to delete this story.", 403);
    }
    yield story.deleteOne();
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Story deleted successfully", null));
});
exports.deleteStory = deleteStory;
// Update claps
const updateClaps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { storyId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!storyId) {
        throw new customError_1.CustomError("Story ID is required.", 400);
    }
    const storyObjectId = new mongoose_1.default.Types.ObjectId(storyId);
    const story = yield storyModel_1.default.findById(storyObjectId);
    if (!story) {
        throw new customError_1.CustomError("Story not found.", 404);
    }
    const user = yield userModel_1.UserModel.findById(userId);
    if (!user) {
        throw new customError_1.CustomError("User not found.", 404);
    }
    const hasClapped = user.clappedPosts.includes(storyObjectId);
    if (hasClapped) {
        user.clappedPosts = user.clappedPosts.filter((id) => id.toString() !== storyObjectId.toString());
        story.claps = Math.max(0, story.claps - 1);
    }
    else {
        user.clappedPosts.push(storyObjectId);
        story.claps += 1;
    }
    yield user.save();
    yield story.save();
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Likes toggled successfully", story));
});
exports.updateClaps = updateClaps;
// get stories of followed users
const getFollowedUsersStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const follows = yield followPeopleModel_1.FollowModel.find({ follower: userId });
    if (!follows) {
        throw new customError_1.CustomError("You are not following anyone.", 404);
    }
    const followedUsers = follows.map((follow) => follow.following);
    const stories = yield storyModel_1.default.aggregate([
        {
            $match: { author: { $in: followedUsers } },
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
            $sort: { createdAt: -1 },
        },
    ]);
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Fetch stories successfully", stories));
});
exports.getFollowedUsersStories = getFollowedUsersStories;
