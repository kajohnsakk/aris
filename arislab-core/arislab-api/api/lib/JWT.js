"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
class JWT {
    constructor(SECRET_KEY, token = "") {
        this.SECRET_KEY = SECRET_KEY;
        this.token = token;
    }
    sign(data, options = {}) {
        const token = jwt.sign(data, this.SECRET_KEY, options);
        return token;
    }
    verify() {
        return jwt.verify(this.token, this.SECRET_KEY);
    }
}
exports.default = JWT;
//# sourceMappingURL=JWT.js.map