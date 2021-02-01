import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';
// import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from '@lodash';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';

import StoreProfileCard from "./card/StoreProfileCard";
import DownloadMobileAppCard from "./card/DownloadMobileAppCard";
import LiveEventsCard from "./card/LiveEventsCard";
// import { CardContent, Card } from '@material-ui/core';
// import {Link} from 'react-router-dom';
// import {Button} from '@material-ui/core';
// import Classname from 'classnames';

// import LiveEventCreatorCard from './card/LiveEventCreatorCard';
// import VideoTutorialCard from './card/VideoTutorialCard';
// import LiveEventInfoFormCard from './card/LiveEventInfoFormCard';
// import LiveEventInfoCard from './card/LiveEventInfoCard';
import DeletePrompt from './dialog/DeletePrompt';
// import ProductInfoFormPrompt from './dialog/ProductInfoFormPrompt';
// import ExistingProductPrompt from './dialog/ExistingProductPrompt';

import Cookies from "js-cookie";
import { UtilityManager } from '../../modules/UtilityManager';

import styles from './styles/styles';

// import { Trans } from 'react-i18next';
import Classnames from 'classnames';
import UtilityFunction from '../../modules/UtilityFunction';
import * as AppConfig from '../../../main/config/AppConfig';
// import LogRocket from 'logrocket';


// import TagManager from 'react-gtm-module';

// TagManager.dataLayer({
//     dataLayer: {
//         event: 'Custom',
//         pageCategory: 'Live',
//         pageAction: 'View',
//         pageLabel: '-',
//         email: 'test22@hotmail.com',
//         registrationID: '123456'
//     }
// });

const SECURESITE_URL = AppConfig.SECURESITE_URL;

class LiveEventsApp extends Component {

    state = {
        auth0_uid: '',
        storeID: '',
        email: '',
        liveEventList: this.props.liveEventList ? this.props.liveEventList : [],
        productList: this.props.productList ? this.props.productList : [],
        count: 0
    };
    pageCategory = "Lives";

    componentDidMount() {
        // let cookieValue = Cookies.get('email');
        let cookieValue = Cookies.get('auth0_uid');
        let dotplay = Cookies.get('dotplay');
        if (this.state.storeID.length === 0 || this.state.auth0_uid.length === 0) {
            UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {
                this.setState({
                    auth0_uid: resultStoreInfo[0].auth0_uid,
                    email: resultStoreInfo[0].email,
                    storeID: resultStoreInfo[0].storeID
                });

                UtilityFunction.tagManagerPushDataLayer(this.pageCategory, "View", "View lives page", UtilityFunction.getExistValue(resultStoreInfo[0].auth0_uid, "Anonymous"));
                UtilityFunction.tagManagerPushDataLayer(this.pageCategory, "View", "15. View Live Page (Main Page)", UtilityFunction.getExistValue(resultStoreInfo[0].auth0_uid, "Anonymous"));


                this.props.getLiveEvents(resultStoreInfo[0].storeID);

                this.props.getProducts(resultStoreInfo[0].storeID);

            });
        }


        // LogRocket.identify(this.state.auth0_uid, {
        //     name: this.state.storeID,
        //     email: this.state.email,
        // });


    }

    componentDidUpdate(prevProps, prevState) {

        if (!_.isEqual(this.props.liveEventList, prevProps.liveEventList)) {
            this.setState({ liveEventList: this.props.liveEventList });
        }

        if (!_.isEqual(this.state.liveEventList, prevState.liveEventList)) {
            this.setState({ liveEventList: this.props.liveEventList });
        }

        if (!_.isEqual(this.props.productList, prevProps.productList)) {
            this.setState({ productList: this.props.productList });
        }

    }

    componentWillUnmount() {
        this.pushTrackingData("Leave", "Leave lives page");
    }

    pushTrackingData = (pageAction, pageLabel) => {
        // let email = UtilityFunction.getExistValue(this.state.email, "Anonymous");
        let auth0_uid = UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous");
        UtilityFunction.tagManagerPushDataLayer(this.pageCategory, pageAction, pageLabel, auth0_uid);
    }

    render() {
        const { classes, isDisplayDeleteLiveEventPrompt } = this.props;

        const { liveEventList } = this.state;
        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}


                /*
                http://react-material.fusetheme.com/components/material-ui/selects
                https://tailwindcss.com/docs/flexbox-align-items
                */

                content={
                    <React.Fragment>

                        {/* <div className="hidden lg:block my-24">
                            <img alt="Live Banner" src="assets/images/etc/livebanner.png" width="100%" />
                        </div> */}

                        {this.state.storeID ? (

                            <div className="flex justify-between my-12 lg:my-24">
                                <div className="hidden lg:block mb-24 mr-24 w-1/5">
                                    <div className="mb-24">
                                        <StoreProfileCard storeID={this.state.storeID} pushTrackingData={this.pushTrackingData} />
                                    </div>
                                    <div>
                                        <DownloadMobileAppCard pushTrackingData={this.pushTrackingData} />
                                    </div>
                                </div>

                                <div className="flex-1 mb-24">

                                    <LiveEventsCard
                                        liveEventList={liveEventList}
                                        productList={this.state.productList}
                                        storeID={this.state.storeID}
                                        pushTrackingData={this.pushTrackingData}
                                    />

                                </div>

                                {isDisplayDeleteLiveEventPrompt && (
                                    <DeletePrompt storeID={this.state.storeID} pushTrackingData={this.pushTrackingData} />
                                )}



                            </div>
                        ) : (
                                <div className={Classnames(classes.loadingPage, "my-64")}>
                                    <CircularProgress className={classes.highlightText} />
                                </div>
                            )}
                    </React.Fragment>
                }
            />
        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLiveEvents: Actions.getLiveEvents,
        getProducts: Actions.getProducts,
        // openCreatorLiveEventCard    : Actions.openCreatorLiveEventCard,
        // closeCreatorLiveEventCard   : Actions.closeCreatorLiveEventCard
    }, dispatch);
}

function mapStateToProps({ liveEventsApp }) {
    return {
        // isDisplayCreatorLiveEventCard       : liveEventsApp.liveEventUi.isDisplayCreatorLiveEventCard,
        isDisplayDeleteLiveEventPrompt: liveEventsApp.liveEventUi.isDisplayDeleteLiveEventPrompt,
        // isDisplayDeleteProductPrompt        : liveEventsApp.liveEventUi.isDisplayDeleteProductPrompt,
        // isDisplayProductInfoFormPrompt      : liveEventsApp.liveEventUi.isDisplayProductInfoFormPrompt,
        // isDisplayExistingProductPrompt      : liveEventsApp.liveEventUi.isDisplayExistingProductPrompt,
        // defaultProductInfoFormPromptType    : liveEventsApp.liveEventUi.defaultProductInfoFormPromptType,
        selectedLiveEventID: liveEventsApp.liveEventUi.selectedLiveEventID,
        liveEventList: liveEventsApp.liveEvents.liveEventList,
        productList: liveEventsApp.liveEvents.productList,
        // product                             : liveEventsApp.products.product
    };
}

export default withReducer('liveEventsApp', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(LiveEventsApp)));

