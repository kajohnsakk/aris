/**
 * Created by root on 22/07/15.
 */
module.exports = {
    isError: function (json) {
        return json.hasOwnProperty("error_code");
    },
    resource_not_found: {
        message: "Resource not found",
        error_code: 1001,
        http_status: 404
    },
    bad_request: {
        message: "Bad request",
        error_code: 1002,
        http_status: 400
    },
    internal_error: {
        message: "Internal Server Error",
        error_code: 1003,
        http_status: 500
    },
    bad_query: {
        message: "Bad query information",
        error_code: 1004,
        http_status: 422
    },
    invalid_email: {
        message: "Invalid email",
        error_code: 1101,
        http_status: 404
    },
    invalid_password: {
        message: "Invalid password",
        error_code: 1102,
        http_status: 402
    },
    invalid_login: {
        message: "Invalid email or password",
        error_code: 1102,
        http_status: 402
    },
    resource_already_exists: {
        message: "Resource already exists",
        error_code: 1103,
        http_status: 409
    },
    session_not_found: {
        message: "Session not found",
        error_code: 1201,
        http_status: 404
    },
    endpoint_not_supported: {
        message: "This api endpoint is not supported",
        error_code: 1202,
        http_status: 405
    },
    invalid_token: {
        message: "Invalid token",
        error_code: 1201,
        http_status: 400
    },
    member_not_found: {
        message: "Member not found",
        error_code: 1203,
        http_status: 404
    },
    send: function (res, error, message) {
        res.status(error.http_status);
        if (message) error.message = message;
        res.json(error);
    }
};