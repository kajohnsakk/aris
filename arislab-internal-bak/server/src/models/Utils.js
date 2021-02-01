"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static randomString(length, an) {
        /**
         * RANDOM STRING GENERATOR
         *
         * Info:      http://stackoverflow.com/a/27872144/383904
         * Use:       randomString(length [,"A"] [,"N"] );
         * Default:   return a random alpha-numeric string
         * Arguments: If you use the optional "A", "N" flags:
         *            "A" (Alpha flag)   return random a-Z string
         *            "N" (Numeric flag) return random 0-9 string
         */
        an = an && an.toLowerCase();
        var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
        for (; i++ < length;) {
            var r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map