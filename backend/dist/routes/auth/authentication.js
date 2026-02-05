"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../core/asyncHandler");
const ApiError_1 = require("../../core/ApiError");
const jwtUtils_1 = __importDefault(require("../../core/jwtUtils"));
const authUtils_1 = require("../../core/authUtils");
const UserRepo = __importStar(require("../../database/repository/userRepo"));
const KeystoreRepo = __importStar(require("../../database/repository/keystoreRepo"));
const jsonwebtoken_1 = require("jsonwebtoken");
const schema_1 = require("./schema");
const validateRequest_1 = require("../../middleware/validateRequest");
const router = (0, express_1.Router)();
exports.default = router.use((0, validateRequest_1.validateRequest)(schema_1.AuthHeaderSchema, 'headers'), (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const accessToken = (0, authUtils_1.getAccessToken)(req);
    try {
        const payload = await jwtUtils_1.default.validate(accessToken);
        (0, authUtils_1.validateAccessToken)(payload);
        const userId = Number(payload.sub);
        if (isNaN(userId)) {
            throw new ApiError_1.AuthFailureError('Invalid user id in token');
        }
        const user = await UserRepo.findById(userId);
        if (!user) {
            throw new ApiError_1.AuthFailureError('User not registered');
        }
        console.log(payload);
        console.log(user.id);
        const keystore = await KeystoreRepo.find(user.id, payload.prm);
        if (!keystore) {
            throw new ApiError_1.AuthFailureError('Invalid access token');
        }
        req.user = user;
        req.keystore = keystore;
        return next();
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new ApiError_1.AccessTokenError('Access token expired');
        }
        throw e;
    }
}));
//# sourceMappingURL=authentication.js.map