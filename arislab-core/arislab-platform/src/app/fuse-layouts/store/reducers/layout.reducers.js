import * as Actions from '../actions';

const initialState = {
    stepState: 0,
};

const LayoutReducer = function (state = initialState, action) {

    switch (action.type) {
        case Actions.STEPPER_NEXT_BUTTON_EVENT: {
            return {
                stepState: state.stepState + 1
            };
        } case Actions.SET_STEPPER_STATE_BUTTON_EVENT: {
            return {
                stepState: state.stepState + action.setValue
            };
        } case Actions.STEPPER_BACK_BUTTON_EVENT: {
            return {
                stepState: state.stepState - 1
            };
        } default: {
            return state;
        }

    }

};

export default LayoutReducer;