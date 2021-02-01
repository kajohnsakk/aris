export const OPEN_CREATOR_LIVE_EVENT_CARD = '[LIVE-EVENTS] OPEN CREATOR LIVE EVENT CARD';
export const CLOSE_CREATOR_LIVE_EVENT_CARD = '[LIVE-EVENTS] CLOSE CREATOR LIVE EVENT CARD';
export const OPEN_DELETE_LIVE_EVENT_PROMPT = '[LIVE-EVENTS] OPEN DELETE LIVE EVENT PROMPT';
export const CLOSE_DELETE_LIVE_EVENT_PROMPT = '[LIVE-EVENTS] CLOSE DELETE LIVE EVENT PROMPT';
export const OPEN_DELETE_PRODUCT_PROMPT = '[LIVE-EVENTS] OPEN DELETE PRODUCT PROMPT';
export const CLOSE_DELETE_PRODUCT_PROMPT = '[LIVE-EVENTS] CLOSE DELETE PRODUCT PROMPT';
export const OPEN_PRODUCT_INFO_FORM_PROMPT = '[LIVE-EVENTS] OPEN PRODUCT INFO FORM PROMPT';
export const CLOSE_PRODUCT_INFO_FORM_PROMPT = '[LIVE-EVENTS] CLOSE PRODUCT INFO FORM PROMPT';
export const OPEN_EXISTING_PRODUCT_PROMPT = '[LIVE-EVENTS] OPEN EXISTING PRODUCT PROMPT';
export const CLOSE_EXISTING_PRODUCT_PROMPT = '[LIVE-EVENTS] CLOSE EXISTING PRODUCT PROMPT';


export function openCreatorLiveEventCard() {
    return {
        type: OPEN_CREATOR_LIVE_EVENT_CARD
    }
}

export function closeCreatorLiveEventCard() {
    return {
        type: CLOSE_CREATOR_LIVE_EVENT_CARD
    }
}

export function openDeleteLiveEventPrompt(deleteLiveEventID) {
    return {
        type: OPEN_DELETE_LIVE_EVENT_PROMPT,
        deleteLiveEventID: deleteLiveEventID
    }
}

export function closeDeleteLiveEventPrompt() {
    return {
        type: CLOSE_DELETE_LIVE_EVENT_PROMPT,
        deleteLiveEventID: ''
    }
}

export function openDeleteProductPrompt(liveEventID, deleteProductID) {
    return {
        type: OPEN_DELETE_PRODUCT_PROMPT,
        selectedLiveEventID: liveEventID,
        selectedProductID: deleteProductID
    }
}

export function closeDeleteProductPrompt() {
    return {
        type: CLOSE_DELETE_PRODUCT_PROMPT,
        selectedLiveEventID: '',
        selectedProductID: ''
    }
}

export function openProductInfoFormPrompt(selectedLiveEventID, selectedProductID) {
    return {
        type: OPEN_PRODUCT_INFO_FORM_PROMPT,
        selectedLiveEventID: selectedLiveEventID,
        selectedProductID: selectedProductID
    }
}

export function closeProductInfoFormPrompt() {
    return {
        type: CLOSE_PRODUCT_INFO_FORM_PROMPT,
        selectedLiveEventID: '',
        selectedProductID: ''
    }
}

export function openExistingProductPrompt(selectedLiveEventID) {
    return {
        type: OPEN_EXISTING_PRODUCT_PROMPT,
        selectedLiveEventID: selectedLiveEventID
    }
}

export function closeExistingProductPrompt() {
    return {
        type: CLOSE_EXISTING_PRODUCT_PROMPT,
        selectedLiveEventID: ''
    }
}

