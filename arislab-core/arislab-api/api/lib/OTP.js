"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OTP {
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}
exports.default = OTP;
//# sourceMappingURL=OTP.js.map