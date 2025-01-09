"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followTopicsController_1 = require("../controllers/followTopicsController");
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const router = express_1.default.Router();
router.post("/follow-topics", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(followTopicsController_1.followTopics));
router.get("/follow-topics", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(followTopicsController_1.getFollowedTopics));
exports.default = router;
