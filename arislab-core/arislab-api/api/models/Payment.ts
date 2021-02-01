import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface bankInfoJson {
    label?: string,
    value?: string
}

export interface gbPayInfoJSON {
    token: string
}

export interface verifyInfoJSON {
    isVerified: boolean,
    verifyID: string
}

export interface paymentInfoJSON {
    bank: bankInfoJson;
    accountName: string;
    accountNumber: string;
    gbPayInfo: gbPayInfoJSON;
    qrImage?: string;
    verifyInfo?: verifyInfoJSON;
}

export interface storeInfoJSON {
    paymentInfo: paymentInfoJSON
}

export interface JSONData {
    storeID: string,
    storeInfo: storeInfoJSON
}

export class Payment extends AbstractPersistentModel {
    public storeID: string;
    public storeInfo: storeInfoJSON;

    constructor(json: JSONData) {
        super(json.storeID);
        this.storeID = json.storeID;
        this.storeInfo = json.storeInfo;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "store";
    protected getType(): string {
        return Payment.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            storeInfo: this.storeInfo
        };
    }

    public static findById(storeID: string): Promise<Payment> {
        Log.debug('[Payment] Finding payment by id with storeID: ', storeID);

        return ElasticsearchClient.getInstance().get(this.TYPE, storeID).then((json: any) => {
            if (!json)
                Log.debug('Store ID ' + storeID + " doesn't exist");
            else
                return new Payment(json);
        });
    }
}