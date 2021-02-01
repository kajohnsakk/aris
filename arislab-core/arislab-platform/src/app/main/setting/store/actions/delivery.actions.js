import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import * as AppConfig from '../../../config/AppConfig';

export const GET_DELIVERY = '[STORE MANAGEMENT] GET DELIVERY';
export const SAVE_DELIVERY = '[STORE MANAGEMENT] SAVE DELIVERY';

const host = AppConfig.API_URL;

export function getDelivery(params) {
    let storeID = params['storeID'];
    const request = axios.get(host + 'delivery/storeID/' + storeID);

    return (dispatch) =>
        request.then((response) => {
            dispatch({
                type: GET_DELIVERY,
                payload: response.data.storeInfo.delivery
            });
        });
}

export function saveDelivery(data, params) {
    let storeID = params['storeID'];
    const request = axios.post(host + 'delivery/storeID/' + storeID + '/update', data);

    return (dispatch) =>
        request.then((response) => {
            dispatch(showMessage({ message: 'Delivery Saved' }));
            return dispatch({
                type: SAVE_DELIVERY,
                payload: response.data
            })
        });
}

