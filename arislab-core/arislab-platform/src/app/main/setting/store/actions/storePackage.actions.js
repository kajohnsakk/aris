import axios from "axios";
import * as AppConfig from "../../../config/AppConfig";

export const GET_CURRENT_STORE_PACKAGE =
  "[STORE PACKAGE] GET CURRENT STORE PACKAGE";

const host = AppConfig.API_URL;

export function getCurrentStorePackage(params) {
  let storeID = params["storeID"];
  const request = axios.get(
    host + "storePackage/storeID/" + storeID + "/current"
  );

  return (dispatch) =>
    request.then((response) => {
      dispatch({
        type: GET_CURRENT_STORE_PACKAGE,
        payload: response.data[0],
      });
    });
}
