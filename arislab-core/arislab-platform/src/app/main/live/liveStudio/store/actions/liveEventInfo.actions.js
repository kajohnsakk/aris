import axios from 'axios';
// import { showMessage } from 'app/store/actions/fuse';
import * as AppConfig from '../../../../config/AppConfig';

export const GET_EVENT_INFO = '[LIVE] GET EVENT INFO';
export const UPDATE_LIVE_EVENT = '[LIVE] UPDATE LIVE EVENT';

const host = AppConfig.API_URL;

export function getEventInfo(params) {
    let storeID = params['storeID'];
    let eventID = params['eventID'];

    const request = axios.get(host + 'event/storeID/' + storeID + '/eventID/' + eventID + '/');

    return (dispatch) =>
        request.then((response) => {
            // console.log('getEventInfo response', response)
            dispatch({
                type: GET_EVENT_INFO,
                payload: response.data[0]
            })
        });
}

export function updateLiveEvent(eventID, updatedLiveEvent) {

    if( updatedLiveEvent.storeID && eventID ) {
        let requestURL = host+'event/storeID/'+updatedLiveEvent.storeID+'/event/'+eventID+'/update/';

        const request = axios.post(requestURL, updatedLiveEvent);
        return (dispatch, getState) =>
            request.then((response) => {

                return dispatch({
                    type: UPDATE_LIVE_EVENT
                });
                
            }
        );
    }

}
