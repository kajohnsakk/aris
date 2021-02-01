// import axios from 'axios';
// import * as AppConfig from '../../../../config/AppConfig';

export const GET_USER_DATA = '[LIVE-EVENTS] GET USER DATA';

export function getUserData() {

    /*
    return (dispatch) => {
        const request = axios.get();

        request.then( (response) => {
            return dispatch({
                type    : GET_USER_DATA,
                payload : response.data
            });
        });
    }
    */

    return {
        type    : GET_USER_DATA,
        payload : {
            userID: 'U12345',
            storeID: 'S12345',
            storeName: 'sos - sense of style',
            storePhoto: 'https://avatars2.githubusercontent.com/u/4323180?s=400&u=4962a4441fae9fba5f0f86456c6c506a21ffca4f&v=4',
        }
    }
   
}