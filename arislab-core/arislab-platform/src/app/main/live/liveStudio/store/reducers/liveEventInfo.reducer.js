import * as Actions from '../actions';

const initialState = null;

const liveEventInfoReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_EVENT_INFO:
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

export default liveEventInfoReducer;
