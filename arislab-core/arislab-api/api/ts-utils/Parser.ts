import { Log } from "./Log";

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

export class Parser {
    static intervalToMs(interval: string): number {
        if (!interval) return -1;
        const suffix = interval.substr(-1);
        const number = Number(interval.substring(0, interval.length - 1));
        if (suffix == "ms") return number;
        if (suffix == "s") return number * 1000;
        if (suffix == "m") return number * 1000 * 60;
        if (suffix == "h") return number * 1000 * 60 * 60;
        if (suffix == "d") return number * 1000 * 60 * 60 * 24;
        return -1;
    }
    public static jsonToCsv(array: any[], includeHeader: boolean, delimiter?: string) {
        let ret = '';
        if (array.length == 0) return ret;
        const keys = Object.keys(array[0]);
        if (includeHeader) {
            ret += keys.join(delimiter ? delimiter : '|') + '\n';
        }
        for (let json of array) {
            const vals = [];
            for (let key of keys) {
                // Log.debug('json key is ',key,' and value is ',json[key]);
                let val = json[key] || '';
                if (typeof (val) == 'object') val = JSON.stringify(val);
                //Convert val to string and replace new line
                vals.push((val + '').replace(/\n/g, ' ').replace(/__NJSEP__/g, ', '));
            }
            ret += vals.join(delimiter ? delimiter : '|') + '\n';
        }
        return ret;
    }
    public static objectToJson(object: any) {
        const ret: any = {};
        const keys = Object.keys(object);
        for (let key of keys) {
            ret[key] = object[key];
        }
        return ret;
    }

    public static recursiveReplaceValue(objSource: any, replaceFunction: ((value: string) => void) = (value => value)): any {
        if (typeof objSource === "object") {
            if (objSource === null) return null;
            if (objSource instanceof Array) {
                for (var i = 0; i < objSource.length; i++) {
                    objSource[i] = Parser.recursiveReplaceValue(objSource[i], replaceFunction);
                }
            } else {
                for (var property in objSource) {
                    objSource[property] = Parser.recursiveReplaceValue(objSource[property], replaceFunction);
                }
            }
            return objSource;

        }
        if (typeof objSource === "string") {
            return replaceFunction(objSource);
        }
        return objSource;
    }
}