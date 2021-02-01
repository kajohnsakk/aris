import { AbstractPersistentModel } from './AbstractPersistentModel';
import { ElasticsearchClient, ElasticsearchQueryResultDocument } from '../components/ElasticsearchClient';
import { Product, JSONData as ProductInterface } from './Product';
import { FundsTransaction } from './FundsTransaction';

import { Utils } from './Utils';
import { Log } from '../utils/Log';
import { Parser } from 'json2csv';
var moment = require('moment-timezone');

export interface IDeliveryInfo {
    firstName: string,
    lastName: string,
    phoneNo: string,
    address1: string,
    address2: string,
    subDistrict: string,
    district: string,
    province: string,
    postalCode: string
}

export interface IGbPaymentDetails {
    customerName: string,
    customerEmail: string,
    customerAddress: string,
    customerTelephone: string,
    [key: string]: string
}

export interface IPaymentInfo {
    method: string,
    status: string,
    details: string,
    gbPaymentDetails: IGbPaymentDetails,
    referenceNo: string,
    gbPayLink: string,
    pressedPayBtnTimestamp: number,
    paymentCompletedOn: number
    isFromBatchCheck?: boolean,
    batchCheckTimestamp?: Date
}

export interface IColorObj {
    label: string,
    value: string
}

export interface IProductValue {
    size: string,
    price: number,
    sku: string,
    colorObj: IColorObj,
    color: string
}
export interface ISelectedProduct {
    productName: string,
    productID: string,
    productNameWithoutColor: string,
    productValue: IProductValue,
    productImage: string,
    availableQuantity?: number,
    originalQuantity?: number,
    isOutOfStock?: boolean,
    isLastQuantity?: boolean,
    isLastRemaining?: boolean,
    isDecreaseQuantity?: boolean
}

export interface IDelivery {
    firstPiece: number,
    nextPiece: number
}

export interface IOrderAdditionalDetails {
    delivery: IDelivery
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

export interface summaryJSON {
    totalDeliveryCost: number,
    totalPrice: number,
    grandTotal: number
}

export interface customFieldsJSON {
    [key: string]: any
}

export interface IOrder {
    orderDocID: string,
    storeID: string,
    userID: string,
    userInfo: IUserInfo,
    orderID: string,
    orderDate: number,
    recipientAccountType: string,
    orderAdditionalDetails: IOrderAdditionalDetails,
    selectedProduct: ISelectedProduct[],
    paymentInfo: IPaymentInfo,
    shippingStatus: string,
    trackingNumber?: string,
    shippingMethod?: string,
    deliveryInfo?: IDeliveryInfo,
    summary: summaryJSON,
    customFields: customFieldsJSON,
    cartID: string,
    channel?: IChannelInfo,
    discount?: IDiscountInfo,

}

export class Order extends AbstractPersistentModel {
    public orderDocID: string;
    public storeID: string;
    public userID: string;
    public userInfo: IUserInfo;
    public orderID: string;
    public orderDate: number;
    public recipientAccountType: string;
    public orderAdditionalDetails: IOrderAdditionalDetails;
    public selectedProduct: ISelectedProduct[];
    public paymentInfo: IPaymentInfo;
    public shippingStatus: string;
    public trackingNumber?: string;
    public shippingMethod?: string;
    public deliveryInfo: IDeliveryInfo;
    public summary: summaryJSON;
    public customFields: customFieldsJSON;
    public cartID: string;
    public channel: IChannelInfo;
    public discount: IDiscountInfo;

    constructor(json: IOrder, orderDocID?: string, summary?: summaryJSON) {
        super(orderDocID);
        this.orderDocID = (orderDocID) ? orderDocID : json.orderDocID;
		this.storeID = json.storeID;
        this.userID = json.userID;
        this.userInfo = json.userInfo;
        this.orderID = json.orderID;
        this.orderDate = json.orderDate;
        this.recipientAccountType = json.recipientAccountType;
        this.orderAdditionalDetails = json.orderAdditionalDetails;
        this.selectedProduct = json.selectedProduct;
        this.paymentInfo = json.paymentInfo;
        this.shippingStatus = json.shippingStatus;
        this.trackingNumber = json.trackingNumber;
        this.shippingMethod = json.shippingMethod;
        this.deliveryInfo = json.deliveryInfo;
        this.summary = summary;
        this.customFields = json.customFields;
        this.cartID = json.cartID;
        this.channel = json.channel;
        this.discount = json.discount;
    }

    doUpdate(json: IOrder): boolean {
        return true;
    }

    private static readonly TYPE = "order";
    protected getType(): string {
        return Order.TYPE;
    }

    public toJSON(): any {
        return {
            orderDocID: this.orderDocID,
            storeID: this.storeID,
            userID: this.userID,
            userInfo: this.userInfo,
            orderID: this.orderID,
            orderDate: this.orderDate,
            recipientAccountType: this.recipientAccountType,
            orderAdditionalDetails: this.orderAdditionalDetails,
            selectedProduct: this.selectedProduct,
            paymentInfo: this.paymentInfo,
            deliveryInfo: this.deliveryInfo,
            shippingStatus: this.shippingStatus,
            trackingNumber: this.trackingNumber,
            shippingMethod: this.shippingMethod,
            summary: this.summary,
            customFields: this.customFields,
            cartID: this.cartID,
            channel: this.channel,
            discount: this.discount
        };
    }

    public static findAllOrder(storeID: string, orderStatus: string, startDate: number, endDate: number) {
        Log.debug(`Finding all order by store id: ${storeID}, status: ${orderStatus}, start date: ${startDate}, end date: ${endDate}`);

        let matchStore = {};
        let matchStatus = {};
        let notMatchStatus: any = [];
        let range = {};

        if (storeID && storeID.length > 0) {
            matchStore = {
                "match": {
                    "storeID.keyword": storeID
                }
            };
        }

        if (orderStatus && orderStatus.length > 0) {
            if (orderStatus === 'SUCCESS') {
                notMatchStatus = [
                    {
                        "match": {
                            "paymentInfo.status.keyword": "PENDING"
                        }
                    },
                    {
                        "match": {
                            "paymentInfo.status.keyword": "FAIL"
                        }
                    }
                ];
                matchStatus = {};

            } else {
                matchStatus = {
                    "match": {
                        "paymentInfo.status.keyword": orderStatus
                    }
                };
            }

        }

        if (startDate > 0 && endDate > 0) {
            if ( !orderStatus || orderStatus !== "SUCCESS" ) {
                range = {
                    "range": {
                        "orderDate": {
                            "gte": startDate,
                            "lte": endDate,
                        }
                    }
                };
            } else {
                range = {
                    "range": {
                        "paymentInfo.paymentCompletedOn": {
                            "gte": startDate,
                            "lte": endDate,
                        }
                    }
                };
            }
            
        }

        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        matchStore,
                        matchStatus,
                        range
                    ],
                    "must_not": notMatchStatus
                }
            },
            "sort": [
                { "orderDate": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then( async (json: any) => {
                if (json && json.length > 0) {
                    // return json.map((result: any) => {
                    //     Log.debug('resultFindAllOrder: ', result);
                    //     let summaryObj = await this.createSummaryObj(result._source);
                    //     return new Order(result._source, result._id, summaryObj);
                    // });

                    const orderList = await this.createSummaryForOrderList(json);
                    return Promise.resolve(orderList);
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding all order: ', error);
                throw error;
            });
    }

    public static async convertJsonToCsv(storeID:string, orderList: IOrder[]) {
        try {
            Log.debug(`==================== Convert JSON to CSV ====================`);

            let products = await Product.findById(storeID, true);
            let transactions = await FundsTransaction.getFundsTransactionList(storeID, 0, 0);

            let fields = [
				'orderDocID',
				'storeID',
                'referenceNo',
                'orderID',
                'orderDate',
                'paymentCompletedOn',
                'customerFBFullName',
                'customerName',
                'customerEmail',
                'customerAddress',
                'subDistrict',
                'district',
                'province',
                'postalCode',
                'customerTelephone',
                'selectedProduct',
                'productHashtag',
                'productSKU',
                'paymentStatus',
                'paymentMethod',
                'totalPrice',
                'totalDeliveryCost',
                'grandTotal',
                'fee',
                'afterFee',
                'gbPayReferenceNo',
                'gbPayLink',
                'fbPageName'
            ];

            var csvData = orderList.map((order: IOrder) => {
                let gbPayReferenceNo: string = "";
                let customerFBFullName: string = "";
                let customerName: string = "";
                let customerEmail: string = "";
                let customerAddress: string = "";
                let subDistrict: string = "";
                let district: string = "";
                let province: string = "";
                let postalCode: string = "";
                let customerTelephone: string = "";
                let referenceNo: string = "";
                let gbPayLink: string = "";
                let fbPageName: string = "";
                let fee: number = 0;
                let afterFee: number = 0;

                if (order['paymentInfo']['details']) {
                    gbPayReferenceNo = order['paymentInfo']['details'];
                }

                if (order['userInfo']['firstName'] && order['userInfo']['lastName']) {
                    customerFBFullName = `${order['userInfo']['firstName']} ${order['userInfo']['lastName']}`;
                }

                if (order['paymentInfo']['gbPaymentDetails']['customerName']) {
                    customerName = order['paymentInfo']['gbPaymentDetails']['customerName'];
                }

                if (order['paymentInfo']['gbPaymentDetails']['customerEmail']) {
                    customerEmail = order['paymentInfo']['gbPaymentDetails']['customerEmail'];
                }

                if (
                    order['deliveryInfo']['address1'] ||
                    order['deliveryInfo']['address2'] ||
                    order['deliveryInfo']['subDistrict'] ||
                    order['deliveryInfo']['district'] ||
                    order['deliveryInfo']['province'] ||
                    order['deliveryInfo']['postalCode']
                ) {
                    customerAddress = `${order['deliveryInfo']['address1']} ${order['deliveryInfo']['address2']} `
                    customerAddress += `${order['deliveryInfo']['subDistrict']} ${order['deliveryInfo']['district']} `
                    customerAddress += `${order['deliveryInfo']['province']} ${order['deliveryInfo']['postalCode']}`;
                }

                if (order['deliveryInfo']['subDistrict']) {
                    subDistrict = order['deliveryInfo']['subDistrict'];
                }
                
                if (order['deliveryInfo']['district']) {
                    district = order['deliveryInfo']['district'];
                }
                
                if (order['deliveryInfo']['province']) {
                    province = order['deliveryInfo']['province'];
                }
                
                if (order['deliveryInfo']['postalCode']) {
                    postalCode = order['deliveryInfo']['postalCode'];
                }

                if (order['deliveryInfo']['phoneNo']) {
                    customerTelephone = order['deliveryInfo']['phoneNo'];
                }

                if (order['paymentInfo']['gbPayLink']) {
                    gbPayLink = order['paymentInfo']['gbPayLink'];
                }

                if (order['paymentInfo']['referenceNo']) {
                    referenceNo = order['paymentInfo']['referenceNo'];
                }

                if (order['channel']['name']) {
                    fbPageName = order['channel']['name'];
                }

                let selectedProductList: string = "";
                let selectedProductHashtag: string = "";
                let selectedProductSKU: string = "";
                order.selectedProduct.forEach((product, index) => {
                    let size;
                    let color;
                    let price;
                    let quantity;
                    let concatAll;
                    let sku;

                    if (product['productValue']['size']) {
                        size = `${product['productValue']['size']}`;
                    }

                    if (Object.keys(product['productValue']['colorObj']).length > 0) {
                        color = `${product['productValue']['colorObj']['label']}`
                    }

                    if (product['productValue']['price']) {
                        price = `${product['productValue']['price']} THB`;
                    }

                    if (product['availableQuantity']) {
                        quantity = `${product['availableQuantity']}`;
                    } else {
                        quantity = 1;
                    }

                    if (color && size) {
                        concatAll = `${color} - ${size} ${price} (Quantity: ${quantity})`;
                    } else {
                        concatAll = `${price} (Quantity: ${quantity})`;
                    }

                    if (index >= 0) {
                        selectedProductList += `${product['productNameWithoutColor']} ${concatAll} \n`
                        let resultFindProduct = products.find((item: ProductInterface) => {
                            return item.productID === product.productID;
                        });

                        // Log.debug('resultFindProduct', resultFindProduct);

                        if (resultFindProduct) {
                            selectedProductHashtag += `#${resultFindProduct['productInfo']['productHashtag']} \n`;
                            selectedProductSKU += `${product['productValue']['sku']} \n`
                        } else {
                            selectedProductHashtag += `- \n`;
                            selectedProductSKU = `- \n`;
                        }
                    }
                    
                    if (/SUCCESS/.test(order['paymentInfo']['status'])) {
                        let matchedTransaction : FundsTransaction;
                        if (transactions.length > 0) {
                            matchedTransaction = transactions.find((transaction: FundsTransaction) => {
                                return transaction.orderInfo.orderID === order.orderID;
                            })
                        }
                        
                        if (matchedTransaction) {
                            fee = matchedTransaction.fee;
                            afterFee = matchedTransaction.actualAmount;
                        }
                    }
                });

                const dateObj = new Date(Number(order.orderDate));

                return {
					orderDocID: order.orderDocID,
					storeID: order.storeID,
                    referenceNo: referenceNo,
                    orderID: order.orderID,
                    orderDate: moment.unix(Number(order.orderDate / 1000)).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
                    paymentCompletedOn: moment.unix(Number(order.paymentInfo.paymentCompletedOn / 1000)).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
                    customerFBFullName: customerFBFullName,
                    customerName: customerName,
                    customerEmail: customerEmail,
                    customerAddress: customerAddress,
                    subDistrict: subDistrict,
                    district: district,
                    province: province,
                    postalCode: postalCode,
                    customerTelephone: customerTelephone,
                    selectedProduct: selectedProductList,
                    productHashtag: selectedProductHashtag,
                    productSKU: selectedProductSKU,
                    paymentStatus: order.paymentInfo.status,
                    paymentMethod: order.paymentInfo.method,
                    totalPrice: order.summary.totalPrice || order.selectedProduct[0].productValue.price,
                    totalDeliveryCost: order.summary.totalDeliveryCost,
                    grandTotal: order.summary.grandTotal || 1,
                    fee: fee,
                    afterFee: afterFee,
                    gbPayReferenceNo: gbPayReferenceNo,
                    gbPayLink: gbPayLink,
                    fbPageName: fbPageName
                }
            });

            let json2csvParser = new Parser({ fields });
            let csv = json2csvParser.parse(csvData);
            Log.debug(`CSV Data: `, csv);
            return csv;
        } catch (error) {
            Log.error('Error while converting to csv with: ', error);
            throw error;
        }

    }

	public static findOrderBySelection(selectedField: string, selectedValue: string) {
		
		let queryStr = {};
		if( selectedField === "GBP" ) {
			queryStr = {
				"match": {
					"paymentInfo.details.keyword": selectedValue
				}
			};
		} else if( selectedField === "orderID" ) {
			queryStr = {
				"match": {
					"orderID.keyword": selectedValue
				}
			};
		} else if( selectedField === "orderDocID" ) {
			queryStr = {
				"term": {
					"_id": selectedValue
				}
			};
		}
		
		let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        queryStr
                    ]
                }
            },
            "sort": [
                { "orderDate": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then( async(json: any) => {
                if (json && json.length > 0) {
                    // return json.map((result: any) => {
                    //     Log.debug('resultFindOrderBySelection: ', result);
                    //     let summaryObj = this.createSummaryObj(result._source);
					// 	Log.debug('summaryObj: ', summaryObj);
                    //     return new Order(result._source, result._id, summaryObj);
                    // });

                    const orderList = await this.createSummaryForOrderList(json);
                    return Promise.resolve(orderList);
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding by selection: ', error);
                throw error;
            });
    }
    
    public static checkDeliveryFieldsConditions(sourceObject: Order) {
        return sourceObject.hasOwnProperty('orderAdditionalDetails') &&
            sourceObject.orderAdditionalDetails.hasOwnProperty('delivery') &&
            sourceObject.orderAdditionalDetails.delivery.hasOwnProperty('firstPiece') &&
            sourceObject.orderAdditionalDetails.delivery.hasOwnProperty('nextPiece')
    }

    public static async createSummaryObj(source: Order, allProducts?: ProductInterface[], ignoreOutOfStockProduct?: boolean) {
        let totalQuantity: number = 0;
        let totalPrice: number = 0;
        let totalDeliveryCost: number = 0;
        let grandTotal: number = 0;
        let maxFirstPieceCost: number = 0;
        let maxFirstPieceCostIndex: number = 0;

        
        if (ignoreOutOfStockProduct) {
            source.selectedProduct = source.selectedProduct.filter((selectedProductItem) => {
                return selectedProductItem.isOutOfStock === false;
            });
        }

        let products = source.selectedProduct;
        let productInfoList = [];
        for (let i = 0; i < products.length; i++){
            let selectedProductItem = products[i]
            let selectedProductIndex = i;

            let productInfo = null
            const productID = selectedProductItem.productID;
            let selectedProductObj: ProductInterface = allProducts.find((productInfo) => {
                return productInfo.productID === productID;
            });
            if( selectedProductObj ) {
                productInfo = selectedProductObj.productInfo;
                productInfoList[i] = productInfo;
            }
            // let product: ProductInterface[] = await Product.findProductById(source.storeID,selectedProductItem.productID)
            // let productInfo = null
            // if(product[0]){
            //     productInfo = product[0].productInfo;
            //     productInfoList[i] = productInfo;
            // }
            if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate){
                let productShippingRate = productInfo.shippingRate
                if(Number(productShippingRate.firstpiece) > Number(maxFirstPieceCost)){
                    maxFirstPieceCost = Number(productShippingRate.firstpiece)
                    maxFirstPieceCostIndex = Number(selectedProductIndex)
                }
            } else {
                if(this.checkDeliveryFieldsConditions(source)){
                    let deliveryCostInfo = source.orderAdditionalDetails.delivery;
                    if(Number(deliveryCostInfo.firstPiece) > Number(maxFirstPieceCost)){
                        maxFirstPieceCost = Number(deliveryCostInfo.firstPiece)
                        maxFirstPieceCostIndex = Number(selectedProductIndex)
                    }
                }
            }
        }

        for (let i = 0; i < products.length; i++){
            let selectedProductItem = products[i]
            let selectedProductIndex = i
            // let product: ProductInterface[] = await Product.findProductById(source.storeID,selectedProductItem.productID)
            // let productInfo = null
            // if(product[0]) {
            //     productInfo = product[0].productInfo;
            // }
            let productInfo = productInfoList[i];
            let availableQuantity = selectedProductItem.hasOwnProperty('availableQuantity') ? selectedProductItem.availableQuantity : 1;
            totalQuantity += Number(availableQuantity);
            totalPrice += Number(selectedProductItem.productValue.price) * Number(availableQuantity);
            if (selectedProductIndex === maxFirstPieceCostIndex) {
                if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate){
                    let productShippingRate = productInfo.shippingRate
                    totalDeliveryCost += Number(productShippingRate['firstpiece']) + Number(productShippingRate['nextpiece']) * Number(availableQuantity - 1)
                }
                else
                    if (this.checkDeliveryFieldsConditions(source)){
                        let deliveryCostInfo = source.orderAdditionalDetails.delivery;
                        totalDeliveryCost += Number(deliveryCostInfo.firstPiece) + Number(deliveryCostInfo.nextPiece) * Number(availableQuantity - 1)
                    }
            }
            else {
                if (productInfo && productInfo.hasOwnProperty('shippingRate') && productInfo.enableShippingRate){
                    let productShippingRate = productInfo.shippingRate;
                    totalDeliveryCost += Number(productShippingRate['nextpiece']) * Number(availableQuantity);
                }    
                else
                    if (this.checkDeliveryFieldsConditions(source)){
                        let deliveryCostInfo = source.orderAdditionalDetails.delivery;
                        totalDeliveryCost += Number(deliveryCostInfo.nextPiece) * Number(availableQuantity);
                    }
            }
        }

        grandTotal = totalPrice + totalDeliveryCost;

        if (grandTotal > 0) {
            if (this.checkDiscount(source)) {
                let totalDiscount = Number(source['discount']['grandTotal']);
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

    public static checkDiscount(orderDetails: Order) {
        return orderDetails.hasOwnProperty('discount') &&
            orderDetails.discount.hasOwnProperty('totalDeliveryCost') &&
            orderDetails.discount.hasOwnProperty('totalPrice') &&
            orderDetails.discount.hasOwnProperty('grandTotal')
    }

    public static async createSummaryForOrderList(json: ElasticsearchQueryResultDocument[]): Promise<Order[]> {
        let resultArray = [];
        const allProducts = await Product.findById("", false);
        
        for (const result of json) {
            let summaryObj = await this.createSummaryObj(result._source, allProducts);
            resultArray.push(new Order(result._source, result._id, summaryObj));
        }
        return Promise.resolve(resultArray);
    }

























	public static findSuccessOrderForWallet() {
        Log.debug(`Finding all success order for wallet`);


        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
							"match": {
								"paymentInfo.status.keyword": "SUCCESS"
							}
						},
						{
							"match": {
								"recipientAccountType.keyword": "GB_PAY_WALLET"
							}
						}
                    ]
                }
            },
            "sort": [
                { "orderDate": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then( async(json: any) => {
                if (json && json.length > 0) {
                    // return json.map((result: any) => {
                    //     return new Order(result._source, result._id);
                    // });

                    const orderList = await this.createSummaryForOrderList(json);
                    return Promise.resolve(orderList);
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding success order for wallet: ', error);
                throw error;
            });
    }
	
	
	public static findSuccessOrderForMerchant() {
        Log.debug(`Finding all success order for merchant`);


        let searchQuery = {
            "query": {
                "bool": {
                    "must": [
                        {
							"match": {
								"paymentInfo.status.keyword": "SUCCESS"
							}
						},
						{
							"match": {
								"recipientAccountType.keyword": "MERCHANT_BANK_ACCOUNT"
							}
						}
                    ]
                }
            },
            "sort": [
                { "orderDate": "desc" }
            ]
        };

        return ElasticsearchClient.getInstance().search(this.TYPE, searchQuery)
            .then( async(json: any) => {
                if (json && json.length > 0) {
                    // return json.map((result: any) => {
                    //     return new Order(result._source, result._id);
                    // });

                    const orderList = await this.createSummaryForOrderList(json);
                    return Promise.resolve(orderList);
                } else {
                    return [];
                }
            })
            .catch((error) => {
                Log.error('Error while finding success order for merchant: ', error);
                throw error;
            });
    }


}