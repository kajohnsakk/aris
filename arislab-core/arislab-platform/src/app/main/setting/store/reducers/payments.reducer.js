import * as Actions from '../actions';

const initialState = null;

const paymentsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_PAYMENT_PROFILE:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.SAVE_PAYMENT_PROFILE:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.VALIDATE_GBPAY_TOKEN:
            {
                return {
                    ...action.payload
                }
            }
        default:
            {
                return state;
            }
    }
};

export default paymentsReducer;
