import * as Actions from '../actions';

const initialState = null;

const chatbotConfigReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_CHATBOT_CONFIG:
            {
                return {
                    ...action.payload
                };
            }
        case Actions.SAVE_CHATBOT_CONFIG:
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

export default chatbotConfigReducer;
