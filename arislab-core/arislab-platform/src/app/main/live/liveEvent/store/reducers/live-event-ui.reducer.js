import * as Actions from '../actions';

const initialState = {
    isDisplayCreatorLiveEventCard: false,
    isDisplayDeleteLiveEventPrompt: false,
    isDisplayDeleteProductPrompt: false,
    isDisplayProductInfoFormPrompt: false,
    isDisplayExistingProductPrompt: false,
    defaultProductInfoFormPromptType: 'new',
    outlinedInputlabelWidth: 0,
    selectedLiveEventID: '',
    selectedProductID: ''
};

const liveEventUiReducer = function( state = initialState, action ) {
    
    switch(action.type) {
        case Actions.OPEN_CREATOR_LIVE_EVENT_CARD: {
            return {
                ...state,
                isDisplayCreatorLiveEventCard: true
            };
        } case Actions.CLOSE_CREATOR_LIVE_EVENT_CARD: {
            return {
                ...state,
                isDisplayCreatorLiveEventCard: false
            };
        } case Actions.OPEN_DELETE_LIVE_EVENT_PROMPT: {
            return {
                ...state,
                isDisplayDeleteLiveEventPrompt: true,
                selectedLiveEventID: action.deleteLiveEventID
            };
        } case Actions.CLOSE_DELETE_LIVE_EVENT_PROMPT: {
            return {
                ...state,
                isDisplayDeleteLiveEventPrompt: false,
                selectedLiveEventID: ''
            };
        } case Actions.OPEN_DELETE_PRODUCT_PROMPT: {
            return {
                ...state,
                isDisplayDeleteProductPrompt: true,
                selectedLiveEventID: action.selectedLiveEventID,
                selectedProductID: action.selectedProductID
            };
        } case Actions.CLOSE_DELETE_PRODUCT_PROMPT: {
            return {
                ...state,
                isDisplayDeleteProductPrompt: false,
                selectedLiveEventID: '',
                selectedProductID: ''
            };
        } case Actions.OPEN_PRODUCT_INFO_FORM_PROMPT: {
            return {
                ...state,
                isDisplayProductInfoFormPrompt: true,
                selectedLiveEventID: action.selectedLiveEventID,
                selectedProductID: action.selectedProductID
            };
        } case Actions.CLOSE_PRODUCT_INFO_FORM_PROMPT: {
            return {
                ...state,
                isDisplayProductInfoFormPrompt: false,
                selectedLiveEventID: '',
                selectedProductID: ''
            };
        } case Actions.OPEN_EXISTING_PRODUCT_PROMPT: {
            return {
                ...state,
                isDisplayExistingProductPrompt: true,
                selectedLiveEventID: action.selectedLiveEventID
            };
        } case Actions.CLOSE_EXISTING_PRODUCT_PROMPT: {
            return {
                ...state,
                isDisplayExistingProductPrompt: false,
                selectedLiveEventID: ''
            };
        } default: {
            return state;
        }
    
    }

};

export default liveEventUiReducer;