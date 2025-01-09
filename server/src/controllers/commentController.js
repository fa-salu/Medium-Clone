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
exports.deleteComment = exports.updateComment = exports.getRepliesByComment = exports.getCommentsByStory = exports.replyToComment = exports.createComment = void 0;
const customError_1 = require("../utils/error/customError");
const standardResponse_1 = require("../utils/standardResponse");
const storyModel_1 = __importDefault(require("../models/storyModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content, storyId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new customError_1.CustomError("Unauthorized user.", 401);
    }
    const story = yield storyModel_1.default.findById(storyId);
    if (!story) {
        throw new customError_1.CustomError("Story not found.", 404);
    }
    const newComment = new commentModel_1.default({
        content,
        author: userId,
        story: storyId,
    });
    yield newComment.save();
    res
        .status(201)
        .json(new standardResponse_1.StandardResponse("Comment added successfully", newComment));
});
exports.createComment = createComment;
// Replay Comment
const replyToComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content, storyId, parentCommentId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new customError_1.CustomError("Unauthorized user.", 401);
    }
    const parentComment = yield commentModel_1.default.findById(parentCommentId);
    if (!parentComment) {
        throw new customError_1.CustomError("Parent comment not found.", 404);
    }
    const newReply = new commentModel_1.default({
        content,
        author: userId,
        story: storyId,
        parentComment: parentCommentId,
    });
    yield newReply.save();
    res
        .status(201)
        .json(new standardResponse_1.StandardResponse("Reply added successfully", newReply));
});
exports.replyToComment = replyToComment;
// Get comment by story
const getCommentsByStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storyId } = req.params;
    const story = yield storyModel_1.default.findById(storyId);
    if (!story) {
        throw new customError_1.CustomError("Story not found.", 404);
    }
    const comments = yield commentModel_1.default.aggregate([
        {
            $match: {
                story: new mongoose_1.default.Types.ObjectId(storyId),
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
        .json(new standardResponse_1.StandardResponse("Main comments retrieved successfully", comments));
});
exports.getCommentsByStory = getCommentsByStory;
// Get replays
const getRepliesByComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    const parentComment = yield commentModel_1.default.findById(commentId);
    if (!parentComment) {
        throw new customError_1.CustomError("Comment not found.", 404);
    }
    const replies = yield commentModel_1.default.aggregate([
        {
            $match: {
                parentComment: new mongoose_1.default.Types.ObjectId(commentId),
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
                parentComment: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Replies retrieved successfully", replies));
});
exports.getRepliesByComment = getRepliesByComment;
// Update Comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new customError_1.CustomError("Unauthorized user.", 401);
    }
    const comment = yield commentModel_1.default.findById(commentId);
    if (!comment) {
        throw new customError_1.CustomError("Comment not found.", 404);
    }
    if (comment.author.toString() !== userId) {
        throw new customError_1.CustomError("You are not authorized to update this comment.", 403);
    }
    comment.content = content;
    yield comment.save();
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Comment updated successfully", comment));
});
exports.updateComment = updateComment;
// Delete Comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { commentId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new customError_1.CustomError("Unauthorized user.", 401);
    }
    const comment = yield commentModel_1.default.findById(commentId);
    if (!comment) {
        throw new customError_1.CustomError("Comment not found.", 404);
    }
    if (comment.author.toString() !== userId) {
        throw new customError_1.CustomError("You are not authorized to delete this comment.", 403);
    }
    yield commentModel_1.default.deleteMany({
        $or: [{ _id: commentId }, { parentComment: commentId }],
    });
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Comment and its replies deleted successfully."));
});
exports.deleteComment = deleteComment;
