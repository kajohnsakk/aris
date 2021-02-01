import * as Actions from '../actions';

const initialState = null;

const liveProductSliderReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_PRODUCTS_LIST:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.GET_PRODUCT:
            {
                return {
                    ...action.payload
                };
            }
        default:
            {
                return state;
            }
    }
};

export default liveProductSliderReducer;
