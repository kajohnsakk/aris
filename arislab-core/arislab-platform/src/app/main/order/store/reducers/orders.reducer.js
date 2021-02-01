import * as Actions from '../actions';

const initialState = {
    data      : [],
    exportOrderUrl: '',
    searchText: ''
};

const ordersReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_ORDERS:
        {
            return {
                ...state,
                data: action.payload
            };
        }
        case Actions.UPDATE_ORDERS:
        {
            var data = [];

            for (const el of state.data) {
                if (el.orderID === action.payload.orderID) {
                    data.push(action.payload)
                } else {
                    data.push(el)
                }
            }

            return {
                ...state,
                data: data
            };
        }
        case Actions.SET_ORDERS_SEARCH_TEXT:
            {
                return {
                    ...state,
                    searchText: action.searchText
                };
            }
        case Actions.EXPORT_ORDERS:
        {
            return {
                ...state,
                exportOrderUrl: action.returnUrl
            };
        }
        case Actions.CLEAR_ORDERS:
        {
            return {
                ...state,
                data: null
            };
        }
        default:
        {
            return {...state};
        }
    }
};

export default ordersReducer;
