import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { IProductBooking } from './interfaces/ProductBooking';

export class ProductBookingManager {
    public static async createProductBooking(productBookingInfo: IProductBooking) {
        try {
            const resultCreateProductBooking = await ApiProxy.getInstance().sendRequest("POST", `/productBooking/new`, productBookingInfo);
            return Promise.resolve(resultCreateProductBooking);
        } catch (error) {
            Log.error('[ProductBookingManager] Error while create product booking: ', error);
            return Promise.reject(error);
        }
    }

}