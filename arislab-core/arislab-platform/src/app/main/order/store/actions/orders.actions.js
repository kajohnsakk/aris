import axios from 'axios';
import * as AppConfig from '../../../config/AppConfig';

export const GET_ORDERS = '[E-COMMERCE APP] GET ORDERS';
export const UPDATE_ORDERS = '[E-COMMERCE APP] UPDATE ORDERS';
export const SET_ORDERS_SEARCH_TEXT = '[E-COMMERCE APP] SET ORDERS SEARCH TEXT';
export const EXPORT_ORDERS = '[E-COMMERCE APP] EXPORT ORDERS';
export const CLEAR_ORDERS = '[E-COMMERCE APP] CLEAR ORDERS';

const host = AppConfig.API_URL;

export function getOrders(params) {
    let storeID = params['storeID'];
    let status = params['status'] || "";
    let startDate = params['startDate'] || "";
    let endDate = params['endDate'] || "";
    let dateFilter = params['dateFilter'];
    let url = `${host}order/storeID/${storeID}?startDate=${startDate}&endDate=${endDate}&dateFilter=${dateFilter}`;
    
    if (status && status !== "ALL") {
        url = `${host}order/storeID/${storeID}?status=${status}&startDate=${startDate}&endDate=${endDate}&dateFilter=${dateFilter}`;
    }
    
    const request = axios.get(url);

    return (dispatch) =>
        request.then((response) =>
        {
            dispatch({
                type: GET_ORDERS,
                payload: response.data
            })
        }     
    );
}

export function updateOrders(params, data) {
    let storeID = params['storeID'];
    let orderID = params['orderID'];
    let url = `${host}order/storeID/${storeID}/orderID/${orderID}/update`;
    const request = axios.post(url, data);

    return (dispatch) =>
        request.then((response) =>
        {
            dispatch({
                type: UPDATE_ORDERS,
                payload: response.data.orderData
            })
        }
    );
}

export function clearOrders() {
    return {
        type: CLEAR_ORDERS,
        payload: null
    }
}

export function setOrdersSearchText(event) {
    return {
        type: SET_ORDERS_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function exportOrders(params) {
    let storeID = params['storeID'];
    let status = params['status'] || "";
    let startDate = params['startDate'] || "";
    let endDate = params['endDate'] || "";
    let dateFilter = params['dateFilter'] || "";
    
    return {
        type: EXPORT_ORDERS,
        returnUrl: `${host}order/storeID/${storeID}?file=csv&timestamp=${Date.now()}&status=${status}&startDate=${startDate}&endDate=${endDate}&dateFilter=${dateFilter}`
    }
}