"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const savedController_1 = require("../controllers/savedController");
const router = express_1.default.Router();
router.post("/save-story", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(savedController_1.savedStory));
router.get("/save-collection", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(savedController_1.getSavedStoriesByUser));
router.get("/saved-collections/:listName", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(savedController_1.getSavedCollectionByName));
router.delete("/delete-collection", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(savedController_1.deleteCollection));
exports.default = router;
