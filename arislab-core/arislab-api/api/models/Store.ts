import { AbstractPersistentModel } from "./AbstractPersistentModel";
import { ElasticsearchClient } from "../components/ElasticsearchClient";

import { businessProfileJSON } from "./BusinessProfile";
import { policiesJSON } from "./Policy";
import { paymentInfoJSON } from "./Payment";
import { deliveryJSON } from "./Delivery";
import { storeConfigJSON } from "./StoreConfig";
import { sha256 } from "js-sha256";

import { Log } from "../ts-utils/Log";
export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export interface ICompanyInfo {
  name: string;
  taxNumber: string;
  addressInfo: IAddress;
  registeredAddressInfo: IAddress;
}

export interface IPersonalInfo {
  name?: string;
  idCard?: string;
  addressInfo?: IAddress;
}

export interface IStorePackagePaymentInfo {
  paymentType: "CREDIT_CARD" | "BILLING";
}

export interface storeInfoJSON {
  businessProfile: businessProfileJSON;
  policies: policiesJSON;
  paymentInfo: paymentInfoJSON;
  delivery: deliveryJSON;
  companyInfo: ICompanyInfo;
  personalInfo: IPersonalInfo;
  storePackagePaymentInfo: IStorePackagePaymentInfo;
  config: storeConfigJSON;
}

export interface verifyInfoJSON {
  isVerified: boolean;
  verifiedAt: number;
  otpID: string;
}

export interface prototypeStoreJSONData {
  auth0_uid: string;
  email: string;
  storeID: string;
  storeInfo: storeInfoJSON;
  createdAt: number;
  registeredTimestamp: number;
  verifyInfo: verifyInfoJSON;
}

export class Store extends AbstractPersistentModel {
  public auth0_uid: string;
  public email: string;
  public storeID: string;
  public storeInfo: storeInfoJSON;
  public createdAt: number;
  public registeredTimestamp: number;
  public verifyInfo: verifyInfoJSON;

  constructor(json: prototypeStoreJSONData) {
    super(json.storeID);
    this.auth0_uid = json.auth0_uid;
    this.email = json.email;
    this.storeID = json.storeID;
    this.createdAt = Date.now();
    this.registeredTimestamp = json.registeredTimestamp || 0;
    this.verifyInfo = {
      isVerified: false,
      verifiedAt: 0,
      otpID: "",
    };
    this.storeInfo = json.storeInfo;
  }

  doUpdate(json: prototypeStoreJSONData): boolean {
    return true;
  }

  private static readonly TYPE = "store";
  protected getType(): string {
    return Store.TYPE;
  }

  public toJSON(): prototypeStoreJSONData {
    return {
      auth0_uid: this.auth0_uid,
      email: this.email,
      storeID: this.storeID,
      storeInfo: this.storeInfo,
      createdAt: this.createdAt,
      registeredTimestamp: this.registeredTimestamp,
      verifyInfo: this.verifyInfo,
    };
  }

  public static findStoreByAuth0UID(auth0_uid: string): Promise<{}> {
    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              term: { "auth0_uid.keyword": auth0_uid },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return { found: true };
        } else {
          return { found: false };
        }
      });
  }

  public static findStoreByEmail(email: string): Promise<{}> {
    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              term: { "email.keyword": email },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return { found: true };
        } else {
          return { found: false };
        }
      });
  }

  public static findStoreIDByEmail(email: string): Promise<{}> {
    Log.debug("findStoreByEmail searching with email ", email);

    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              term: { "email.keyword": email },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        Log.debug("founded with json ", json);
        if (json && json.length > 0) {
          return json.map((resultJSON: any) => {
            return {
              email: resultJSON._source.email,
              storeID: resultJSON._source.storeID,
              createdAt: resultJSON._source.createdAt,
              registeredTimestamp: resultJSON._source.registeredTimestamp,
            };
          });
        } else {
          return [];
        }
      });
  }

  public static findStoreIDByAuth0UID(auth0_uid: string): Promise<{}> {
    Log.debug("findStoreIDByAuth0UID searching with auth0_uid ", auth0_uid);

    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              term: { "auth0_uid.keyword": auth0_uid },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        Log.debug("founded with json ", json);
        if (json && json.length > 0) {
          return json.map((resultJSON: any) => {
            return {
              auth0_uid: resultJSON._source.auth0_uid,
              email: resultJSON._source.email,
              storeID: resultJSON._source.storeID,
              config: {
                enabledEditProductHashtag: !!resultJSON._source.storeInfo.config
                  .enabledEditProductHashtag,
                enabledReserveProduct: !!resultJSON._source.storeInfo.config
                  .enabledReserveProduct,
              },
              paymentInfo: {
                useBusinessWithdraw: !!resultJSON._source.storeInfo.paymentInfo
                  .useBusinessWithdraw,
              },
              createdAt: resultJSON._source.createdAt,
              registeredTimestamp: resultJSON._source.registeredTimestamp,
            };
          });
        } else {
          return [];
        }
      });
  }

  public static findAllStore(): Promise<prototypeStoreJSONData[]> {
    let searchQuery = {
      query: {
        match_all: {},
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return json.map((resultJSON: prototypeStoreJSONData) => {
            return resultJSON;
          });
        } else {
          return [];
        }
      })
      .catch((error: any) => {
        Log.error("Error while finding all store : ", error);
        throw error;
      });
  }

  public static findStoreIDByPinCode(pinCode: string): Promise<{}> {
    Log.debug(
      "findStoreByPinCode searching with pincode " +
        pinCode +
        " (" +
        sha256(pinCode) +
        ")"
    );

    let searchQuery = {
      query: {
        bool: {
          must: [
            { term: { "verifyInfo.pinCode.keyword": sha256(pinCode) } },
            { term: { "verifyInfo.isVerified": true } },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        Log.debug("founded with json ", json);
        if (json && json.length > 0) {
          return json.map((resultJSON: any) => {
            return {
              storeID: resultJSON._source.storeID,
            };
          });
        } else {
          return [];
        }
      });
  }

  public static findStoreIDByPaymentInfo(
    bankCode: string,
    accountNumber: string
  ): Promise<{}> {
    Log.debug(
      `findStoreByPaymentInfo searching with bankCode: ${bankCode}, and accountNumber: ${accountNumber}`
    );

    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              term: { "storeInfo.paymentInfo.bank.bankCode.keyword": bankCode },
            },
            {
              term: {
                "storeInfo.paymentInfo.accountNumber.keyword": accountNumber,
              },
            },
            { term: { "storeInfo.paymentInfo.verifyInfo.isVerified": true } },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        Log.debug("founded with json ", json);
        if (json && json.length > 0) {
          return json.map((resultJSON: any) => {
            return {
              storeID: resultJSON._source.storeID,
            };
          });
        } else {
          return [];
        }
      });
  }

  public static findByCustomFields(
    fieldArray: Array<{ fieldName: string; fieldValue: string }>
  ): Promise<Store[]> {
    Log.debug("Finding store by customfields with ", fieldArray);

    let searchQuery: { [key: string]: any } = {
      query: {
        bool: {
          must: [],
        },
      },
    };

    fieldArray.forEach((fieldObj) => {
      const queryToPush = {
        match: { [fieldObj["fieldName"]]: fieldObj["fieldValue"] },
      };
      searchQuery["query"]["bool"]["must"].push(queryToPush);
    });

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        if (json && json.length > 0) {
          return json.map((result: any) => {
            Log.debug("Result findByCustomFields is ", result);
            return new Store(result._source);
          });
        } else {
          return [];
        }
      });
  }
}
