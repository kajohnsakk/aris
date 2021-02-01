import { CartManager } from "./CartManager";
import { StoreManager } from "./StoreManager";
import { CustomerManager } from "./CustomerManager";
import { ChannelManager } from "./ChannelManager";
import { Payment, inputGBPayDataJSON } from "./Payment";

import { ICart, ISelectedProductJSON } from "./interfaces/Cart";
import { ICustomer } from "./interfaces/Customer";
import { IStore } from "./interfaces/Store";

import { ApiProxy } from "../modules/ApiProxy";
import { ExternalProxy } from "../modules/ExternalProxy";

import { Log } from "../utils/Log";
import { AsyncForEach } from "../utils/AsyncForEach";
import { Utils } from "../utils/Utils";

const INSTANCE_NAME = process.env.INSTANCE_NAME;
interface IInitMandatoryVariable {
  cartID: string;
  cartDetailsObj: ICart;
  customerDetailsObj: ICustomer;
  storeDetailsObj: IStore;
  storeGBPayToken: string;
  recipientAccountType: string;
  constantVariables: { [key: string]: any };
  dynamicVariables: { [key: string]: any };
}

interface IDoCodActionResponseObject {
  status: boolean;
  cod: boolean;
}

interface ICreateOrderBodyResponseObject {
  _id: string;
  orderID: string;
  paymentReferenceNo: string;
}

export class OrderManager {
  public static async updateOrderByID(
    orderID: string,
    storeID: string,
    updateBody: { [key: string]: any }
  ) {
    Log.debug(
      "[OrderManager] Updating order id: " +
        orderID +
        " of storeID : " +
        storeID +
        " with body: ",
      updateBody
    );

    try {
      const resultUpdateOrder = await ApiProxy.getInstance().sendRequest(
        "POST",
        `/order/storeID/${storeID}/orderID/${orderID}/update`,
        updateBody
      );
      return Promise.resolve(resultUpdateOrder);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public static async initMandatoryVariable(
    cartID: string,
    actionType: "COD" | "PAYMENT"
  ): Promise<IInitMandatoryVariable> {
    try {
      Log.debug(
        "[OrderManager] Initialing mandatory variable for cartID: " +
          cartID +
          " and actionType: " +
          actionType
      );

      cartID = Utils.decodeBase64(cartID);
      const resultCartDetails = await CartManager.getCartDetailsFromBooking(
        cartID
      );
      const resultCustomerDetails = await CustomerManager.checkCustomerExists(
        resultCartDetails["storeID"],
        resultCartDetails["userID"]
      );
      const resultStoreDetail = await StoreManager.getStoreDetails(
        resultCartDetails["storeID"]
      );

      const storeGbPayToken =
        resultStoreDetail["storeInfo"]["paymentInfo"]["gbPayInfo"]["token"];

      const constantVariables = this.initConstantVariables(actionType);

      let recipientAccountType: string = "MERCHANT_BANK_ACCOUNT";
      if (constantVariables["defaultGbPayToken"] === storeGbPayToken) {
        recipientAccountType = "GB_PAY_WALLET";
      }

      await this.deleteStringify(resultCartDetails);

      const dynamicVariables = await this.initDynamicVariables(
        resultCartDetails,
        resultCustomerDetails
      );

      return {
        cartID: cartID,
        cartDetailsObj: resultCartDetails,
        customerDetailsObj: resultCustomerDetails,
        storeDetailsObj: resultStoreDetail,
        storeGBPayToken: storeGbPayToken,
        recipientAccountType: recipientAccountType,
        constantVariables: constantVariables,
        dynamicVariables: dynamicVariables,
      };
    } catch (error) {
      Log.error(
        "[OrderManager] Error while initialing order body for cartID: " +
          cartID +
          " with error: ",
        error
      );
      throw error;
    }
  }

  private static initConstantVariables(actionType: "COD" | "PAYMENT") {
    Log.debug(
      "[OrderManager] Initialing constant variable for actionType: " +
        actionType
    );
    const defaultGbPayToken =
      process.env.DEFAULT_GB_PAY_TOKEN ||
      "yrFKx7r0eZTfEQKJUdRunZTtKOAXthFLZQ4ds0AdDSZpDMQaSEw9mw2+EyYn9FsgZm3gwvrlgMq5KRl0l5Rw/p40fbZ10rkUYkrFDJT3lg81LtfcpgL0gVbuU0mqc10L2ErhxSZrHqYgY8SCRWFTou03yoDKkaKZxlpdPM7XdblRfQLT";
    const defaultRedirectURL =
      process.env.DEFAULT_REDIRECT_URL || "about:blank";
    const paymentWebhook = process.env.PAYMENT_WEBHOOK_URL || "about:blank";
    let responseUrl = `${process.env.WEB_URL}site/cart/status`;
    let referenceNo = Utils.generateReferenceNo();

    if (actionType === "COD") {
      referenceNo = "";
      responseUrl = "";
    }

    return {
      referenceNo: referenceNo,
      defaultGbPayToken: defaultGbPayToken,
      defaultRedirectURL: defaultRedirectURL,
      paymentWebhook: paymentWebhook,
      responseUrl: responseUrl,
    };
  }

  private static async initDynamicVariables(
    cartDetailsObj: ICart,
    customerDetailsObj: ICustomer
  ) {
    Log.debug(
      "[OrderManager] Initialing dynamic variable for cartDetailsObj: ",
      cartDetailsObj,
      " customerDetailsObj: ",
      customerDetailsObj
    );
    let userInfoFirstName: string;
    let userInfoLastName: string;
    let deliveryCustomerName: string;
    let deliveryInfoFirstName: string;
    let deliveryInfoLastName: string;
    let deliveryInfoEmail: string;
    let deliveryInfoPhoneNo: string;
    let deliveryInfoAddress: string;
    let deliveryInfoSubDistrict: string;
    let deliveryInfoDistrict: string;
    let deliveryInfoProvince: string;
    let deliveryInfoPostalCode: string;
    let taxInvoiceDetailsBusinessType: string;
    let taxInvoiceDetailsPersonType: string;
    let taxInvoiceDetailsBusinessName: string;
    let taxInvoiceDetailsBranchName: string;
    let taxInvoiceDetailsBranchId: string;
    let taxInvoiceDetailsTaxInvoiceNumber: string;
    let taxInvoiceDetailsInvoiceAddress: string;
    let channelInfo = {};
    let discount = {};

    userInfoFirstName = this.checkExistsValue(
      cartDetailsObj["userInfo"],
      "firstName",
      ""
    );
    userInfoLastName = this.checkExistsValue(
      cartDetailsObj["userInfo"],
      "lastName",
      ""
    );
    deliveryCustomerName = this.checkExistsValue(
      customerDetailsObj["result"][0],
      "customerName",
      ""
    );
    if (customerDetailsObj["result"][0].hasOwnProperty("userInfo")) {
      deliveryInfoFirstName = this.checkExistsValue(
        customerDetailsObj["result"][0],
        "firstName",
        ""
      );
      deliveryInfoLastName = this.checkExistsValue(
        customerDetailsObj["result"][0],
        "lastName",
        ""
      );
    }
    deliveryInfoEmail = this.checkExistsValue(
      customerDetailsObj["result"][0],
      "customerEmail",
      ""
    );
    deliveryInfoPhoneNo = this.checkExistsValue(
      customerDetailsObj["result"][0],
      "customerPhoneNo",
      ""
    );
    deliveryInfoAddress = this.checkExistsValue(
      customerDetailsObj["result"][0],
      "customerAddress",
      ""
    );
    if (
      customerDetailsObj["result"][0].hasOwnProperty("customerAddressDetails")
    ) {
      deliveryInfoSubDistrict = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerAddressDetails"],
        "subDistrict",
        ""
      );
      deliveryInfoDistrict = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerAddressDetails"],
        "district",
        ""
      );
      deliveryInfoProvince = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerAddressDetails"],
        "province",
        ""
      );
      deliveryInfoPostalCode = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerAddressDetails"],
        "postalCode",
        ""
      );
    }
    if (
      customerDetailsObj["result"][0].hasOwnProperty(
        "customerTaxInvoiceDetails"
      ) &&
      customerDetailsObj["result"][0]["isEnableTaxInvoice"]
    ) {
      taxInvoiceDetailsBusinessType = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "businessType",
        ""
      );
      taxInvoiceDetailsPersonType = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "personType",
        ""
      );
      taxInvoiceDetailsBusinessName = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "businessName",
        ""
      );
      taxInvoiceDetailsBranchName = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "branchName",
        ""
      );
      taxInvoiceDetailsTaxInvoiceNumber = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "taxInvoiceNumber",
        ""
      );
      taxInvoiceDetailsInvoiceAddress = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "invoiceAddress",
        ""
      );
      taxInvoiceDetailsBranchId = this.checkExistsValue(
        customerDetailsObj["result"][0]["customerTaxInvoiceDetails"],
        "branchId",
        ""
      );
    }
    channelInfo = this.checkExistsValue(cartDetailsObj, "channel", {});
    discount = this.checkExistsValue(cartDetailsObj, "discount", {});

    if (userInfoFirstName.length === 0 && userInfoLastName.length === 0) {
      const resultSalesChannelDetails = await StoreManager.getSalesChannelDetails(
        cartDetailsObj["storeID"]
      );
      const resultGetUserInfo = await ChannelManager.getUserInfo(
        cartDetailsObj["userID"],
        resultSalesChannelDetails[0]["channels"]["facebookSelectedPage"][
          "access_token"
        ]
      );

      if (!userInfoFirstName)
        userInfoFirstName = resultGetUserInfo["first_name"];
      if (!userInfoLastName) userInfoLastName = resultGetUserInfo["last_name"];
    }

    return {
      userInfoFirstName: userInfoFirstName,
      userInfoLastName: userInfoLastName,
      deliveryCustomerName: deliveryCustomerName,
      deliveryInfoFirstName: deliveryInfoFirstName,
      deliveryInfoLastName: deliveryInfoLastName,
      deliveryInfoEmail: deliveryInfoEmail,
      deliveryInfoPhoneNo: deliveryInfoPhoneNo,
      deliveryInfoAddress: deliveryInfoAddress,
      deliveryInfoSubDistrict: deliveryInfoSubDistrict,
      deliveryInfoDistrict: deliveryInfoDistrict,
      deliveryInfoProvince: deliveryInfoProvince,
      deliveryInfoPostalCode: deliveryInfoPostalCode,
      taxInvoiceDetailsPersonType: taxInvoiceDetailsPersonType,
      taxInvoiceDetailsBusinessType: taxInvoiceDetailsBusinessType,
      taxInvoiceDetailsBusinessName: taxInvoiceDetailsBusinessName,
      taxInvoiceDetailsBranchName: taxInvoiceDetailsBranchName,
      taxInvoiceDetailsTaxInvoiceNumber: taxInvoiceDetailsTaxInvoiceNumber,
      taxInvoiceDetailsInvoiceAddress: taxInvoiceDetailsInvoiceAddress,
      taxInvoiceDetailsBranchId: taxInvoiceDetailsBranchId,
      channelInfo: channelInfo,
      discount: discount,
    };
  }

  private static async deleteStringify(cartDetailsObj: ICart) {
    Log.debug("[OrderManager] Deleting stringify from cartDetailsObj...");
    await AsyncForEach.foreach(
      cartDetailsObj["selectedProduct"],
      async (cartDetails: ISelectedProductJSON, i: number) => {
        if (cartDetails.hasOwnProperty("stringify")) {
          delete cartDetails["selectedProduct"][i]["stringify"];
          Log.debug(cartDetails["selectedProduct"][i]["stringify"]);
        }
      }
    );
  }

  private static checkExistsValue(
    objectToCheck: { [key: string]: any },
    fieldToCheckInObject: string,
    defaultValue: string | object
  ): any {
    let returnValue = defaultValue;

    if (
      objectToCheck &&
      typeof objectToCheck === "object" &&
      objectToCheck.hasOwnProperty(fieldToCheckInObject)
    ) {
      returnValue = objectToCheck[fieldToCheckInObject];
    }

    return returnValue;
  }

  private static async createOrderBody(
    cartID: string,
    actionType: "COD" | "PAYMENT"
  ) {
    try {
      Log.debug(
        "[OrderManager] Creating order body for cartID: " +
          cartID +
          " actionType: " +
          actionType
      );

      const data: IInitMandatoryVariable = await this.initMandatoryVariable(
        cartID,
        actionType
      );

      return {
        storeID: data["cartDetailsObj"]["storeID"],
        userID: data["cartDetailsObj"]["userID"],
        userInfo: {
          firstName: data["dynamicVariables"]["userInfoFirstName"],
          lastName: data["dynamicVariables"]["userInfoLastName"],
        },
        recipientAccountType: data["recipientAccountType"],
        orderAdditionalDetails: {
          delivery: {
            firstPiece: data["cartDetailsObj"]["deliveryCost"]["firstPiece"],
            nextPiece: data["cartDetailsObj"]["deliveryCost"]["nextPiece"],
          },
        },
        selectedProduct: data["cartDetailsObj"]["selectedProduct"],
        paymentInfo: {
          method: "N/A",
          status: "PENDING",
          details: "",
          gbPaymentDetails: {
            customerName: "",
            customerEmail: "",
            customerAddress: "",
            customerTelephone: "",
          },
          pressedPayBtnTimestamp: Date.now(),
          referenceNo: data["constantVariables"]["referenceNo"],
        },
        deliveryInfo: {
          firstName: data["dynamicVariables"]["deliveryInfoFirstName"],
          lastName: data["dynamicVariables"]["deliveryInfoLastName"],
          customerName: data["dynamicVariables"]["deliveryCustomerName"],
          phoneNo: data["dynamicVariables"]["deliveryInfoPhoneNo"],
          address1: data["dynamicVariables"]["deliveryInfoAddress"],
          address2: "",
          subDistrict: data["dynamicVariables"]["deliveryInfoSubDistrict"],
          district: data["dynamicVariables"]["deliveryInfoDistrict"],
          province: data["dynamicVariables"]["deliveryInfoProvince"],
          postalCode: data["dynamicVariables"]["deliveryInfoPostalCode"],
        },
        taxInvoiceDetails: {
          personType: data["dynamicVariables"]["taxInvoiceDetailsPersonType"],
          businessType:
            data["dynamicVariables"]["taxInvoiceDetailsBusinessType"],
          businessName:
            data["dynamicVariables"]["taxInvoiceDetailsBusinessName"],
          branchName: data["dynamicVariables"]["taxInvoiceDetailsBranchName"],
          branchId: data["dynamicVariables"]["taxInvoiceDetailsBranchId"],
          taxInvoiceNumber:
            data["dynamicVariables"]["taxInvoiceDetailsTaxInvoiceNumber"],
          invoiceAddress:
            data["dynamicVariables"]["taxInvoiceDetailsInvoiceAddress"],
        },
        cartID: data["cartID"],
        channel: data["dynamicVariables"]["channelInfo"],
        discount: data["dynamicVariables"]["discount"],
      };
    } catch (error) {
      Log.error("[OrderManager] Error while creating order body: ", error);
      throw error;
    }
  }

  public static async createOrder(
    cartID: string,
    actionType: "COD" | "PAYMENT"
  ) {
    try {
      const orderBody = await this.createOrderBody(cartID, actionType);

      Log.debug(
        "[OrderManager] Creating new order for cartID: " +
          cartID +
          " with body: ",
        orderBody
      );

      const resultCreateOrder = await ApiProxy.getInstance().sendRequest(
        "POST",
        `/order/new`,
        orderBody
      );

      const payload = { orderID: resultCreateOrder.orderID };

      await ExternalProxy.getInstance().sendRequest({
        uri: `https://${INSTANCE_NAME}.convolab.ai/chatlogic/events/checkRevisit`,
        method: "POST",
        body: {
          key: "facebookid",
          value: orderBody.userID,
          sender: "web",
          source: "system-event",
          channelType: "facebook",
          log_to_message_history: false,
          payload: JSON.stringify(payload),
        },
      });

      Log.debug(
        "[OrderManager] Result from create order for cartID: " +
          cartID +
          " is: ",
        resultCreateOrder
      );
      return Promise.resolve(resultCreateOrder);
    } catch (error) {
      Log.error("[OrderManager] Error while creating order: ", error);
      return Promise.reject(error);
    }
  }

  private static async postCodWebhook(
    cartDetailsObj: ICart,
    resultCreateNewOrder: ICreateOrderBodyResponseObject,
    customerDetailsObj: ICustomer
  ) {
    try {
      Log.debug("[OrderManager] Posting cod request to webhook...");
      const customerName = customerDetailsObj["customerName"];
      const customerEmail = customerDetailsObj["customerEmail"];
      const customerAddress = `${customerDetailsObj["customerAddress"]} ${customerDetailsObj["customerAddressDetails"]["subDistrict"]} ${customerDetailsObj["customerAddressDetails"]["district"]} ${customerDetailsObj["customerAddressDetails"]["province"]} ${customerDetailsObj["customerAddressDetails"]["postalCode"]}`;
      const customerTelephone = customerDetailsObj["customerPhoneNo"];

      const webhookBody = {
        amount: cartDetailsObj["summary"]["grandTotal"],
        referenceNo: "CASH_ON_DELIVERY",
        gbpReferenceNo: "CASH_ON_DELIVERY",
        currencyCode: "764",
        resultCode: "00",
        totalAmount: cartDetailsObj["summary"]["grandTotal"],
        thbAmount: cartDetailsObj["summary"]["grandTotal"],
        detail: "",
        customerName: customerName,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        customerTelephone: customerTelephone,
        merchantDefined1: resultCreateNewOrder["orderID"],
        merchantDefined2: resultCreateNewOrder["_id"],
        merchantDefined3: cartDetailsObj["storeID"],
        merchantDefined4: cartDetailsObj["cartID"],
        useCashOnDelivery: true,
      };

      const resultPostToWebhook = await Payment.postToWebhook(webhookBody);
      return Promise.resolve(resultPostToWebhook);
    } catch (error) {
      Log.error(
        "[OrderManager] Error while posting cod request to webhook: ",
        error
      );
      return Promise.reject(error);
    }
  }

  private static async doCodAction(cartID: string) {
    try {
      Log.debug(
        "[OrderManager] Starting COD Action for cartID: " + cartID + "..."
      );
      const resultInitMandatoryVariable = await this.initMandatoryVariable(
        cartID,
        "COD"
      );
      const resultCreateOrder = await this.createOrder(cartID, "COD");

      let result: Object = { isCodActionDone: false, cod: true };
      if (resultCreateOrder) {
        const resultPostCodWebhook = await this.postCodWebhook(
          resultInitMandatoryVariable["cartDetailsObj"],
          resultCreateOrder,
          resultInitMandatoryVariable["customerDetailsObj"]["result"][0]
        );
        if (resultPostCodWebhook === 200) result["isCodActionDone"] = true;
      }

      Log.debug("[OrderManager] COD action is done, returning: ", result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  private static async initGBInputData(
    cartID: string,
    resultCreateOrder: ICreateOrderBodyResponseObject
  ) {
    try {
      Log.debug("[OrderManager] Creating gb input data for cartID: " + cartID);

      const resultInitMandatoryVariable = await this.initMandatoryVariable(
        cartID,
        "PAYMENT"
      );

      const customerDetailsObj =
        resultInitMandatoryVariable["customerDetailsObj"]["result"][0];

      const customerName = customerDetailsObj["customerName"];
      const customerEmail = customerDetailsObj["customerEmail"];
      const customerAddress = `${customerDetailsObj["customerAddress"]} ${customerDetailsObj["customerAddressDetails"]["subDistrict"]} ${customerDetailsObj["customerAddressDetails"]["district"]} ${customerDetailsObj["customerAddressDetails"]["province"]} ${customerDetailsObj["customerAddressDetails"]["postalCode"]}`;
      const customerTelephone = customerDetailsObj["customerPhoneNo"];

      let gbInputData: inputGBPayDataJSON = {
        token: resultInitMandatoryVariable["storeGBPayToken"],
        amount:
          resultInitMandatoryVariable["cartDetailsObj"]["summary"][
            "grandTotal"
          ],
        referenceNo: resultCreateOrder["paymentReferenceNo"],
        customerName: customerName,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        customerTelephone: customerTelephone,
        responseUrl:
          resultInitMandatoryVariable["constantVariables"]["responseUrl"],
        backgroundUrl:
          resultInitMandatoryVariable["constantVariables"]["paymentWebhook"],
        merchantDefined1: resultCreateOrder["orderID"],
        merchantDefined2: resultCreateOrder["_id"],
        merchantDefined3:
          resultInitMandatoryVariable["cartDetailsObj"]["storeID"],
        merchantDefined4:
          resultInitMandatoryVariable["cartDetailsObj"]["cartID"],
        merchantDefined5:
          resultInitMandatoryVariable["cartDetailsObj"]["channel"]["name"],
      };

      Log.debug(
        "[OrderManager] Init gb input data is done, returning: ",
        gbInputData
      );
      return gbInputData;
    } catch (error) {
      Log.error("[OrderManager] Error while initialing GBInputData: ", error);
      throw error;
    }
  }

  private static async doCreditCardAction(
    cartID: string,
    resultCreateOrder: ICreateOrderBodyResponseObject
  ) {
    try {
      Log.debug(
        "[OrderManager] Processing credit card action for cartID: " + cartID
      );

      let result: Object = { isCreditCardActionDone: false };

      const gbInputData: inputGBPayDataJSON = await this.initGBInputData(
        cartID,
        resultCreateOrder
      );

      const resultGeneratedLink = await Payment.generateGBPayLink(gbInputData);

      if (resultGeneratedLink["resultCode"] === "00") {
        const destination = resultGeneratedLink["gbLinkUrl"];
        const updateBody = {
          paymentInfo: {
            referenceNo: resultGeneratedLink["referenceNo"],
            gbPayLink: destination,
          },
        };

        const resultInitMandatoryVariable = await this.initMandatoryVariable(
          cartID,
          "PAYMENT"
        );
        const resultUpdateLinkToOrder = await this.updateOrderByID(
          resultCreateOrder["_id"],
          resultInitMandatoryVariable["cartDetailsObj"]["storeID"],
          updateBody
        );
        if (resultUpdateLinkToOrder) {
          result["isCreditCardActionDone"] = true;
          result["response"] = destination;
        }
      }

      Log.debug(
        "[OrderManager] Credit card action is done, returning: ",
        result
      );
      return result;
    } catch (error) {
      Log.error(
        "[OrderManager] Error while processing credit card action: ",
        error
      );
      throw error;
    }
  }

  private static async doQRCodeAction(
    cartID: string,
    resultCreateOrder: ICreateOrderBodyResponseObject
  ) {
    try {
      Log.debug(
        "[OrderManager] Processing qr code action for cartID: " + cartID
      );

      let result: Object = { isQRCodeActionDone: false };

      const gbInputData: inputGBPayDataJSON = await this.initGBInputData(
        cartID,
        resultCreateOrder
      );

      const resultCreateQRCode = await Payment.createQRCode(gbInputData);
      if (resultCreateQRCode) {
        result["isCreditCardActionDone"] = true;
        result["response"] = new Buffer(resultCreateQRCode).toString("base64");
      }

      Log.debug("[OrderManager] QRCode action is done, returning: ", result);
      return result;
    } catch (error) {
      Log.error(
        "[OrderManager] Error while processing qr code action: ",
        error
      );
      throw error;
    }
  }

  private static async doPaymentAction(
    cartID: string,
    paymentMethod: "CARD" | "QR"
  ) {
    try {
      Log.debug(
        "[OrderManager] Starting PAYMENT action for cartID: " +
          cartID +
          " with paymentMethod: " +
          paymentMethod
      );

      const resultCreateOrder = await this.createOrder(cartID, "PAYMENT");

      let resultPaymentAction: Object = { isPaymentActionDone: false };

      if (resultCreateOrder) {
        if (paymentMethod === "CARD") {
          const resultDoCreditCardAction = await this.doCreditCardAction(
            cartID,
            resultCreateOrder
          );

          resultPaymentAction["isPaymentActionDone"] = true;
          resultPaymentAction["paymentMethod"] = "CARD";
          resultPaymentAction["result"] = resultDoCreditCardAction;
        } else if (paymentMethod === "QR") {
          const resultDoQRCodeAction = await this.doQRCodeAction(
            cartID,
            resultCreateOrder
          );

          resultPaymentAction["isPaymentActionDone"] = true;
          resultPaymentAction["paymentMethod"] = "QR";
          resultPaymentAction["result"] = resultDoQRCodeAction;
        }
      }

      Log.debug(
        "[OrderManager] Payment action is done, returning: ",
        resultPaymentAction
      );
      return resultPaymentAction;
    } catch (error) {
      Log.error(
        "[OrderManager] Error while processing payment action: ",
        error
      );
      throw error;
    }
  }

  public static async doRedirectAction(
    cartID: string,
    actionType: "COD" | "PAYMENT",
    paymentMethod?: "CARD" | "QR"
  ) {
    try {
      Log.debug("[OrderManager] Checking for redirect type is COD or PAYMENT");

      let resultAction;
      if (actionType === "COD") {
        Log.debug(
          "[OrderManager] Action type is COD, sending to doCodAction..."
        );
        resultAction = await this.doCodAction(cartID);
      } else if (actionType === "PAYMENT") {
        Log.debug(
          "[OrderManager] Action type is COD, sending to doPaymentAction with paymentMethod: " +
            paymentMethod
        );
        resultAction = await this.doPaymentAction(cartID, paymentMethod);
      }

      Log.debug(
        "[OrderManager] Redirect action is done, returning: ",
        resultAction
      );
      return resultAction;
    } catch (error) {
      Log.error(
        "[OrderManager] Error while processing redirect action: ",
        error
      );
      throw error;
    }
  }
}
