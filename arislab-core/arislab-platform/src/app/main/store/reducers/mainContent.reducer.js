import * as Actions from '../actions';

const initialState = {
    tabValue: 0
};

const mainContentReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CHANGE_TAB:
            {
                return {
                    ...state,
                    ...action.payload
                };
            }
        default:
            {
                return state;
            }
    }
};

export default mainContentReducer;
