export interface orderDeliveryCostJSON {
    firstPiece: number,
    nextPiece: number
}

export interface userInfoJSON {
    firstName: string,
    lastName: string
}

export interface orderAdditionalDetailsJSON {
    delivery?: orderDeliveryCostJSON
}

export interface gbPaymentDetailsJSON {
    customerName: string,
    customerEmail: string,
    customerAddress: string,
    customerTelephone: string,
    [key: string]: string
}

export interface colorObjectJSON {
    value: string,
    label: string
}

export interface productValueJSON {
    size: string,
    price: number,
    sku: string,
    colorObj: colorObjectJSON,
    color: string
}

export interface selectedProductJSON {
    productName: string,
    productID: string,
    productNameWithoutColor: string,
    productValue: productValueJSON,
    productImage: string,
    availableQuantity?: number,
    originalQuantity?: number,
    isOutOfStock?: boolean,
    isLastQuantity?: boolean,
    isLastRemaining?: boolean,
    isDecreaseQuantity?: boolean
}

export interface paymentInfoJSON {
    method: string,
    status: string,
    details: string,
    referenceNo: string,
    pressedPayBtnTimestamp: Date,
    paymentCompletedOn: Date,
    gbPayLink: string,
    gbPaymentDetails: gbPaymentDetailsJSON,
    isFromBatchCheck?: boolean,
    batchCheckTimestamp?: Date
}

export interface deliveryInfoJSON {
    firstName: string,
    lastName: string,
    customerName: string,
    phoneNo: string,
    address1: string,
    address2: string,
    subDistrict: string,
    district: string,
    province: string,
    postalCode: string
}

export interface summaryJSON {
    totalDeliveryCost: number,
    totalPrice: number,
    grandTotal: number
}

export interface customFieldsJSON {
    [key: string]: any
}

export interface returningUserAdditionalDetailsJSON {
    [key: string]: any
}

export interface returningUserJSON {
    isReturningUser: boolean,
    additionalDetails?: returningUserAdditionalDetailsJSON
}

export interface channelInfoJSON {
    id: string,
    name: string
}

export interface discountInfoJSON {
    totalDeliveryCost: number,
    totalPrice: number,
    grandTotal: number
}

export interface IOrder {
    storeID: string,
    userID: string,
    userInfo: userInfoJSON,
    orderID: string,
    orderDate: number,
    recipientAccountType: string,
    orderAdditionalDetails: orderAdditionalDetailsJSON,
    selectedProduct: selectedProductJSON[],
    paymentInfo: paymentInfoJSON,
    deliveryInfo: deliveryInfoJSON,
    summary: summaryJSON,
    customFields: customFieldsJSON,
    cartID: string,
    channel: channelInfoJSON,
    discount?: discountInfoJSON
}