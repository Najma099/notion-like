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
exports.isPasswordCorrect = exports.createTokens = exports.validateRefreshToken = exports.validateAccessToken = exports.getRefreshedToken = exports.getAccessToken = void 0;
const ApiError_1 = require("./ApiError");
const jwtUtils_1 = __importStar(require("./jwtUtils"));
const config_1 = require("./../config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const KeystoreRepo = __importStar(require("../database/repository/keystoreRepo"));
const getAccessToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }
    throw new ApiError_1.AuthFailureError('Access Token Missing');
};
exports.getAccessToken = getAccessToken;
const getRefreshedToken = (req) => {
    if (req.body?.refreshToken) {
        return req.body.refreshToken;
    }
    throw new ApiError_1.AuthFailureError('Refresh Token is missing');
};
exports.getRefreshedToken = getRefreshedToken;
const validateAccessToken = (payload) => {
    if (!payload ||
        !payload.prm ||
        !payload.sub ||
        payload.iss !== config_1.tokenInfo.issuer ||
        payload.aud !== config_1.tokenInfo.audience ||
        !/^\d+$/.test(payload.sub)) {
        throw new ApiError_1.AuthFailureError('Invalid Access Token');
    }
    return true;
};
exports.validateAccessToken = validateAccessToken;
const validateRefreshToken = (payload) => {
    if (!payload ||
        !payload.prm ||
        !payload.sub ||
        payload.iss !== config_1.tokenInfo.issuer ||
        payload.aud !== config_1.tokenInfo.audience ||
        !/^\d+$/.test(payload.sub)) {
        throw new ApiError_1.AuthFailureError('Invalid Refresh Token');
    }
    return true;
};
exports.validateRefreshToken = validateRefreshToken;
const createTokens = async (userId) => {
    const accessTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    await KeystoreRepo.create(userId, accessTokenKey, refreshTokenKey);
    const accessToken = await jwtUtils_1.default.encode({
        ...new jwtUtils_1.AccessTokenPayload(config_1.tokenInfo.issuer, config_1.tokenInfo.audience, userId, accessTokenKey, config_1.tokenInfo.accessTokenValidity)
    });
    const refreshToken = await jwtUtils_1.default.encode({
        ...new jwtUtils_1.RefreshTokenPayload(config_1.tokenInfo.issuer, config_1.tokenInfo.audience, userId, refreshTokenKey, config_1.tokenInfo.refreshTokenValidity)
    });
    return { accessToken, refreshToken };
};
exports.createTokens = createTokens;
const isPasswordCorrect = async (userPassword, hashedPassword) => {
    return await bcryptjs_1.default.compare(userPassword, hashedPassword);
};
exports.isPasswordCorrect = isPasswordCorrect;
//# sourceMappingURL=authUtils.js.map