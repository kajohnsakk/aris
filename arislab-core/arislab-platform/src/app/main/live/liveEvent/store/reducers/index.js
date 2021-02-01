import liveEventUi from './live-event-ui.reducer';
// import products from './products.reducer';
// import user from './user.reducer';
import liveEvents from './live-events.reducer';
import businessProfile from '../../../../setting/store/reducers/businessProfile.reducer';
import liveProductSlider from '../../../liveStudio/store/reducers/liveProductSlider.reducer';
import { combineReducers } from 'redux';

const reducer = combineReducers({
    liveEventUi,
    // user,
    liveEvents,
    // products,
    businessProfile,
    liveProductSlider
});

export default reducer;
