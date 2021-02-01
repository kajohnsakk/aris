import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { 
    withStyles, 
    IconButton,
    Button,
    TextField,
    Tooltip,
    Divider,
    Fab,
    CircularProgress,
    FormControlLabel,
    RadioGroup,
    Radio,
    Dialog
} from '@material-ui/core';

// import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import _ from '@lodash';
import { showMessage } from 'app/store/actions/fuse';
import { UtilityManager } from '../../../modules/UtilityManager';
import UtilityFunction from "../../../modules/UtilityFunction";

import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ViewListIcon from '@material-ui/icons/ViewList';
import StayCurrentPortraitIcon from '@material-ui/icons/StayCurrentPortrait';
import StayCurrentLandscapeIcon from '@material-ui/icons/StayCurrentLandscape';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import styles from '../styles/styles';

import { Trans, withTranslation } from 'react-i18next';
import i18n from '../../../../i18n';

import LiveEventProductTable from '../table/LiveEventProductTable';
import { SalesChannelManager } from '../../../context/sales_channel/salesChannelManager';
import HorizontalPromptCard from './HorizontalPromptCard';

import '../styles/styles.css'

const initialState = {
    eventID: '',
    isDisplayHorizontalDialog: false,
    eventInfo: {
        storeID: '',
        name: '',
        description: '',
        videoOrientation: 'VERTICAL',
        createAt: '',
        eventStartAt: '',
        eventEndAt: '',
        code: '',
        facebookData: {
            videoID: '',
            streamURL: '',
            streamKey: ''
        },
        // facebookStreamKey: '',
        /*category: '',
        startDate: defaultDate,
        startTime: defaultTime,
        endDate: defaultDate,
        endTime: defaultEndTime,*/
        products: []
    },
    facebookPageID: '',
    facebookSelectedPageAccessToken: '',
    isCreatingLiveSession: false,
    liveErrorModal: false,
    error: ''

};

class LiveEventInfoFormCard extends React.Component {

    state = {...initialState};

    maxTitileLength = 255;

    componentDidMount() {
        //this.props.getProductCategories();
        // if( this.props.type === 'edit' ) {
        //     this.setState({ 
        //         eventID: this.props.liveEvent.eventID,
        //         eventInfo: {
        //             storeID: this.props.liveEvent.storeID,
        //             name: this.props.liveEvent.name,
        //             description: this.props.liveEvent.description,
        //             createAt: this.props.liveEvent.createAt,
        //             eventStartAt: this.props.liveEvent.eventStartAt,
        //             eventEndAt: this.props.liveEvent.eventEndAt,
        //             code: this.props.liveEvent.code ? this.props.liveEvent.code : this.randomString(6) ,
        //             // facebookStreamKey: this.props.liveEvent.facebookStreamKey,
        //             products: this.props.liveEvent.products,
        //             eventID: this.props.liveEvent.eventID
        //         } 
        //     });
        // } else {
            this.setState({ 
                eventInfo: {
                    ...initialState.eventInfo,
                    storeID: this.props.storeID,
                    code: this.randomString(6)
                } 
            });
        // }

        SalesChannelManager.getInstance().getChannelByStoreID(this.props.storeID).then((resultChannelByStoreID) => {
            if (resultChannelByStoreID.length > 0 && resultChannelByStoreID[0].hasOwnProperty('channels')) {
                this.setState({ facebookPageID: resultChannelByStoreID[0]['channels']['facebook'], facebookSelectedPageAccessToken: resultChannelByStoreID[0]['channels']['facebookSelectedPageAccessToken'] });
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {

        // if( this.props.type !== 'new' && !_.isEqual(this.state.eventInfo, this.props.liveEvent) ) {
        //     this.setState({ eventInfo: this.props.liveEvent, eventID: this.props.eventID });
        // }

        var nowEventInfo = this.state.eventInfo;

        if( !_.isEqual(this.props.selectedLiveEventProductList, prevProps.selectedLiveEventProductList) ) {
            // var nowEventInfo = this.state.eventInfo;
            nowEventInfo.products = this.props.selectedLiveEventProductList;
            this.setState({ eventInfo: { ...nowEventInfo } });
        }

        if( !_.isEqual(this.props.updateLiveEventProductID, prevProps.updateLiveEventProductID) ) {
            // var nowEventInfo = this.state.eventInfo;
            nowEventInfo.products.push(this.props.updateLiveEventProductID);
            this.setState({ eventInfo: { ...nowEventInfo } });
        }

        if ( !_.isEqual(this.props.liveEvent, prevProps.liveEvent) ) {
            this.setState({ eventInfo: this.props.liveEvent, eventID: this.props.eventID });
        }

        // if( !_.isEqual(this.props.productList, prevProps.productList) ) {
        //     this.setProductListToThisLiveEvent();
        // }

        if( this.state.isCreatingLiveSession === true ) {
            // Call facebook api for get 'streamURL'
            var eventData = this.state.eventInfo;
            var eventID = this.state.eventInfo.eventID;

            if( this.props.storeID && eventID ) {
                if( this.state.facebookPageID.length > 0 && this.state.facebookSelectedPageAccessToken.length > 0 ) {
                    showMessage('asdfsdfsdf')
                    var facebookPageID = this.state.facebookPageID;
                    var facebookSelectedPageAccessToken = this.state.facebookSelectedPageAccessToken;
                    const apiUrl = `https://graph.facebook.com/${facebookPageID}/live_videos?status=LIVE_NOW&title=${encodeURIComponent(eventData.name)}&description=${encodeURIComponent(eventData.description)}&access_token=${facebookSelectedPageAccessToken}`;
                    axios.post(apiUrl).then((res) => {
                        eventData.facebookData.videoID = res.data.id;
                        eventData.facebookData.streamURL = res.data.secure_stream_url;
                        
                        this.props.updateLiveEvent(eventID, eventData, false);
                        this.setState( { isCreatingLiveSession: false }, () => { this.props.history.push("/platform/lives/studio/"+eventData.eventID); } );
                    })
                    .catch((error) => {
                        showMessage({ message: 'Error can\'t create LIVE session.' })
                        this.setState( { isCreatingLiveSession: false, error: error.toString(), liveErrorModal: true } );
                    });
                }

            } else {
                showMessage({ message: 'Error not found your store.' })
                this.setState( { isCreatingLiveSession: false } );
            }

        }

    }

    toggleDialog = dialogName => {
        if (this.state[dialogName]) {
            this.setState({ error: "" });
        }
        this.setState({ [dialogName]: !this.state[dialogName] });
    };

    randomString = (length) => {
        let result           = '';
        // let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    handleInputChange = (event) => {
        if (event.target.name === "eventInfo.name") {
            if (new Blob([event.target.value]).size > 255) {
                return;
            }
        }
        this.setState(_.set({...this.state}, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
        this.toggleDialog(event.target.value)
    };

    handleSubmitLiveEventForm = async (event) => {
        event.preventDefault();

        await this.processEventData();

        setTimeout(function(){ window.location.href = "/platform/lives"; }, 1000);

    }

    processEventData = async () => {
        // if( this.props.type === 'new' ) {
        //     this.props.insertLiveEvent(this.state.eventInfo);
        // } else if( this.props.type === 'edit' ) {
        //     this.props.updateLiveEvent(this.state.eventID, this.state.eventInfo);
        // }
        if( this.state.eventID.length > 0 ) {
            this.props.pushTrackingData("Update", "Update LIVE: " + this.state.eventInfo.name);
            this.props.updateLiveEvent(this.state.eventID, this.state.eventInfo);
        } else {

            var eventInfo = this.state.eventInfo;
            var hasDuplicateEventCode = false;
            do {
                var duplicateEventCode = await UtilityManager.getInstance().getEventInfoByCode(eventInfo.code);
                if( duplicateEventCode.length > 0 ) {
                    hasDuplicateEventCode = true;
                    eventInfo.code = this.randomString(6);
                } else {
                    hasDuplicateEventCode = false;
                }
            } while (hasDuplicateEventCode); 
            
            this.props.pushTrackingData("Create", "Create LIVE: " + this.state.eventInfo.name);
            this.props.pushTrackingData("Create", "18. Create Live");

            this.props.insertLiveEvent(this.state.eventInfo);
        }
    };

    setProductListToThisLiveEvent = () => {

        const data = this.props.productList;

        const newProductList = {};
        Object.keys(data).map((key, index) => {

            if( this.state.eventInfo.products && this.state.eventInfo.products.length > 0 ) {
                if( this.state.eventInfo.products.indexOf(data[key].productID) > -1 ) {
                    newProductList[this.state.eventInfo.products.indexOf(data[key].productID)] = data[key];
                }
            }
            
            return newProductList;
        });

        this.setState({ liveEventProductList: newProductList });
    };

    handleAddProductBtnClick = event => {
        event.preventDefault();

        let eventID = this.state.eventID;
        this.props.pushTrackingData("Click", "Add product into LIVE button");
        this.props.pushTrackingData("Click", "16. Create Product");

        this.props.openProductInfoFormPrompt(eventID, '');

    }

    handleSelectProductBtnClick = event => {
        event.preventDefault();

        let eventID = this.state.eventID;
        this.props.pushTrackingData("Click", "Select product into LIVE button");
        this.props.openExistingProductPrompt(eventID, '');
        
    }

    handleGoLiveBtnClick = async (event) => {
        event.preventDefault();
        this.props.pushTrackingData("Click", "Go LIVE button");
        this.props.pushTrackingData("Create", "20. Click Get Code");

        await this.processEventData();

        setTimeout(() => { this.setState( { isCreatingLiveSession: true } ); }, 1000);
        
    }

    toggleDialog = (info) => {
        if (info === "HORIZONTAL"){
            this.setState({ isDisplayHorizontalDialog: !this.state.isDisplayHorizontalDialog });
        }
    };

    toggleErrorDialog = dialogName => {
        if (this.state[dialogName]) {
            this.setState({ error: "" });
        }
        this.setState({ [dialogName]: !this.state[dialogName] });
    };

    render() {
        const { classes } = this.props;
        
        return (
            <React.Fragment>
                <Dialog
                    fullWidth={false}
                    fullScreen={UtilityFunction.useMediaQuery("(max-width: 1199px)")}
                    maxWidth="md"
                    open={this.state.liveErrorModal}
                    className={classes.dialog}
                >
                    <div className="modal-header flex items-center">
                        <ErrorIcon color="error"></ErrorIcon>
                        <div className="ml-4 text-red"><Trans i18nKey="live-event.error">เกิดข้อผิดพลาด</Trans></div>
                    </div>

                    <div className="absolute right pin-t pin-r">
                        <IconButton
                            aria-label="Close"
                            onClick={() => {
                                this.toggleErrorDialog("liveErrorModal");
                            }}
                        >
                            <CloseIcon fontSize="default" />
                        </IconButton>
                    </div>

                    <div className="modal-content">
                        <div><Trans i18nKey="live-event.please-try-again">กรุณาลองอีกครั้ง</Trans></div>
                        {(this.state.error.includes('500') ? <div className="mt-8"><Trans i18nKey="live-event.length-error">ชื่อวีดีโอหรือคำอธิบายอาจมีความยาวเกินไป</Trans></div> : <React.Fragment></React.Fragment>)}
                        <div className="mt-8 text-grey-dark">{this.state.error}</div>
                    </div>
                </Dialog>
                <div className={classes.card}>
                    <div className={classes.cardContent}>
                        <form autoComplete="off" onSubmit={this.handleSubmitLiveEventForm}>
                            <div className="flex items-center p-16">
                                <div className="flex-grow text-left font-bold text-lg">
                                    { this.props.type === 'new' ? <Trans i18nKey="live-event.create-live-event-title">Create LIVE Event</Trans> : <Trans i18nKey="live-event.edit-live-event">Edit LIVE Event</Trans> }
                                </div>
                                <div className="hidden lg:flex">
                                    <Button className={classNames(classes.linkButton, "mr-12")} type="Submit" onClick={() => {
                                        this.props.pushTrackingData("Click", "Save LIVE button"); this.props.pushTrackingData("Create", "19. Click Save Live");} }>
                                        <Trans i18nKey="main.save-btn">Save</Trans>
                                    </Button>
                                    { !this.state.isCreatingLiveSession ? (
                                        <Fab variant="extended" size="small" aria-label="Play" disabled={ this.state.eventInfo.products && this.state.eventInfo.products.length > 0 ? false : true } className={classNames(classes.button, classes.highlightButton, "m-0")} onClick={this.handleGoLiveBtnClick} >
                                            <PlayArrowIcon className={classes.iconInButton}/>
                                            <span className="mr-8"><Trans i18nKey="live-event.go-live-btn">GO LIVE</Trans></span>
                                        </Fab>
                                    ) : (
                                        <Fab variant="extended" size="small" aria-label="Play" disabled={ true } className={classNames(classes.button, classes.highlightButton, "m-0")}>
                                            <CircularProgress size={24} className={classes.highlightText} />
                                            <span className="mx-3"><Trans i18nKey="live-event.creating-live-session-btn">Creating LIVE session...</Trans></span>
                                        </Fab>
                                    ) }
                                </div>
                            </div>
                            <Divider className="hidden lg:block mx-12 my-16"/>

                            <div className="flex flex-col lg:flex-row">
                                <div className="w-full px-16 lg:w-1/2 lg:p-8">
                                    <div className="mb-8 lg:mb-16">
                                        <div className="flex items-center">
                                            <Trans i18nKey="live-event.post-description">Post Description</Trans>
                                            <Tooltip classes={{ tooltip: classes.tooltip }} title={<Trans i18nKey="live-event.post-description-tooltips"></Trans>}><InfoIcon className={classes.tooltipDotBadge} /></Tooltip>
                                        </div>
                                        <TextField
                                            id="live-event-description"
                                            name="eventInfo.description"
                                            fullWidth
                                            multiline
                                            rows="4"
                                            margin="normal"
                                            variant="outlined"
                                            placeholder={i18n.t('live-event.post-description-placeholder')}
                                            value={this.state.eventInfo ? this.state.eventInfo.description : ""}
                                            onChange={this.handleInputChange}
                                            inputProps={{ maxLength: 3000 }}
                                        />
                                    </div>
                                    <div className="mb-8 lg:mb-16">
                                        <div className="flex items-center">
                                            <Trans i18nKey="live-event.video-title">Video title</Trans>
                                            <Tooltip classes={{ tooltip: classes.tooltip }} title={<Trans i18nKey="live-event.video-title-tooltips"></Trans>}><InfoIcon className={classes.tooltipDotBadge} /></Tooltip>
                                        </div>
                                        <TextField
                                            id="live-event-name"
                                            name="eventInfo.name"
                                            placeholder={i18n.t('live-event.video-title-placeholder')}
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={this.state.eventInfo ? this.state.eventInfo.name : ""}
                                            onChange={this.handleInputChange}
                                            inputProps={{ maxLength: this.maxTitileLength }}
                                        />
                                    <div className="flex justify-end items-center text-grey-darker">
                                        <div><Trans i18nKey="live-event.length"></Trans> {new Blob([this.state.eventInfo.name]).size}/{this.maxTitileLength}</div>
                                            <Tooltip classes={{ tooltip: classes.tooltip }} classes={{ tooltip: classes.tooltip }} title={<Trans i18nKey="live-event.video-title-length"></Trans>}><InfoIcon className={classes.tooltipDotBadge} /></Tooltip>
                                        </div>
                                    </div>
                                    <div className="mb-8 lg:mb-16">
                                        <Trans i18nKey="live-event.video-orientation">Video Orientation</Trans>
                                        <RadioGroup aria-label="videoOrientation" name="eventInfo.videoOrientation" value={this.state.eventInfo ? this.state.eventInfo.videoOrientation : "VERTICAL"} onChange={this.handleInputChange} row>
                                            <FormControlLabel
                                                value="VERTICAL"
                                                control={<Radio color="primary" />}
                                                label={<StayCurrentPortraitIcon />}
                                                className="mr-40"
                                            />
                                            <FormControlLabel
                                                value="HORIZONTAL"
                                                control={<Radio color="primary" />}
                                                label={<StayCurrentLandscapeIcon />}
                                            />
                                        }
                                        </RadioGroup>
                                        <HorizontalPromptCard
                                            isDisplayHorizontalDialog={this.state.isDisplayHorizontalDialog}
                                            toggleDialog={this.toggleDialog} />
                                    </div>
                                </div>
                                <div className="w-full px-16 my-32 lg:w-1/2 lg:p-8">
                                    <div>
                                        <Trans i18nKey="live-event.product-for-live">Product for live</Trans>
                                        <Tooltip classes={{ tooltip: classes.tooltip }} title={<Trans i18nKey="live-event.product-for-live-tooltips"></Trans>}><InfoIcon className={classes.tooltipDotBadge} /></Tooltip>
                                    </div>
                                    <div className="lg:hidden">
                                        <div className="flex-1 text-center my-8 text-xs">
                                            <Fab variant="extended" size="small" className={classNames(classes.fabButton, classes.highlightButton)}
                                                    onClick={this.handleAddProductBtnClick}>
                                                <div className="flex items-center px-2 text-xs">
                                                    <AddIcon className={classNames(classes.iconInButton, "p-0")}/>
                                                    <Trans i18nKey="main.add-product-btn">Add Product</Trans>
                                                </div>
                                            </Fab>
                                            <Trans i18nKey="main.or">OR</Trans>
                                            <Fab variant="extended" size="small" className={classNames(classes.fabButton)}
                                                    onClick={this.handleSelectProductBtnClick}>
                                                <div className="flex items-center px-2 text-xs">
                                                    <ViewListIcon className={classNames(classes.iconInButton, "p-0")}/>
                                                    <Trans i18nKey="main.select-product-btn">Select Product</Trans>
                                                </div>
                                            </Fab>
                                        </div>
                                    </div>
                                    <div className="mt-8 px-8 border-solid border-1 rounded">
                                        <div>
                                            <LiveEventProductTable
                                                canEditProducct={true}
                                                onRowClick={null}
                                                products={this.state.eventInfo.products}
                                                eventID={this.state.eventID}
                                                pushTrackingData={this.props.pushTrackingData}
                                            />
                                        </div>
                                        <div className="hidden lg:flex my-12">
                                            <div className="flex-1 text-center content-center">
                                                <Fab variant="extended" size="small" className={classNames(classes.fabButton, classes.highlightButton)}
                                                        onClick={this.handleAddProductBtnClick}>
                                                    <div className="flex items-center px-8">
                                                        <AddIcon className={classNames(classes.iconInButton, "p-0")}/>
                                                        <Trans i18nKey="main.add-product-btn">Add Product</Trans>
                                                    </div>
                                                </Fab>
                                                <Trans i18nKey="main.or">OR</Trans>
                                                <Fab variant="extended" size="small" className={classNames(classes.fabButton)}
                                                        onClick={this.handleSelectProductBtnClick}>
                                                    <div className="flex items-center px-8">
                                                        <ViewListIcon className={classNames(classes.iconInButton, "p-0")}/>
                                                        <Trans i18nKey="main.select-product-btn">Select Product</Trans>
                                                    </div>
                                                </Fab>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="mt-24 flex items-center justify-center">
                                { ( this.props.type === "new" ) ? (
                                    <Fab variant="extended" size="small" className={classNames(classes.fabButton, classes.highlightButton)} type="Submit">
                                        <div className={classes.extendedMargin}>
                                            <Trans i18nKey="main.create-event-btn">Create Event</Trans>
                                        </div>
                                    </Fab>
                                ) : (
                                    <Fab variant="extended" size="small" className={classNames(classes.fabButton, classes.highlightButton)} type="Submit">
                                        <div className={classes.extendedMargin}>
                                            <Trans i18nKey="main.save-btn">Save</Trans>
                                        </div>
                                    </Fab>
                                ) }
                                <Button className={classes.linkButton} component={Link} to="../lives">
                                    <Trans i18nKey="main.cancel-btn">Cancel</Trans>
                                </Button>
                            </div> */}


                            <div className="fixed pin-b block w-full lg:hidden" style={{ zIndex: '100' }}>
                                <div className="pt-16 pb-32 px-16 bg-white text-right shadow">
                                    <Button className={classNames(classes.linkButton, "mr-12")} type="Submit" onClick={ () => this.props.pushTrackingData("Click", "Save LIVE button") }>
                                        <Trans i18nKey="main.save-btn">Save</Trans>
                                    </Button>
                                    { !this.state.isCreatingLiveSession ? (
                                        <Fab variant="extended" size="small" aria-label="Play" disabled={ this.state.eventInfo.products && this.state.eventInfo.products.length > 0 ? false : true } className={classNames(classes.button, classes.highlightButton, "m-0")} onClick={this.handleGoLiveBtnClick} >
                                            <PlayArrowIcon className={classes.iconInButton}/>
                                            <span className="mr-8"><Trans i18nKey="live-event.go-live-btn">GO LIVE</Trans></span>
                                        </Fab>
                                    ) : (
                                        <Fab variant="extended" size="small" aria-label="Play" disabled={ true } className={classNames(classes.button, classes.highlightButton, "m-0")}>
                                            <CircularProgress size={24} className={classes.highlightText} />
                                            <span className="mx-3"><Trans i18nKey="live-event.creating-live-session-btn">Creating LIVE session...</Trans></span>
                                        </Fab>
                                    ) }
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

// LiveEventInfoFormCard.propTypes = {
//     classes: PropTypes.object.isRequired,
// };


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // closeCreatorLiveEventCard   : Actions.closeCreatorLiveEventCard,
        //getProductCategories        : Actions.getProductCategories,
        openProductInfoFormPrompt   : Actions.openProductInfoFormPrompt,
        openExistingProductPrompt   : Actions.openExistingProductPrompt,
        insertLiveEvent             : Actions.insertLiveEvent,
        updateLiveEvent             : Actions.updateLiveEvent
    }, dispatch);
}

function mapStateToProps({liveEventsApp}) {
    return {
        outlinedInputlabelWidth     : liveEventsApp.liveEventUi.outlinedInputlabelWidth,
        user                        : liveEventsApp.user,
        // liveEvent                   : liveEventsApp.liveEvents.liveEvent,
        productList                 : liveEventsApp.liveEvents.productList
        // productCategoryList         : liveEventsApp.products.productCategoryList,
    };
}



export default withReducer('liveEventsApp', reducer)( withStyles(styles, {withTheme: true})(    withRouter(connect(mapStateToProps, mapDispatchToProps)( withTranslation()(LiveEventInfoFormCard) ))   ) );