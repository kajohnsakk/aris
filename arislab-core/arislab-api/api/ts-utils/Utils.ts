import { Log } from './Log';
import { ElasticsearchClient } from '../components/ElasticsearchClient';
import { v4 as uuidv4 } from 'uuid';

const uuid = require("uuid");
const shortUuid = require("short-uuid");
const Cryptr = require('cryptr');

export class Utils {
    public static generateId() {
        return shortUuid().fromUUID(uuid.v4());
    }
    public static createUUID() {
        //sort 'e' of for resolving csv conflict
        do{
            var UUID = uuidv4();
            var shortUUID = UUID.substr(0,6);
        }while(shortUUID.indexOf('e') > -1)
        return shortUUID;
    }
    public static extractValues(obj: { [key: string]: any }) {
        let tags: string[] = [];
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            const val = obj[key];
            if (typeof (val) == 'object' && !key.startsWith('_')) {
                tags = tags.concat(Utils.extractValues(val));
            }
            else if (typeof (val) == 'number' && val > 0) tags.push(val + "");
            else if (typeof (val) == 'string' &&
                val.length > 0 &&
                val != "undefined" &&
                val != "null") tags.push(val + "")
        }
        return tags;
    }
    /**
    ** Get displayable, easy-to-understand explanation string of action
    * */
    public static getActionDisplayString(action: string) {
        if (!action) return "-";
        // Example: @show_menu_category
        if (action.startsWith("@")) return "Flow: " + action;
        // Example: answer-#general_อ่านไม่ตอบ__น้องขอโทษค่ะ||น้องตอบแล้วค่ะ||ขอโทษด้วยนะคะ
        else if (action.startsWith("answer-#")) {
            return "Chitchat: " + action.replace("answer-#", "").split("__")[0];
        }
        // Example: faq-say_hello
        else if (action.startsWith("faq-")) {
            return "FAQ: " + action.replace("faq-", "");
        }
        // Example: testvar_response
        else if (action) {
            return "Template: " + action;
        }
        return action;
    }

    public static cryptrManager(secret_key: string, mode: string, data: string) {
        Log.debug('Crypting data: ', data, ' with mode ' + mode);
        let CRYPTR_KEY = new Cryptr(secret_key);
        let result;
        if (mode === "ENCRYPT") {
            Log.debug('[cryptrManager] Encrypting data: ', data);
            result = CRYPTR_KEY.encrypt(data);
            Log.debug('[cryptrManager] Result encrypt: ', result);
        } else if (mode === "DECRYPT") {
            Log.debug('[cryptrManager] Decrypting data: ', data);
            result = CRYPTR_KEY.decrypt(data);
            Log.debug('[cryptrManager] Result decrypt: ', result);
        }
        return result;
    }

    public static findDuplicate(itemList: Array<{ [key: string]: any }>) {
        return new Set(itemList).size !== itemList.length
    }

    public static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

   /**
    * Pushing new fields to each type by giving type, fieldPath and fieldObj
    * @param {string} type Type to push new fields
    * @param {string} fieldPath Path of field to push new object to
    * @param {object} fieldObj Field object to push
    */
    public static async pushFields(type: string, fieldPath: string, fieldObj: any) {
        try {
            Log.debug('Pushing new fields to type: ' + type + ' with fieldPath: ' + fieldPath + ' and fieldObj: ', fieldObj);
            let result: { status: string, details?: string } = { "status": "failed" };
            const checkFieldsQuery = {
                "query": {
                    "bool": {
                        "must_not": [
                            { "exists": { "field": fieldPath } },
                            { "match": { "storeID.keyword": "" } }
                        ]
                    }
                }
            }

            const resultCheckFields = await ElasticsearchClient.getInstance().count(type, checkFieldsQuery);
            if (!resultCheckFields) {
                result['status'] = "noop";
                result['details'] = "All documents already had this field object";
            } else {
                const pushFieldsBody = {
                    ...checkFieldsQuery,
                    "script": {
                        "params": { "newFieldObj": fieldObj },
                        "source": `ctx._source.${fieldPath} = params.newFieldObj`,
                        "lang": "painless"
                    }
                };

                const resultPushFields: { [key: string]: any } = await ElasticsearchClient.getInstance().updateByQuery(type, pushFieldsBody);
                result['status'] = resultPushFields['status'];
                result['details'] = "Push new field object successfully";
            }
            return result;
        } catch (error) {
            Log.error('Error while pushing fields: ', error);
            throw error;
        }
    }
}