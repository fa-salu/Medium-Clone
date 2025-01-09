"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const topicController_1 = require("../controllers/topicController");
const router = express_1.default.Router();
router.get("/topics", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(topicController_1.getTopics));
router.post("/topic", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(topicController_1.createOrUpdateTopics));
exports.default = router;
