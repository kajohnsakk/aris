import * as Actions from '../actions';

const initialState = {
    liveEvent: {},
    liveEventList: [],
    productList: [],
	liveEventProductList: {},
};

const liveEventsReducer = function(state = initialState, action) {
    switch(action.type) {
        case Actions.GET_LIVE_EVENT: {
            return {
                ...state,
                liveEvent: action.payload
            };
        } case Actions.REMOVE_LIVE_EVENT_DATA_STATE: {
            return {
                ...state,
                liveEvent: {}
            };
        } case Actions.GET_LIVE_EVENTS: {
            return {
                ...state,
                liveEventList: action.payload
            };
        } case Actions.GET_PRODUCTS: {
            return {
                ...state,
                productList: action.payload
            };
        } case Actions.INSERT_LIVE_EVENT: {
            return {
                ...state,
                // liveEventList: [...action.payload]
                liveEvent: {...action.payload}
            };
        } case Actions.UPDATE_LIVE_EVENT: {
            return {
                ...state,
                // liveEventList: [...action.payload]
                liveEvent: {...action.payload}
            };
        } case Actions.DELETE_LIVE_EVENT: {
            return {
                ...state,
                liveEventList: [...action.payload]
            };
        } case Actions.INSERT_PRODUCT_TO_LIVE_EVENT: {
            return {
                ...state,
                liveEventList: [...action.liveEventList],
                productList: [...action.productList]
            };
        } case Actions.UPDATE_PRODUCT_IN_LIVE_EVENT: {
            return {
                ...state,
                productList: action.payload
            };
        } case Actions.DELETE_PRODUCT_FROM_LIVE_EVENT: {
            return {
                ...state,
                liveEventList: [...action.liveEventList],
                productList: [...action.productList]
            };
        } case Actions.GET_LIVE_EVENT_PRODUCTS_LIST: {
            return {
                ...state,
                liveEventProductList: action.payload
            };
        } default: {
            return state;
        }
    }
};

export default liveEventsReducer;