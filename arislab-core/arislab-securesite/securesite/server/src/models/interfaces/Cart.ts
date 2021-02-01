export interface ISummaryJSON {
    totalDeliveryCost: number,
    totalPrice: number,
    grandTotal: number
}

export interface IDeliveryCostJSON {
    firstPiece: number,
    nextPiece: number
}

export interface IColorObjectJSON {
    value: string,
    label: string
}

export interface IProductValueJSON {
    size: string,
    price: number,
    sku: string,
    colorObj: IColorObjectJSON,
    color: string
}

export interface IShippingRateJSON {
    firstpiece: number,
    nextpiece: number
}

export interface ISelectedProductJSON {
    productName: string,
    productID: string,
    productHashtag: string,
    productNameWithoutColor: string,
    productValue: IProductValueJSON,
    productImage: string,
    productType?: string,
    shippingRate: IShippingRateJSON,
    originalQuantity?: number,
    availableQuantity?: number,
    stringify?: string
}

export interface IUserInfo {
    firstName: string,
    lastName: string
}

export interface IChannelInfo {
    id: string,
    name: string
}

export interface IDiscountInfo {
    totalDeliveryCost: number,
    totalPrice: number,
    grandTotal: number
}

export interface ICart {
    cartID: string,
    storeID: string,
    userID: string,
    userInfo: IUserInfo,
    createdAt: Date,
    selectedProduct: ISelectedProductJSON[],
    deliveryCost: IDeliveryCostJSON,
    isOneClickBuy: boolean,
    status: string,
    closedAt: Date,
    summary?: ISummaryJSON,
    channel?: IChannelInfo,
    discount?: IDiscountInfo
}