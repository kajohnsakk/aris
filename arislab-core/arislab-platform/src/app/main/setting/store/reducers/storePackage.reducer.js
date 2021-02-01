import * as Actions from '../actions';

const initialState = {
    storePackageList: [],
    currentStorePackage: {}
};

const storePackageReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_CURRENT_STORE_PACKAGE: {
            return {
                ...state,
                currentStorePackage: action.payload
            };
        }
        default: {
            return state;
        }
    }
};

export default storePackageReducer;
