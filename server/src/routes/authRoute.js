"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController"); // Import login controller
const errorCatch_1 = require("../utils/error/errorCatch");
const router = express_1.default.Router();
// POST route for user login
router.post("/login", (0, errorCatch_1.errorCatch)(authController_1.login));
exports.default = router;
