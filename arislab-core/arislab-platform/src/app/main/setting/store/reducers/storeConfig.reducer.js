import * as Actions from '../actions';

const initialState = null;

const storeConfigReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_STORE_CONFIG:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.SAVE_STORE_CONFIG:
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

export default storeConfigReducer;
