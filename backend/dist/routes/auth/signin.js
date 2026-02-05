"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../core/asyncHandler");
const schema_1 = require("./schema");
const ApiError_1 = require("../../core/ApiError");
const userRepo_1 = require("../../database/repository/userRepo");
const authUtils_1 = require("../../core/authUtils");
const ApiResponse_1 = require("../../core/ApiResponse");
const utils_1 = require("../../core/utils");
const validateRequest_1 = require("../../middleware/validateRequest");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.validateRequest)(schema_1.SigninSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await (0, userRepo_1.findByEmail)(email);
    if (!user)
        throw new ApiError_1.BadRequestError('User not registered.');
    const isValid = await (0, authUtils_1.isPasswordCorrect)(password, user.password);
    if (!isValid)
        throw new ApiError_1.AuthFailureError('Authentication failure');
    const tokens = await (0, authUtils_1.createTokens)(user.id);
    const userData = (0, utils_1.getUserData)(user);
    new ApiResponse_1.SuccessResponse('Login success.', {
        user: userData,
        tokens: tokens,
    }).send(res);
}));
exports.default = router;
//# sourceMappingURL=signin.js.map