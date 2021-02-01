import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient, ElasticsearchQueryResultDocument } from '../components/ElasticsearchClient';
import { Product, JSONData as ProductInterface } from './Product';
import { Delivery, JSONData as DeliveryInterface } from './Delivery';

import { Log } from '../ts-utils/Log';

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
    disableAddress?: boolean,
    isVoucher?: boolean
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

export class Cart extends AbstractPersistentModel {
    public cartID: string;
    public storeID: string;
    public userID: string;
    public userInfo: IUserInfo;
    public createdAt: Date;
    public selectedProduct: ISelectedProductJSON[];
    public deliveryCost: IDeliveryCostJSON;
    public isOneClickBuy: boolean;
    public status: string;
    public closedAt: Date;
    public summary: ISummaryJSON;
    public channel: IChannelInfo;
    public discount: IDiscountInfo;

    constructor(json: ICart, cartID?: string, summary?: ISummaryJSON) {
        super(cartID);
        this.cartID = json.cartID;
        this.storeID = json.storeID;
        this.userID = json.userID;
        this.userInfo = json.userInfo;
        this.createdAt = json.createdAt;
        this.deliveryCost = json.deliveryCost;
        this.isOneClickBuy = json.isOneClickBuy;
        this.selectedProduct = json.selectedProduct;
        this.status = json.status;
        this.closedAt = json.closedAt;
        this.summary = summary;
        this.channel = json.channel;
        this.discount = json.discount;
    }

    doUpdate(json: ICart): boolean {
        return true;
    }

    private static readonly TYPE = "cart";
    protected getType(): string {
        return Cart.TYPE;
    }

    public toJSON(): ICart {
        return {
            cartID: this.cartID,
            storeID: this.storeID,
            userID: this.userID,
            userInfo: this.userInfo,
            createdAt: this.createdAt,
            deliveryCost: this.deliveryCost,
            isOneClickBuy: this.isOneClickBuy,
            selectedProduct: this.selectedProduct,
            status: this.status,
            closedAt: this.closedAt,
            summary: this.summary,
            channel: this.channel,
            discount: this.discount
        };
    }

    public static getCartDetails(cartID: string) {
        Log.debug('[Cart] Getting cart details with cartID: ' + cartID);
        return ElasticsearchClient.getInstance().get(this.TYPE, cartID)
            .then(async (resultCartDetails: any) => {
                Log.debug('[Cart] resultCartDetails', resultCartDetails);
                let summaryObj = await this.createSummaryObj(resultCartDetails);
                return new Cart(resultCartDetails, resultCartDetails['cartID'], summaryObj);
            })
            .catch((err) => {
                Log.error('Error while getting cart details: ', err);
                throw err;
            });
    }

    public static checkDeliveryFieldsConditions(cartDetails: ICart) {
        return cartDetails.hasOwnProperty('deliveryCost') &&
            cartDetails.deliveryCost.hasOwnProperty('firstPiece') &&
            cartDetails.deliveryCost.hasOwnProperty('nextPiece')
    }

    public static checkDiscount(cartDetails: ICart) {
        return cartDetails.hasOwnProperty('discount') &&
            cartDetails.discount.hasOwnProperty('totalDeliveryCost') &&
            cartDetails.discount.hasOwnProperty('totalPrice') &&
            cartDetails.discount.hasOwnProperty('grandTotal')
    }

    public static async createSummaryObj(cartDetails: ICart) {
        let totalQuantity: number = 0;
        let totalPrice: number = 0;
        let totalDeliveryCost: number = 0;
        let grandTotal: number = 0;
        let maxFirstPieceCost: number = 0;
        let maxFirstPieceCostIndex: number = 0;

        let products = cartDetails.selectedProduct
        for (let i = 0; i < products.length; i++) {
            let selectedProductItem = products[i];
            let selectedProductIndex = i;
            let product: ProductInterface[] = await Product.findProductById(cartDetails.storeID, selectedProductItem.productID);
            let productInfo = null;
            if (product[0]) {
                productInfo = product[0].productInfo;
            }
            if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate) {
                let productShippingRate = productInfo.shippingRate;
                if (Number(productShippingRate.firstpiece) > Number(maxFirstPieceCost)) {
                    maxFirstPieceCost = Number(productShippingRate.firstpiece)
                    maxFirstPieceCostIndex = Number(selectedProductIndex)
                }
            } else {
                if (this.checkDeliveryFieldsConditions(cartDetails)) {
                    let deliveryCost = await Delivery.findById(cartDetails.storeID);
                    cartDetails.deliveryCost.firstPiece = Number(deliveryCost.storeInfo.delivery.price.firstPiece);
                    cartDetails.deliveryCost.nextPiece = Number(deliveryCost.storeInfo.delivery.price.additionalPiece);
                    let price = cartDetails.deliveryCost
                    if (Number(price.firstPiece) > Number(maxFirstPieceCost)) {
                        maxFirstPieceCost = Number(price.firstPiece)
                        maxFirstPieceCostIndex = Number(selectedProductIndex)
                    }
                }
            }
        }

        for (let i = 0; i < products.length; i++) {
            let selectedProductItem = products[i];
            let selectedProductIndex = i;
            totalQuantity += Number(selectedProductItem.availableQuantity);
            totalPrice += Number(selectedProductItem.productValue.price) * Number(selectedProductItem.availableQuantity);

            let product: ProductInterface[] = await Product.findProductById(cartDetails.storeID, selectedProductItem.productID);
            let productInfo = null;
            if (product[0]) {
                productInfo = product[0].productInfo;
            }
            if (selectedProductIndex === maxFirstPieceCostIndex) {
                if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate) {
                    let productShippingRate = productInfo.shippingRate;
                    totalDeliveryCost += Number(productShippingRate['firstpiece']) + Number(productShippingRate['nextpiece']) * Number(selectedProductItem.availableQuantity - 1)
                }
                else
                    if (this.checkDeliveryFieldsConditions(cartDetails)) {
                        let deliveryCost = await Delivery.findById(cartDetails.storeID);
                        cartDetails.deliveryCost.firstPiece = Number(deliveryCost.storeInfo.delivery.price.firstPiece);
                        cartDetails.deliveryCost.nextPiece = Number(deliveryCost.storeInfo.delivery.price.additionalPiece);
                        let price = cartDetails.deliveryCost
                        totalDeliveryCost += Number(price.firstPiece) + Number(price.nextPiece) * Number(selectedProductItem.availableQuantity - 1)
                    }
            } else {
                if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate) {
                    let productShippingRate = productInfo.shippingRate;
                    totalDeliveryCost += Number(productShippingRate['nextpiece']) * Number(selectedProductItem.availableQuantity)
                }
                else
                    if (this.checkDeliveryFieldsConditions(cartDetails)) {
                        let deliveryCost = await Delivery.findById(cartDetails.storeID);
                        cartDetails.deliveryCost.firstPiece = Number(deliveryCost.storeInfo.delivery.price.firstPiece);
                        cartDetails.deliveryCost.nextPiece = Number(deliveryCost.storeInfo.delivery.price.additionalPiece);
                        let price = cartDetails.deliveryCost
                        totalDeliveryCost += Number(price.nextPiece) * Number(selectedProductItem.availableQuantity)
                    }
            }
        };

        grandTotal = totalPrice + totalDeliveryCost;

        if (grandTotal > 0) {
            if (this.checkDiscount(cartDetails)) {
                let totalDiscount = Number(cartDetails['discount']['grandTotal']);
                grandTotal = grandTotal - totalDiscount;

                if (grandTotal <= 0) grandTotal = 1;
            }
        }

        return Promise.resolve({
            totalQuantity: totalQuantity,
            totalDeliveryCost: totalDeliveryCost,
            totalPrice: totalPrice,
            grandTotal: grandTotal
        })
    }

    public static checkUserCartExists(userID: string, isOneClickBuy: boolean) {
        const searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        { "match": { "userID.keyword": userID } },
                        { "match": { "status.keyword": "OPEN" } },
                        { "match": { "isOneClickBuy": isOneClickBuy } }
                    ]
                }
            }
        }

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then((resultCheckUserCartExists: any) => {
                Log.debug('[Cart] resultCheckUserCartExists', resultCheckUserCartExists);
                if (resultCheckUserCartExists && resultCheckUserCartExists.length > 0) {
                    let result = resultCheckUserCartExists.map((result: { [key: string]: any }) => {
                        return new Cart(result._source, result._id)
                    });
                    return { "exists": true, "result": result }
                } else {
                    return { "exists": false, "result": [] };
                }
            })
            .catch((err) => {
                Log.debug('[Cart] Error while checking user cart exists: ', err);
                throw err;
            });
    }

    public static findIndexOfExistsItem(productInfo: ISelectedProductJSON, cartSelectedProduct: ISelectedProductJSON[]) {
        let indexOfExistsItem;
        let filterObj = {};

        if (productInfo['productType'] === "SINGLE" || productInfo['productType'] === "VOUCHER") {
            // If product type in productInfo is SINGLE, filter it by their own productID
            filterObj = { productID: productInfo['productID'] };
            Log.debug('[Cart] [findIndexOfExistsItem] productInfo param is SINGLE, filtering product with: ', filterObj);

            indexOfExistsItem = cartSelectedProduct.findIndex((item: ISelectedProductJSON) => {
                return productInfo['productID'] === item['productID'];
            });
        } else if (productInfo['productType'] === "COLOR_ONLY") {
            // If product type in productInfo is COLOR_ONLY, filter it by their own productID and color value
            filterObj = {
                productID: productInfo['productID'],
                color: productInfo['productValue']['colorObj']['value']
            };
            Log.debug('[Cart] [findIndexOfExistsItem] productInfo param is COLOR_ONLY, filtering product with: ', filterObj);

            indexOfExistsItem = cartSelectedProduct.findIndex((item: ISelectedProductJSON) => {
                return productInfo['productID'] === item['productID'] &&
                    productInfo['productValue']['colorObj']['value'] === item['productValue']['colorObj']['value'];
            });
        } else if (productInfo['productType'] === "MULTI") {
            // If product type in productInfo is COLOR_ONLY, filter it by their own productID, color value and size
            filterObj = {
                productID: productInfo['productID'],
                color: productInfo['productValue']['colorObj']['value'],
                size: productInfo['productValue']['size']
            }
            Log.debug('[Cart] [findIndexOfExistsItem] productInfo param is MULTI, filtering product with: ', filterObj);

            indexOfExistsItem = cartSelectedProduct.findIndex((item: ISelectedProductJSON) => {
                return productInfo['productID'] === item['productID'] &&
                    productInfo['productValue']['colorObj']['value'] === item['productValue']['colorObj']['value'] &&
                    productInfo['productValue']['size'] === item['productValue']['size'];
            });
        }

        return {
            filterResults: indexOfExistsItem,
            filterObj: filterObj
        };
    }

    public static async updateItemInCart(cartID: string, productInfo: ISelectedProductJSON, increaseOrDecrease: string) {
        try {
            Log.debug('[Cart] Updating item in cartID: ' + cartID + ' with productInfo: ', productInfo);

            let cartInfo = await this.getCartDetails(cartID);
            let cartSelectedProduct = cartInfo['selectedProduct'];
            let objIndexOfExistsItem: { [key: string]: any };
            let indexOfExistsItem;

            if (cartSelectedProduct.length > 0) {
                objIndexOfExistsItem = this.findIndexOfExistsItem(productInfo, cartSelectedProduct);
                indexOfExistsItem = objIndexOfExistsItem['filterResults'];
            }

            if (indexOfExistsItem >= 0) {
                // If this productID has already exists in selectedProduct, update quantity instead
                Log.debug('[Cart] Product with these conditions: ', objIndexOfExistsItem['filterObj'], ' has already in the cart, updating quantity with mode ' + increaseOrDecrease + ' instead...');
                let cartSelectedProductWithItemIndex = cartSelectedProduct[indexOfExistsItem];
                if (increaseOrDecrease === "INCREASE") {
                    cartSelectedProductWithItemIndex['originalQuantity'] += 1;
                    cartSelectedProductWithItemIndex['availableQuantity'] += 1;
                } else if (increaseOrDecrease === "DECREASE") {
                    cartSelectedProductWithItemIndex['originalQuantity'] -= 1;
                    cartSelectedProductWithItemIndex['availableQuantity'] -= 1;
                    cartSelectedProductWithItemIndex['originalQuantity'] = cartSelectedProductWithItemIndex['availableQuantity'];
                }
                cartSelectedProduct[indexOfExistsItem] = cartSelectedProductWithItemIndex;
            } else {
                // This productID never exists in selectedProduct? Just push it into selectedProduct
                Log.debug('[Cart] Adding product info: ', productInfo, ' into the cart');
                cartSelectedProduct.push(productInfo);
            }

            let updateData: ICart = cartInfo
            updateData['selectedProduct'] = cartSelectedProduct;

            let cartObj = new Cart(updateData, cartID);
            return cartObj.save()
                .then(() => { return { "status": "success" } })
                .catch(() => { return { "status": "failed" } });

        } catch (err) {
            Log.error('Error while updating item in cart: ', err);
            return Promise.reject(err);
        }
    }

    public static async updateProductDataInCart(cartID: string, productInfo: ISelectedProductJSON) {
        try {
            Log.debug('[Cart] Updating item in cartID: ' + cartID + ' with productInfo: ', productInfo);

            let cartInfo = await this.getCartDetails(cartID);
            let cartSelectedProduct = cartInfo['selectedProduct'];
            let objIndexOfExistsItem: { [key: string]: any };
            let indexOfExistsItem;

            if (cartSelectedProduct.length > 0) {
                objIndexOfExistsItem = this.findIndexOfExistsItem(productInfo, cartSelectedProduct);
                indexOfExistsItem = objIndexOfExistsItem['filterResults'];
            }

            if (indexOfExistsItem >= 0) {
                // If this productID has already exists in selectedProduct, update quantity instead
                Log.debug('[Cart] Product with these conditions: ', objIndexOfExistsItem['filterObj'], ' has already in the cart, updating product data with ', productInfo);
                cartSelectedProduct[indexOfExistsItem] = productInfo;
            } else {
                // This productID never exists in selectedProduct? Just push it into selectedProduct
                Log.debug('[Cart] Adding product info: ', productInfo, ' into the cart');
                cartSelectedProduct.push(productInfo);
            }

            let updateData: ICart = cartInfo
            updateData['selectedProduct'] = cartSelectedProduct;

            let cartObj = new Cart(updateData, cartID);
            return cartObj.save()
                .then(() => { return { "status": "success" } })
                .catch(() => { return { "status": "failed" } });

        } catch (err) {
            Log.error('Error while updating item in cart: ', err);
            return Promise.reject(err);
        }
    }

    public static async removeItemFromCart(cartID: string, productInfoToRemove: ISelectedProductJSON) {
        try {
            Log.debug('[Cart] Removing item from cartID: ' + cartID + ' with productInfo: ', productInfoToRemove);

            let cartInfo = await this.getCartDetails(cartID);
            let cartSelectedProduct = cartInfo['selectedProduct'];
            let objIndexOfExistsItem: { [key: string]: any };
            let indexOfExistsItem;

            if (cartSelectedProduct.length > 0) {
                objIndexOfExistsItem = this.findIndexOfExistsItem(productInfoToRemove, cartSelectedProduct);
                indexOfExistsItem = objIndexOfExistsItem['filterResults'];
            }

            if (indexOfExistsItem >= 0) {
                cartSelectedProduct.splice(indexOfExistsItem, 1);
            }

            let updateData = cartInfo;
            updateData['selectedProduct'] = cartSelectedProduct;

            let cartObj = new Cart(updateData, cartID);
            return cartObj.save()
                .then(() => { return { "status": "success" }; })
                .catch(() => { return { "status": "failed" }; });

        } catch (error) {
            Log.error('Error while removing item from cart: ', error);
            return Promise.reject(error);
        }
    }

}