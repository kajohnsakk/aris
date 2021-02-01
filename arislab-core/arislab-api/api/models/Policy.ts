import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface policiesJSON {
    privacyPolicy?: string,
    returnRefundPolicy?: string,
    shippingPolicy?: string,
    cancellationPolicy?: string
}

export interface storeInfoJSON {
    policies: policiesJSON
}

export interface JSONData {
    storeID: string,
    storeInfo: storeInfoJSON
}

export class Policy extends AbstractPersistentModel {
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
        return Policy.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            storeInfo: this.storeInfo
        };
    }

    public static findById(storeID: string): Promise<Policy> {
        Log.debug('[Policy] Finding policy by id with storeID: ', storeID);

        return ElasticsearchClient.getInstance().get(this.TYPE, storeID).then((json: any) => {
            if (!json)
                Log.debug('Store ID ' + storeID + " doesn't exist");
            else
                return new Policy(json);
        });
    }
}