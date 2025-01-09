"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storyController_1 = require("../controllers/storyController");
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const router = express_1.default.Router();
router.post("/stories", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.createStory));
router.put("/stories/:id", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.updateStorys));
router.get("/stories/:id", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.fetchStoryById));
router.get("/stories", (0, errorCatch_1.errorCatch)(storyController_1.getAllStories));
router.delete("/stories/:storyId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.deleteStory));
router.post("/stories/:storyId/claps", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.updateClaps));
router.get("/stories/author/:userId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.getStoriesByAuthor));
router.get("/followed-stories", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(storyController_1.getFollowedUsersStories));
exports.default = router;
