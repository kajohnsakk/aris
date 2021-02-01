import axios from 'axios';
// import { showMessage } from 'app/store/actions/fuse';
import * as AppConfig from '../../../../config/AppConfig';

export const GET_PRODUCT_INFO = '[LIVE] GET PRODUCT INFO';

const host = AppConfig.API_URL;

export function getProductInfo(params) {
    let storeID = params['storeID'];
    let productID = params['productID'];

    const request = axios.get(host + 'product/storeID/' + storeID + '/product/' + productID + '/details');

    return (dispatch) =>
        request.then((response) => {
            // console.log('getProductInfo response', response)
            dispatch({
                type: GET_PRODUCT_INFO,
                payload: response.data[0]
            })
        });
}
