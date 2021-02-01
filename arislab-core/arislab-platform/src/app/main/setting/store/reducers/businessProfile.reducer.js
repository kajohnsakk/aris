import * as Actions from '../actions';

const initialState = null;

const businessProfileReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_BUSINESS_PROFILE: {
            return {
                ...action.payload
            };
        }
        case Actions.GET_BUSINESS_PROFILE_ONLY: {
            return {
                ...action.payload
            };
        }
        case Actions.SAVE_BUSINESS_PROFILE: {
            return {...state};
        }
        case Actions.SAVE_BUSINESS_PROFILE_SECTIONS: {
            let storeInfo = { storeInfo: {
                    ...state.storeInfo,
                    ...action.payload.storeInfo
                }
            }
            return {
                ...state,
                ...storeInfo
            };
        }
        default: {
            return state;
        }
    }
};

export default businessProfileReducer;
