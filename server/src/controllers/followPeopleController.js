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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowing = exports.getFollowers = exports.followUser = void 0;
const userModel_1 = require("../models/userModel");
const standardResponse_1 = require("../utils/standardResponse");
const customError_1 = require("../utils/error/customError");
const followPeopleModel_1 = require("../models/followPeopleModel");
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { followId } = req.body;
    const user = yield userModel_1.UserModel.findById(userId);
    const followUser = yield userModel_1.UserModel.findById(followId);
    if (!user || !followUser) {
        throw new customError_1.CustomError("User not found", 404);
    }
    const existingFollow = yield followPeopleModel_1.FollowModel.findOne({
        follower: userId,
        following: followId,
    });
    if (existingFollow) {
        yield followPeopleModel_1.FollowModel.deleteOne({ _id: existingFollow._id });
        return res
            .status(200)
            .json(new standardResponse_1.StandardResponse("Unfollowed the user successfully", {}));
    }
    const newFollow = new followPeopleModel_1.FollowModel({ follower: userId, following: followId });
    yield newFollow.save();
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Followed the user successfully", newFollow));
});
exports.followUser = followUser;
// Get followers of a user
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const user = yield userModel_1.UserModel.findById(userId);
    if (!user) {
        throw new customError_1.CustomError("User not found", 404);
    }
    const followers = yield followPeopleModel_1.FollowModel.find({ following: userId }).populate("follower", "name email imageUri");
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Followers fetched successfully", followers));
});
exports.getFollowers = getFollowers;
// Get users that a user is following
const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const user = yield userModel_1.UserModel.findById(userId);
    if (!user) {
        throw new customError_1.CustomError("User not found", 404);
    }
    const following = yield followPeopleModel_1.FollowModel.find({ follower: userId }).populate("following", "name email imageUri");
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Following list fetched successfully", following));
});
exports.getFollowing = getFollowing;
