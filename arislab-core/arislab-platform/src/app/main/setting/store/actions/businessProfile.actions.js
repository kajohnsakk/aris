import axios from "axios";
import { showMessage } from "app/store/actions/fuse";
import * as AppConfig from "../../../config/AppConfig";

export const GET_BUSINESS_PROFILE = "[STORE MANAGEMENT] GET BUSINESS PROFILE";
export const GET_BUSINESS_PROFILE_ONLY =
  "[STORE MANAGEMENT] GET BUSINESS PROFILE ONLY";
export const SAVE_BUSINESS_PROFILE = "[STORE MANAGEMENT] SAVE BUSINESS PROFILE";
export const SAVE_PAYMENT_INFO = "[STORE MANAGEMENT] SAVE PAYMENT INFO";
export const SAVE_BUSINESS_PROFILE_SECTIONS =
  "[STORE MANAGEMENT] SAVE BUSINESS PROFILE SECTIONS";

const host = AppConfig.API_URL;

export function getBusinessProfile(params) {
  let storeID = params["storeID"];

  const request = axios.get(host + "businessProfile/storeID/" + storeID);

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_BUSINESS_PROFILE,
        payload: response.data,
      });
    });
}

export function getBusinessProfileOnly(params) {
  let storeID = params["storeID"];
  const request = axios.get(host + "businessProfile/storeID/" + storeID);

  return (dispatch) =>
    request.then((response) => {
      let returnObj = response.data;
      returnObj.storeInfo.paymentInfo = {};
      dispatch({
        type: GET_BUSINESS_PROFILE_ONLY,
        payload: returnObj,
      });
    });
}

export function saveBusinessProfile(data, params) {
  let storeID = params["storeID"];
  const request = axios.post(
    host + "businessProfile/storeID/" + storeID + "/update",
    data
  );
  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Store Saved" }));

      return dispatch({
        type: SAVE_BUSINESS_PROFILE,
        payload: response.data,
      });
    });
}

export function saveBusinessProfileSections(data, params) {
  let storeID = params["storeID"];
  let sections = params["sections"];
  const request = axios.post(
    host +
      "businessProfile/storeID/" +
      storeID +
      "/sections/" +
      sections +
      "/update",
    data
  );

  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Store Saved" }));

      return dispatch({
        type: SAVE_BUSINESS_PROFILE_SECTIONS,
        payload: response.data,
      });
    });
}

export function updateStorePaymentInfo(storeID, params) {
  return axios.put(host + "store/" + storeID + "/paymentInfo", params);
}
