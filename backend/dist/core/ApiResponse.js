"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRefreshResponse = exports.AccessTokenErrorResponse = exports.SuccessResponse = exports.FailureMsgResponse = exports.SuccessMsgResponse = exports.InternalErrorResponse = exports.BadRequestResponse = exports.ForbiddenResponse = exports.NotFoundResponse = exports.AuthFailureResponse = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode["SUCCESS"] = "10000";
    StatusCode["FAILURE"] = "10001";
    StatusCode["RETRY"] = "10002";
    StatusCode["INVALID_ACCESS_TOKEN"] = "10003";
})(StatusCode || (StatusCode = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["SUCCESS"] = 200] = "SUCCESS";
    ResponseStatus[ResponseStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseStatus[ResponseStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseStatus[ResponseStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseStatus[ResponseStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseStatus[ResponseStatus["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
})(ResponseStatus || (ResponseStatus = {}));
class ApiResponse {
    statusCode;
    status;
    message;
    success;
    constructor(statusCode, status, message, success) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.success = success;
    }
    prepare(res, response, headers) {
        for (const [key, value] of Object.entries(headers))
            res.append(key, value);
        return res.status(this.status).json(ApiResponse.sanitize(response));
    }
    static sanitize(response) {
        const clone = {};
        Object.assign(clone, response);
        delete clone.status;
        for (const i in clone)
            if (typeof clone[i] === 'undefined')
                delete clone[i];
        return clone;
    }
    send(res, headers = {}) {
        return this.prepare(res, this, headers);
    }
}
class AuthFailureResponse extends ApiResponse {
    constructor(message = 'Authentication Failure', success = false) {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message, success);
    }
}
exports.AuthFailureResponse = AuthFailureResponse;
class NotFoundResponse extends ApiResponse {
    constructor(message = 'Not Found', success = false) {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message, success);
    }
    send(res, headers = {}) {
        return super.prepare(res, this, headers);
    }
}
exports.NotFoundResponse = NotFoundResponse;
class ForbiddenResponse extends ApiResponse {
    constructor(message = 'Bad Parameters', success = false) {
        super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message, success);
    }
}
exports.ForbiddenResponse = ForbiddenResponse;
class BadRequestResponse extends ApiResponse {
    constructor(message = 'Bad Parameters', success = false) {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message, success);
    }
}
exports.BadRequestResponse = BadRequestResponse;
class InternalErrorResponse extends ApiResponse {
    constructor(message = 'Internal Error', success = false) {
        super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message, success);
    }
}
exports.InternalErrorResponse = InternalErrorResponse;
class SuccessMsgResponse extends ApiResponse {
    constructor(message, success = true) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message, success);
    }
}
exports.SuccessMsgResponse = SuccessMsgResponse;
class FailureMsgResponse extends ApiResponse {
    constructor(message, success = false) {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message, success);
    }
}
exports.FailureMsgResponse = FailureMsgResponse;
class SuccessResponse extends ApiResponse {
    data;
    constructor(message, data, success = true) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message, success);
        this.data = data;
    }
    send(res, headers = {}) {
        return super.prepare(res, this, headers);
    }
}
exports.SuccessResponse = SuccessResponse;
class AccessTokenErrorResponse extends ApiResponse {
    instruction = 'refresh_token';
    constructor(message = 'Access token invalid', success = false) {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message, success);
    }
    send(res, headers = {}) {
        headers.instruction = this.instruction;
        return super.prepare(res, this, headers);
    }
}
exports.AccessTokenErrorResponse = AccessTokenErrorResponse;
class TokenRefreshResponse extends ApiResponse {
    accessToken;
    refreshToken;
    constructor(message, accessToken, refreshToken, success = true) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message, success);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
    send(res, headers = {}) {
        return super.prepare(res, this, headers);
    }
}
exports.TokenRefreshResponse = TokenRefreshResponse;
//# sourceMappingURL=ApiResponse.js.map