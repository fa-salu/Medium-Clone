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
exports.getFollowedTopics = exports.followTopics = void 0;
const FollowTopicsModel_1 = require("../models/FollowTopicsModel");
const topicsModel_1 = __importDefault(require("../models/topicsModel"));
const followTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { topic } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId || !topic || typeof topic !== "string") {
        return res.status(400).json({ message: "Invalid input" });
    }
    const existingTopic = yield topicsModel_1.default.findOne({ topics: topic });
    if (!existingTopic) {
        return res.status(400).json({ message: "Topic does not exist" });
    }
    const followDoc = yield FollowTopicsModel_1.FollowTopicsModel.findOne({ userId });
    if (followDoc) {
        if (followDoc.topics.includes(topic)) {
            followDoc.topics = followDoc.topics.filter((t) => t !== topic);
            yield followDoc.save();
            return res
                .status(200)
                .json({ message: "Topic removed successfully", data: followDoc });
        }
        followDoc.topics.push(topic);
        yield followDoc.save();
        return res
            .status(200)
            .json({ message: "Topic added successfully", data: followDoc });
    }
    const newFollowDoc = yield FollowTopicsModel_1.FollowTopicsModel.create({
        userId,
        topics: [topic],
    });
    return res
        .status(201)
        .json({ message: "Topic followed successfully", data: newFollowDoc });
});
exports.followTopics = followTopics;
// Get followed topics by user ID
const getFollowedTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const followDoc = yield FollowTopicsModel_1.FollowTopicsModel.findOne({ userId });
    if (!followDoc) {
        return res
            .status(404)
            .json({ message: "No followed topics found for this user" });
    }
    return res.status(200).json({ data: followDoc });
});
exports.getFollowedTopics = getFollowedTopics;
