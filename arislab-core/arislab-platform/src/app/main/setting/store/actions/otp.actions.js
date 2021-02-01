import axios from "axios";
import * as AppConfig from "../../../config/AppConfig";

export const GET_OTP_CODE = "[OTP] GET OTP CODE";
export const UPDATE_OTP = "[OTP] UPDATE OTP";
export const CHECK_OTP = "[OTP] CHECK OTP CODE";
export const SAVE_OTP = "[OTP] SAVE OTP";

const host = AppConfig.API_URL;

export function insertOtp(data) {
  const request = axios.post(host + "otp/new/", data);

  return (dispatch) =>
    request.then((response) => {
      return dispatch({
        type: SAVE_OTP,
        payload: data,
      });
    });
}
