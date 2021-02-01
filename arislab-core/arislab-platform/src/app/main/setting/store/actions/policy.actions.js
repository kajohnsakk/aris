import axios from "axios";
import { showMessage } from "app/store/actions/fuse";
import * as AppConfig from "../../../config/AppConfig";

export const GET_POLICY = "[STORE MANAGEMENT] GET POLICY";
export const SAVE_POLICY = "[STORE MANAGEMENT] SAVE POLICY";

const host = AppConfig.API_URL;

export function getPolicy(params) {
  let storeID = params["storeID"];
  const request = axios.get(host + "policy/storeID/" + storeID);

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_POLICY,
        payload: response.data,
      });
    });
}

export function savePolicy(data, params) {
  let storeID = params["storeID"];
  // let section = params['section'];
  // const request = axios.post(host + 'policy/storeID/' + storeID + '/sections/' + section + '/update', data);
  const request = axios.post(
    host + "policy/storeID/" + storeID + "/update",
    data
  );

  return (dispatch) =>
    request.then((response) => {
      dispatch(showMessage({ message: "Policy Saved" }));

      return dispatch({
        type: SAVE_POLICY,
        payload: response.data,
      });
    });
}
