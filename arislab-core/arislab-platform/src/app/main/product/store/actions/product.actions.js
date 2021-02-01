import axios from 'axios';
// import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';
import * as AppConfig from '../../../config/AppConfig';

export const GET_PRODUCT = '[E-COMMERCE APP] GET PRODUCT';
export const SAVE_PRODUCT = '[E-COMMERCE APP] SAVE PRODUCT';
export const CLEAR_PRODUCT_DATA = '[E-COMMERCE APP] CLEAR PRODUCT DATA';

const host = AppConfig.API_URL;

export function getProduct(params) {
    let storeID = params['storeID'];
    let productID = params['productID'];
    const request = axios.get(host + 'product/storeID/' + storeID + '/product/' + productID + '/details');

    return (dispatch) =>
        request.then((response) => {
            // console.log('getSingleProduct response ', response);

            dispatch({
                type: GET_PRODUCT,
                payload: response.data[0]
            })
        });
}

export function saveProduct(data, params) {
    let requestURL;
    
    let storeID = params['storeID'];
    let productID = params['productID'];

    if (productID !== "new") {
        requestURL = host + 'product/storeID/' + storeID + '/product/' + productID + '/update';
    } else {
        requestURL = host + 'product/storeID/' + storeID + '/product/new';
    }

    const request = axios.post(requestURL, data);

    return (dispatch) =>
        request.then((response) => {

            dispatch(showMessage({ message: 'Product Saved' }));

            // let productInfo = data;
            let productData = {
                storeID: storeID,
                productInfo: data,
                // status: "saved_product",
                productID: response.data
            };
// console.log('Action productData ===========> ', productData);
            return dispatch({
                type: SAVE_PRODUCT,
                payload: productData
            })
        }
    );
}

export function newProduct(storeID) {

    const request = axios.get(host + 'product/generateNewHashtag/storeID/' + storeID);

    return (dispatch) =>
        request.then((response) => {

            const data = {
                storeID: this.storeID,
                productInfo: {
                    productBrandName: "",
                    productName: "",
                    productDescription: "",
                    productWeight: 0,
                    productTypeOption: {},
                    subCategoryLevel1SelectedOption: {},
                    subCategoryLevel2SelectedOption: {},
                    productColorOptions: [],
                    productSizeOptions: [],
                    productFAQDetails: {},
                    productFAQDetailsOption: {},
                    productVariations: [],
                    productHashtag: response.data.hashtag,
                    shippingRate: {},
                    closeupImage: {},
                    individualProductType: "",
                    productUniversalInfo: {},
                    isNotAvailable: true
                }
            };

            return dispatch({
                type: GET_PRODUCT,
                payload: data
            });
        
        }
    );

    
    
    
    // const data = {
    //     storeID: storeID,
    //     productInfo: {
    //         productBrandName: "",
    //         productName: "",
    //         productDescription: "",
    //         productWeight: 0,
    //         productTypeOption: {},
    //         subCategoryLevel1SelectedOption: {},
    //         subCategoryLevel2SelectedOption: {},
    //         productColorOptions: [],
    //         productSizeOptions: [],
    //         productFAQDetails: {},
    //         productFAQDetailsOption: {},
    //         productVariations: [],
    //         productHashtag: "",
    //         closeupImage: {}
    //     }
    // };

    // return {
    //     type: GET_PRODUCT,
    //     payload: data
    // }
}

export function clearProductData() {
    return {
            type: CLEAR_PRODUCT_DATA,
            payload: null
        };
}


export function showCopyMessage() {
    return (dispatch) => {
        dispatch(showMessage({ message : 'Copied' }));
    }
}
