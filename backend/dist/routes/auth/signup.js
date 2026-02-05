"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const database_1 = require("../../database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.validateRequest)(schema_1.SignupSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const emailExists = await (0, userRepo_1.existsByEmail)(email);
    if (emailExists)
        throw new ApiError_1.BadRequestError('Email already registered.');
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const prisma = (0, database_1.getPrismaClient)();
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });
    const tokens = await (0, authUtils_1.createTokens)(user.id);
    new ApiResponse_1.SuccessResponse('Signup successful', {
        user: (0, utils_1.getUserData)(user),
        tokens,
    }).send(res);
}));
exports.default = router;
//# sourceMappingURL=signup.js.map