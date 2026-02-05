"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const ApiError_1 = require("../core/ApiError");
function validateRequest(schema, property = 'body') {
    return (req, _res, next) => {
        const parsed = schema.safeParse(req[property]);
        if (!parsed.success) {
            return next(new ApiError_1.AuthFailureError(parsed.error.issues.map(i => i.message).join(', ')));
        }
        req[property] = parsed.data;
        next();
    };
}
//# sourceMappingURL=validateRequest.js.map