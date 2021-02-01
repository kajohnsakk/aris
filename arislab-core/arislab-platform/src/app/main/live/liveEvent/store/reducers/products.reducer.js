import * as Actions from '../actions';

const initialState = {
    colorList: [],
    productCategoryList: [],
    productSubCategory1List: [],
    productSubCategory2List: [],
    productAttributeList: [],
    product: {}
};

const liveEventsReducer = function(state = initialState, action) {
    switch(action.type) {
        case Actions.GET_PRODUCT_CATEGORIES: {
            return {
                ...state,
                productCategoryList: [...action.payload]
            };
        } case Actions.GET_PRODUCT_SUB_CATEGORIES_LEVEL_1: {
            return {
                ...state,
                productSubCategory1List: [...action.payload]
            };
        } case Actions.GET_PRODUCT_SUB_CATEGORIES_LEVEL_2: {
            return {
                ...state,
                productSubCategory2List: [...action.payload],
                productAttributeList: [...action.attributes]
            };
        } default: {
            return state;
        }
    }
};

export default liveEventsReducer;