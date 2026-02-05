"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = __importDefault(require("./signup"));
const signin_1 = __importDefault(require("./signin"));
const identity_1 = __importDefault(require("./identity"));
const signout_1 = __importDefault(require("./signout"));
const token_1 = __importDefault(require("./token"));
const router = (0, express_1.Router)();
router.use('/signup', signup_1.default);
router.use('/signin', signin_1.default);
router.use('/signout', signout_1.default);
router.use('/token', token_1.default);
router.use('/me', identity_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map