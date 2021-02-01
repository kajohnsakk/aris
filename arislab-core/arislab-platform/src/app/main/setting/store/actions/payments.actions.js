import axios from "axios";
import { showMessage } from "app/store/actions/fuse";
import * as AppConfig from "../../../config/AppConfig";

export const GET_PAYMENT_PROFILE = "[STORE MANAGEMENT] GET PAYMENT INFORMATION";
export const SAVE_PAYMENT_PROFILE =
  "[STORE MANAGEMENT] SAVE PAYMENT INFORMATION";
export const SAVE_BANK_RECORD = "[STORE MANAGEMENT] SAVE BANK RECORD";
export const VALIDATE_GBPAY_TOKEN = "[STORE MANAGEMENT] VALDIATE GBPAY TOKEN";

const host = AppConfig.API_URL;

export function getPaymentInfo(params) {
  let storeID = params["storeID"];
  const request = axios.get(host + "payment/storeID/" + storeID);

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_PAYMENT_PROFILE,
        payload: response.data,
      });
    });
}

export function savePaymentInfo(data, params) {
  let storeID = params["storeID"];
  const request = axios.post(
    host + "payment/storeID/" + storeID + "/update",
    data
  );

  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Payment Information Saved" }));

      return dispatch({
        type: SAVE_PAYMENT_PROFILE,
        payload: response.data,
      });
    });
}

export function sendPaymentInfo(data) {
  const request = axios.post(host + "email/send", data);

  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Payment Information sent" }));

      return dispatch({
        type: SAVE_PAYMENT_PROFILE,
        payload: response.data,
      });
    });
}

export function insertBankRecord(bankData, storeData, emailData, storeID) {
  let bankRecordData = {
    storeID: storeID,
    accountInfo: {
      accountName: bankData.accountName,
      accountNumber: bankData.accountNumber,
      bank: {
        ...bankData.bank,
      },
    },
    verifyInfo: {
      referenceNo: "",
    },
    createdAt: Date.now(),
    isVerified: false,
    verifiedAt: 0,
  };

  const request = axios.post(host + "bankRecord/new", {
    bankRecordData: bankRecordData,
    storeData: storeData,
    emailData: emailData,
  });
  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Bank Record Information Saved" }));

      return dispatch({
        type: SAVE_BANK_RECORD,
        payload: response.data,
      });
    });
}

export function validateGBPayToken(token) {
  const request = axios.post(host + "utility/validateGBPayToken", token);

  return (dispatch) =>
    request.then((response) => {
      return dispatch({
        type: VALIDATE_GBPAY_TOKEN,
        payload: response.data,
      });
    });
}
