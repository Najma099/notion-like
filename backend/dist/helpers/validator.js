"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodAuthBearer = exports.ValidationSource = void 0;
const zod_1 = __importDefault(require("zod"));
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["HEADER"] = "headers";
    ValidationSource["QUERY"] = "query";
    ValidationSource["PARAM"] = "params";
    ValidationSource["REQUEST"] = "request";
})(ValidationSource || (exports.ValidationSource = ValidationSource = {}));
exports.ZodAuthBearer = zod_1.default
    .string()
    .regex(/^Bearer\s+\S+$/, {
    message: "Invalid Authorization header. Expected: 'Bearer <token>'",
});
//# sourceMappingURL=validator.js.map