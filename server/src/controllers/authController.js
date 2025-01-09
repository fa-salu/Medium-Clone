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
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const standardResponse_1 = require("../utils/standardResponse");
const JWT_SECRET = process.env.JWT_SECRET_KEY || "sldfkj83owurjfw8eio";
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, imageUri } = req.body;
    if (!name || !email || !imageUri) {
        return res.status(400).json({
            message: "Missing required fields: name, email, imageUri",
        });
    }
    let user = yield userModel_1.UserModel.findOne({ email });
    if (!user) {
        user = new userModel_1.UserModel({
            name,
            email,
            imageUri,
        });
        yield user.save();
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, email }, JWT_SECRET, {
        expiresIn: "7d",
    });
    const response = {
        user,
        token,
    };
    return res
        .status(200)
        .json(new standardResponse_1.StandardResponse("Login successful", response));
});
exports.login = login;
