"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../core/asyncHandler");
const ApiResponse_1 = require("../../core/ApiResponse");
const authentication_1 = __importDefault(require("./authentication"));
const router = (0, express_1.Router)();
router.use(authentication_1.default);
router.get('/', (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    new ApiResponse_1.SuccessResponse('User Information.', {
        user: req.user
    }).send(res);
}));
exports.default = router;
//# sourceMappingURL=identity.js.map