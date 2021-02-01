import { Log } from '../utils/Log';
import { ApiProxy } from '../modules/ApiProxy';
import { ICustomer } from './interfaces/Customer';

export class CustomerManager {
    public static async getCustomerDetails(userID: string) {
        Log.debug('[CustomerManager] Getting customer details with userID: ' + userID);
        try {
            const resultCustomerDetails = await ApiProxy.getInstance().sendRequest("GET", `/customer/details?userID=${userID}`);

            Log.debug('[CustomerManager] Customer details of userID: ', resultCustomerDetails);
            return Promise.resolve(resultCustomerDetails);
        }
        catch (err) {
            Log.error('[CustomerManager] Error while getting customer details: ', err);
            return Promise.reject(err);
        }
    }

    public static async checkCustomerExists(storeID: string, userID: string) {
        Log.debug('[CustomerManager] Checking customer exists or not with storeID: ' + storeID + ' userID: ' + userID);
        try {
            const resultCheckCustomerExists = await ApiProxy.getInstance().sendRequest("POST", `/customer/checkCustomerExists`, {
                storeID: storeID,
                userID: userID
            });

            if (resultCheckCustomerExists.exists) {
                resultCheckCustomerExists.result.forEach((customer: any) => {
                    delete customer['storeID'];
                    delete customer['createdAt'];
                    customer['stringify'] = JSON.stringify(customer);
                });
            }

            Log.debug('[CustomerManager] Result check customer exists: ', resultCheckCustomerExists);
            return Promise.resolve(resultCheckCustomerExists);
        }
        catch (err) {
            Log.error('[CustomerManager] Error while checking customer exists: ', err);
            return Promise.reject(err);
        }
    }

    public static async createNewCustomer(customerInfo: ICustomer) {
        Log.debug('[CustomerManager] Creating new customer with data: ', customerInfo);
        try {
            const resultCreateNewCustomer = await ApiProxy.getInstance().sendRequest("POST", `/customer/new`, customerInfo);

            Log.debug('[CustomerManager] Result create new customer: ', resultCreateNewCustomer);
            return Promise.resolve(resultCreateNewCustomer);
        } catch (error) {
            Log.error('[CustomerManager] Error while creating new customer: ', error);
            return Promise.reject(error);
        }
    }

    public static async updateCustomer(customerInfo: { [key: string]: any }) {
        Log.debug('[CustomerManager] Updating customer with data: ', customerInfo);
        try {
            const resultUpdateCustomer = await ApiProxy.getInstance().sendRequest("POST", `/customer/update`, customerInfo);

            Log.debug('[CustomerManager] Result update customer: ', resultUpdateCustomer);
            return Promise.resolve(resultUpdateCustomer);
        } catch (error) {
            Log.error('[CustomerManager] Error while updating customer: ', error);
            return Promise.reject(error);
        }
    }

}