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
exports.updateUserDetails = void 0;
const userModel_1 = require("../models/userModel");
const customError_1 = require("../utils/error/customError");
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { name, imageUri, bio } = req.body;
    if (!name && !imageUri && !bio) {
        throw new customError_1.CustomError("No updates provided.", 404);
    }
    const updatedUser = yield userModel_1.UserModel.findByIdAndUpdate(userId, { $set: { name, imageUri, bio } }, { new: true, runValidators: true });
    if (!updatedUser) {
        throw new customError_1.CustomError("User not found.", 404);
    }
    res
        .status(200)
        .json({ message: "User updated successfully.", user: updatedUser });
});
exports.updateUserDetails = updateUserDetails;
