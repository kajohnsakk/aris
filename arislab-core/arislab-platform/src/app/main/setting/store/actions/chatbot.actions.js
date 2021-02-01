import axios from "axios";
import { showMessage } from "app/store/actions/fuse";
import * as AppConfig from "../../../config/AppConfig";

export const GET_CHATBOT_CONFIG = "[STORE MANAGEMENT] GET CHATBOT CONFIG";
export const SAVE_CHATBOT_CONFIG = "[STORE MANAGEMENT] SAVE CHATBOT CONFIG";

const host = AppConfig.API_URL;

export function getChatbotConfig(params) {
  let storeID = params["storeID"];
  const request = axios.get(host + "chatbot/storeID/" + storeID + "/details");

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_CHATBOT_CONFIG,
        payload: response.data[0],
      });
    });
}

export function saveChatbotConfig(data, params) {
  let storeID = params["storeID"];
  const request = axios.post(
    host + "chatbot/storeID/" + storeID + "/update",
    data
  );

  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Chatbot Config Saved" }));

      return dispatch({
        type: SAVE_CHATBOT_CONFIG,
        payload: response.data,
      });
    });
}
