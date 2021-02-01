import React, { Component } from 'react';
import Cookies from "js-cookie";
import {
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';

// import { FacebookPageJson, FacebookService } from '../../../modules/FacebookService';
// import FacebookPageList from './FacebookPageList';
import '../../storeManagement/StoreManagement.css';
import { UtilityManager } from '../../../modules/UtilityManager';
import UtilityFunction from '../../../modules/UtilityFunction';
import { SalesChannelManager } from '../../../context/sales_channel/salesChannelManager';

import { Trans, withTranslation } from 'react-i18next';
import { FacebookService } from '../../../modules/FacebookService';
import * as Actions from '../../store/actions';
import reducer from '../../store/reducers';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';

const styles = theme => ({
    layoutRoot: {},
    card: {
        maxWidth: '100%',
        border: 'solid 1px #ededed',
        paddingBottom: 5
    },
    header: {
        background: '#fbfbfb',
        borderBottom: 'solid 2px #ededed',
        color: '#8d9095',
        fontWeight: 'bolder'
    },
    content: {
        background: '#ffffff',
        paddingTop: 5,
        paddingBottom: 5,
    },
    table: {
        marginBottom: '300px'
    }
});

class Facebook extends Component {
    state = {
        storeInfo: {},
        auth0_uid: '',
        storeID: '',
        email: '',
        businessProfile: null,
        channelInfo: {},
        facebookSelectedPage: {},
        isSaving: false,
        selectedPage: {},
        pages: [],
        isLoadData: true,
        isLoadFacebookPageData: false
    }
    pageCategory = "Sale Channel";


    componentDidMount() {
        // let cookieValue = Cookies.get('email');
        let cookieValue = Cookies.get('auth0_uid');

        this.storeInfoLookup(cookieValue)
            .then( async (resultStoreInfoLookup) => {
                // console.log('resultStoreInfoLookup', resultStoreInfoLookup);
                this.setState({
                    storeInfo: resultStoreInfoLookup
                })

                // SalesChannelManager.getInstance().getChannelByStoreID(resultStoreInfoLookup[0].storeID)
                //     .then((resultChannelByStoreID) => {
                //         let facebookPageID;
                //         let facebookSelectedPage;

                //         if (resultChannelByStoreID.length > 0 && resultChannelByStoreID[0].hasOwnProperty('channels')) {
                //             facebookPageID = "facebook_" + resultChannelByStoreID[0]['channels']['facebook'];
                //             facebookSelectedPage = resultChannelByStoreID[0]['channels']['facebookSelectedPage'];

                //             this.setState({
                //                 facebookSelectedPage: facebookSelectedPage
                //             });

                //             SalesChannelManager.getInstance().getConvolabChannelInfo(facebookPageID)
                //                 .then((resultGetConvolabChannelInfo) => {
                //                     this.setState({
                //                         channelInfo: resultGetConvolabChannelInfo,
                //                         isLoadData: false
                //                     }, () => { this.setSelectedFacebookPageData(); });
                //                 });
                //         }

                //     });

                var resultChannelByStoreID = await SalesChannelManager.getInstance().getChannelByStoreID(resultStoreInfoLookup[0].storeID);
                if (resultChannelByStoreID.length > 0 && resultChannelByStoreID[0].hasOwnProperty('channels')) {
                    var facebookPageID = "facebook_" + resultChannelByStoreID[0]['channels']['facebook'];
                    // var facebookSelectedPage = resultChannelByStoreID[0]['channels']['facebookSelectedPage'];

                    // this.setState({
                    //     facebookSelectedPage: facebookSelectedPage
                    // });

                    var resultGetConvolabChannelInfo = await SalesChannelManager.getInstance().getConvolabChannelInfo(facebookPageID);
                    this.setState({
                        channelInfo: resultGetConvolabChannelInfo,
                        isLoadData: false
                    }, () => { this.setSelectedFacebookPageData(); });
                }
                
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (!_.isEqual(this.props.businessProfile, prevProps.businessProfile) || (this.props.businessProfile && this.state.businessProfile === null)) {
            this.setState({ businessProfile: this.props.businessProfile });
        }

    }

    componentWillUnmount() {
        if (this.checkExternalTrackingDataFunctionIsExist()) {
            this.props.pushTrackingData("Leave", "Leave " + this.props.dataLabel);
        } else {
            UtilityFunction.tagManagerPushDataLayer(this.pageCategory, "Leave", "Leave sale channel", UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous"));
        }
    }

    pushTrackingData = (pageAction, pageLabel) => {
        // let email = UtilityFunction.getExistValue(this.state.email, "Anonymous");
        let auth0_uid = UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous");
        UtilityFunction.tagManagerPushDataLayer(this.pageCategory, pageAction, pageLabel, auth0_uid);
    }

    storeInfoLookup = (cookie) => {
        return UtilityManager.getInstance().storeInfoLookup(cookie)
            .then((resultStoreInfo) => {
                this.setState({
                    auth0_uid: resultStoreInfo[0].auth0_uid,
                    email: resultStoreInfo[0].email,
                    storeID: resultStoreInfo[0].storeID
                });

                this.props.getBusinessProfile({ storeID: resultStoreInfo[0].storeID });

                if (this.checkExternalTrackingDataFunctionIsExist()) {
                    this.props.pushTrackingData("View", "View " + this.props.dataLabel);
                } else {
                    UtilityFunction.tagManagerPushDataLayer(this.pageCategory, "View", "View sale channel page", UtilityFunction.getExistValue(resultStoreInfo[0].auth0_uid, "Anonymous"));
                }

                return resultStoreInfo;
            });
    }

    onFacebookAuthClicked = () => {
        this.setState({ isLoadFacebookPageData: true });
        FacebookService.getInstance().authenticate().then(() => {
            return FacebookService.getInstance().loadPages();
        }).then(this.onFacebookPageLoaded);
    };

    onFacebookPageLoaded = () => {
        this.setState({ isLoadFacebookPageData: false }, () => { this.setSelectedFacebookPageData(); });
    }

    setSelectedFacebookPageData = () => {

        FacebookService.getInstance().pages.map((page) => {
            if (this.state.channelInfo.hasOwnProperty('channel_id') && this.state.channelInfo.channel_id === page.id) {
                this.setState({ selectedPage: page });
                return true;
            }
            return false;

        });
    };

    checkExternalFunctionIsExist = () => {
        return (typeof this.props.handleStepperNextButton === 'function');
    }

    checkExternalTrackingDataFunctionIsExist = () => {
        return (typeof this.props.pushTrackingData === 'function');
    }

    handleClickCloseButton = (event) => {
        this.setState({
            isDialogOpen: false
        })
    }

    removeChannelFromConvolab = async (channelID) => {
        SalesChannelManager.getInstance().removeChannelFromConvolab(channelID);

        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('success') },
                2000
            )
        );
    }

    handleSavePage = async (event) => {
        event.preventDefault();
        const { selectedPage } = this.state;

        if (this.checkExternalTrackingDataFunctionIsExist()) {
            this.props.pushTrackingData("Click", "Save sale channel button");
            this.props.pushTrackingData("Update", "Update " + this.props.dataLabel);
        } else {
            this.pushTrackingData("Click", "Save sale channel button");
            this.pushTrackingData("Update", "Update sale channel page");
        }

        if (FacebookService.getInstance().pages.length > 0) {

            this.setState({ isSaving: true });

            let pageInfo = FacebookService.getInstance().pages.filter((page) => {
                return page.id === selectedPage.id;
            });

            // if (this.state.businessProfile) {
            //     var businessProfile = this.state.businessProfile;
            //     var param = { storeID: businessProfile.storeID };
            //     businessProfile.storeInfo.businessProfile.logo = selectedPage.profilePicture;
            //     businessProfile.storeInfo.businessProfile.accountDetails.businessName = selectedPage.name;
            //     this.props.saveBusinessProfile(businessProfile, param);
            // }

            let channelID = "facebook_" + pageInfo[0]['id'];
            let convolab_channelBody = {
                id: "facebook_" + pageInfo[0]['id'],
                channel_type: "facebook",
                name: pageInfo[0]['name'],
                token: pageInfo[0]['access_token'],
                channel_id: pageInfo[0]['id'],
                status: "active",
                created_at: Date.now(),
                user_count: 0,
                message_count: 0,
                bot_id: "origin",
                entity_link: [],
                last_refresh: Date.now()
            }

            // Check channelID is exists in database or not
            let channelInfo = await SalesChannelManager.getInstance().getChannelInfo(channelID)
            
            if (
                channelInfo.length <= 0 ||
                (channelInfo.length > 0 && channelInfo[0].hasOwnProperty('storeID') && channelInfo[0]['storeID'] === 'undefined')
            ) {
                let channelID = this.state.channelInfo['id'];
                
                if( channelID ) {
                    await this.removeChannelFromConvolab(channelID);
                }
                SalesChannelManager.getInstance().addChannelToConvolab(convolab_channelBody.id, convolab_channelBody);
                
                let updateChannelBody = {
                    facebook: pageInfo[0]['id'],
                    facebookSelectedPage: selectedPage,
                    facebookSelectedPageAccessToken: pageInfo[0]['access_token']
                }
                await SalesChannelManager.getInstance().updateChannel(this.state.storeID, updateChannelBody);

                if(Cookies.get('dotplay')){
                    console.log("facebookid : ",updateChannelBody.facebook)
                    console.log("facebookPageName : ",updateChannelBody.facebookSelectedPage.name)
                }

                if (this.state.businessProfile) {
                    var businessProfile = this.state.businessProfile;
                    var param = { storeID: businessProfile.storeID };
                    businessProfile.storeInfo.businessProfile.logo = selectedPage.profilePicture;
                    businessProfile.storeInfo.businessProfile.accountDetails.businessName = selectedPage.name;
                    this.props.saveBusinessProfile(businessProfile, param);
                }
                
                this.setState({
                    isSaving: false,
                    isError: false,
                    errorCode: "",
                    errorMessage: "",
                    isDialogOpen: false
                });

                // Check if this component has external function == this component is in Create New Store state
                if (this.checkExternalFunctionIsExist()) {
                    this.props.handleStepperNextButton();
                } else if(Cookies.get('dotplay')){
                    window.location.href = Cookies.get('redirect_url')+"?facebookId="+updateChannelBody.facebook+"&facebookPage="+updateChannelBody.facebookSelectedPage.name;
                } 
                else {
                    window.location.reload();
                }

                // SalesChannelManager.getInstance().removeChannelFromConvolab(channelID)
                //     .then((resultRemoveChannelFromConvolab) => {
                //         // If this channelID never exists in the database or storeID returns undefined
                //         SalesChannelManager.getInstance().addChannelToConvolab(convolab_channelBody.id, convolab_channelBody)
                //             .then((resultAddChannelToConvolab) => {
                //                 let updateChannelBody = {
                //                     facebook: pageInfo[0]['id'],
                //                     facebookSelectedPage: selectedPage,
                //                     facebookSelectedPageAccessToken: pageInfo[0]['access_token']
                //                 }

                //                 SalesChannelManager.getInstance().updateChannel(this.state.storeID, updateChannelBody)
                //                     .then((resultUpdateChannel) => {
                //                         // console.log('resultUpdateChannel', resultUpdateChannel);

                //                         if (this.state.businessProfile) {
                //                             var businessProfile = this.state.businessProfile;
                //                             var param = { storeID: businessProfile.storeID };
                //                             businessProfile.storeInfo.businessProfile.logo = selectedPage.profilePicture;
                //                             businessProfile.storeInfo.businessProfile.accountDetails.businessName = selectedPage.name;
                //                             this.props.saveBusinessProfile(businessProfile, param);
                //                         }
                                        
                //                         this.setState({
                //                             isSaving: false,
                //                             isError: false,
                //                             errorCode: "",
                //                             errorMessage: "",
                //                             isDialogOpen: false
                //                         });

                //                         // Check if this component has external function == this component is in Create New Store state
                //                         if (this.checkExternalFunctionIsExist()) {
                //                             this.props.handleStepperNextButton();
                //                         } else {
                //                             window.location.reload();
                //                         }

                //                     })
                //                     .catch( (error) => {
                //                         this.setState({
                //                             isSaving: false,
                //                             isError: true,
                //                             errorCode: "sales-channels-modal-error-cannot-save-page",
                //                             errorMessage: "Error",
                //                             isDialogOpen: true
                //                         });
                //                     } );

                //             })
                //     })
                //     .catch( (error) => {
                //         this.setState({
                //             isSaving: false,
                //             isError: true,
                //             errorCode: "sales-channels-modal-error-cannot-save-page",
                //             errorMessage: "Error",
                //             isDialogOpen: true
                //         });
                //     } );
            } else {

                if (this.state.storeID !== channelInfo[0]['storeID']) {
                    // If this channelID exists in the database
                    this.setState({
                        isSaving: false,
                        isError: true,
                        errorCode: "sales-channels-modal-error-duplicate-page",
                        errorMessage: "Duplicate page",
                        isDialogOpen: true
                    });

                } else {

                    if( !this.state.channelInfo.hasOwnProperty('channel_id') ) {
                        SalesChannelManager.getInstance().addChannelToConvolab(convolab_channelBody.id, convolab_channelBody);
                    }

                    this.setState({
                        isSaving: false,
                        isError: false,
                        isDialogOpen: false
                    });

                    // Check if this component has external function == this component is in Create New Store state
                    if (this.checkExternalFunctionIsExist()) {
                        this.props.handleStepperNextButton();
                    } else {
                        // window.location.reload();
                    }

                }
            }
        }
    }

    renderFacebookPageList = () => {
        const pages = FacebookService.getInstance().pages;

        return (
            <div className={(this.props.parentPage && this.props.parentPage === 'LIVE_EVENTS_PAGE' ? "" : "lg:w-2/3 ") + "store-management-body-container w-full my-40 rounded overflow-hidden shadow inline-block" }>
            <div className="px-40 py-20 store-management-header">
                <div className="font-bold text-xl mb-2 text-left"><Trans i18nKey="settings.salesChannels.sales-channels-title">Sales Channel</Trans></div>
            </div>
            <div className="lg:py-20 lg:px-80 px-16 store-management-body content-left text-left relative">
                { this.state.isSaving && (
                    <div className="h-full w-full absolute z-50 pin-t pin-l" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                        <div className="flex flex-col h-full items-center justify-center">
                            <CircularProgress color="primary" />
                            <div className="font-semibold mt-8 text-lg text-white">
                                <Trans i18nKey="settings.salesChannels.saving-facebook-page">System is saving your data, please wait...</Trans>
                            </div>
                        </div>
                    </div>
                ) }
                <div className="mb-24 text-left  text-lg inline-block content-left mt-12 text-black inline-block w-2/3"><Trans i18nKey="settings.salesChannels.sales-channels-input-facebook-page-placeholder">Select Facebook Page</Trans></div>
                <div className="mx-auto max-w-sm text-center flex flex-wrap justify-center store-management-page-selector text-lg">
                    {
                        pages.map((page) => {
                            // console.log('page =======> ', page);
                            return (
                                <div className="flex items-center mr-4 px-4 py-16 w-full" key={page.id}>
                                    <React.Fragment>
                                        <input id={page.id} type="radio" name="radio" value={page.id} className="hidden" onClick={() => { this.setState({ selectedPage: page }) }} defaultChecked={this.state.channelInfo.hasOwnProperty('channel_id') ? this.state.channelInfo.channel_id === page.id : false} />
                                    </React.Fragment>
                                    <label htmlFor={page.id} className="flex items-center cursor-pointer">
                                        <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                        {page.name}
                                    </label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {this.checkExternalFunctionIsExist() ? (
                <div className="px-40 py-20 text-right store-management-footer">
                    {/* <button className="button-secondary" onClick={() => { this.props.handleStepperBackButton(); }}>&lt;&nbsp; <Trans i18nKey="main.back-btn">Back</Trans></button> */}
                    {this.state.isSaving === true ? (
                        <button className="button-secondary" disabled><Trans i18nKey="settings.salesChannels.sales-channels-button-saving-label">Saving</Trans>.....</button>
                    ) : (
                        <button className="button-primary" disabled={!(this.state.selectedPage.hasOwnProperty('id'))} onClick={this.handleSavePage}><Trans i18nKey="main.next-btn">Next</Trans></button>
                    )}
                </div>
            ) : (
                <div className="px-40 py-20 text-right store-management-footer">
                    {this.state.isSaving === true ? (
                        <button className="button-secondary" disabled><Trans i18nKey="settings.salesChannels.sales-channels-button-saving-label">Saving</Trans>.....</button>
                    ) : (
                        <button className="button-primary" disabled={!(this.state.selectedPage.hasOwnProperty('id'))} onClick={this.handleSavePage}><Trans i18nKey="settings.salesChannels.sales-channels-button-save-label">Save</Trans></button>
                    )}
                </div>
            )}
        </div>)
    };

    renderLoginFacebookContent = () => {
        return (
        <div className={(this.props.parentPage && this.props.parentPage === 'LIVE_EVENTS_PAGE' ? "" : "lg:w-2/3 lg:my-40 ") + "store-management-body-container w-full rounded overflow-hidden shadow inline-block"}>
            <div className="px-40 py-20 store-management-header">
                <div className="font-bold text-xl mb-2 text-left"><Trans i18nKey="settings.salesChannels.sales-channels-title">Sales Channel</Trans></div>
            </div>
            <div className="lg:py-20 lg:px-80 store-management-body">
                <div className="mb-24 text-center mt-40">
                    <img alt="Your Store Logo" src="assets/images/store-management/your-store-logo.png" style={{ width: "180px" }} />
                </div>
                <div className="mb-24 text-center  text-lg w-full inline-block text-center mt-12 text-gray">
                    <div className="w-full lg:w-2/3 inline-block">
                        <Trans i18nKey="settings.salesChannels.sales-channels-message">Connect your Aris account to your Facebook Page to connect sales channel</Trans>
                    </div>
                </div>
                <div className="mb-24 text-center text-lg w-full lg:w-1/2 inline-block mt-24 text-gray">
                    {this.state.isLoadData ? (
                        <button className="loading-facebook">
                            <Trans i18nKey="settings.salesChannels.sales-channels-loading-facebook-label">Loading</Trans>.....
                        </button>
                    ) : (
                        this.state.businessProfile && this.state.businessProfile.hasOwnProperty('storeInfo') && this.state.businessProfile.storeInfo.hasOwnProperty('businessProfile') && this.state.businessProfile.storeInfo.businessProfile.hasOwnProperty('accountDetails') && this.state.businessProfile.storeInfo.businessProfile.accountDetails.hasOwnProperty('businessName') && this.state.businessProfile.storeInfo.businessProfile.accountDetails.businessName.length > 0 ? (
                            <button className="edit-login-facebook-button w-4/5 sm:w-3/5 md:w-2/5 lg:w-full" onClick={() => { this.onFacebookAuthClicked(); }}>
                                <div className="flex flex-row items-center">
                                    <div className="flex flex-1 items-center text-left mr-4">
                                        { this.state.businessProfile.storeInfo.businessProfile.logo && <img alt={this.state.businessProfile.storeInfo.businessProfile.accountDetails.businessName} className="h-40 mx-4 rounded-full" src={ this.state.businessProfile.storeInfo.businessProfile.logo } /> }
                                        { this.state.businessProfile.storeInfo.businessProfile.accountDetails.businessName }
                                    </div>
                                    <div className="flex"><EditIcon className="mx-4" /></div>
                                </div>
                            </button>
                        ) : (
                            <button className="login-facebook-button" onClick={() => { this.onFacebookAuthClicked(); }}>
                                <Trans i18nKey="settings.salesChannels.sales-channels-button-login-with-facebook-label">LOGIN WITH FACEBOOK</Trans>
                            </button>
                        )
                    )}
                </div>
            </div>
            {this.checkExternalFunctionIsExist() ? (
                <div className="px-40 py-20 text-right store-management-footer">
                    <button className="button-secondary" onClick={() => { this.props.handleStepperBackButton(); }}>&lt;&nbsp; <Trans i18nKey="main.back-btn">Back</Trans></button>
                    <button className="button-primary inactive" ><Trans i18nKey="main.next-btn">Next</Trans></button>
                </div>
            ) : (null)}
        </div>)
    };

    render() {

        // if (FacebookService.getInstance().pages.length > 0) {
        //     console.log('FacebookService.getInstance().pages', FacebookService.getInstance().pages);
        // }

        return (
            <FusePageSimple
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                content={
                    (
                        <div className="text-center content-center">
                            {FacebookService.getInstance().pages.length > 0 && !this.state.isLoadData ? this.renderFacebookPageList() : this.renderLoginFacebookContent()}



                            {this.state.isError === true ?
                                <Dialog
                                    open={this.state.isDialogOpen}
                                    fullWidth={true}
                                    maxWidth={"sm"}
                                    aria-labelledby="customized-dialog-title"
                                >
                                    <DialogTitle id="customized-dialog-title">
                                        <Trans i18nKey={`settings.salesChannels.sales-channels-modal-error-title`}>
                                            Error
                                        </Trans>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Typography gutterBottom>
                                            <Trans i18nKey={`settings.salesChannels.${this.state.errorCode}`}>
                                                {this.state.errorMessage}
                                            </Trans>
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleClickCloseButton} autoFocus>
                                            <Trans i18nKey={`settings.salesChannels.sales-channels-modal-error-close-button`}>
                                                Close
                                            </Trans>
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                : null
                            }
                        </div>
                    )
                }

            />
        )
    }
}

// export default withStyles(styles, { withTheme: true })(withTranslation()(Facebook));
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBusinessProfile: Actions.getBusinessProfile,
        saveBusinessProfile: Actions.saveBusinessProfile
    }, dispatch);
}

function mapStateToProps({ storeManagement }) {
    return {
        businessProfile: storeManagement.businessProfile,
    }
}

export default withReducer('storeManagement', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Facebook)))));
