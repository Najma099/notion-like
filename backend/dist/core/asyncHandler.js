"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
function asyncHandler(execution) {
    return (req, res, next) => {
        execution(req, res, next).catch(next);
    };
}
//# sourceMappingURL=asyncHandler.js.map