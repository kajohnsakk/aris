import axios from 'axios';
import * as AppConfig from '../../../config/AppConfig';
import { showMessage } from 'app/store/actions/fuse';

export const GET_PRODUCTS = '[E-COMMERCE APP] GET PRODUCTS';
export const SET_PRODUCTS_SEARCH_TEXT = '[E-COMMERCE APP] SET PRODUCTS SEARCH TEXT';

const host = AppConfig.API_URL;

export function getProducts(params) {
    let storeID = params['storeID'];
    const request = axios.get(host + 'product/storeID/' + storeID);

    return (dispatch) =>
        request.then((response) => {
            dispatch({
                type: GET_PRODUCTS,
                payload: response.data
            })
        });
}

export function deleteProductAPI(lst) {
    let requestURL = host + 'product/deleteMultipleProducts';
    // let requestURL = 'https://28371019.ngrok.io/api/product/deleteMultipleProducts/'
    let body = {'productIDList': lst}
    const request = axios.post(requestURL, body);

    return (dispatch) =>
        request.then((response) => {

            dispatch(showMessage({ message: 'Product(s) deleted' }));
            window.location = "/platform/products";
        }
    );
}

export function setProductsSearchText(event) {
    return {
        type: SET_PRODUCTS_SEARCH_TEXT,
        searchText: event.target.value
    }
}

