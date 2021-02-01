import businessProfile from "../../../setting/store/reducers/businessProfile.reducer";
import orders from "../../../order/store/reducers/orders.reducer";
import payment  from "../../../setting/store/reducers/payments.reducer";
import { combineReducers } from "redux";

const reducer = combineReducers({
    businessProfile,
    orders,
    payment
});

export default reducer;
