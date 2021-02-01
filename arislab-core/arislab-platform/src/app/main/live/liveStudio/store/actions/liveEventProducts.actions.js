import axios from 'axios';
import * as AppConfig from '../../../../config/AppConfig';

export const GET_PRODUCTS = '[LIVE-EVENTS] GET PRODUCTS';
export const SAVE_PRODUCT = '[LIVE-EVENTS] SAVE PRODUCT';

export function getProducts(storeID) {

    let requestURL = AppConfig.API_URL+'product/storeID/'+storeID;
    const request = axios.get(requestURL);

    return (dispatch) =>
        request.then((response) => {
            dispatch({
                type: GET_PRODUCTS,
                payload: response.data
            })
        }
    );
}

export function saveProduct(data, params) {
    let requestURL;
    
    let storeID = params['storeID'];
    let productID = params['productID'];

    if (productID !== "new") {
        requestURL = AppConfig.API_URL + 'product/storeID/' + storeID + '/product/' + productID + '/update';
    } else {
        requestURL = AppConfig.API_URL + 'product/storeID/' + storeID + '/product/new';
    }

    const request = axios.post(requestURL, data);

    return (dispatch) =>
        request.then((response) => {

            // dispatch(showMessage({ message: 'Product Saved' }));

            const productData = {
                storeID: storeID,
                productInfo: data,
                // status: "saved_product",
                productID: response.data
            };

            dispatch({
                type: SAVE_PRODUCT,
                payload: productData
            });

            return new Promise(function(resolve, reject) {
                resolve(productData);
            } );
        }
    );
}