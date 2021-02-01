import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface chargeTypeJSON {
	label?: string,
	value?: string
}

export interface priceJSON {
	firstPiece?: string,
	additionalPiece?: string
}

export interface deliveryJSON {
    // chargeType?: chargeTypeJSON,
    price?: priceJSON,
}

export interface storeInfoJSON {
    delivery: deliveryJSON
}

export interface JSONData {
    storeID: string,
    storeInfo: storeInfoJSON
}

export class Delivery extends AbstractPersistentModel {
    public storeID: string;
    public storeInfo: storeInfoJSON;

    constructor(json: JSONData) {
        super(json.storeID);
		
		if( !json.storeInfo.hasOwnProperty('delivery') ) {
			json.storeInfo['delivery'] = {
				// chargeType: {
				// 	label: '',
				//	value: ''
				//},
				price: {
					firstPiece: '',
					additionalPiece: ''
				}
			};
		}
		
        this.storeID = json.storeID;
        this.storeInfo = json.storeInfo;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "store";
    protected getType(): string {
        return Delivery.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            storeInfo: this.storeInfo
        };
    }

    public static findById(storeID: string): Promise<Delivery> {
        Log.debug('[Delivery] Finding delivery by id with storeID: ', storeID);

        return ElasticsearchClient.getInstance().get(this.TYPE, storeID).then((json: any) => {
            if (!json)
                Log.debug('Store ID ' + storeID + " doesn't exist");
            else
                return new Delivery(json);
        });
    }
}