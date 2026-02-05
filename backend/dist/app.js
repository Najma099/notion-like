"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("./config");
const index_1 = __importDefault(require("./routes/index"));
const error_middleware_1 = require("./middleware/error.middleware");
const ApiError_1 = require("./core/ApiError");
process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1);
});
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({ limit: '10mb' }));
exports.app.use(express_1.default.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
exports.app.use((0, cors_1.default)({
    origin: config_1.originUrl,
    credentials: true,
    optionsSuccessStatus: 200,
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, helmet_1.default)());
exports.app.use('/api/v1', index_1.default);
exports.app.use((_req, _res, next) => next(new ApiError_1.NotFoundError()));
exports.app.use(error_middleware_1.errorHandler);
//# sourceMappingURL=app.js.map