const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

export class Parser{

    public static objectToJson(object: any){
        const ret : any = {};
        const keys = Object.keys(object);
        for(let key of keys){
            ret[key] = object[key];
        }
        return ret;
    }

    public static recursiveReplaceValue( objSource: any, replaceFunction: ((value: string) => void) = (value => value)) : any{
        if(typeof objSource === "object" ){
            if(objSource === null) return null;
            if(objSource instanceof Array){
                for(var i = 0; i < objSource.length; i++){
                    objSource[i] =  Parser.recursiveReplaceValue(objSource[i], replaceFunction);
                }
            }else{
                for(var property in objSource){
                    objSource[property] = Parser.recursiveReplaceValue(objSource[property], replaceFunction);
                }
            }
            return objSource;

        }
        if(typeof objSource === "string"){
            return replaceFunction(objSource);
        }
        return objSource;
    }
}