"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const config_1 = require("./../config");
const ApiError_1 = require("./../core/ApiError");
const errorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    const errors = [];
    console.error('Error:', err);
    if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
        return;
    }
    if (!config_1.isProduction) {
        message = err?.message || message;
        errors.push(err?.message);
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(errors.length > 0 && !config_1.isProduction && { errors }),
        timeStamp: new Date().toISOString(),
        path: req.originalUrl,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map