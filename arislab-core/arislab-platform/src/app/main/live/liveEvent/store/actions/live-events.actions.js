import axios from 'axios';
import _ from '@lodash';
import * as AppConfig from '../../../../config/AppConfig';
import { showMessage } from 'app/store/actions/fuse';
import {
    // closeCreatorLiveEventCard,
    closeDeleteLiveEventPrompt,
    closeProductInfoFormPrompt,
    closeDeleteProductPrompt
} from '../actions/live-event-ui.actions';
// import { getProductsList } from '../../../liveStudio/store/actions/liveProductSlider.actions';

export const GET_LIVE_EVENT = '[LIVE-EVENTS] GET LIVE EVENT';
export const GET_LIVE_EVENTS = '[LIVE-EVENTS] GET LIVE EVENTS';
export const GET_PRODUCTS = '[LIVE-EVENTS] GET PRODUCTS';
export const INSERT_LIVE_EVENT = '[LIVE-EVENTS] INSERT LIVE EVENT';
export const UPDATE_LIVE_EVENT = '[LIVE-EVENTS] UPDATE LIVE EVENT';
export const DELETE_LIVE_EVENT = '[LIVE-EVENTS] DELETE LIVE EVENT';
export const INSERT_PRODUCT_TO_LIVE_EVENT = '[LIVE-EVENTS] INSERT PRODUCT TO LIVE EVENT';
export const UPDATE_PRODUCT_IN_LIVE_EVENT = '[LIVE-EVENTS] UPDATE PRODUCT IN LIVE EVENT';
export const GET_LIVE_EVENT_PRODUCT = '[LIVE-EVENTS] GET PRODUCT IN LIVE EVENT';
export const TYPE_ERROR = '[LIVE-EVENTS] ERROR';
export const REPEAT_PRODUCT_DATA = '[LIVE-EVENTS] REPEAT PRODUCT DATA';
export const DELETE_PRODUCT_FROM_LIVE_EVENT = '[LIVE-EVENTS] DELETE PRODUCT FROM LIVE EVENT';
export const REMOVE_LIVE_EVENT_DATA_STATE = '[LIVE-EVENTS] REMOVE LIVE EVENT DATA STATE';
export const GET_LIVE_EVENT_PRODUCTS_LIST = '[LIVE-EVENTS] GET LIVE EVENT PRODUCTS LIST';

export function removeLiveEventDataState() {
    return (dispatch) => dispatch({
        type: REMOVE_LIVE_EVENT_DATA_STATE,
        payload: {}
    });
}

export function getLiveEvent(storeID, eventID) {

    let requestURL = AppConfig.API_URL+'event/storeID/'+storeID+'/eventID/'+eventID;
   
    const request = axios.get(requestURL);

    return (dispatch) =>
        request.then((response) => {

            return dispatch({
               type: GET_LIVE_EVENT,
               payload: response.data[0]
            })
        }
    );

}

export function getLiveEvents(storeID) {

    let requestURL = AppConfig.API_URL+'event/storeID/'+storeID+'/';
   
    const request = axios.get(requestURL);

    return (dispatch) =>
        request.then((response) => {

            return dispatch({
               type: GET_LIVE_EVENTS,
               payload: response.data
            })
        }
    );

/*
    return (dispatch, getState) => {
        const liveEventList = getState().liveEventsApp.liveEvents.liveEventList;
        
        let temp = {
            liveEventID: 'Test',
            userID: 'U12345',
            storeID: 'S12345',
            name: '1111',
            description: 'D1',
            time: {
                create: '2019-04-18 12:00:00',
                start: '',
                end: '',
            },
            products: []
        };
        liveEventList.push(temp);

        return {
            type    : GET_LIVE_EVENTS,
            payload : liveEventList
        };
    }
*/    

}

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

export function insertLiveEvent(newLiveEvent) {

    if( !newLiveEvent.createAt || (newLiveEvent.createAt && newLiveEvent.createAt.length === 0) ) {
        newLiveEvent.createAt = Date.now();
    }
    
    let requestURL = AppConfig.API_URL+'event/storeID/'+newLiveEvent.storeID+'/event/new';
    const request = axios.post(requestURL, newLiveEvent);

    return (dispatch, getState) =>
        request.then((response) => {

            // dispatch(closeCreatorLiveEventCard());
            dispatch(showMessage({ message: 'Insert new LIVE Event' }));

            if( response.data && !newLiveEvent.hasOwnProperty('eventID') ) {
                newLiveEvent.eventID = response.data;
            }

            // let liveEventList = [...getState().liveEventsApp.liveEvents.liveEventList];
            // liveEventList.unshift(newLiveEvent);
       
            return dispatch({
                type: INSERT_LIVE_EVENT,
                // payload: liveEventList
                payload: newLiveEvent
            });

        }
    );
    

    /*
    return (dispatch, getState) => {
        const liveEventList = getState().liveEventsApp.liveEvents.liveEventList;
        liveEventList.unshift(newLiveEvent);

        return {
            type    : GET_LIVE_EVENTS,
            payload : liveEventList
        };
    }*/
    

}

export function updateLiveEvent(eventID, updatedLiveEvent, isShowMessage=true) {

    if( updatedLiveEvent.storeID && eventID ) {
        let requestURL = AppConfig.API_URL+'event/storeID/'+updatedLiveEvent.storeID+'/event/'+eventID+'/update/';

        const request = axios.post(requestURL, updatedLiveEvent);
        return (dispatch, getState) =>
            request.then((response) => {

                if( isShowMessage === true ) {
                    dispatch(showMessage({ message: 'LIVE Event saved' }));
                }

                const liveEventList = [...getState().liveEventsApp.liveEvents.liveEventList];
                liveEventList.some(function(obj) {
                    if (obj.eventID === eventID){
                        for (let key in obj) {
                            if( obj[key] !== updatedLiveEvent[key] && updatedLiveEvent[key] ) {
                                obj[key] = updatedLiveEvent[key];
                            }
                        }
                        //return true;
                    }
                    return true;
                });

                if( !updatedLiveEvent.hasOwnProperty('eventID') ) {
                    updatedLiveEvent.eventID = eventID;
                }

                return dispatch({
                    type: UPDATE_LIVE_EVENT,
                    // payload: [...liveEventList]
                    payload: {...updatedLiveEvent}
                });
                
            }
        );
    } else {
        return (dispatch, getState) => {
            dispatch(showMessage({ message: "Can't save LIVE Event" }));
    
            return {
                type: TYPE_ERROR
            };
        }
    }
/*
    return (dispatch, getState) => {
        const liveEventList = getState().liveEventsApp.liveEvents.liveEventList;

        liveEventList.some(function(obj) {
            if (obj.storeId === updatedLiveEvent.storeId){
                for (let key in obj) {
                    obj[key] = updatedLiveEvent[key];
                }
                return true;
            }
            return true;
        });

        return {
            type    : GET_LIVE_EVENTS,
            payload : liveEventList
        };
    }
*/
}

export function deleteLiveEvent(storeID, eventID) {

    if( storeID && eventID ) {
        let requestURL = AppConfig.API_URL+'event/storeID/'+storeID+'/event/'+eventID+'/delete/';
   
        const request = axios.post(requestURL, {});
        return (dispatch, getState) =>
            request.then((response) => {

                dispatch( closeDeleteLiveEventPrompt() );
                dispatch(showMessage({ message: 'LIVE Event deleted' }));

                const liveEventList = getState().liveEventsApp.liveEvents.liveEventList.filter(event => event.eventID !== eventID);

                return dispatch({
                    type: DELETE_LIVE_EVENT,
                    payload: liveEventList
                });
            }
        );
    } else {
        return (dispatch, getState) => {
            dispatch(showMessage({ message: "Can't delete LIVE Event" }));
    
            return {
                type: TYPE_ERROR
            };
        }
    }

    /*
    return (dispatch, getState) => {
        const liveEventList = getState().liveEventsApp.liveEvents.liveEventList;

        let i = liveEventList.length;
        while (i--) {
            if( liveEventList[i].liveEventID === liveEventID){
                liveEventList.splice(i,1);
            }
        }
       
        return {
            type    : GET_LIVE_EVENTS,
            payload : liveEventList
        };
    }
    */
}

export function insertProductToLiveEvent(productData, eventID, newProductID, liveEventList) {
    
    if( eventID ) {

        let updatedLiveEvent = {};
        let repeatData = true;
        liveEventList.some(function(obj, index) {
            if( obj.eventID === eventID ) {
                for (let key in obj) {
                    if( key !== 'products' ) {
                        updatedLiveEvent[key] = obj[key];
                    } else if( key === 'products' ) {
                        if( obj[key].indexOf(newProductID) === -1 ) {
                            updatedLiveEvent[key] = [...obj[key], newProductID];
                            repeatData = false;
                        } else {
                            updatedLiveEvent[key] = obj[key];
                        }
                    }
                }
            }
            return true;
        });

        if( !repeatData ) {
            let requestURL = AppConfig.API_URL+'event/storeID/'+updatedLiveEvent.storeID+'/event/'+eventID+'/update/';
            const request = axios.post(requestURL, updatedLiveEvent);   
            
            return (dispatch, getState) =>
                request.then((response) => {

                    dispatch( closeProductInfoFormPrompt() );
                    
                    const liveEventListState = [...getState().liveEventsApp.liveEvents.liveEventList];

                    const newLiveEventList = [];
                    liveEventListState.some(function(obj, index) {
                        const newLiveEvent = {...obj};
                        if(obj.eventID === eventID) {
                            if( obj.products.indexOf(newProductID) === -1 ) {
                                newLiveEvent.products = [...obj.products, newProductID];
                            }
                        }
                        newLiveEventList[index] = {...newLiveEvent};
                        return true;
                    });

                    const productList = [...getState().liveEventsApp.liveEvents.productList];
                    productList.push(productData);

                    return dispatch({
                        type: INSERT_PRODUCT_TO_LIVE_EVENT,
                        liveEventList: newLiveEventList,
                        productList: productList
                    });
        
                }
            );
        } else {
            
            return {
                type: REPEAT_PRODUCT_DATA
            };
      
        }
        

    } else {
        return (dispatch, getState) => {
            dispatch(showMessage({ message: "Can't update LIVE Event" }));
    
            return {
                type: TYPE_ERROR
            };
        }
    }

}

export function updateProductInLiveEvent(productID, updateProductData) {
    
    if( productID ) {

        return (dispatch, getState) => {

            dispatch( closeProductInfoFormPrompt() );

            const productList = [...getState().liveEventsApp.liveEvents.productList];
            productList.some(function(obj, index) {
                if (obj.productID === productID){
                    let productInfo = obj.productInfo;
                    for (let key in productInfo) {
                        if( !_.isEqual(productInfo[key], updateProductData[key]) && updateProductData[key] ) {
                            productInfo[key] = updateProductData[key];
                        }
                    }
                }
                return true;
            });
            
            return dispatch({
                type: UPDATE_PRODUCT_IN_LIVE_EVENT,
                payload: [...productList]
            });
        }

        // let requestURL = AppConfig.API_URL+'product/storeID/'+storeID;
        // const request = axios.get(requestURL);

        // return (dispatch) =>
        //     request.then((response) => {
        //         dispatch( closeProductInfoFormPrompt() );
                
        //         dispatch({
        //             type: UPDATE_PRODUCT_IN_LIVE_EVENT,
        //             payload: response.data
        //         })
        //     }
        // );

    } else {
        return (dispatch, getState) => {
            dispatch(showMessage({ message: "Can't update LIVE Event" }));
    
            return {
                type: TYPE_ERROR
            };
        }
    }

}

export function deleteProductFormLiveEvent(liveEventList, eventID, deleteProductID) {


    if( eventID && deleteProductID ) {

        let updatedLiveEvent = {};
        let productsInLive = [];
        liveEventList.some(function(obj, index) {
            if( obj.eventID === eventID ) {
                for (let key in obj) {
                    if( key !== 'products' ) {
                        updatedLiveEvent[key] = obj[key];
                    } else if( key === 'products' ) {

                        productsInLive = [...obj[key]];
                        let i = productsInLive.length;
                        while (i--) {
                            if( productsInLive[i] === deleteProductID){
                                productsInLive.splice(i,1);
                            }
                        }

                        updatedLiveEvent[key] = [...productsInLive];

                    }
                }
            }
            return true;
        });

        if( updatedLiveEvent.hasOwnProperty('storeID') ) {
            let requestURL = AppConfig.API_URL+'event/storeID/'+updatedLiveEvent.storeID+'/event/'+eventID+'/update/';
            const request = axios.post(requestURL, updatedLiveEvent);   
            
            return (dispatch, getState) =>
                request.then((response) => {
                    dispatch(showMessage({ message: "Delete product in LIVE Event" }));
                    dispatch( closeDeleteProductPrompt() );
                    
                    const liveEventListState = [...getState().liveEventsApp.liveEvents.liveEventList];

                    const newLiveEventList = [];
                    liveEventListState.some(function(obj, index) {
                        let newLiveEvent = {...obj};
                        if(obj.eventID === eventID) {
                            newLiveEvent.products = [...productsInLive];
                        } 

                        newLiveEventList[index] = {...newLiveEvent};
                        return true;
                    });
                    
                    const productList = [...getState().liveEventsApp.liveEvents.productList];

                    return dispatch({
                        type: DELETE_PRODUCT_FROM_LIVE_EVENT,
                        liveEventList: newLiveEventList,
                        productList: productList
                    });
        
                }
            );
        } else {
            
            return {
                type: TYPE_ERROR
            };
        }
        

    } else {
        return (dispatch, getState) => {
            dispatch(showMessage({ message: "Can't delete product in LIVE Event" }));
    
            return {
                type: TYPE_ERROR
            };
        }
    }

}

export function getLiveEventProductList(data) {
    const request = axios.post(AppConfig.API_URL + 'product/productInfo/', data);

    return (dispatch) =>
        request.then((response) => {
            dispatch({
                type: GET_LIVE_EVENT_PRODUCTS_LIST,
                payload: response.data
            })
        })
}