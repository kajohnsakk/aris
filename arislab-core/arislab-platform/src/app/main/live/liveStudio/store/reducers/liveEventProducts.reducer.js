import * as Actions from '../actions';

const initialState = {
    productList: []
};

const liveEventProducts = function(state = initialState, action) {
    switch(action.type) {
        case Actions.GET_PRODUCTS: {
            return {
                ...state,
                productList: action.payload
            };
        } case Actions.SAVE_PRODUCT: {
            return {
                ...state
            };
        } default: {
            return state;
        }
    }
};

export default liveEventProducts;