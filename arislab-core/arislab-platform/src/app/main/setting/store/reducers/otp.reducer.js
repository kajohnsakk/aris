import * as Actions from '../actions';

const initialState = { otpCode: "", otpReferenceCode: ""}

const otpReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SAVE_OTP:
            {
                return {
                    otpCode: action.payload.otpCode,
                    otpReferenceCode: action.payload.otpReferenceCode
                };
            }
        // case Actions.SAVE_OTP_CODE:
        //     {
        //         return {
        //             ...action.payload
        //         };
        //     }
        default:
            {
                return state;
            }
    }
};

export default otpReducer;
