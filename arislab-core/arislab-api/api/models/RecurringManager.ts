import { Recurring, IRecurring } from "../models/Recurring";
import { GBPay, IRecurringApi, IResultRecurringApi } from "../models/GBPay";
import { ICreditCard, CreditCard } from "../models/CreditCard";
import {
  IStorePackage,
  StorePackage,
  IPackageInfo,
} from "../models/StorePackage";
import { Log } from "../ts-utils/Log";
var moment = require("moment");
const timeUuid = require("time-uuid");

const recurringBackgroundUrl =
  process.env.RECURRING_BACKGROUND_URL ||
  "https://manage.arislab.ai/recurringResult";
const recurringPeriod = process.env.RECURRING_PERIOD || "01";

export class RecurringManager {
  private static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public static async processRecurring(creditCardInfo: ICreditCard) {
    Log.debug(
      "[RecurringManager] Process recurring from creditCardInfo: ",
      creditCardInfo
    );
    await this.sleep(1500);

    try {
      const recurringList = await Recurring.findCurrentRecurring(
        creditCardInfo.storeID,
        creditCardInfo.creditCardID
      );
      if (recurringList.length > 0) {
        Log.debug(
          "[RecurringManager] Found current recurring: ",
          recurringList
        );
        const currentRecurringInfo = { ...recurringList[0] };
        let newRecurringInfo = this.generateNewRecurringData(
          currentRecurringInfo,
          currentRecurringInfo["recurringInfo"]["recurringAmount"]
        );
        await this.updateRecurring(
          creditCardInfo.storeID,
          currentRecurringInfo,
          newRecurringInfo
        );
      } else {
        Log.debug("[RecurringManager] Not found current recurring.....");
      }

      Log.debug("[RecurringManager] Process recurring done.");
      return Promise.resolve(true);
    } catch (err) {
      Log.error(
        "[RecurringManager] Error while getting current recurring: ",
        err
      );
      return Promise.reject(err);
    }
  }

  public static async updateRecurring(
    storeID: string,
    currentRecurringInfo: IRecurring,
    newRecurringInfo: IRecurring
  ) {
    Log.debug(
      "[RecurringManager] Update recurring of storeID: " +
        storeID +
        " from CURRENT Recurring: ",
      currentRecurringInfo,
      " to NEW Recurring: ",
      newRecurringInfo
    );
    let currentCreditCardList = await CreditCard.findCurrentCreditCard(storeID);
    let currentCreditCardInfo = currentCreditCardList[0];

    const updateResult: IResultRecurringApi = await this.updateRecurringToGbPay(
      newRecurringInfo,
      currentCreditCardInfo
    );

    let resultObject = this.generateRecurringResultObject(
      updateResult.resultCode
    );

    await this.sleep(1000);
    if (resultObject.resultStatus === "SUCCESS") {
      await this.deleteRecurring(currentRecurringInfo);
      newRecurringInfo["creditCardID"] = currentCreditCardInfo["creditCardID"];
      newRecurringInfo["referenceNo"] = updateResult["referenceNo"];
      newRecurringInfo["recurringInfo"]["recurringNo"] =
        updateResult["recurringNo"];
      newRecurringInfo["recurringInfo"]["cardToken"] =
        currentCreditCardInfo["creditCardInfo"]["token"];
      newRecurringInfo["verifyInfo"]["resultCode"] = updateResult["resultCode"];
      resultObject["recurringID"] = await this.insertNewRecurring(
        newRecurringInfo
      );
    }

    return Promise.resolve(resultObject);
  }

  private static deleteRecurring(recurringInfo: IRecurring) {
    return new Promise(async (resolve, reject) => {
      try {
        recurringInfo["isDeleted"] = true;
        recurringInfo["deletedAt"] = Date.now();
        Log.debug(
          "[RecurringManager] Delete current recurring by update recurringID: " +
            recurringInfo.recurringID +
            " with data: ",
          recurringInfo
        );
        let recurringObj = new Recurring(
          recurringInfo,
          recurringInfo.recurringID
        );
        resolve(await recurringObj.update(recurringInfo));
      } catch (error) {
        Log.debug(
          "[RecurringManager] Fail to delete current recurring with error => ",
          error
        );
        reject(false);
      }
    });
  }

  private static updateRecurringToGbPay(
    recurringInfo: IRecurring,
    currentCreditCardInfo: ICreditCard
  ): Promise<IResultRecurringApi> {
    return new Promise(async (resolve, reject) => {
      try {
        let requestData: IRecurringApi = {
          processType: "U",
          recurringNo: recurringInfo["recurringInfo"]["recurringNo"],
          recurringAmount: recurringInfo["recurringInfo"]["recurringAmount"],
          cardToken: currentCreditCardInfo["creditCardInfo"]["token"],
        };
        Log.debug("Update recurring to GB Pay of body: ", requestData);
        const updateResult = await GBPay.sendRecurringToGbpay(requestData);
        Log.debug("Result from update recurring is: ", updateResult);
        resolve(updateResult);
      } catch (error) {
        Log.error(
          "[RecurringManager] Fail to update recurring to GB Pay with error => ",
          error
        );

        let resultObj = {
          resultCode: "",
          referenceNo: "",
          recurringNo: "",
        };
        reject(resultObj);
      }
    });
  }

  private static insertNewRecurring(recurringInfo: IRecurring) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const recurringID = timeUuid();
        recurringInfo["recurringID"] = recurringID;
        if (!recurringInfo.hasOwnProperty("storePackageID")) {
          recurringInfo["storePackageID"] = "";
        }
        recurringInfo["createdAt"] = Date.now();
        recurringInfo["isDeleted"] = false;
        recurringInfo["deletedAt"] = 0;
        Log.debug(
          "[RecurringManager] Insert new recurring with: ",
          recurringInfo
        );
        let recurringObj = new Recurring(recurringInfo, recurringID);
        await recurringObj.update(recurringInfo);
        resolve(recurringID);
      } catch (error) {
        Log.debug(
          "[RecurringManager] Fail to insert new recurring with error => ",
          error
        );
        reject("");
      }
    });
  }

  public static async sendRecurringToGbpay(
    creditCardInfo: ICreditCard,
    chargePrice: number,
    selectedPackage: IPackageInfo,
    isDowngradePackage: boolean
  ) {
    Log.debug(
      "[RecurringManager] Create/Update recurring to GB Pay from creditCardInfo: ",
      creditCardInfo
    );
    try {
      const recurringList = await Recurring.findCurrentRecurring(
        creditCardInfo.storeID,
        creditCardInfo.creditCardID
      );
      let isCreateNewRecurring = false;
      let processResult;
      if (recurringList.length > 0) {
        Log.debug(
          "[RecurringManager] Found current recurring: ",
          recurringList
        );

        // if( this.checkSelectHighLevelPackage(chargePrice) ) {
        if (!isDowngradePackage) {
          // เลือก Package ราคาสูงขึ้น ต้องคิดเงินเพิ่ม
          processResult = await this.cancelPreviousRecurring(recurringList[0]);
          isCreateNewRecurring = true;
        } else {
          // เลือก Package ราคาถูกลง ไม่ต้องคิดเงินเพิ่ม
          const recurringInfo = recurringList[0];
          const currentRecurringInfo = { ...recurringInfo };

          const packagePrice = selectedPackage.memberPrice;
          if (packagePrice > 0) {
            // ปรับราคา recurring เดิม
            let newRecurringInfo = this.generateNewRecurringData(
              currentRecurringInfo,
              packagePrice
            );

            Log.debug(
              "[RecurringManager] User select lower package. Just update recurring price to GB Pay."
            );
            processResult = await this.updateRecurring(
              creditCardInfo.storeID,
              currentRecurringInfo,
              newRecurringInfo
            );
          } else {
            // ยกเลิก recurring เดิม

            Log.debug(
              "[RecurringManager] User select free package. Cancel recurring from GB Pay."
            );
            processResult = await this.cancelPreviousRecurring(
              currentRecurringInfo
            );
          }
        }
      } else {
        Log.debug("[RecurringManager] Not found current recurring.....");
        isCreateNewRecurring = true;
      }

      if (isCreateNewRecurring) {
        processResult = await this.createNewRecurring(
          creditCardInfo,
          chargePrice
        );
      }

      Log.debug("[RecurringManager] Create/Update recurring to GB Pay done.");
      return Promise.resolve(processResult);
    } catch (err) {
      Log.error(
        "[RecurringManager] Error while Create/Update recurring to GB Pay: ",
        err
      );
      return Promise.reject(err);
    }
  }

  private static generateNewRecurringData(
    recurringInfo: IRecurring,
    newPrice: number
  ) {
    let newRecurringInfo = {
      recurringID: "",
      storeID: recurringInfo["storeID"],
      creditCardID: recurringInfo["creditCardID"],
      referenceNo: recurringInfo["referenceNo"],
      recurringInfo: {
        recurringNo: recurringInfo["recurringInfo"]["recurringNo"],
        recurringAmount: newPrice,
        recurringInterval: recurringInfo["recurringInfo"]["recurringInterval"],
        recurringPeriod: recurringInfo["recurringInfo"]["recurringPeriod"],
        allowAccumulate: recurringInfo["recurringInfo"]["allowAccumulate"],
        cardToken: recurringInfo["recurringInfo"]["cardToken"],
      },
      verifyInfo: {
        resultCode: recurringInfo["verifyInfo"]["resultCode"],
      },
      createdAt: 0,
      deletedAt: 0,
      isDeleted: false,
    };

    return newRecurringInfo;
  }

  private static checkSelectHighLevelPackage(chargePrice: number) {
    return chargePrice > 0;
  }

  private static async cancelPreviousRecurring(recurringInfo: IRecurring) {
    Log.debug(
      "[RecurringManager] Cancel previous recurring with data: ",
      recurringInfo
    );
    const requestData: IRecurringApi = {
      processType: "C",
      recurringNo: recurringInfo["recurringInfo"]["recurringNo"],
    };
    Log.debug("Cancel recurring to GB Pay of body: ", requestData);
    const cancelResult = await GBPay.sendRecurringToGbpay(requestData);
    Log.debug("Result from cancel recurring is: ", cancelResult);

    let resultObject = this.generateRecurringResultObject(
      cancelResult.resultCode
    );

    if (resultObject.resultStatus === "SUCCESS") {
      const resultDelete = await this.deleteRecurring(recurringInfo);
    }

    return Promise.resolve(resultObject);
  }

  private static async createNewRecurring(
    creditCardInfo: ICreditCard,
    chargePrice: number
  ) {
    Log.debug(
      "[RecurringManager] Create new recurring with credit card data: ",
      creditCardInfo
    );

    const storeID = creditCardInfo.storeID;
    const creditCardID = creditCardInfo.creditCardID;

    const referenceNo = moment().format("YYYYMMDDHHmmss");
    const requestData: IRecurringApi = {
      processType: "I",
      referenceNo: referenceNo,
      recurringAmount: chargePrice,
      recurringInterval: "M",
      recurringPeriod: recurringPeriod,
      allowAccumulate: "Y",
      cardToken: creditCardInfo["creditCardInfo"]["token"],
      backgroundUrl: recurringBackgroundUrl,
    };
    Log.debug("Create recurring to GB Pay of body: ", requestData);
    const createResult = await GBPay.sendRecurringToGbpay(requestData);
    Log.debug("Result from create recurring is: ", createResult);

    let resultObject = this.generateRecurringResultObject(
      createResult.resultCode
    );

    if (resultObject.resultStatus === "SUCCESS") {
      const recurringInfo: IRecurring = {
        recurringID: "",
        storeID: storeID,
        creditCardID: creditCardID,
        referenceNo: requestData["referenceNo"],
        recurringInfo: {
          recurringNo: createResult["recurringNo"],
          recurringAmount: requestData["recurringAmount"],
          recurringInterval: requestData["recurringInterval"],
          recurringPeriod: requestData["recurringPeriod"],
          allowAccumulate: requestData["allowAccumulate"],
          cardToken: requestData["cardToken"],
        },
        verifyInfo: {
          resultCode: createResult["resultCode"],
        },
        createdAt: Date.now(),
        isDeleted: false,
        deletedAt: 0,
      };
      Log.debug("Create new recurring to storeID: " + storeID);
      resultObject["recurringID"] = await this.insertNewRecurring(
        recurringInfo
      );
    } else {
      Log.error("Create new recurring fail.");
    }

    return Promise.resolve(resultObject);
  }

  private static generateRecurringResultObject(resultCode: string) {
    let resultStatus = "";
    let resultDetail = "";
    let errorMessageI18n = "";
    switch (resultCode) {
      case "00":
        resultStatus = "SUCCESS";
        break;
      case "01":
        resultStatus = "FAIL";
        resultDetail = "Invalid require field.";
        errorMessageI18n = "gbpay-error-message.invalid-require-field";
        break;
      case "02":
        resultStatus = "FAIL";
        resultDetail = "Recurring is not 'Y'.";
        errorMessageI18n = "gbpay-error-message.recurring-fail";
        break;
      case "03":
        resultStatus = "FAIL";
        resultDetail = "Duplicate 'referenceNo'.";
        errorMessageI18n = "gbpay-error-message.recurring-fail";
        break;
      default:
        resultStatus = "FAIL";
        resultDetail = "System error";
        errorMessageI18n = "gbpay-error-message.recurring-fail";
        break;
    }

    return {
      resultCode: resultCode,
      resultStatus: resultStatus,
      resultDetail: resultDetail,
      errorMessageI18n: errorMessageI18n,
      recurringID: "",
    };
  }
}
