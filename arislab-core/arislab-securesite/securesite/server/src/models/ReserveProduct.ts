import { Log } from "../utils/Log";
import { ApiProxy } from "../modules/ApiProxy";

export class ReserveProduct {
  public static async insertReserveProduct(reserveProductInfo: object) {
    Log.debug(
      "[ReserveProduct] Inserting reserve product: ",
      reserveProductInfo
    );

    try {
      let reserveProductResponse = await ApiProxy.getInstance().sendRequest(
        "POST",
        "/reserveProduct",
        {
          data: reserveProductInfo,
        }
      );

      Log.debug(
        "[ReserveProduct] Reserve product was inserted: ",
        reserveProductResponse
      );

      return reserveProductResponse;
    } catch (error) {
      Log.error("[ReserveProduct] Error while insert reserve product: ", error);
      throw error;
    }
  }
}
