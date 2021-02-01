import {ElasticsearchClient, ElasticsearchQueryResultDocument} from "../components/ElasticsearchClient";
import {AbstractPersistentModel} from "./AbstractPersistentModel";
import { Log } from '../ts-utils/Log';


export interface IVerifyInfo {
    resultCode: string
}

export interface ICreditCardInfo {
    name: string,
    number: string,
    expirationMonth: string,
    expirationYear: string,
    securityCode: string,
    token: string,
}

export interface ICreditCard {
    creditCardID: string,
    storeID: string,
    creditCardInfo: ICreditCardInfo,
    verifyInfo: IVerifyInfo,
    createdAt: number,
    deletedAt: number,
    isDeleted: boolean
}

export class CreditCard extends AbstractPersistentModel {
    public creditCardID: string;
    public storeID: string;
    public creditCardInfo: ICreditCardInfo;
    public verifyInfo: IVerifyInfo;
    public createdAt: number;
    public deletedAt: number;
    public isDeleted: boolean;

    constructor(json: ICreditCard, creditCardID?: string) {
        super(creditCardID);
        this.creditCardID = creditCardID;
        if( json ) {
            this.storeID = json.storeID;
            this.creditCardInfo = json.creditCardInfo;
            this.verifyInfo = json.verifyInfo;
            this.createdAt = json.createdAt;
            this.deletedAt = json.deletedAt;
            this.isDeleted = json.isDeleted;
        }
    }

    doUpdate(json: ICreditCard): boolean {
        return true;
    }

    private static readonly TYPE = "credit_card";
    protected getType(): string {
        return CreditCard.TYPE;
    }

    public toJSON(): ICreditCard {
        return {
            creditCardID: this.creditCardID,
            storeID: this.storeID,
            creditCardInfo: this.creditCardInfo,
            verifyInfo: this.verifyInfo,
            createdAt: this.createdAt,
            deletedAt: this.deletedAt,
            isDeleted: this.isDeleted
        }
    }

    public updateJSON(json: ICreditCard) {
        return new Promise((resolve, reject) => {
            if( json ) {
                this.creditCardID = json.creditCardID;
                this.storeID = json.storeID;
                this.creditCardInfo = json.creditCardInfo;
                this.verifyInfo = json.verifyInfo;
                this.createdAt = json.createdAt;
                this.deletedAt = json.deletedAt;
                this.isDeleted = json.isDeleted;

                resolve( this.update(json) );
            } else {
                resolve( false );
            }
        });
        
    }

    public static findCurrentCreditCard(storeID: string): Promise<ICreditCard[]> {
        Log.debug('Finding current credit card from storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        },
                        {
                            "match": {
                                "isDeleted": "false"
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result current credit card from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new CreditCard(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

    public static findCreditCardList(storeID: string): Promise<ICreditCard[]> {
        Log.debug('Finding list of credit card from storeID: ' + storeID);

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "storeID.keyword": storeID
                            }
                        }
                    ]
                }
            },
            "sort": [
                { "createdAt": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('Result list of credit card from storeID: ' + storeID + ' is: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new CreditCard(result._source, result._id);
                });
            } else {
                return [];
            }
        });
    }

}
