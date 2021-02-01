export interface IVariationDetails {
    color: string,
    size: string
}

export interface IAddressDetails {
    district: string,
    subDistrict: string,
    province: string,
    postalCode: string
}

export interface IUserInfo {
    firstName: string,
    lastName: string
}

export interface ICustomerInfo {
    userID: string,
    userInfo: IUserInfo,
    customerName: string,
    customerEmail: string,
    customerPhoneNo: string,
    customerAddress: string,
    customerAddressDetails: IAddressDetails
}

export interface IProductBooking {
    productBookingID?: string,
    cartID: string,
    productID: string,
    hasVariation: boolean,
    variationDetails: IVariationDetails,
    customerInfo: ICustomerInfo,
    quantity: number,
    startTimestamp?: number,
    endTimestamp?: number,
    createdAt?: number,
    isDeleted?: boolean,
    deletedAt?: number
}