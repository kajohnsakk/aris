import { AbstractPersistentModel } from "./AbstractPersistentModel";
import { ElasticsearchClient } from "../components/ElasticsearchClient";

import { Log } from "../ts-utils/Log";

export interface IAddressDetails {
  district: string;
  subDistrict: string;
  province: string;
  postalCode: string;
}

export interface IUserInfo {
  firstName: string;
  lastName: string;
}

export interface ITaxInvoiceDetails {
  personType: string;
  businessType: string;
  businessName: string;
  branchName: string;
  branchId: string;
  taxInvoiceNumber: string;
  invoiceAddress: string;
}

export interface ICustomer {
  storeID: string;
  userID: string;
  userInfo: IUserInfo;
  customerName: string;
  customerEmail: string;
  customerPhoneNo: string;
  customerAddress: string;
  customerAddressDetails: IAddressDetails;
  customerTaxInvoiceDetails: ITaxInvoiceDetails;
  isEnableTaxInvoice: Boolean;
  isVoted: Boolean;
  createdAt: number;
  updatedAt: number;
}

export class Customer extends AbstractPersistentModel {
  public storeID: string;
  public userID: string;
  public userInfo: IUserInfo;
  public customerName: string;
  public customerEmail: string;
  public customerPhoneNo: string;
  public customerAddress: string;
  public customerAddressDetails: IAddressDetails;
  public customerTaxInvoiceDetails: ITaxInvoiceDetails;
  public isEnableTaxInvoice: Boolean;
  public isVoted: Boolean;
  public createdAt: number;
  public updatedAt: number;

  constructor(json: ICustomer, userID?: string) {
    if (!json.hasOwnProperty("customerAddressDetails")) {
      json.customerAddressDetails = {
        district: "",
        subDistrict: "",
        province: "",
        postalCode: "",
      };
    }

    super(userID);
    this.storeID = json.storeID;
    this.userID = json.userID;
    this.userInfo = json.userInfo;
    this.customerName = json.customerName;
    this.customerEmail = json.customerEmail;
    this.customerPhoneNo = json.customerPhoneNo;
    this.customerAddress = json.customerAddress || "";
    this.customerAddressDetails = json.customerAddressDetails;
    this.customerTaxInvoiceDetails = json.customerTaxInvoiceDetails;
    this.isVoted = json.isVoted;
    this.isEnableTaxInvoice = json.isEnableTaxInvoice;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }

  doUpdate(json: ICustomer): boolean {
    return true;
  }

  private static readonly TYPE = "customer";
  protected getType(): string {
    return Customer.TYPE;
  }

  public toJSON(): any {
    return {
      storeID: this.storeID,
      userID: this.userID,
      userInfo: this.userInfo,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhoneNo: this.customerPhoneNo,
      customerAddress: this.customerAddress,
      customerAddressDetails: this.customerAddressDetails,
      customerTaxInvoiceDetails: this.customerTaxInvoiceDetails,
      isEnableTaxInvoice: this.isEnableTaxInvoice,
      isVoted: this.isVoted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static getCustomerDetails(userID: string) {
    return ElasticsearchClient.getInstance()
      .get(this.TYPE, userID)
      .then((resultCustomerDetails: any) => {
        Log.debug("resultCustomerDetails", resultCustomerDetails);
        return new Customer(
          resultCustomerDetails,
          resultCustomerDetails["userID"]
        );
      })
      .catch((err) => {
        Log.error("Error while getting customer details: ", err);
        throw err;
      });
  }

  public static checkCustomerExists(storeID: string, userID: string) {
    let searchQuery = {
      query: {
        bool: {
          must: [
            { match: { "storeID.keyword": storeID } },
            { match: { "userID.keyword": userID } },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((resultCheckCustomerExists: any) => {
        Log.debug("resultCheckCustomerExists", resultCheckCustomerExists);
        if (resultCheckCustomerExists && resultCheckCustomerExists.length > 0) {
          let result = resultCheckCustomerExists.map(
            (result: { [key: string]: any }) => {
              return new Customer(result._source, result._id);
            }
          );
          return { exists: true, result: result };
        } else {
          return { exists: false, result: [] };
        }
      })
      .catch((err) => {
        Log.debug("Error while checking customer exists: ", err);
        throw err;
      });
  }
}
