export class Utils {
    public static randomString(length: Number, an: string) {
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

    public static timeConverter(UNIX_timestamp: number): string {
        var a = new Date(UNIX_timestamp);
        var year = a.getFullYear();
        var month = this.str_pad(a.getMonth() + 1);
        var date = this.str_pad(a.getDate());
        var hour = this.str_pad(a.getHours());
        var min = this.str_pad(a.getMinutes());
        var sec = this.str_pad(a.getSeconds());
        var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;

        return time;
    }

    public static str_pad(num: number): string {
        return String("00" + num).slice(-2);
    }
}