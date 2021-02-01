import axios from 'axios';
// import { showMessage } from 'app/store/actions/fuse';
import * as AppConfig from '../../../../config/AppConfig';

export const GET_PRODUCTS_LIST = '[LIVE] GET PRODUCTS LIST';
export const GET_PRODUCT = '[LIVE] GET PRODUCT';

const host = AppConfig.API_URL;

export function getProductsList(data) {
    const request = axios.post(host + 'product/productInfo/', data);

    return (dispatch) =>
        request.then((response) => {
            dispatch({
                type: GET_PRODUCTS_LIST,
                payload: response.data
            })
        })
}

export function getProduct(data) {
    return (dispatch) =>
        dispatch({
            type: 'GET_PRODUCT',
            payload: data
        })
}
