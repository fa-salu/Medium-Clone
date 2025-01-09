"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get("/user", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(userController_1.getUser));
router.get("/user/:userId", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(userController_1.getUserById));
router.get("/users", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(userController_1.getAllUser));
exports.default = router;
