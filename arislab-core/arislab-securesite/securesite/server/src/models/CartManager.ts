import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { CustomerManager } from './CustomerManager';
import { ICart, ISelectedProductJSON } from './interfaces/Cart';
import { IDelivery } from './interfaces/Delivery';

export class CartManager {
    public static async getCartDetails(cartID: string) {
        Log.debug('[CartManager] Getting cart details of cartID: ' + cartID);
        try {
            let resultCartDetails = await ApiProxy.getInstance().sendRequest("GET", `/cart/details?cartID=${cartID}`);

            resultCartDetails['selectedProductLength'] = resultCartDetails['selectedProduct'].length;

            if (resultCartDetails['selectedProductLength'] > 0) {
                // Check cart item first. Some item data maybe change.
                resultCartDetails = await this.checkAllCartItem(resultCartDetails);

                resultCartDetails['productStaticInfo'] = resultCartDetails['selectedProduct'].map((selectedProductStaticInfo: any) => {
                    if (
                        selectedProductStaticInfo.hasOwnProperty('productValue') &&
                        selectedProductStaticInfo.productValue.hasOwnProperty('size') &&
                        selectedProductStaticInfo['productValue']['size'] === "__COLOR_ONLY__"
                    ) {
                        selectedProductStaticInfo['productValue']['size'] = "";
                    }
                    return selectedProductStaticInfo;
                });

                resultCartDetails['disableAddress'] = true;

                // If resultShouldEnableAddress return more than one, will enable address
                const resultShouldEnableAddress = resultCartDetails['selectedProduct'].filter((selectedProduct: any) => {
                    return selectedProduct.disableAddress === false;
                });

                if (resultShouldEnableAddress.length > 0) {
                    resultCartDetails['disableAddress'] = false;
                }
            }

            resultCartDetails['hasDiscount'] = this.hasDiscount(resultCartDetails);

            Log.debug('[CartManager] Cart details of cartID: ', resultCartDetails);
            return Promise.resolve(resultCartDetails);
        }
        catch (err) {
            Log.error('[CartManager] Error while getting cart details: ', err);
            return Promise.reject(err);
        }
    }

    public static async checkProductInventory(storeID: string, productID: string, color?: string, size?: string) {
        try {
            const resultCheckProductInventory = await ApiProxy.getInstance().sendRequest("POST", `/product/storeID/${storeID}/product/${productID}/checkInventory`, {
                color: color,
                size: size
            });
            return Promise.resolve(resultCheckProductInventory);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    public static async checkProductBookingInventory(productID: string, color?: string, size?: string) {
        try {
            const resultCheckProductBookingInventory = await ApiProxy.getInstance().sendRequest("POST", `/productBooking/product/${productID}/checkInventory`, {
                color: color,
                size: size
            });
            return Promise.resolve(resultCheckProductBookingInventory);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    public static async checkAllCartItem(cartDetails: ICart) {
        try {
            return new Promise(async (resolve, reject) => {
                let cartID = cartDetails['cartID'];
                let selectedProduct = cartDetails['selectedProduct'];
                for (let i = 0; i < selectedProduct.length; i++) {
                    let product = selectedProduct[i];
                    Log.debug('[CartManager] checking productID ' + product['productID'] + ' is out of stock or not');
                    let productColor = "";
                    let productSize = "";

                    if (
                        product['productValue']['colorObj'].hasOwnProperty('value') &&
                        product['productValue']['colorObj']['value']
                    ) {
                        productColor = product['productValue']['colorObj']['value'];
                    }

                    if (product['productValue']['size']) {
                        productSize = product['productValue']['size'];
                    }

                    if (cartDetails['status'] === 'OPEN') {
                        // ตะกร้ายังไม่ได้ชำระเงิน

                        let remainingStock = await this.checkProductInventory(cartDetails['storeID'], product['productID'], productColor, productSize);
                        Log.debug('[CartManager] productID ' + product['productID'] + ' total remaining stock is: ', remainingStock)
                        let bookingStock = await this.checkProductBookingInventory(product['productID'], productColor, productSize);
                        Log.debug('[CartManager] productID ' + product['productID'] + ' total booking stock is: ', bookingStock)

                        let originalQuantity = product['originalQuantity'];
                        let availableQuantity = originalQuantity;
                        if (remainingStock['stock'] < originalQuantity) {
                            availableQuantity = remainingStock['stock'];
                        }
                        if (remainingStock['stock'] - bookingStock['stock'] < originalQuantity) {
                            availableQuantity = remainingStock['stock'] - bookingStock['stock'];
                        }
                        
                        if (availableQuantity < 0) {
                            availableQuantity = 0;
                        }

                        product['availableQuantity'] = availableQuantity;
                        // Update available quantity...
                        await this.updateCartProductData(cartID, product);

                        product['stringify'] = JSON.stringify(product);
                        product['isOutOfStock'] = false;
                        product['isLastQuantity'] = false;
                        product['isLastRemaining'] = false;
                        product['isDecreaseQuantity'] = false;
                        product['isPaidOrder'] = false;
                        product['isQuantityOne'] = false;

                        if (originalQuantity === 1) {
                            product['isQuantityOne'] = true;
                        }

                        if (remainingStock['stock'] - bookingStock['stock'] === 1) {
                            product['isLastQuantity'] = true;
                        }

                        if (remainingStock['stock'] - bookingStock['stock'] <= 0) {
                            product['isOutOfStock'] = true;
                        }

                        if (product['originalQuantity'] - product['availableQuantity'] !== 0) {
                            product['isDecreaseQuantity'] = true;
                        }

                        if (product['originalQuantity'] === remainingStock['stock']) {
                            product['isLastRemaining'] = true;
                        }
                    } else {
                        // ตะกร้าชำระเงินแล้ว ไม่ต้องคำนวณ stock

                        product['stringify'] = JSON.stringify(product);

                        product['isOutOfStock'] = false;
                        product['isLastQuantity'] = false;
                        product['isLastRemaining'] = false;
                        product['isDecreaseQuantity'] = false;
                        product['isPaidOrder'] = true;
                    }

                }
                cartDetails['summary'] = await this.createSummaryObj(cartDetails);
                resolve(cartDetails);

            })
        } catch (error) {
            Log.error('[CartManager] Error while checking all cart item ', error);
            return Promise.reject(error)
        }
    }

    public static async checkUserCartExists(userID: string, isOneClickBuy?: boolean) {
        try {
            const resultCheckUserCartExists = await ApiProxy.getInstance().sendRequest("POST", `/cart/checkUserCartExists`, {
                userID: userID,
                oneClickBuy: isOneClickBuy
            });
            return Promise.resolve(resultCheckUserCartExists);
        } catch (error) {
            Log.error('[CartManager] Error while checking user cart exists or not ', error);
            return Promise.reject(error)
        }
    }

    public static async updateCartItem(cartID: string, productInfo: ISelectedProductJSON, increaseOrDecrease: string) {
        try {
            const resultUpdateCartItem = await ApiProxy.getInstance().sendRequest("POST", `/cart/updateCartItem?cartID=${cartID}&mode=${increaseOrDecrease}`, productInfo);
            return Promise.resolve(resultUpdateCartItem);
        } catch (error) {
            Log.error('[CartManager] Error while updating cart item: ', error);
            return Promise.reject(error);
        }
    }

    public static async updateCartProductData(cartID: string, productInfo: ISelectedProductJSON) {
        try {
            const resultUpdateCartProductData = await ApiProxy.getInstance().sendRequest("POST", `/cart/updateCartProductData?cartID=${cartID}`, productInfo);
            return Promise.resolve(resultUpdateCartProductData);
        } catch (error) {
            Log.error('[CartManager] Error while updating cart product data: ', error);
            return Promise.reject(error);
        }
    }

    public static async removeCartItem(cartID: string, productInfo: ISelectedProductJSON) {
        try {
            const resultRemoveCartItem = await ApiProxy.getInstance().sendRequest("POST", `/cart/removeCartItem?cartID=${cartID}`, productInfo);
            return Promise.resolve(resultRemoveCartItem);
        } catch (error) {
            Log.error('[CartManager] Error while removing cart item: ', error);
            return Promise.reject(error);
        }
    }

    private static checkDeliveryFieldsConditions(cartDetails: ICart) {
        return cartDetails.hasOwnProperty('deliveryCost') &&
            cartDetails.deliveryCost.hasOwnProperty('firstPiece') &&
            cartDetails.deliveryCost.hasOwnProperty('nextPiece');
    }

    public static async createSummaryObj(cartDetails: ICart) {
        try {
            Log.debug('[CartManager] Creating summary object...');
            let totalQuantity: number = 0;
            let totalPrice: number = 0;
            let totalDeliveryCost: number = 0;
            let grandTotal: number = 0;
            let maxFirstPieceCost: number = 0;
            let maxFirstPieceCostIndex: number = 0;

            let products = cartDetails.selectedProduct
            for (let i = 0; i < products.length; i++){
                let selectedProductItem = products[i]
                let selectedProductIndex = i
                let product = await ApiProxy.getInstance().sendRequest("GET", `/product/productID/${selectedProductItem.productID}/`)
                let productInfo = null
                if(product){
                    productInfo = product.productInfo
                }
                if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate){
                    let productShippingRate = product.productInfo.shippingRate
                    if(Number(productShippingRate.firstpiece) > Number(maxFirstPieceCost)){
                        maxFirstPieceCost = Number(productShippingRate.firstpiece)
                        maxFirstPieceCostIndex = Number(selectedProductIndex)
                    }
                } else {
                    if(this.checkDeliveryFieldsConditions(cartDetails)){
                        let deliveryCost: IDelivery = await ApiProxy.getInstance().sendRequest("GET", `/delivery/storeID/${cartDetails.storeID}`)
                        cartDetails.deliveryCost.firstPiece = Number(deliveryCost.storeInfo.delivery.price.firstPiece);
                        cartDetails.deliveryCost.nextPiece = Number(deliveryCost.storeInfo.delivery.price.additionalPiece);
                        let price = cartDetails.deliveryCost
                        if(Number(price.firstPiece) > Number(maxFirstPieceCost)){
                            maxFirstPieceCost = Number(price.firstPiece)
                            maxFirstPieceCostIndex = Number(selectedProductIndex)
                        }
                    }
                }
            }
            for (let i = 0; i < products.length; i++){
                let selectedProductItem = products[i]
                let selectedProductIndex = i    
                totalQuantity += Number(selectedProductItem.availableQuantity);
                totalPrice += Number(selectedProductItem.productValue.price) * Number(selectedProductItem.availableQuantity);
                let product = await ApiProxy.getInstance().sendRequest("GET", `/product/productID/${selectedProductItem.productID}/`)
                let productInfo = null
                if(product){
                    productInfo = product.productInfo
                }
                if (selectedProductIndex === maxFirstPieceCostIndex) {
                    if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate){
                        let productShippingRate = productInfo.shippingRate
                        totalDeliveryCost += Number(productShippingRate['firstpiece']) + Number(productShippingRate['nextpiece']) * Number(selectedProductItem.availableQuantity - 1)
                    }
                    else
                        if (this.checkDeliveryFieldsConditions(cartDetails)){
                            let deliveryCost: IDelivery = await ApiProxy.getInstance().sendRequest("GET", `/delivery/storeID/${cartDetails.storeID}`)
                            cartDetails.deliveryCost.firstPiece = Number(deliveryCost.storeInfo.delivery.price.firstPiece);
                            cartDetails.deliveryCost.nextPiece = Number(deliveryCost.storeInfo.delivery.price.additionalPiece);
                            let price = cartDetails.deliveryCost
                            totalDeliveryCost += Number(price.firstPiece) + Number(price.nextPiece) * Number(selectedProductItem.availableQuantity - 1)
                        }
                } else {
                    if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate){
                        let productShippingRate = productInfo.shippingRate
                        totalDeliveryCost += Number(productShippingRate['nextpiece']) * Number(selectedProductItem.availableQuantity)
                    }    
                    else
                        if (this.checkDeliveryFieldsConditions(cartDetails)){
                            let deliveryCost: IDelivery = await ApiProxy.getInstance().sendRequest("GET", `/delivery/storeID/${cartDetails.storeID}`)
                            cartDetails.deliveryCost.firstPiece = Number(deliveryCost.storeInfo.delivery.price.firstPiece);
                            cartDetails.deliveryCost.nextPiece = Number(deliveryCost.storeInfo.delivery.price.additionalPiece);
                            let price = cartDetails.deliveryCost
                            totalDeliveryCost += Number(price.nextPiece) * Number(selectedProductItem.availableQuantity)
                        }
                }
            }

            grandTotal = totalPrice + totalDeliveryCost;

            if (grandTotal > 0) {
                if (this.checkDiscount(cartDetails)) {
                    let totalDiscount = Number(cartDetails['discount']['grandTotal']);
                    grandTotal = grandTotal - totalDiscount;

                    if (grandTotal <= 0) grandTotal = 1;
                }
            }

            let summary = {
                totalQuantity: totalQuantity,
                totalDeliveryCost: totalDeliveryCost,
                totalPrice: totalPrice,
                grandTotal: grandTotal
            };

            Log.debug('[CartManager] Summary object was created successfully with result: ', summary);

            return Promise.resolve(summary);
        } catch (error) {
            Log.error('[CartManager] Error while summary cart item: ', error);
            return Promise.reject(error);
        }
    }

    public static checkDiscount(cartDetails: ICart) {
        return cartDetails.hasOwnProperty('discount') &&
            cartDetails.discount.hasOwnProperty('totalDeliveryCost') &&
            cartDetails.discount.hasOwnProperty('totalPrice') &&
            cartDetails.discount.hasOwnProperty('grandTotal')
    }

    public static async decryptDataQuerystring(data: string) {
        try {
            const resultDecryptDataQuerystring = await ApiProxy.getInstance().sendRequest("POST", `/utility/cryptData`, {
                secret_key: "@R!SL@B_ONE_CLICK_BUY",
                mode: "DECRYPT",
                data: data
            });
            return Promise.resolve(resultDecryptDataQuerystring);
        } catch (error) {
            Log.error('[CartManager] Error while decrypting data querystring: ', error);
            return Promise.reject(error);
        }
    }

    public static async getCartDetailsFromBooking(cartID: string) {
        Log.debug('[CartManager] Getting cart details from booking of cartID: ' + cartID);
        try {
            let resultCartDetails = await ApiProxy.getInstance().sendRequest("GET", `/cart/details?cartID=${cartID}`);
            resultCartDetails['summary'] = await this.createSummaryObj(resultCartDetails);

            Log.debug('[CartManager] Cart details from booking of cartID: ', resultCartDetails);
            return Promise.resolve(resultCartDetails);
        }
        catch (err) {
            Log.error('[CartManager] Error while getting cart details from booking: ', err);
            return Promise.reject(err);
        }
    }

    public static async getProductBookingOfCart(cartID: string, productID: string, color?: string, size?: string) {
        Log.debug('[CartManager] Getting product booking of cartID: ' + cartID + ' with productID: ' + productID + ' color: ' + color + ' and size: ' + size);
        try {
            const resultCheckProductBookingInventory = await ApiProxy.getInstance().sendRequest("POST", `/productBooking/cart/${cartID}/product/${productID}/checkInventory`, {
                color: color,
                size: size
            });

            Log.debug('[CartManager] Result get product booking of cart', resultCheckProductBookingInventory);
            return Promise.resolve(resultCheckProductBookingInventory);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    public static async createNewCart(cartInfo: ICart) {
        Log.debug('[CartManager] Creating new cart with cartInfo: ', cartInfo);
        try {
            const resultCreateNewCart = await ApiProxy.getInstance().sendRequest("POST", `/cart/new`, cartInfo);

            Log.debug('[CartManager] Result create new cart', resultCreateNewCart);
            return Promise.resolve(resultCreateNewCart);
        } catch (error) {
            Log.error('[CartManager] Error while creating new cart: ', error);
            return Promise.reject(error);
        }
    }

    public static async updateCart(updateInfo: { [key: string]: any }, cartID: string) {
        Log.debug('[CartManager] Updating cartID: ' + cartID + ' with updateInfo: ', updateInfo);
        try {
            const resultUpdateCart = await ApiProxy.getInstance().sendRequest("POST", `/cart/update?cartID=${cartID}`, updateInfo);

            Log.debug('[CartManager] Result update cart', resultUpdateCart);
            return Promise.resolve(resultUpdateCart);
        } catch (error) {
            Log.error('[CartManager] Error while updating cart: ', error);
            return Promise.reject(error);
        }
    }

    public static async openBuyNowLink(data: string) {
        try {
            let redirectObj = {};
            let cartID;

            // Decrypt value from data first
            let resultDecryptDataQuerystring = await this.decryptDataQuerystring(data);
            resultDecryptDataQuerystring = JSON.parse(resultDecryptDataQuerystring['data']);

            // Then try to iterate over decrypted querystring to make sure that decrypted is in proper json format
            if (Object.keys(resultDecryptDataQuerystring)) {
                let resultCreateNewCart = await this.createNewCart(resultDecryptDataQuerystring);
                Log.debug('[CartManager] resultCreateNewCart', resultCreateNewCart);
                cartID = resultCreateNewCart['_id'];
            }

            let resultCheckCustomerExists = await CustomerManager.checkCustomerExists(resultDecryptDataQuerystring['storeID'], resultDecryptDataQuerystring['userID']);

            redirectObj['destination'] = "details";
            redirectObj['cartID'] = cartID;
            if (!resultCheckCustomerExists['exists']) {
                redirectObj['destination'] = "delivery";
                redirectObj['cartID'] = cartID;
            }

            return Promise.resolve(redirectObj);
        } catch (error) {
            Log.error('[CartManager] Error while opening buy now link: ', error);
            return Promise.reject(error);
        }
    }

    public static async verifyCartInventory(cartID: string) {
        try {
            let resultCartDetails = await ApiProxy.getInstance().sendRequest("GET", `/cart/details?cartID=${cartID}`);
            Log.debug('[CartManager] resultCartDetails: ', resultCartDetails);

            let selectedProduct = resultCartDetails['selectedProduct'];
            let isVerify = true;
            for (let i = 0; i < selectedProduct.length; i++) {
                let product = selectedProduct[i];
                Log.debug('[CartManager] [Before Checkout] checking productID ' + product['productID'] + ' is out of stock or not');
                let productColor = "";
                let productSize = "";

                if (
                    product['productValue']['colorObj'].hasOwnProperty('value') &&
                    product['productValue']['colorObj']['value']
                ) {
                    productColor = product['productValue']['colorObj']['value'];
                }

                if (product['productValue']['size']) {
                    productSize = product['productValue']['size'];
                }

                let remainingStock = await this.checkProductInventory(resultCartDetails['storeID'], product['productID'], productColor, productSize);
                Log.debug('[CartManager] [Before Checkout] productID ' + product['productID'] + ' total remaining stock is: ', remainingStock)
                let bookingStock = await this.checkProductBookingInventory(product['productID'], productColor, productSize);
                Log.debug('[CartManager] [Before Checkout] productID ' + product['productID'] + ' total booking stock is: ', bookingStock)

                if ((remainingStock['stock'] - bookingStock['stock']) < product['availableQuantity'] || remainingStock['stock'] <= 0 || product['availableQuantity'] <= 0 ) {
                    Log.debug('[CartManager] [Before Checkout] productID ' + product['productID'] + ' is react stock limited.')
                    isVerify = false;
                    break;
                }

            }

            let returnValue = { "isVerify": isVerify };
            Log.debug('[CartManager] [Before Checkout] Result verifyCartInventory of cartID: ' + cartID + ' is: ', returnValue);
            return Promise.resolve(returnValue);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    public static hasDiscount(cartDetails: ICart) {
        return cartDetails.hasOwnProperty('discount');
    }
}