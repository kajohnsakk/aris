import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import * as AppConfig from '../../../config/AppConfig';

export const GET_STORE_CONFIG = '[STORE MANAGEMENT] GET STORE CONFIG';
export const SAVE_STORE_CONFIG = '[STORE MANAGEMENT] SAVE STORE CONFIG';

const host = AppConfig.API_URL;

export function getStoreConfig(params) {
    let storeID = params['storeID'];
    const request = axios.get(host + 'storeConfig/storeID/' + storeID);

    return (dispatch) =>
        request.then((response) => {
            dispatch({
                type: GET_STORE_CONFIG,
                payload: response.data.storeInfo
            });
        });
}

export function saveStoreConfig(data, params) {
    let storeID = params['storeID'];
    const request = axios.post(host + 'storeConfig/storeID/' + storeID + '/update', data);

    return (dispatch) =>
        request.then((response) => {
            dispatch(showMessage({ message: 'Store Config Saved' }));
            return dispatch({
                type: SAVE_STORE_CONFIG,
                payload: response.data
            })
        });
}
