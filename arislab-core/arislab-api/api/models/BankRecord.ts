import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface bankInfoJson {
    label: string,
    value: string,
    bankCode?: string
}

export interface accountInfoJSON {
    accountName: string,
    accountNumber: string,
    bank: bankInfoJson
}

export interface verifyInfoJSON {
    referenceNo: string
}

export interface JSONData {
    verifyID: string,
    storeID: string,
    accountInfo: accountInfoJSON,
    verifyInfo: verifyInfoJSON,
    createdAt: number, 
    isVerified: boolean,
    verifiedAt: number
}

export class BankRecord extends AbstractPersistentModel {
    public verifyID: string
    public storeID: string
    public accountInfo: accountInfoJSON
    public verifyInfo: verifyInfoJSON
    public createdAt?: number
    public isVerified: boolean
    public verifiedAt: number

    constructor(json: JSONData) {
        super(json.verifyID);
        this.verifyID = json.verifyID;
        this.storeID = json.storeID;
        this.accountInfo = json.accountInfo;
        this.verifyInfo = json.verifyInfo;
        this.createdAt = json.createdAt;
        this.isVerified = json.isVerified;
        this.verifiedAt = json.verifiedAt;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "bank_record";
    protected getType(): string {
        return BankRecord.TYPE;
    }

    public toJSON(): any {
        return {
            verifyID: this.verifyID,
            storeID: this.storeID,
            accountInfo: this.accountInfo,
            verifyInfo: this.verifyInfo,
            createdAt: this.createdAt,
            isVerified: this.isVerified,
            verifiedAt: this.verifiedAt
        };
    }

    public static findById(verifyID: string): Promise<BankRecord> {
        Log.debug('[BankRecord] Finding bank record by id with verifyID: ', verifyID);

        return ElasticsearchClient.getInstance().get(this.TYPE, verifyID).then((json: any) => {
            if (!json)
                Log.debug('Verify ID ' + verifyID + " doesn't exist");
            else
                return new BankRecord(json);
        });
    }

    public static findBankRecordsByStatus(isVerified: boolean, start: Date, end: Date): Promise<BankRecord> {
        Log.debug('Finding bank record by isVerified: ' + isVerified);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "isVerified": isVerified } },
                        {
                            "range": { "createdAt": { "gte": start, "lte": end } }
                        }
                    ]
                }
            }
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                // Log.debug('findBankRecordsByStatus founded with result: ', json);
                return json.map((result: any) => {
                    return new BankRecord(result._source);
                });
            } else {
                return [];
            }
        });
    }
}