"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const commentController_1 = require("../controllers/commentController");
const router = express_1.default.Router();
router.post("/comment", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(commentController_1.createComment));
router.post("/comment/reply", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(commentController_1.replyToComment));
router.get("/comments/:storyId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(commentController_1.getCommentsByStory));
router.get("/comments/replays/:commentId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(commentController_1.getRepliesByComment));
router.put("/comment/update/:commentId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(commentController_1.updateComment));
router.delete("/comment/:commentId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(commentController_1.deleteComment));
exports.default = router;
