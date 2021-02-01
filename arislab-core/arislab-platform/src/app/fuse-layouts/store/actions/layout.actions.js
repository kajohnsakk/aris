export const STEPPER_NEXT_BUTTON_EVENT = 'STEPPER NEXT BUTTON EVENT';
export const SET_STEPPER_STATE_BUTTON_EVENT = 'SET STEPPER STATE BUTTON EVENT';
export const STEPPER_BACK_BUTTON_EVENT = 'STEPPER BACK BUTTON EVENT';

export function handleStepperNextButton() {
    return {
        type: STEPPER_NEXT_BUTTON_EVENT,
    }
}

export function handleSetStepperStepButton(setValue) {
    return {
        type: SET_STEPPER_STATE_BUTTON_EVENT,
        setValue: setValue
    }
}

export function handleStepperBackButton() {
    return {
        type: STEPPER_BACK_BUTTON_EVENT,
    }
}