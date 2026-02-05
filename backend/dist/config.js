"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenInfo = exports.port = exports.isProduction = exports.originUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.originUrl = process.env.ORIGIN_URL;
exports.isProduction = process.env.NODE_ENV === 'production';
exports.port = process.env.PORT;
exports.tokenInfo = {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY || '',
    jwtPublicKey: process.env.JWT_PUBLIC_KEY || ''
};
//# sourceMappingURL=config.js.map