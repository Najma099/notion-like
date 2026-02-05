"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenPayload = exports.AccessTokenPayload = void 0;
const util_1 = require("util");
const jsonwebtoken_1 = require("jsonwebtoken");
const ApiError_1 = require("./ApiError");
const config_1 = require("../config");
class AccessTokenPayload {
    iss;
    aud;
    sub;
    prm;
    iat;
    exp;
    constructor(issuer, audience, userId, primaryKey, validity) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = userId.toString();
        this.prm = primaryKey;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + validity;
    }
}
exports.AccessTokenPayload = AccessTokenPayload;
class RefreshTokenPayload {
    iss;
    aud;
    sub;
    prm;
    iat;
    exp;
    constructor(issuer, audience, userId, secondaryKey, validity) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = userId.toString();
        this.prm = secondaryKey;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + validity;
    }
}
exports.RefreshTokenPayload = RefreshTokenPayload;
async function readPublicKey() {
    return config_1.tokenInfo.jwtPublicKey;
}
async function readPrivateKey() {
    return config_1.tokenInfo.jwtPrivateKey;
}
async function encode(payload) {
    const cert = await readPrivateKey();
    if (!cert)
        throw new ApiError_1.InternalError('Token generation failure');
    return (0, util_1.promisify)(jsonwebtoken_1.sign)(payload, cert, { algorithm: 'RS256' });
}
async function validate(token) {
    const cert = await readPublicKey();
    try {
        return (await (0, util_1.promisify)(jsonwebtoken_1.verify)(token, cert));
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.TokenExpiredError) {
            throw new ApiError_1.TokenExpiredError();
        }
        throw new ApiError_1.BadTokenError();
    }
}
async function decode(token) {
    const cert = await readPublicKey();
    try {
        return (await (0, util_1.promisify)(jsonwebtoken_1.verify)(token, cert));
    }
    catch (_e) {
        throw new ApiError_1.BadTokenError();
    }
}
exports.default = {
    encode,
    validate,
    decode,
};
//# sourceMappingURL=jwtUtils.js.map