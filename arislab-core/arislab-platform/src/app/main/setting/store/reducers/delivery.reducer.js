import * as Actions from '../actions';

const initialState = null;

const deliveryReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_DELIVERY:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.SAVE_DELIVERY:
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

export default deliveryReducer;
