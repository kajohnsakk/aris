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
import LiveEventInfoFormCard from './card/LiveEventInfoFormCard';
import BreadcrumbCard from './card/BreadcrumbCard';
import DeletePrompt from './dialog/DeletePrompt';
import ProductInfoFormPrompt from './dialog/ProductInfoFormPrompt';
import ExistingProductPrompt from './dialog/ExistingProductPrompt';

import Cookies from "js-cookie";
import { UtilityManager } from '../../modules/UtilityManager';

import styles from './styles/styles';

// import { Trans } from 'react-i18next';
import Classnames from 'classnames';
import UtilityFunction from '../../modules/UtilityFunction';

class LiveEventApp extends Component {

    state = {
        auth0_uid: '',
        storeID: '',
        email: '',
        eventID: '',
        isLoadingEvent: false,
        liveEvent: {},
        productList: this.props.productList ? this.props.productList : [],
        selectedLiveEventProductList: [],
        maxLiveEventName: 50
    };
    pageCategory = "Lives";

    componentDidMount() {
        // let cookieValue = Cookies.get('email');
        let cookieValue = Cookies.get('auth0_uid');

        UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {
            const params = this.props.match.params;
            const { eventID } = params;
            var hasEvent = false;

            if (eventID !== 'new') {
                this.props.getLiveEvent(resultStoreInfo[0].storeID, eventID);
                hasEvent = true;
            }
            this.props.getLiveEvents(resultStoreInfo[0].storeID);
            this.props.getProducts(resultStoreInfo[0].storeID);

            this.setState({
                auth0_uid: resultStoreInfo[0].auth0_uid,
                email: resultStoreInfo[0].email,
                storeID: resultStoreInfo[0].storeID,
                eventID: eventID,
                isLoadingEvent: hasEvent
            });

            UtilityFunction.tagManagerPushDataLayer(this.pageCategory, "View", "View lives form", UtilityFunction.getExistValue(resultStoreInfo[0].auth0_uid, "Anonymous"));

        });


        if (this.props.liveEvent) {
            this.setState({ liveEvent: this.props.liveEvent });
            // this.props.getProducts(this.state.storeID);
        }

        // this.props.getLiveEvents(this.state.storeID);
        // this.props.getProducts(this.state.storeID);
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.isLoadingEvent) {
            if (typeof this.props.liveEvent === 'undefined') {
                window.location.href = "platform/lives/new";
            }
        }

        // if ( !_.isEqual(this.props.liveEventList, prevProps.liveEventList) ) {
        //     this.setState({ liveEventList: this.props.liveEventList });
        // }

        if (!_.isEqual(this.props.liveEvent, prevProps.liveEvent)) {
            this.setState({ liveEvent: this.props.liveEvent, selectedLiveEventProductList: this.props.liveEvent.products });
        }

        if (!_.isEqual(this.props.productList, prevProps.productList)) {
            this.setState({ productList: this.props.productList });
        }

    }

    componentWillUnmount() {
        this.pushTrackingData("Leave", "Leave lives form");
        this.props.removeLiveEventDataState();
    }

    pushTrackingData = (pageAction, pageLabel) => {
        // let email = UtilityFunction.getExistValue(this.state.email, "Anonymous");
        let auth0_uid = UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous");
        UtilityFunction.tagManagerPushDataLayer(this.pageCategory, pageAction, pageLabel, auth0_uid);
    }

    addInsertedProductIdToLiveEvent = (productID, productData) => {
        setTimeout(() => {
            var selectedLiveEventProductList = this.state.selectedLiveEventProductList;
            var newSelectedLiveEventProductList;
            if (selectedLiveEventProductList.indexOf(productID) > -1) {
                newSelectedLiveEventProductList = selectedLiveEventProductList;
            } else {
                newSelectedLiveEventProductList = [...selectedLiveEventProductList, productID];
            }
            this.setState({ selectedLiveEventProductList: newSelectedLiveEventProductList }, () => {
                this.props.getProducts(this.state.storeID);
                this.props.closeProductInfoFormPrompt();
            });
        }, 1000);

    }

    addExistsProductIdToLiveEvent = (liveEventProductList) => {
        this.setState({ selectedLiveEventProductList: liveEventProductList });
    }

    removeProductIdFromLiveEvent = (productID) => {
        // this.setState({ selectedLiveEventProductList: liveEventProductList });
        var selectedLiveEventProductList = [...this.state.selectedLiveEventProductList];
        var newSelectedLiveEventProductList = [];
        var index = selectedLiveEventProductList.indexOf(productID);

        if (index > -1) {
            selectedLiveEventProductList.splice(index, 1);
        }

        newSelectedLiveEventProductList = [...selectedLiveEventProductList];
        this.setState({ selectedLiveEventProductList: [...newSelectedLiveEventProductList] }, () => {
            this.props.closeDeleteProductPrompt();
        });
    }

    render() {
        const {
            classes, isDisplayProductInfoFormPrompt, isDisplayExistingProductPrompt, isDisplayDeleteProductPrompt
        } = this.props;

        const {
            eventID, liveEvent, productList, storeID
        } = this.state;

        var breadcrumbList = [{ titleI18n: 'live-event.live-event', title: 'Live', link: '/platform/lives' }];
        if (eventID === 'new') {
            breadcrumbList.push({ titleI18n: 'live-event.create-live-event-title', title: 'Create LIVE event', link: '' });
        } else {
            if (this.state.liveEvent) {
                var liveEventName = this.state.liveEvent.name && this.state.liveEvent.name.length > this.state.maxLiveEventName ? this.state.liveEvent.name.substring(0, this.state.maxLiveEventName) + '...' : this.state.liveEvent.name;
                breadcrumbList.push({ titleI18n: '', title: liveEventName, link: '' });
            }
        }


        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}

                content={
                    <React.Fragment>

                        <div>
                        
                            { this.state.storeID ? (
                                
                                <div className="flex justify-between lg:mt-24">
                                    <div className="hidden lg:block mb-24 mr-24 w-1/5">
                                        <div className="mb-24">
                                            <StoreProfileCard storeID={this.state.storeID} pushTrackingData={this.pushTrackingData} />
                                        </div>
                                        <div>
                                            <DownloadMobileAppCard pushTrackingData={this.pushTrackingData} />
                                        </div>
                                    </div>

                                    <div className="flex-1 mb-24">

                                        <div className="hidden lg:block mb-24 max-w-full">
                                            <BreadcrumbCard
                                                breadcrumbList={breadcrumbList}
                                            />
                                        </div>

                                        <div>
                                            <LiveEventInfoFormCard
                                                key={eventID}
                                                eventID={eventID}
                                                liveEvent={{ ...liveEvent }}
                                                isExpanded={true}
                                                productList={productList}
                                                storeID={storeID}
                                                type={eventID === 'new' ? eventID : 'edit'}
                                                selectedLiveEventProductList={this.state.selectedLiveEventProductList}
                                                pushTrackingData={this.pushTrackingData}
                                            />
                                        </div>

                                        {/* <Card className={classes.card}>
                                            <CardContent className={Classname(classes.cardHeader, "py-0")}>
                                                <div className='flex items-center justify-between'>
                                                    <Trans i18nKey="live-event.live-event">All events</Trans>
                                                    <Button align='right' variant="outlined" className={classes.button} component= {Link} to='/platform/live/create'>
                                                        <div className={classes.extendedMargin}><Trans i18nKey="live-event.new-event-btn">New Event</Trans></div>
                                                    </Button>
                                                </div>
                                            </CardContent>


                                            <CardContent className={classes.cardContent}>
                                                {liveEventList.length > 0 && (
                                                    liveEventList.map((liveEvent, index) => (<div key={"WrapLiveEventInfoCard_" + index} className="mb-24">
                                                        <LiveEventInfoCard
                                                            key={liveEvent.eventID}
                                                            liveEvent={{ ...liveEvent }}
                                                            eventIndex={index}
                                                            isExpanded={index === 0 ? true : false}
                                                            productList={this.state.productList}
                                                            storeID={this.state.storeID}
                                                        />
                                                    </div>))
                                                )}
                                            </CardContent>
                                        </Card> */}

                                    </div>













                                    {isDisplayDeleteProductPrompt && (
                                        <DeletePrompt
                                            storeID={this.state.storeID}
                                            removeProductIdFromLiveEvent={this.removeProductIdFromLiveEvent}
                                            pushTrackingData={this.pushTrackingData}
                                        />
                                    )}

                                    {isDisplayProductInfoFormPrompt && (
                                        <ProductInfoFormPrompt
                                            storeID={this.state.storeID}
                                            handleDoneProcessProductData={this.addInsertedProductIdToLiveEvent}
                                            pushTrackingData={this.pushTrackingData}
                                        />
                                    )}

                                    {isDisplayExistingProductPrompt && this.state.productList && (
                                        <ExistingProductPrompt
                                            storeID={this.state.storeID}
                                            productList={this.state.productList}
                                            handleDoneSelectedProductData={this.addExistsProductIdToLiveEvent}
                                            selectedLiveEventProductList={this.state.selectedLiveEventProductList}
                                        />
                                    )}

                                </div>
                            ) : (
                                    <div className={Classnames(classes.loadingPage, "my-64")}>
                                        <CircularProgress className={classes.highlightText} />
                                    </div>
                                )}

                        </div>
    
                        {/* <div className="md:hidden justify-between p-24">
                            <Typography className="font-bold text-center text-red">
                                <Trans i18nKey="live-event.not-available-on-mobile">
                                    This feature cannot be used on mobile device.
                                </Trans>
                            </Typography>
                        </div> */}
                    </React.Fragment>
                }
            />
        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLiveEvents: Actions.getLiveEvents,
        getLiveEvent: Actions.getLiveEvent,
        getProducts: Actions.getProducts,
        closeProductInfoFormPrompt: Actions.closeProductInfoFormPrompt,
        closeDeleteProductPrompt: Actions.closeDeleteProductPrompt,
        removeLiveEventDataState: Actions.removeLiveEventDataState,
        // openCreatorLiveEventCard    : Actions.openCreatorLiveEventCard,
        // closeCreatorLiveEventCard   : Actions.closeCreatorLiveEventCard
    }, dispatch);
}

function mapStateToProps({ liveEventsApp }) {
    return {
        // isDisplayCreatorLiveEventCard       : liveEventsApp.liveEventUi.isDisplayCreatorLiveEventCard,
        // isDisplayDeleteLiveEventPrompt      : liveEventsApp.liveEventUi.isDisplayDeleteLiveEventPrompt,
        isDisplayDeleteProductPrompt: liveEventsApp.liveEventUi.isDisplayDeleteProductPrompt,
        isDisplayProductInfoFormPrompt: liveEventsApp.liveEventUi.isDisplayProductInfoFormPrompt,
        isDisplayExistingProductPrompt: liveEventsApp.liveEventUi.isDisplayExistingProductPrompt,
        defaultProductInfoFormPromptType: liveEventsApp.liveEventUi.defaultProductInfoFormPromptType,
        selectedLiveEventID: liveEventsApp.liveEventUi.selectedLiveEventID,
        liveEventList: liveEventsApp.liveEvents.liveEventList,
        liveEvent: liveEventsApp.liveEvents.liveEvent,
        productList: liveEventsApp.liveEvents.productList,
        // product                             : liveEventsApp.products.product
    };
}

export default withReducer('liveEventsApp', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(LiveEventApp)));

