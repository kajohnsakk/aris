import * as Actions from '../actions';

const initialState = null;

const liveProductInfoReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_PRODUCT_INFO:
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

export default liveProductInfoReducer;
