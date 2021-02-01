import { combineReducers } from 'redux';
import liveProductInfo from './liveProductInfo.reducer';
import liveProductSlider from './liveProductSlider.reducer';
import liveEventInfo from './liveEventInfo.reducer';
import liveEventProducts from './liveEventProducts.reducer';
import businessProfile from '../../../../setting/store/reducers/businessProfile.reducer';

const reducer = combineReducers({
    liveProductInfo,
    liveProductSlider,
    liveEventInfo,
    businessProfile,
	liveEventProducts
});

export default reducer;
