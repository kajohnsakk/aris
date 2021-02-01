import { Log } from "../ts-utils/Log";
import { ExternalProxy } from "../modules/ExternalProxy";
import { Order } from "../models/Order";

export interface GBPayData {
  token: string;
  amount: Number;
  referenceNo: string;
  payType: string;
  cardUse: string;
  billUse: string;
  qrUse: string;
  expire: Number;
  deliveryMethod: string;
  multipleUse: string;
  responseUrl: string;
  backgroundUrl: string;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerTelephone?: string;
  detail?: string;
  merchantDefined1?: string;
  merchantDefined2?: string;
}

export interface inputGBPayDataJSON {
  token: string;
  amount: number;
  referenceNo: string;
  responseUrl: string;
  backgroundUrl: string;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
  customerTelephone?: string;
  merchantDefined1?: string;
  merchantDefined2?: string;
}

export interface IGenerateCreditCardToken {
  rememberCard: boolean;
  card: ICreditCard;
}

export interface ICreditCard {
  name: string;
  number: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
}

export interface IRecurringApi {
  processType: "I" | "U" | "C";
  recurringNo?: string;
  referenceNo?: string;
  recurringAmount?: number;
  recurringInterval?: "M" | "Q" | "Y";
  recurringPeriod?: string;
  allowAccumulate?: "Y" | "N";
  cardToken?: string;
  backgroundUrl?: string;
}

export interface IResultRecurringApi {
  resultCode: string;
  referenceNo: string;
  recurringNo: string;
}

export class GBPay {
  public static readonly TOKEN =
    process.env.DEFAULT_GB_PAY_TOKEN ||
    "yrFKx7r0eZTfEQKJUdRunZTtKOAXthFLZQ4ds0AdDSZpDMQaSEw9mw2+EyYn9FsgZm3gwvrlgMq5KRl0l5Rw/p40fbZ10rkUYkrFDJT3lg81LtfcpgL0gVbuU0mqc10L2ErhxSZrHqYgY8SCRWFTou03yoDKkaKZxlpdPM7XdblRfQLT";
  private static readonly SECRET_KEY =
    process.env.GB_PAY_SECRET_KEY || "PwpRAVimAIDF7EEe4iLWhh11M8EOaAcz";
  private static readonly GATEWAY =
    process.env.GB_PAY_GATEWAY || "https://api.gbprimepay.com/";

  private static readonly GB_PAY_ADMIN_ARISLAB_ACCOUNT_PUBLIC_KEY =
    process.env.GB_PAY_ADMIN_ARISLAB_ACCOUNT_PUBLIC_KEY || "";
  private static readonly GB_PAY_ADMIN_ARISLAB_ACCOUNT_SECRET_KEY =
    process.env.GB_PAY_ADMIN_ARISLAB_ACCOUNT_SECRET_KEY || "";

  public static generateLink(data: inputGBPayDataJSON) {
    return ExternalProxy.getInstance()
      .sendRequest({
        uri: `${this.GATEWAY}gbp/gateway/link`,
        method: "POST",
        body: data,
      })
      .then((resultLink: any) => {
        Log.debug(
          "Generated gbpay link of body ",
          data,
          " result is: ",
          resultLink
        );
        return Promise.resolve(resultLink);
      })
      .catch((err: any) => {
        Log.error(
          "Error while generating gbpay link: ",
          err + " , body: ",
          data
        );
        return Promise.reject(err);
      });
  }

  public static checkTransactionStatus(referenceNo: string) {
    return ExternalProxy.getInstance()
      .sendRequest({
        uri: `${this.GATEWAY}v1/check_status_txn`,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(this.SECRET_KEY + ":").toString(
            "base64"
          )}`,
        },
        body: { referenceNo: referenceNo },
      })
      .then((resultCheckTransactionStatus: any) => {
        Log.debug(
          "resultCheckTransactionStatus is : ",
          resultCheckTransactionStatus
        );
        return Promise.resolve(resultCheckTransactionStatus);
      })
      .catch((err: any) => {
        Log.error(
          "Error while checking transaction status of reference no: " +
            referenceNo +
            " with error: ",
          err
        );
        return Promise.reject(err);
      });
  }

  public static voidTransaction(gbpReferenceNo: string, secret_key?: string) {
    Log.debug(
      "[GBPay] Voiding transaction of gbpReferenceNo: " + gbpReferenceNo
    );

    let authHeaders_secretKey = this.SECRET_KEY;

    if (secret_key) authHeaders_secretKey = secret_key;

    return ExternalProxy.getInstance()
      .sendRequest({
        uri: `${this.GATEWAY}v1/void`,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            authHeaders_secretKey + ":"
          ).toString("base64")}`,
        },
        body: { gbpReferenceNo: gbpReferenceNo },
      })
      .then((resultVoidTransaction: any) => {
        Log.debug("[GBPay] resultVoidTransaction is : ", resultVoidTransaction);
        return Promise.resolve(resultVoidTransaction);
      })
      .catch((err: any) => {
        Log.error(
          "[GBPay] Error while voiding transaction of gbpReferenceNo: " +
            gbpReferenceNo +
            " with error: ",
          err
        );
        return Promise.reject(err);
      });
  }

  public static verifyQRCodeTransaction(
    referenceNo: string,
    gbpReferenceNo: string,
    amount: string
  ) {
    return Order.verifyOrderForProcessTransaction(referenceNo, amount)
      .then((resultVerifyOrderForProcessTransaction: { status: string }) => {
        Log.debug(
          "resultVerifyOrderForProcessTransaction ",
          resultVerifyOrderForProcessTransaction
        );
        if (resultVerifyOrderForProcessTransaction["status"] === "APPROVE") {
          return {
            resultCode: "00",
            referenceNo: referenceNo,
            gbpReferenceNo: gbpReferenceNo,
          };
        } else if (
          resultVerifyOrderForProcessTransaction["status"] === "REJECT"
        ) {
          return {
            resultCode: "99",
            referenceNo: referenceNo,
            gbpReferenceNo: gbpReferenceNo,
          };
        }
      })
      .catch((err) => {
        Log.error("Error while verifying qrcode transaction : ", err);
        throw err;
      });
  }

  public static withdrawTransaction(
    bankAccount: string,
    accountName: string,
    bankCode: string,
    amount: Number,
    timeline: string
  ) {
    return ExternalProxy.getInstance()
      .sendRequest({
        uri: `${this.GATEWAY}v2/transfers`,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(this.SECRET_KEY + ":").toString(
            "base64"
          )}`,
        },
        body: {
          status: "TRANSFER",
          referenceNo: Date.now(),
          bankAccount: bankAccount,
          accHolderName: accountName,
          bankCode: bankCode,
          amount: amount,
          timeline: timeline,
        },
      })
      .then((resultWithdrawTransaction: any) => {
        Log.debug("resultWithdrawTransaction is : ", resultWithdrawTransaction);
        return Promise.resolve(resultWithdrawTransaction);
      })
      .catch((err: any) => {
        Log.error(
          "Error while withdraw transaction of bankAccount: " +
            bankAccount +
            " with error: ",
          err
        );
        if (!err.hasOwnProperty("resultCode")) {
          err.resultCode = err.statusCode;
        }
        return Promise.reject(err);
      });
  }

  public static generateCreditCardToken(data: IGenerateCreditCardToken) {
    return ExternalProxy.getInstance()
      .sendRequest({
        uri: `${this.GATEWAY}v1/tokens`,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            this.GB_PAY_ADMIN_ARISLAB_ACCOUNT_PUBLIC_KEY + ":"
          ).toString("base64")}`,
        },
        body: data,
      })
      .then((resultToken: { [key: string]: any }) => {
        Log.debug(
          "Generated credit card token of body ",
          data,
          " result is: ",
          resultToken
        );
        return Promise.resolve(resultToken);
      })
      .catch((err: any) => {
        Log.error(
          "Error while generating credit card token: ",
          err + " , body: ",
          data
        );
        return Promise.reject(err);
      });
  }

  public static sendRecurringToGbpay(data: IRecurringApi) {
    return ExternalProxy.getInstance()
      .sendRequest({
        uri: `${this.GATEWAY}v1/recurring`,
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            this.GB_PAY_ADMIN_ARISLAB_ACCOUNT_SECRET_KEY + ":"
          ).toString("base64")}`,
        },
        body: data,
      })
      .then((resultUpdate: { [key: string]: any }) => {
        Log.debug(
          "Send recurring to GB Pay of body ",
          data,
          " result is: ",
          resultUpdate
        );
        return Promise.resolve(resultUpdate);
      })
      .catch((err: any) => {
        Log.error(
          "Error while send recurring to GB Pay: ",
          err + " , body: ",
          data
        );
        return Promise.reject(err);
      });
  }

  public static verifyAccount(bankAccount: string, bankCode: string) {
    return ExternalProxy.getInstance().sendRequest({
      uri: `${this.GATEWAY}v2/transfers`,
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(this.SECRET_KEY + ":").toString(
          "base64"
        )}`,
      },
      body: {
        status: "CHECKACC",
        bankAccount: bankAccount,
        bankCode: bankCode,
      },
    });
  }
}
