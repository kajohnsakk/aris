import React from 'react';
// import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import {
    withStyles,
    // Card,
    // CardContent,
    Button,
} from '@material-ui/core';
import Facebook from '../../../setting/channelManagement/Facebook/Facebook';
import axios from 'axios';
// import { showMessage } from 'app/store/actions/fuse';
import ALink from '@material-ui/core/Link';

// import _ from '@lodash';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
// import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import CircularProgress from '@material-ui/core/CircularProgress';
import LiveEventInfoCard from './LiveEventInfoCard';
// import ProductTable from '../table/ProductTable';
// import LiveEventInfoFormCard from './LiveEventInfoFormCard';
import styles from '../styles/styles';
import Classnames from 'classnames';
import { SalesChannelManager } from '../../../context/sales_channel/salesChannelManager';

import { Trans, withTranslation } from 'react-i18next';
// import i18n from '../../../../i18n';


const initialState = {
    liveEventList: [],
    productList: [],
    storeID: '',
    facebookPageID: '',
    facebookSelectedPageAccessToken: '',
    isDisplayNews: true,
    validFacebookPage: false,
    isCheckingData: true,
};

class LiveEventsCard extends React.Component {

    state = { ...initialState };

    componentDidMount() {

        SalesChannelManager.getInstance().getChannelByStoreID(this.props.storeID).then((resultChannelByStoreID) => {
            if (resultChannelByStoreID.length > 0 && resultChannelByStoreID[0].hasOwnProperty('channels')) {

                this.setState({
                    facebookPageID: resultChannelByStoreID[0]['channels']['facebook'],
                    facebookSelectedPageAccessToken: resultChannelByStoreID[0]['channels']['facebookSelectedPageAccessToken']
                }, this.isTokenValid(resultChannelByStoreID[0]['channels']['facebookSelectedPageAccessToken'], resultChannelByStoreID[0]['channels']['facebook']));
            } else {
                this.setState({
                    isCheckingData: false
                })
            }

            // this.setState({
            //     isCheckingData: false
            // })
        });
    }

    redirectFacebook = () => {
        window.location.href = "/platform/setting/salesChannels";
    }

    closeWindow = () => {
        this.setState({
            isDisplayNews: !this.state.isDisplayNews
        })
    }

    isTokenValid = (pageToken, pageID) => {
        let tokenObject = { token: pageToken }
        let facebookID = 'facebook_' + pageID
        if (pageToken.length > 0) {
            axios.post('api/channels/validatePageToken', tokenObject).then((response) => {
                if (response.data.data.is_valid === true) {
                    axios.get('api/channels/cvl-platform/channelID/' + facebookID + '/details').then((res) => {
                        if (res.data.id === facebookID && this.state.facebookPageID !== "") {
                            this.setState({
                                validFacebookPage: true,
                                isCheckingData: false
                            });
                        } else {
                            this.setState({
                                isCheckingData: false
                            });
                        }
                    })
                } else {
                    this.setState({
                        isCheckingData: false
                    });
                }
            });
        } else {
            this.setState({
                isCheckingData: false
            });
        }
    }

    render() {
        const { classes, liveEventList, productList, storeID } = this.props;
        const lineURL = process.env.REACT_APP_LINE_URL || "https://lin.ee/wj86cIh"

        return (
            <React.Fragment>

                {this.state.isCheckingData ?
                    <div className={Classnames(classes.loadingPage, "my-24")}>
                        <CircularProgress className={classes.highlightText} />
                    </div>
                    :
                    <div>
                        {this.state.isDisplayNews ? (

                            <div className={Classnames(classes.card, "mb-24")}>
                                <div className={Classnames(classes.cardContent, "w-full")}>
                                    <div className="rounded relative" role="alert">

                                        <div className="flex ml-8 lg:ml-0">
                                            <img alt="AccountType" src="assets/images/store-management/account-type-notification.png" width="100px" />

                                            <div className="flex flex-row items-center mx-16">
                                                <div className="flex flex-col flex-1">
                                                    <span className="font-bold text-lg mb-4"><Trans i18nKey="live-event.tutorial">Contact us for our platform tutorial</Trans></span>
                                                    <span className="block"><Trans i18nKey="live-event.add-line">You can add our line </Trans> <ALink style={{ color: "#f00" }} href={lineURL} target="_blank" rel="noopener noreferrer"><Trans i18nKey="live-event.here">here</Trans></ALink></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute pin-t pin-r">
                                            <Button onClick={this.closeWindow}> X </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                                null
                            )}

                        {!this.state.validFacebookPage ? (
                            <Facebook parentPage="LIVE_EVENTS_PAGE" storeID={this.state.storeID} pushTrackingData={this.props.pushTrackingData} dataLabel="Live events connect new sales channel" />
                        ) : (

                                <div className={classes.card}>
                                    <div className={Classnames(classes.liveEventCardHeader, "flex items-center justify-between p-16")}>
                                        <Trans i18nKey="live-event.live-event">All events</Trans> ({liveEventList.length})
                                        <Button align='right' variant="outlined" className={classes.button} component={Link} to='/platform/lives/new' onClick={() => this.props.pushTrackingData("Click", "Create LIVE button")}>
                                            <div className={classes.extendedMargin}><Trans i18nKey="live-event.new-event-btn">New Event</Trans></div>
                                        </Button>

                                    </div>
                                    <div className={Classnames(classes.cardContent, "mt-12")}>
                                        {/* <div className='flex flex-row items-center mb-24'>
                                <div className='flex w-1/4 mx-8'>
                                    <img alt='' src="assets/images/landing/welcome-icon.png"/>
                                </div>
                                <div className='w-3/4 mx-8 flex flex-col'>
                                    <div className='block text-xl text-bold'>
                                        <Trans i18nkey="live-event.creating-an-event"> Creating an event </Trans>
                                    </div>
                                    <div className='block'>
                                        <Trans i18nkey="live-event.creating-a-product"> Create a product </Trans>
                                    </div>
                                    <div className='block'>
                                        <Trans i18nkey="live-event.create-a-live"> Create a live </Trans>
                                    </div>
                                </div>
                            </div> */}

                                        <div>
                                            {liveEventList.length > 0 ? (
                                                liveEventList.map((liveEvent, index) => (<div key={"WrapLiveEventInfoCard_" + index} className="mb-24">
                                                    <LiveEventInfoCard
                                                        key={liveEvent.eventID}
                                                        liveEvent={{ ...liveEvent }}
                                                        eventIndex={index}
                                                        isExpanded={index === 0 ? true : false}
                                                        productList={productList}
                                                        storeID={storeID}
                                                        facebookPageID={this.state.facebookPageID}
                                                        facebookSelectedPageAccessToken={this.state.facebookSelectedPageAccessToken}
                                                        pushTrackingData={this.props.pushTrackingData}
                                                    />
                                                </div>))
                                            ) : (
                                                    <div className="px-32 pb-12 lg:px-0">
                                                        <Button component={Link} to='/platform/lives/new' className={Classnames(classes.createNewLiveEventBigBtn, "py-32 text-xs justify-center items-center flex")} onClick={() => this.props.pushTrackingData("Click", "Create LIVE button")}>
                                                            <img src="assets/images/etc/add-icon-btn.png" alt="Add icon" className="mr-12" /><Trans i18nKey="live-event.create-new-live-event-title">Create New LIVE Event</Trans>
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                }


            </React.Fragment>
        );

    }
}

LiveEventsCard.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

function mapStateToProps({ liveEventsApp }) {
    return {

    };
}

// ( connect(mapStateToProps, mapDispatchToProps)( withTranslation()(LiveEventInfoCard) ) )
export default withReducer('liveEventsApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LiveEventsCard)))));