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

export interface policiesJSON {
    privacyPolicy?: string,
    returnRefundPolicy?: string,
    shippingPolicy?: string,
    cancellationPolicy?: string
}

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

export interface priceJSON {
    firstPiece?: string,
    additionalPiece?: string
}

export interface deliveryJSON {
    // chargeType?: chargeTypeJSON,
    price?: priceJSON
}

export interface storeConfigJSON {
    useCart?: boolean,
    useCashOnDelivery?: boolean,
    useCreditCard?: boolean,
    useLastReply?: boolean,
    lastReplyMessage?: string
}

export interface storeInfoJSON {
    businessProfile: businessProfileJSON,
    policies: policiesJSON,
    paymentInfo: paymentInfoJSON,
    delivery: deliveryJSON,
    config: storeConfigJSON
}

export interface verifyInfoJSON {
    isVerified: boolean,
    verifiedAt: number,
    otpID: string
}

export interface IStore {
    auth0_uid: string,
    email: string,
    storeID: string,
    storeInfo: storeInfoJSON,
    createdAt: number,
    registeredTimestamp: number,
    verifyInfo: verifyInfoJSON
}