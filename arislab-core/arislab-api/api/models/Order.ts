import { AbstractPersistentModel } from "./AbstractPersistentModel";
import {
  ElasticsearchClient,
  ElasticsearchQueryResultDocument,
} from "../components/ElasticsearchClient";
import { Product, JSONData as ProductInterface } from "./Product";
import { FundsTransaction } from "./FundsTransaction";
import { ProductBooking, IProductBooking } from "./ProductBooking";
import { Channel } from "./Channel";

import { Log } from "../ts-utils/Log";
import { Parser } from "json2csv";
import * as moment from "moment";

export interface orderDeliveryCostJSON {
  firstPiece: number;
  nextPiece: number;
}

export interface userInfoJSON {
  firstName: string;
  lastName: string;
}

export interface orderAdditionalDetailsJSON {
  delivery?: orderDeliveryCostJSON;
}

export interface gbPaymentDetailsJSON {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerTelephone: string;
  [key: string]: string;
}

export interface colorObjectJSON {
  value: string;
  label: string;
}

export interface productValueJSON {
  size: string;
  price: number;
  sku: string;
  colorObj: colorObjectJSON;
  color: string;
}

export interface shippingRateJSON {
  firstpiece: number;
  nextpiece: number;
}

export interface selectedProductJSON {
  productName: string;
  productID: string;
  productNameWithoutColor: string;
  productValue: productValueJSON;
  productImage: string;
  shippingRate: shippingRateJSON;
  availableQuantity?: number;
  originalQuantity?: number;
  isOutOfStock?: boolean;
  isLastQuantity?: boolean;
  isLastRemaining?: boolean;
  isDecreaseQuantity?: boolean;
  isVoucher?: boolean;
  code: string[];
}

export interface paymentInfoJSON {
  method: string;
  status: string;
  details: string;
  referenceNo: string;
  pressedPayBtnTimestamp: Date;
  paymentCompletedOn: Date;
  gbPayLink: string;
  gbPaymentDetails: gbPaymentDetailsJSON;
  isFromBatchCheck?: boolean;
  batchCheckTimestamp?: Date;
}

export interface deliveryInfoJSON {
  firstName: string;
  lastName: string;
  customerName: string;
  phoneNo: string;
  address1: string;
  address2: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface summaryJSON {
  totalQuantity?: number;
  totalDeliveryCost: number;
  totalPrice: number;
  grandTotal: number;
  fee?: number;
  afterFee?: number;
}

export interface customFieldsJSON {
  [key: string]: any;
}

export interface returningUserAdditionalDetailsJSON {
  [key: string]: any;
}

export interface returningUserJSON {
  isReturningUser: boolean;
  additionalDetails?: returningUserAdditionalDetailsJSON;
}

export interface channelInfoJSON {
  id: string;
  name: string;
}

export interface discountInfoJSON {
  totalDeliveryCost: number;
  totalPrice: number;
  grandTotal: number;
}

export interface taxInvoiceDetailsJSON {
  personType: string;
  businessType: string;
  businessName: string;
  branchName: string;
  taxInvoiceNumber: string;
  invoiceAddress: string;
  branchId: string;
}

export interface JSONData {
  storeID: string;
  userID: string;
  userInfo: userInfoJSON;
  orderID: string;
  orderDate: number;
  recipientAccountType: string;
  orderAdditionalDetails: orderAdditionalDetailsJSON;
  selectedProduct: selectedProductJSON[];
  paymentInfo: paymentInfoJSON;
  shippingStatus: string;
  trackingNumber?: string;
  shippingMethod?: string;
  deliveryInfo: deliveryInfoJSON;
  taxInvoiceDetails: taxInvoiceDetailsJSON;
  summary: summaryJSON;
  customFields: customFieldsJSON;
  cartID: string;
  channel: channelInfoJSON;
  discount?: discountInfoJSON;
  isTrackingSent: boolean;
}

export class Order extends AbstractPersistentModel {
  public orderDocID: string;
  public storeID: string;
  public userID: string;
  public userInfo: userInfoJSON;
  public orderID: string;
  public orderDate: number;
  public recipientAccountType: string;
  public orderAdditionalDetails: orderAdditionalDetailsJSON;
  public selectedProduct: selectedProductJSON[];
  public deliveryInfo: deliveryInfoJSON;
  public taxInvoiceDetails: taxInvoiceDetailsJSON;
  public shippingStatus: string;
  public trackingNumber: string;
  public shippingMethod: string;
  public paymentInfo: paymentInfoJSON;
  public summary: summaryJSON;
  public customFields: customFieldsJSON;
  public cartID: string;
  public channel: channelInfoJSON;
  public discount: discountInfoJSON;
  public isTrackingSent: boolean;

  constructor(
    json: JSONData,
    orderDocID?: string,
    summary?: summaryJSON,
    customFields?: customFieldsJSON
  ) {
    super(orderDocID);
    this.orderDocID = orderDocID;
    this.storeID = json.storeID;
    this.userID = json.userID;
    this.userInfo = json.userInfo;
    this.orderID = json.orderID;
    this.orderDate = json.orderDate;
    this.recipientAccountType = json.recipientAccountType;
    this.orderAdditionalDetails = json.orderAdditionalDetails;
    this.selectedProduct = json.selectedProduct;
    this.deliveryInfo = json.deliveryInfo;
    this.taxInvoiceDetails = json.taxInvoiceDetails;
    this.shippingStatus = json.shippingStatus || "N/A";
    this.trackingNumber = json.trackingNumber;
    this.shippingMethod = json.shippingMethod;
    this.paymentInfo = json.paymentInfo;
    this.summary = summary;
    this.customFields = customFields;
    this.cartID = json.cartID;
    this.channel = json.channel;
    this.discount = json.discount;
    this.isTrackingSent = json.isTrackingSent || false;
  }

  doUpdate(json: JSONData): boolean {
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
      taxInvoiceDetails: this.taxInvoiceDetails,
      shippingStatus: this.shippingStatus,
      trackingNumber: this.trackingNumber,
      shippingMethod: this.shippingMethod,
      summary: this.summary,
      customFields: this.customFields,
      cartID: this.cartID,
      channel: this.channel,
      discount: this.discount,
      isTrackingSent: this.isTrackingSent,
    };
  }

  public static findById(
    storeID: string,
    status?: string,
    startDate?: number,
    endDate?: number,
    dateFilter?: string
  ): Promise<Order[]> {
    Log.debug(
      "Finding order in storeID: " + storeID,
      status && status !== "ALL" ? " with status: " + status : ""
    );

    let withStatus = {};
    if (status) {
      if (status === "SUCCESS") {
        withStatus = {
          wildcard: {
            "paymentInfo.status.keyword": "SUCCESS*",
          },
        };
      } else {
        withStatus = {
          match: {
            "paymentInfo.status.keyword": status,
          },
        };
      }
    }

    let searchQuery = {};

    if (startDate && endDate) {
      let filter = {};
      if (dateFilter === "orderDate" && (!status || status !== "SUCCESS")) {
        filter = {
          range: { orderDate: { gte: startDate, lte: endDate } },
        };
      } else {
        filter = {
          range: {
            "paymentInfo.paymentCompletedOn": { gte: startDate, lte: endDate },
          },
        };
      }

      searchQuery = {
        query: {
          bool: {
            must: [
              {
                match: {
                  "storeID.keyword": storeID,
                },
              },
              withStatus,
            ],
            filter,
          },
        },
      };
    } else {
      searchQuery = {
        query: {
          bool: {
            must: [{ match: { "storeID.keyword": storeID } }, withStatus],
          },
        },
      };
    }
    Log.debug("searchQuery", searchQuery);

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          Log.debug("Order findById founded with result: ", json);
          const orderList = await this.createSummaryForOrderList(json, storeID);
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static findByDocId(orderID: string): Promise<Order> {
    Log.debug("Finding order by document id: " + orderID);

    return ElasticsearchClient.getInstance()
      .get(this.TYPE, orderID)
      .then(async (json: any) => {
        Log.debug("Result findByDocId is ", json);
        let summaryObj = await this.createSummaryObj(json);
        return new Order(json, json.orderID, summaryObj);
      });
  }

  public static findByOrderStatus(
    status: string,
    start: Date,
    end: Date,
    storeID?: string
  ): Promise<Order[]> {
    Log.debug("Finding order by status: " + status);

    let withStoreID = {};
    if (storeID) {
      withStoreID = { match: { "storeID.keyword": storeID } };
    }

    let searchQuery = {
      query: {
        bool: {
          must: [
            { match: { "paymentInfo.status.keyword": status } },
            withStoreID,
            { exists: { field: "paymentInfo.referenceNo" } },
            {
              range: { orderDate: { gte: start, lte: end } },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          Log.debug("Order findByOrderStatus founded with result: ", json);
          const orderList = await this.createSummaryForOrderList(json, storeID);
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static findByCustomField(fieldObj: {
    fieldName: string;
    fieldValue: string;
  }): Promise<Order[]> {
    Log.debug("Finding orderinfo by customfields with ", fieldObj);

    let searchQuery = {
      query: {
        bool: {
          must: [
            { match: { [fieldObj["fieldName"]]: fieldObj["fieldValue"] } },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          Log.debug("Result findByCustomField is ", json);
          const orderList = await this.createSummaryForOrderList(json, "");
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static findByOrderId(
    storeID: string,
    orderID: string
  ): Promise<Order[]> {
    Log.debug("Finding orderID " + orderID + "of storeID " + storeID);

    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  { match: { orderID: orderID } },
                  { match: { _id: orderID } },
                ],
                minimum_should_match: 1,
                must: [{ term: { "storeID.keyword": storeID } }],
              },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          Log.debug("Result findByOrderId is ", json);
          const orderList = await this.createSummaryForOrderList(json, storeID);
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static checkDeliveryFieldsConditions(sourceObject: Order) {
    return (
      sourceObject.hasOwnProperty("orderAdditionalDetails") &&
      sourceObject.orderAdditionalDetails.hasOwnProperty("delivery") &&
      sourceObject.orderAdditionalDetails.delivery.hasOwnProperty(
        "firstPiece"
      ) &&
      sourceObject.orderAdditionalDetails.delivery.hasOwnProperty("nextPiece")
    );
  }

  public static async createSummaryObj(
    source: Order,
    ignoreOutOfStockProduct?: boolean,
    productList?: Product[]
  ) {
    let totalQuantity: number = 0;
    let totalPrice: number = 0;
    let totalDeliveryCost: number = 0;
    let grandTotal: number = 0;
    let maxFirstPieceCost: number = 0;
    let maxFirstPieceCostIndex: number = 0;

    if (ignoreOutOfStockProduct) {
      source.selectedProduct = source.selectedProduct.filter(
        (selectedProductItem) => {
          return selectedProductItem.isOutOfStock === false;
        }
      );
    }

    let products = source.selectedProduct;
    let selectedProductInfoList = [];
    for (let i = 0; i < products.length; i++) {
      let selectedProductItem = products[i];
      let selectedProductIndex = i;

      let productInfo = null;
      let selectedProductObj = null;
      const productID = selectedProductItem.productID;
      if (productList && productList.length > 0) {
        selectedProductObj = productList.find((productInfo) => {
          return productInfo.productID === productID;
        });
      } else {
        let foundProductList: ProductInterface[] = await Product.findProductById(
          source.storeID,
          selectedProductItem.productID
        );
        if (foundProductList.length > 0) {
          selectedProductObj = foundProductList[0];
        }
      }

      if (selectedProductObj) {
        productInfo = selectedProductObj.productInfo;
        selectedProductInfoList[i] = productInfo;
      }

      if (
        productInfo &&
        productInfo.hasOwnProperty("shippingRate") &&
        productInfo.enableShippingRate
      ) {
        let productShippingRate = productInfo.shippingRate;
        if (
          Number(productShippingRate.firstpiece) > Number(maxFirstPieceCost)
        ) {
          maxFirstPieceCost = Number(productShippingRate.firstpiece);
          maxFirstPieceCostIndex = Number(selectedProductIndex);
        }
      } else {
        if (this.checkDeliveryFieldsConditions(source)) {
          let deliveryCostInfo = source.orderAdditionalDetails.delivery;
          if (Number(deliveryCostInfo.firstPiece) > Number(maxFirstPieceCost)) {
            maxFirstPieceCost = Number(deliveryCostInfo.firstPiece);
            maxFirstPieceCostIndex = Number(selectedProductIndex);
          }
        }
      }
    }

    for (let i = 0; i < products.length; i++) {
      let selectedProductItem = products[i];
      let selectedProductIndex = i;
      const productID = selectedProductItem.productID;

      let productInfo = null;
      if (selectedProductInfoList[i]) {
        productInfo = selectedProductInfoList[i];
      }
      if (productList && productList.length > 0) {
        let selectedProductObj = null;
        selectedProductObj = productList.find((productInfo) => {
          return productInfo.productID === productID;
        });
        if (
          selectedProductObj &&
          selectedProductObj.hasOwnProperty("productInfo")
        ) {
          productInfo = selectedProductObj["productInfo"];
        }
      } else {
        let foundProductList: ProductInterface[] = await Product.findProductById(
          source.storeID,
          selectedProductItem.productID
        );
        if (foundProductList.length > 0) {
          productInfo = foundProductList[0].productInfo;
        }
      }

      totalQuantity += Number(selectedProductItem.availableQuantity);
      totalPrice +=
        Number(selectedProductItem.productValue.price) *
        Number(selectedProductItem.availableQuantity);

      if (selectedProductIndex === maxFirstPieceCostIndex) {
        if (
          productInfo &&
          productInfo.hasOwnProperty("shippingRate") &&
          productInfo.enableShippingRate
        ) {
          let productShippingRate = productInfo.shippingRate;
          totalDeliveryCost +=
            Number(productShippingRate["firstpiece"]) +
            Number(productShippingRate["nextpiece"]) *
            Number(selectedProductItem.availableQuantity - 1);
        } else if (this.checkDeliveryFieldsConditions(source)) {
          let deliveryCostInfo = source.orderAdditionalDetails.delivery;
          totalDeliveryCost +=
            Number(deliveryCostInfo.firstPiece) +
            Number(deliveryCostInfo.nextPiece) *
            Number(selectedProductItem.availableQuantity - 1);
        }
      } else {
        if (
          productInfo &&
          productInfo.hasOwnProperty("shippingRate") &&
          productInfo.enableShippingRate
        ) {
          let productShippingRate = productInfo.shippingRate;
          totalDeliveryCost +=
            Number(productShippingRate["nextpiece"]) *
            Number(selectedProductItem.availableQuantity);
        } else if (this.checkDeliveryFieldsConditions(source)) {
          let deliveryCostInfo = source.orderAdditionalDetails.delivery;
          totalDeliveryCost +=
            Number(deliveryCostInfo.nextPiece) *
            Number(selectedProductItem.availableQuantity);
        }
      }
    }

    grandTotal = totalPrice + totalDeliveryCost;

    if (grandTotal > 0) {
      if (this.checkDiscount(source)) {
        let totalDiscount = Number(source["discount"]["grandTotal"]);
        grandTotal = grandTotal - totalDiscount;

        if (grandTotal <= 0) grandTotal = 1;
      }
    }

    return Promise.resolve({
      totalQuantity: totalQuantity,
      totalDeliveryCost: totalDeliveryCost,
      totalPrice: totalPrice,
      grandTotal: grandTotal,
    });
  }

  public static checkDiscount(orderDetails: Order) {
    return (
      orderDetails.hasOwnProperty("discount") &&
      orderDetails.discount.hasOwnProperty("totalDeliveryCost") &&
      orderDetails.discount.hasOwnProperty("totalPrice") &&
      orderDetails.discount.hasOwnProperty("grandTotal")
    );
  }

  public static updateByOrderId(orderID: string, updateData: any) {
    Log.debug("Updating orderID " + orderID + " with data : ", updateData);

    if (updateData.hasOwnProperty("orderDocID")) delete updateData.orderDocID;

    return ElasticsearchClient.getInstance()
      .update(this.TYPE, orderID, updateData, false)
      .then((resultUpdateOrder) => {
        Log.debug("updateByOrderId result: ", resultUpdateOrder);
        return { result: "success", orderData: resultUpdateOrder };
      })
      .catch((err) => {
        Log.error("Error while updating order by id: ", err);
        return err;
      });
  }

  public static findUUIDbyOrderId(orderID: string) {
    return ElasticsearchClient.getInstance()
      .get(this.TYPE, orderID)
      .then((result: any) => {
        return { orderUUID: result.orderID };
      })
      .catch((err) => {
        return err;
      });
  }

  public static findOrdersByProductID(
    storeID: string,
    productID: string
  ): Promise<Order[]> {
    let searchQuery = {
      query: {
        bool: {
          must: [
            { match: { "storeID.keyword": storeID } },
            { match: { "selectedProduct.productID.keyword": productID } },
            { match: { "paymentInfo.status.keyword": "SUCCESS" } },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          const orderList = await this.createSummaryForOrderList(json, storeID);
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static async exportToCsv(storeID: string, orderInfo: JSONData[]) {
    try {
      Log.debug("Exporting order to csv with data: ", orderInfo);

      let products = await Product.findById(storeID, true);
      let transactions = await FundsTransaction.findByStoreID(storeID);

      let output = orderInfo.map((order) => {
        let gbPayReferenceNo: string = "";
        let customerFBFullName: string = "";
        let customerName: string = "";
        let customerEmail: string = "";
        let customerAddress: string = "";
        let customerTelephone: string = "";
        let referenceNo: string = "";
        let gbPayLink: string = "";
        let fbPageName: string = "";
        let fee: number = 0;
        let afterFee: number = 0;
        let quantity: string = "";
        let paymentCompletedOn: string = "";

        if (order["paymentInfo"].hasOwnProperty("paymentCompletedOn")) {
          paymentCompletedOn = moment
            .unix(Number(Number(order.paymentInfo.paymentCompletedOn) / 1000))
            .format("YYYY-MM-DD HH:mm:ss");
        }

        if (order["paymentInfo"]["details"]) {
          gbPayReferenceNo = order["paymentInfo"]["details"];
        }

        if (order["userInfo"]["firstName"] && order["userInfo"]["lastName"]) {
          customerFBFullName = `${order["userInfo"]["firstName"]} ${order["userInfo"]["lastName"]}`;
        }

        if (order["paymentInfo"]["gbPaymentDetails"]["customerName"]) {
          customerName =
            order["paymentInfo"]["gbPaymentDetails"]["customerName"];
        }

        if (order["paymentInfo"]["gbPaymentDetails"]["customerEmail"]) {
          customerEmail =
            order["paymentInfo"]["gbPaymentDetails"]["customerEmail"];
        }

        if (
          order["deliveryInfo"]["address1"] ||
          order["deliveryInfo"]["address2"] ||
          order["deliveryInfo"]["subDistrict"] ||
          order["deliveryInfo"]["district"] ||
          order["deliveryInfo"]["province"] ||
          order["deliveryInfo"]["postalCode"]
        ) {
          customerAddress = `${order["deliveryInfo"]["address1"]} ${order["deliveryInfo"]["address2"]} `;
          customerAddress += `${order["deliveryInfo"]["subDistrict"]} ${order["deliveryInfo"]["district"]} `;
          customerAddress += `${order["deliveryInfo"]["province"]} ${order["deliveryInfo"]["postalCode"]}`;
        }

        if (order["deliveryInfo"]["phoneNo"]) {
          customerTelephone = `'${order["deliveryInfo"]["phoneNo"]}'`;
        }

        if (order["paymentInfo"]["gbPayLink"]) {
          gbPayLink = order["paymentInfo"]["gbPayLink"];
        }

        if (order["paymentInfo"]["referenceNo"]) {
          referenceNo = order["paymentInfo"]["referenceNo"];
        }

        if (order["channel"]["name"]) {
          fbPageName = order["channel"]["name"];
        }

        let personType: string = "";
        let businessType: string = "";
        let businessName: string = "";
        let branchName: string = "";
        let branchId: string = "";
        let taxInvoiceNumber: string = "";
        let invoiceAddress: string = "";

        if (order["taxInvoiceDetails"]) {
          if (order["taxInvoiceDetails"]["personType"]) {
            if (order["taxInvoiceDetails"]["personType"] === "LEGAL_ENTITY")
              personType = "นิติบุคคล";
            if (order["taxInvoiceDetails"]["personType"] === "INDIVIDUAL")
              personType = "บุคคลทั่วไป";
          }

          if (order["taxInvoiceDetails"]["businessType"]) {
            if (order["taxInvoiceDetails"]["businessType"] === "HEAD_OFFICE")
              businessType = "สำนักงานใหญ่";
            if (order["taxInvoiceDetails"]["businessType"] === "BRANCH")
              businessType = "สาขา";
          }

          if (order["taxInvoiceDetails"]["businessName"]) {
            businessName = `${order["taxInvoiceDetails"]["businessName"]}`;
          }

          if (order["taxInvoiceDetails"]["branchName"]) {
            branchName = `${order["taxInvoiceDetails"]["branchName"]}`;
          }

          if (order["taxInvoiceDetails"]["branchId"]) {
            branchId = `${order["taxInvoiceDetails"]["branchId"]}`;
          }

          if (order["taxInvoiceDetails"]["taxInvoiceNumber"]) {
            taxInvoiceNumber = `${order["taxInvoiceDetails"]["taxInvoiceNumber"]}`;
          }

          if (order["taxInvoiceDetails"]["invoiceAddress"]) {
            invoiceAddress = `${order["taxInvoiceDetails"]["invoiceAddress"]}`;
          }
        }

        let shippingMethod: string;
        let trackingNumber: string;
        let isTrackingSent: string;

        if (order["trackingNumber"]) {
          trackingNumber = order["trackingNumber"];
        }

        if (order["shippingMethod"]) {
          shippingMethod = order["shippingMethod"];
        }

        if (order.hasOwnProperty("isTrackingSent")) {
          isTrackingSent = order["isTrackingSent"] ? "Yes" : "No";
        }

        let selectedProductList: string = "";
        let selectedProductPriceList: string = "";
        let selectedProductHashtag: string = "";
        let selectedProductSKU: string = "";
        order.selectedProduct.forEach((product, index) => {
          let size;
          let color;
          let price;
          let tempQuantity;
          let concatAll;
          let sku;

          if (product["productValue"]["size"]) {
            size = `${product["productValue"]["size"]}`;
          }

          if (Object.keys(product["productValue"]["colorObj"]).length > 0) {
            color = `${product["productValue"]["colorObj"]["label"]}`;
          }

          if (product["productValue"]["price"]) {
            price = `${product["productValue"]["price"]}`;
          }

          if (product["availableQuantity"]) {
            tempQuantity = product["availableQuantity"];
          } else {
            tempQuantity = 1;
          }

          if (color && size) {
            concatAll = `${color} - ${size}`;
          } else {
            concatAll = ``;
          }
          quantity += `${tempQuantity}\n`;

          if (index >= 0) {
            selectedProductList += `${product["productNameWithoutColor"]} ${concatAll} \n`;
            let resultFindProduct = products.find((item: ProductInterface) => {
              return item.productID === product.productID;
            });
            selectedProductPriceList += `${price} \n`;

            if (resultFindProduct) {
              selectedProductHashtag += `#${resultFindProduct["productInfo"]["productHashtag"]} \n`;
              if (product["productValue"]["sku"])
                selectedProductSKU += `${product["productValue"]["sku"]} \n`;
            } else {
              selectedProductHashtag += `- \n`;
              selectedProductSKU = `- \n`;
            }
          }

          if (/SUCCESS/.test(order["paymentInfo"]["status"])) {
            let matchedTransaction: FundsTransaction;
            if (transactions.length > 0) {
              matchedTransaction = transactions.find(
                (transaction: FundsTransaction) => {
                  return transaction.orderInfo.orderID === order.orderID;
                }
              );
            }

            if (matchedTransaction) {
              fee = matchedTransaction.fee;
              afterFee = matchedTransaction.actualAmount;
            }
          }
        });
        return {
          referenceNo: referenceNo,
          orderID: order.orderID,
          orderDate: moment
            .unix(Number(order.orderDate / 1000))
            .format("YYYY-MM-DD HH:mm:ss"),
          paymentDate: paymentCompletedOn,
          customerFBFullName: customerFBFullName,
          customerName: customerName,
          customerEmail: customerEmail,
          customerAddress: customerAddress,
          customerTelephone: customerTelephone,
          quantity: quantity,
          selectedProduct: selectedProductList,
          productPrice: selectedProductPriceList,
          productHashtag: selectedProductHashtag,
          productSKU: selectedProductSKU,
          paymentStatus: order.paymentInfo.status,
          paymentMethod: order.paymentInfo.method,
          totalPrice:
            order.summary.totalPrice ||
            order.selectedProduct[0].productValue.price,
          totalDeliveryCost: order.summary.totalDeliveryCost,
          grandTotal: order.summary.grandTotal || 1,
          fee: fee,
          afterFee: afterFee,
          gbPayReferenceNo: gbPayReferenceNo,
          gbPayLink: gbPayLink,
          fbPageName: fbPageName,
          personType: personType,
          businessType: businessType,
          businessName: businessName,
          branchName: branchName,
          branchId: branchId,
          taxInvoiceNumber: taxInvoiceNumber,
          invoiceAddress: invoiceAddress,
          shippingMethod: shippingMethod,
          trackingNumber: trackingNumber,
          isTrackingSent: isTrackingSent,
        };
      });

      let fields = [
        "referenceNo",
        "orderID",
        "orderDate",
        "paymentDate",
        "customerFBFullName",
        "customerName",
        "customerEmail",
        "customerAddress",
        "customerTelephone",
        "selectedProduct",
        "productPrice",
        "quantity",
        "productHashtag",
        "productSKU",
        "paymentStatus",
        "paymentMethod",
        "totalPrice",
        "totalDeliveryCost",
        "grandTotal",
        "fee",
        "afterFee",
        "gbPayReferenceNo",
        "gbPayLink",
        "fbPageName",
        "personType",
        "businessType",
        "businessName",
        "branchName",
        "branchId",
        "taxInvoiceNumber",
        "invoiceAddress",
        "shippingMethod",
        "trackingNumber",
        "isTrackingSent",
      ];

      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(output);

      return csv;
    } catch (error) {
      Log.error("Error while exporting to csv with: ", error);
      throw error;
    }
  }

  public static checkGBPaymentDetails(
    gbPaymentDetailsObj: gbPaymentDetailsJSON
  ) {
    let propertyChecklist = [
      "customerName",
      "customerEmail",
      "customerAddress",
      "customerTelephone",
    ];
    let count: number = 0;
    let isHasAllProperty: boolean = false;

    propertyChecklist.forEach((property) => {
      if (
        gbPaymentDetailsObj.hasOwnProperty(property) &&
        gbPaymentDetailsObj[property] !== ""
      ) {
        count += 1;
      }
    });

    if (propertyChecklist.length === count) {
      isHasAllProperty = true;
    }

    return isHasAllProperty;
  }

  public static checkReturningUser(userID: string, storeID: string) {
    let searchQuery = {
      query: {
        bool: {
          must: [
            { match: { userID: userID } },
            { match: { storeID: storeID } },
          ],
          must_not: [
            {
              term: { "paymentInfo.gbPaymentDetails.customerName.keyword": "" },
            },
            {
              term: {
                "paymentInfo.gbPaymentDetails.customerEmail.keyword": "",
              },
            },
            {
              term: {
                "paymentInfo.gbPaymentDetails.customerAddress.keyword": "",
              },
            },
            {
              term: {
                "paymentInfo.gbPaymentDetails.customerTelephone.keyword": "",
              },
            },
          ],
        },
      },
      sort: [{ orderDate: "desc" }],
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then((json: any) => {
        Log.debug(
          "Checking userid " +
          userID +
          " of storeid " +
          storeID +
          " is returning user or not with query: ",
          searchQuery
        );

        let resultReturningUser: returningUserJSON = {
          isReturningUser: false,
        };

        if (json && json.length > 0) {
          let source = json[0]["_source"];
          resultReturningUser["isReturningUser"] = true;
          resultReturningUser["additionalDetails"] = {
            userInfo: source["userInfo"],
            customerName:
              source["paymentInfo"]["gbPaymentDetails"]["customerName"],
            customerEmail:
              source["paymentInfo"]["gbPaymentDetails"]["customerEmail"],
            customerAddress:
              source["paymentInfo"]["gbPaymentDetails"]["customerAddress"],
            customerTelephone:
              source["paymentInfo"]["gbPaymentDetails"]["customerTelephone"],
          };
        } else {
          resultReturningUser["isReturningUser"] = false;
        }

        Log.debug(
          "Check returning user success, returning with ",
          resultReturningUser
        );

        return resultReturningUser;
      })
      .catch((error) => {
        Log.error("Error while checking return user with error", error);
        throw error;
      });
  }

  public static async verifyOrderForProcessTransaction(
    referenceNo: string,
    amount: string
  ) {
    try {
      Log.debug(
        "Verifying order for process transaction for referenceNo: " +
        referenceNo
      );
      let orderInfo = await this.findByCustomField({
        fieldName: "paymentInfo.referenceNo",
        fieldValue: referenceNo,
      });
      if (orderInfo.length === 0) {
        // Finding by referenceNo is return zero result?, find with link id of gbPayLink instead.
        orderInfo = await this.findByCustomField({
          fieldName: "paymentInfo.gbPayLink",
          fieldValue: referenceNo,
        });
      }

      let selectedProductList = orderInfo[0]["selectedProduct"];
      let cartID = orderInfo[0]["cartID"];
      let requestAmount = parseFloat(amount);
      let hasBookingProductExpired = false;

      return new Promise((resolve, reject) => {
        try {
          selectedProductList.forEach(async (product, index) => {
            let productID = product["productID"];
            let color = "";
            let size = "";
            let resultCheckInventory;

            Log.debug(
              `Checking productID: ${productID} is out of booking or not...`
            );

            if (product["productValue"]["colorObj"].hasOwnProperty("value")) {
              color = product["productValue"]["colorObj"]["value"];
            }

            if (product["productValue"]["size"]) {
              size = product["productValue"]["size"];
            }

            if (color && size) {
              resultCheckInventory = await ProductBooking.checkProductBookingByProductId(
                cartID,
                productID,
                color,
                size
              );
            } else {
              resultCheckInventory = await ProductBooking.checkProductBookingByProductId(
                cartID,
                productID
              );
            }

            if (resultCheckInventory["stock"] >= product["availableQuantity"]) {
              Log.debug(
                `ProductID ${productID} is booking in cartID ${cartID}, next...`
              );
            } else {
              Log.debug(
                `ProductID ${productID} is out of booking in cartID ${cartID}, ignoring...`
              );
              hasBookingProductExpired = true;
            }

            if (index === selectedProductList.length - 1) {
              resolve({ hasBookingProductExpired: hasBookingProductExpired });
            }
          });
        } catch (error) {
          reject(error);
          throw error;
        }
      }).then((checkBookingProductResult: any) => {
        Log.debug(
          `Check booking selected product of orderID: ${orderInfo[0]["orderDocID"]} is done!! result: `,
          checkBookingProductResult
        );
        if (checkBookingProductResult.hasBookingProductExpired) {
          Log.debug(
            `Product booking in orderID: ${orderInfo[0]["orderDocID"]} is expired, returning reject status and sending message to chat`
          );
          let userID = orderInfo[0]["userID"];
          let message =
            process.env.CHATBOT_PRODUCT_OUT_OF_BOOKING_MESSAGE ||
            "ขออภัยค่ะ คุณไม่ได้ชำระค่าสินค้าภายในระยะเวลาที่กำหนด กรุณากดสั่งซื้อสินค้าใหม่อีกครั้งนะคะ 😅";
          Channel.sendCustomMessage({ userID: userID, message: message });
          return { status: "REJECT" };
        } else {
          Log.debug(
            `All product booking in orderID: ${orderInfo[0]["orderDocID"]} are available, returning approve status`
          );
          return { status: "APPROVE" };
        }
      });
    } catch (error) {
      Log.error(
        "Error while verifying order for process transaction with : ",
        error
      );
      throw error;
    }
  }

  public static findOrderByCustomerWithCustomRange(
    storeID: string,
    userID: string,
    timestamp: number
  ): Promise<Order[]> {
    Log.debug(
      "Finding order with StoreID " +
      storeID +
      " and userID " +
      userID +
      " with timestamp " +
      timestamp
    );
    let endRangeTimestamp = timestamp + 900000;
    Log.debug("end range timestamp : " + endRangeTimestamp);
    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              match: {
                "storeID.keyword": storeID,
              },
            },
            {
              match: {
                "userID.keyword": userID,
              },
            },
            {
              range: {
                orderDate: {
                  gte: timestamp,
                  lt: endRangeTimestamp,
                },
              },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          Log.debug("Result findOrderByOrderId is ", json);
          const orderList = await this.createSummaryForOrderList(json, "");
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static findOrderByOrderId(orderID: string): Promise<Order[]> {
    Log.debug("Finding orderID " + orderID);

    let searchQuery = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  { match: { orderID: orderID } },
                  { match: { _id: orderID } },
                ],
                minimum_should_match: 1,
              },
            },
          ],
        },
      },
    };

    return ElasticsearchClient.getInstance()
      .search(this.TYPE, searchQuery)
      .then(async (json: any) => {
        if (json && json.length > 0) {
          Log.debug("Result findOrderByOrderId is ", json);
          const orderList = await this.createSummaryForOrderList(json, "");
          return Promise.resolve(orderList);
        } else {
          return [];
        }
      });
  }

  public static async createSummaryForOrderList(
    json: ElasticsearchQueryResultDocument[],
    storeID?: string
  ): Promise<Order[]> {
    let resultArray = [];

    let productList = [];
    if (storeID && storeID.length > 0) {
      productList = await Product.findById(storeID);
    } else {
      const storeIDs = json.map((order) => order._source.storeID);

      productList = [];
      const query = {
        query: {
          bool: {
            should: [
              storeIDs.map((storeID) => ({
                match: {
                  "storeID.keyword": storeID,
                },
              })),
            ],
          },
        },
      };

      const _products = await Product.customQuery(query);
      const _tmpProducts = _products.map(
        (_product) => new Product(_product._source, _product._id)
      );

      productList = _tmpProducts;
    }

    for (const result of json) {
      let summaryObj = await this.createSummaryObj(
        result._source,
        false,
        productList
      );
      let customFields = {
        _id: result._id,
        orderID: result._source.orderID,
        orderDocID: result._source.orderDocID,
      };
      resultArray.push(
        new Order(result._source, result._id, summaryObj, customFields)
      );
    }
    return Promise.resolve(resultArray);
  }
}
