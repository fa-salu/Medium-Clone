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
exports.createOrUpdateTopics = exports.getTopics = void 0;
const topicsModel_1 = __importDefault(require("../models/topicsModel"));
const customError_1 = require("../utils/error/customError");
const standardResponse_1 = require("../utils/standardResponse");
// Fetch all topics
const getTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topicsModel_1.default.findOne();
    if (topic) {
        return res.status(200).json(new standardResponse_1.StandardResponse("Success", topic.topics));
    }
    throw new customError_1.CustomError("No topics found", 404);
});
exports.getTopics = getTopics;
// Create or update topics
const createOrUpdateTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { topics } = req.body;
    if (!topics || !Array.isArray(topics)) {
        return res
            .status(400)
            .json(new standardResponse_1.StandardResponse("Error", "Topics should be an array"));
    }
    let topic = yield topicsModel_1.default.findOne();
    if (topic) {
        topic.topics = [...new Set([...topic.topics, ...topics])];
        yield topic.save();
        return res.status(200).json(new standardResponse_1.StandardResponse("Success", topic));
    }
    topic = new topicsModel_1.default({ topics });
    yield topic.save();
    return res.status(201).json(new standardResponse_1.StandardResponse("Success", topic));
});
exports.createOrUpdateTopics = createOrUpdateTopics;
