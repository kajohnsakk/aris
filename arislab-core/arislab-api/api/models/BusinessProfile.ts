import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient, ElasticsearchQueryResultDocument } from '../components/ElasticsearchClient';

import { Log } from '../ts-utils/Log';

export interface accountDetailsJSON {
    name?: string,
    businessName?: string
}

export interface businessAddressJSON {
    addressLine1?: string,
    addressLine2?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string
}

export interface businessProfileJSON {
    logo?: string,
    accountDetails?: accountDetailsJSON,
    businessEmail?: string,
    businessPhoneNo?: string,
    businessAddress?: businessAddressJSON
}

export interface IDelivery {
    price?: IPrice
}

export interface IPrice {
    firstPiece?: string,
    additionalPiece?: string
}

export interface ICompanyInfo {
    name?: string,
    taxNumber?: string,
    addressInfo?: businessAddressJSON,
    registeredAddressInfo?: businessAddressJSON
}

export interface IPersonalInfo {
    name?: string,
    idCard?: string,
    addressInfo?: businessAddressJSON
}

export interface IPolicies {
    returnRefundPolicy?: string,
    privacyPolicy?: string,
    cancellationPolicy?: string,
    shippingPolicy?: string
}

export interface IConfig {
    useCreditCard?: boolean,
    useCart?: boolean,
    useCashOnDelivery?: boolean,
    useBusinessFeatures?: boolean,
    useLastReply?: boolean,
    lastReplyMessage?: string
}

export interface IBank {
    bankCode?: string,
    label?: string,
    value?: string
}

export interface IGbPayInfo {
    token: string
}

export interface IPaymentVerifyInfo {
    verifyID: string,
    isVerified: boolean
}

export interface IPaymentInfo {
    accountName?: string,
    qrImage?: string,
    accountNumber?: string,
    bank?: IBank,
    gbPayInfo?: IGbPayInfo,
    verifyInfo?: IPaymentVerifyInfo
}

export interface IStorePackagePaymentInfo {
    paymentType: "CREDIT_CARD" | "BILLING"
}

export interface storeInfoJSON {
    businessProfile?: businessProfileJSON,
    delivery?: IDelivery,
    companyInfo?: ICompanyInfo,
    personalInfo?: IPersonalInfo,
    policies?: IPolicies,
    config?: IConfig,
    paymentInfo?: IPaymentInfo,
    storePackagePaymentInfo?: IStorePackagePaymentInfo
}

export interface verifyInfoJSON {
    isVerified: boolean,
    verifiedAt: number,
    otpID: string,
    pinCode: string
}

export interface JSONData {
    storeID: string,
    storeInfo?: storeInfoJSON,
    verifyInfo?: verifyInfoJSON,
    createdAt?: number,
    registeredTimestamp?: number,
    isDeveloperStore: Boolean
}

export class BusinessProfile extends AbstractPersistentModel {
    public storeID: string;
    public storeInfo: storeInfoJSON;
    public createdAt: number;
    public registeredTimestamp: number;
    public verifyInfo: verifyInfoJSON;
    public isDeveloperStore: Boolean;

    constructor(json: JSONData) {
        super(json.storeID);
        this.storeID = json.storeID;
        this.storeInfo = json.storeInfo;
        this.createdAt = json.createdAt;
        this.registeredTimestamp = json.registeredTimestamp;
        this.verifyInfo = json.verifyInfo;
        this.isDeveloperStore = json.isDeveloperStore;
    }

    doUpdate(json: JSONData): boolean {
        return true;
    }

    private static readonly TYPE = "store";
    protected getType(): string {
        return BusinessProfile.TYPE;
    }

    public toJSON(): any {
        return {
            storeID: this.storeID,
            verifyInfo: this.verifyInfo,
            storeInfo: this.storeInfo,
            createdAt: this.createdAt,
            registeredTimestamp: this.registeredTimestamp,
            isDeveloperStore: this.isDeveloperStore
        };
    }

    public static getAll(): Promise<BusinessProfile[]> {
        const searchQuery = {
            "query": {
                "exists": { "field": "auth0_uid" }
            }
        }

        Log.debug('[BusinessProfile] Finding all business profile with query: ', searchQuery);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: ElasticsearchQueryResultDocument[]) => {
            if (json && json.length > 0) {
                Log.debug('[BusinessProfile] Result find all business profile: ', json);
                return json.map((result: ElasticsearchQueryResultDocument) => {
                    return new BusinessProfile(result._source);
                });
            } else {
                return [];
            }
        });
    }

    public static findById(storeID: string): Promise<BusinessProfile> {
        Log.debug('[BusinessProfile] Finding business profile by id with storeID: ', storeID);

        return ElasticsearchClient.getInstance().get(this.TYPE, storeID).then((json: any) => {
            if (!json)
                Log.error('Store ID ' + storeID + " doesn't exist");
            else
                Log.debug('[BusinessProfile] Result find business profile by id: ', json);
            return new BusinessProfile(json);
        });
    }

    public static async findStoreByID(storeID: string): Promise<any> {
        const searchQuery = {
            "query": {
                "match": { "storeID.keyword": storeID }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery);
    }

    public static findStoreByEmail(email: string): Promise<any> {
        const searchQuery = {
            "query": {
                "match": { "email.keyword": email }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery);
    }

    public static findByEmail(email: string): Promise<any> {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "email.keyword": email } }
                    ]
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('[BusinessProfile] Result find business profile by email: ', json);
                return json.map((result: any) => {
                    return new BusinessProfile(result._source);
                });
            } else {
                return [];
            }
        });
    }

    public static findByAuth0ID(id: string): Promise<any> {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "auth0_uid.keyword": id } }
                    ]
                }
            }
        }
        Log.debug('[BusinessProfile] Finding business profile by auth0 uid with query: ', searchQuery);

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery).then((json: any) => {
            if (json && json.length > 0) {
                Log.debug('[BusinessProfile] Result find business profile by auth0 uid: ', json);
                return json.map((result: any) => {
                    return new BusinessProfile(result._source);
                });
            } else {
                return [];
            }
        });
    }
}