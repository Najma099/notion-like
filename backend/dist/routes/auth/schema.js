"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHeaderSchema = exports.SignupSchema = exports.SigninSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SigninSchema = zod_1.default.object({
    email: zod_1.default.email({ message: 'Invalid email' }),
    password: zod_1.default.string().min(1, { message: 'Password is required' }),
});
exports.SignupSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, 'Name is too short'),
    email: zod_1.default.string().email('Invalid email'),
    password: zod_1.default.string().min(6, 'Password must be at least 6 characters'),
});
exports.AuthHeaderSchema = zod_1.default.object({
    authorization: zod_1.default
        .string()
        .startsWith('Bearer ')
        .min(10, 'Invalid Authorization header'),
});
//# sourceMappingURL=schema.js.map