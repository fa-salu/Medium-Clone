"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const followPeopleController_1 = require("../controllers/followPeopleController");
const router = express_1.default.Router();
router.post("/follow", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(followPeopleController_1.followUser));
router.get("/:userId/followers", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(followPeopleController_1.getFollowers));
router.get("/:userId/following", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(followPeopleController_1.getFollowing));
exports.default = router;
