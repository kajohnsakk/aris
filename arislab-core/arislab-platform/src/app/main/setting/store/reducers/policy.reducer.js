import * as Actions from '../actions';

const initialState = null;

const policyReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_POLICY:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.SAVE_POLICY:
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

export default policyReducer;
