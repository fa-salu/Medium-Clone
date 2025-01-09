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
exports.getAllUser = exports.getUserById = exports.getUser = void 0;
const userModel_1 = require("../models/userModel");
const customError_1 = require("../utils/error/customError");
const standardResponse_1 = require("../utils/standardResponse");
// Get user deatails
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new customError_1.CustomError("Story ID is required", 400);
    }
    const user = yield userModel_1.UserModel.findById(userId);
    if (!user) {
        throw new customError_1.CustomError("Story not found", 404);
    }
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Story fetched successfully", user));
});
exports.getUser = getUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const user = yield userModel_1.UserModel.findById(userId);
    if (!user) {
        throw new customError_1.CustomError("User not found", 404);
    }
    res.status(200).json(new standardResponse_1.StandardResponse("User fetched successfully", user));
});
exports.getUserById = getUserById;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const users = yield userModel_1.UserModel.find({ _id: { $ne: userId } });
    res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Users fetched successfully", users));
});
exports.getAllUser = getAllUser;
