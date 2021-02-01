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
  taxInvoiceNumber: string;
  invoiceAddress: string;
  branchId: string;
  branchName: string;
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
  createdAt?: number;
  updatedAt?: number;
}
