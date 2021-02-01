const uuid = require("uuid");
const shortUuid = require("short-uuid");

export class Utils{
    public static generateId(){
        return shortUuid().fromUUID(uuid.v4());
    }

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
    public static randomString(length: Number, an: string) {
        an = an && an.toLowerCase();
        var str = "", i = 0, min = an == "a" ? 10 : 0, max = an == "n" ? 10 : 62;
        for (; i++ < length;) {
            var r = Math.random() * (max - min) + min << 0;
            str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
        }
        return str;
    }

    public static decodeBase64(base64String: string) {
        return Buffer.from(base64String, 'base64').toString();
    }

    public static createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        const s = [];
        const hexDigits = "0123456789abcdef";
        for (let i = 0; i < 15; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        // s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        // s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        // s[8] = s[13] = s[18] = s[23] = "-";

        const uuid = s.join("");
        return uuid;
    }

    public static generateReferenceNo() {
        // return this.createUUID();

        return Date.now()+""+Math.floor((Math.random()*100));
    }
}