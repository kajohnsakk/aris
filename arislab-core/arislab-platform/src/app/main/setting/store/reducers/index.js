import { combineReducers } from 'redux';
import businessProfile from './businessProfile.reducer';
import policy from './policy.reducer';
import payments from './payments.reducer';
import chatbotConfig from './chatbot.reducer';
import delivery from './delivery.reducer';
import storeConfig from './storeConfig.reducer';
import LayoutReducer from '../../../../fuse-layouts/store/reducers/layout.reducers';
import otp from './otp.reducer';
import storePackage from './storePackage.reducer';

const reducer = combineReducers({
    businessProfile,
    policy,
    payments,
    chatbotConfig,
    delivery,
    LayoutReducer,
    otp,
    storeConfig,
    storePackage
});

export default reducer;
