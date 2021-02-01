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

export interface IDelivery {
    storeID: string,
    storeInfo: storeInfoJSON
}