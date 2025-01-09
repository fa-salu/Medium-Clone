"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const customError_1 = require("../utils/error/customError");
const handleError_1 = require("../utils/error/handleError");
const errorResponse = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        statusCode: error.statusCode,
        message: error.message,
        errorCode: error.errorCode,
    });
};
const globalErrorHandler = (
// biome-ignore lint/suspicious/noExplicitAny: the error can be multiple types
error, _req, res, _next) => {
    console.log(error);
    if (error instanceof customError_1.CustomError) {
        errorResponse(error, res);
        return;
    }
    if (error.name === "CastError") {
        const castError = (0, handleError_1.castErrorHandler)(error);
        errorResponse(castError, res);
        return;
    }
    if (error.code === 11000) {
        const duplicateKeyError = (0, handleError_1.duplicateKeyErrorHandler)(error);
        errorResponse(duplicateKeyError, res);
        return;
    }
    if (error.name === "ValidationError") {
        const validationError = (0, handleError_1.validationErrorHandler)(error);
        errorResponse(validationError, res);
        return;
    }
    // default error if none of the above match
    res.status(500).json({
        status: "fail",
        statusCode: 500,
        message: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
    });
};
exports.globalErrorHandler = globalErrorHandler;
