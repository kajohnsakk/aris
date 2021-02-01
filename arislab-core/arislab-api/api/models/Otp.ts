import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';
import { json } from 'body-parser';

export interface StoreInfoJsonData {
    storeID: string,
    name: string,
    phoneNo: string
}

export interface SmsInfoJsonData {
    from: string,
    to: string,
    message: string,
    sentRefID: string,
    sentStatus: string,
    sentStatusDetail?: string,
    sentAt: number
}

export interface JSONData {
    otpID: string,
    otpCode: string,
    otpReferenceCode: string,
    storeInfo: StoreInfoJsonData,
    smsInfo: SmsInfoJsonData,
    createdAt: number,
    isUsed: boolean,
    usedAt: number
}

export class Otp extends AbstractPersistentModel {
    public otpID: string;
    public otpCode: string;
    public otpReferenceCode: string;
    public storeInfo: StoreInfoJsonData;
    public smsInfo: SmsInfoJsonData;
    public createdAt: number;
    public isUsed: boolean;
    public usedAt: number;

    constructor(json: JSONData, otpID?: string) {
        super(otpID);
        this.otpID = otpID;
        if (json) {
            this.otpCode = json.otpCode;
            this.otpReferenceCode = json.otpReferenceCode;
            this.storeInfo = json.storeInfo;
            this.smsInfo = json.smsInfo;
            this.createdAt = json.createdAt;
            this.isUsed = json.isUsed;
            this.usedAt = json.usedAt;
        }

    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "otp";
    protected getType(): string {
        return Otp.TYPE;
    }

    public toJSON(): any {
        return {
            otpID: this.otpID,
            otpCode: this.otpCode,
            otpReferenceCode: this.otpReferenceCode,
            storeInfo: this.storeInfo,
            smsInfo: this.smsInfo,
            createdAt: this.createdAt,
            isUsed: this.isUsed,
            usedAt: this.usedAt
        }
    }

    public static findOtpFromCode(storeID: string, otpCode: string, otpReferenceCode: string): Promise<Otp> {
        Log.debug('Finding otp from code: ' + otpCode + ' with reference code: ' + otpReferenceCode + ' in storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeInfo.storeID.keyword": storeID
                            }
                        },
                        {
                            "match": {
                                "otpCode.keyword": otpCode
                            }
                        },
                        {
                            "match": {
                                "otpReferenceCode.keyword": otpReferenceCode
                            }
                        }
                    ]
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('Result otp from code: ' + otpCode + ' with reference code: ' + otpReferenceCode + ' in storeID: ' + storeID + ' is: ', json);
                return json.map((result: any) => {
                    return new Otp(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

}