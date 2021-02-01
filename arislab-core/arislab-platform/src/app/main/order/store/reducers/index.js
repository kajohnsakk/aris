import { combineReducers } from 'redux';
import orders from './orders.reducer';
// import products from '../../../product/store/reducers/products.reducer';
// import product from '../../../product/store/reducers/product.reducer';

const reducer = combineReducers({
    orders,
    // products,
    // product
});

export default reducer;
