"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const errorCatch_1 = require("../utils/error/errorCatch");
const profileUpdateController_1 = require("../controllers/profileUpdateController");
const router = express_1.default.Router();
router.put("/me/account/update", verifyToken_1.verifyToken, (0, errorCatch_1.errorCatch)(profileUpdateController_1.updateUserDetails));
exports.default = router;
