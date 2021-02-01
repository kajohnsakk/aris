// import axios from 'axios';
import * as AppConfig from '../../../../config/AppConfig';

export const GET_PRODUCT_CATEGORIES = '[LIVE-EVENTS] GET PRODUCT CATEGORIES';
export const GET_PRODUCT_SUB_CATEGORIES_LEVEL_1 = '[LIVE-EVENTS] GET PRODUCT SUB CATEGORIES LEVEL 1';
export const GET_PRODUCT_SUB_CATEGORIES_LEVEL_2 = '[LIVE-EVENTS] GET PRODUCT SUB CATEGORIES LEVEL 2';


export function getProductCategories() {

    /*
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/add-contact', {
            newContact
        });

        return request.then( (response) => dispatch({
            type    : GET_LIVE_EVENTS,
            payload : response.data
        }) );

    };
    */

    //const productCategoryList = AppConfig.PRODUCT_CATEGORY_LIST;
    //const productCategoryList = AppConfig.PRODUCT_CATEGORY_LIST[language].filter( data => data.parent.length === 0 && data.level === 'Category' );
    const productCategoryList = AppConfig.PRODUCT_CATEGORY_LIST;


    return {
        type    : GET_PRODUCT_CATEGORIES,
        payload : productCategoryList
    };

}

export function getProductSubCategoriesLevel1(categoryValue) {

    /*
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/add-contact', {
            newContact
        });

        return request.then( (response) => dispatch({
            type    : GET_LIVE_EVENTS,
            payload : response.data
        }) );

    };
    */

    let productSubCategory1List = [];
    if( categoryValue.length > 0 ) {

        let productSubCategory1Data = AppConfig.PRODUCT_CATEGORY_LIST.filter( data => {     
            if( data.value.length > 0 && data.value === categoryValue ) {
                return true;
            }
            return false;
        } );

        productSubCategory1List = productSubCategory1Data[0].children;

    }

    return {
        type    : GET_PRODUCT_SUB_CATEGORIES_LEVEL_1,
        payload : productSubCategory1List
    };

}

export function getProductSubCategoriesLevel2(categoryValue, subCategoryValue) {

    /*
    return (dispatch, getState) => {

        const {routeParams} = getState().contactsApp.contacts;

        const request = axios.post('/api/contacts-app/add-contact', {
            newContact
        });

        return request.then( (response) => dispatch({
            type    : GET_LIVE_EVENTS,
            payload : response.data
        }) );

    };
    */

    let productSubCategory2List = [];
    let productAttributeList = [];
    if( categoryValue.length > 0 && subCategoryValue.length > 0 ) {
    
        let productSubCategory1Data = AppConfig.PRODUCT_CATEGORY_LIST.filter( data => {     
            if( data.value.length > 0 && data.value === categoryValue ) {
                return true;
            }
            return false;
        } );

        let productSubCategory2Data = productSubCategory1Data[0].children.filter( data => {     
            if( data.value.length > 0 && data.value === subCategoryValue ) {
                return true;
            }
            return false;
        } );

        if( productSubCategory2Data[0].available ) {
            productSubCategory2List = productSubCategory2Data[0].children;
            productAttributeList = productSubCategory2Data[0].attributes;
        }
        
    }

    return {
        type        : GET_PRODUCT_SUB_CATEGORIES_LEVEL_2,
        payload     : productSubCategory2List,
        attributes  : productAttributeList
    };

}

