"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (res, statusCode, message, details) => {
    const TYPES = {
        200: 'OK',
        201: 'Created',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        409: 'Conflict',
        500: 'InternalServerError'
    };
    const responseMsg = {
        statusCode,
        name: TYPES[statusCode],
        message,
    };
    if (details)
        responseMsg.details = details;
    return res.status(statusCode).send(responseMsg);
};
//# sourceMappingURL=response.js.map