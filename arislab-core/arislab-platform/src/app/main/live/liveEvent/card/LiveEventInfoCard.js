import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { 
    withStyles,
    Button,
    IconButton,
    Fab,
    Dialog
} from '@material-ui/core';
import { showMessage } from 'app/store/actions/fuse';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CircularProgress from '@material-ui/core/CircularProgress';
// import AddIcon from '@material-ui/icons/Add';
// import ViewListIcon from '@material-ui/icons/ViewList';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from '@lodash';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import LiveEventProductTable from '../table/LiveEventProductTable';
// import ProductTable from '../table/ProductTable';
// import LiveEventInfoFormCard from './LiveEventInfoFormCard';
import styles from '../styles/styles';
// import { SalesChannelManager } from '../../../context/sales_channel/salesChannelManager';
import UtilityFunction from '../../../modules/UtilityFunction';
import { Trans, withTranslation } from 'react-i18next';
import '../styles/styles.css'
// import i18n from '../../../../i18n';


const initialState = {
    // isExpanded: false,
    // isEditMode: false,
    liveEvent: {},
    productList: {},
    isCreatingLiveSession: false,
    facebookPageID: '',
    facebookSelectedPageAccessToken: '',
    embedVideo: '',
    videoOrientation: 'VERTICAL',
    maxLiveEventName: 25,
    error: '',
    liveErrorModal: false
};

class LiveEventInfoCard extends React.Component {

    state = {
        ...initialState
    };
    
    componentDidMount() {

        if( this.checkObjIsEmpty(this.state.liveEvent) ) {
            this.setState( { liveEvent: this.props.liveEvent }, () => this.prepareLiveEventData() );
        }

    }

    componentDidUpdate(prevProps, prevState) {

        if( ( this.state.facebookPageID.length === 0 && this.props.facebookPageID !== this.state.facebookPageID ) || ( this.state.facebookSelectedPageAccessToken.length === 0 && this.props.facebookSelectedPageAccessToken !== this.state.facebookSelectedPageAccessToken ) || !_.isEqual(this.props.facebookPageID, prevProps.facebookPageID) || !_.isEqual(this.props.facebookSelectedPageAccessToken, prevProps.facebookSelectedPageAccessToken) ) {
            this.setState({ facebookPageID: this.props.facebookPageID, facebookSelectedPageAccessToken: this.props.facebookSelectedPageAccessToken }, () => { this.getFacebookVideoData(); });
        }


        if ( !_.isEqual(this.props.liveEvent, prevProps.liveEvent) ) {
            if( this.props.liveEvent.eventID === prevProps.liveEvent.eventID ) {   
                this.setState({ liveEvent: this.props.liveEvent }, () => this.prepareLiveEventData() );
            }
        }

        if ( !_.isEqual(this.props.productList, prevProps.productList) ) {   
            // this.setProductListToThisLiveEvent()
        }

        if( this.props.liveEvent.eventID === this.state.liveEvent.eventID ) {
            if( this.props.liveEvent.products.length !== this.state.liveEvent.products.length ) {   
                this.setState({ liveEvent: this.props.liveEvent }, () => this.prepareLiveEventData() );
                
            }
        }


        if( this.state.isCreatingLiveSession === true ) {
            // Call facebook api for get 'streamURL'
            var eventData = this.state.liveEvent;
            var eventID = eventData.eventID;

            if( this.props.storeID ) {

                if( this.state.facebookPageID.length > 0 && this.state.facebookSelectedPageAccessToken.length > 0 ) {
            
                    var facebookPageID = this.state.facebookPageID;
                    var facebookSelectedPageAccessToken = this.state.facebookSelectedPageAccessToken;
                    const apiUrl = `https://graph.facebook.com/${facebookPageID}/live_videos?status=LIVE_NOW&title=${encodeURIComponent(eventData.name)}&description=${encodeURIComponent(eventData.description)}&access_token=${facebookSelectedPageAccessToken}`;
                    axios.post(apiUrl).then((res) => {
                        eventData.facebookData.videoID = res.data.id;
                        eventData.facebookData.streamURL = res.data.secure_stream_url;
                        // eventData.streamingToIpAddress = "";
                    
                        this.props.updateLiveEvent(eventID, eventData, false);

                        setTimeout(() => {
                            this.setState( { isCreatingLiveSession: false }, () => { this.props.history.push("/platform/lives/studio/"+eventData.eventID); } );
                        }, 1000);
        
                    })
                    .catch((error, res) => {
                        showMessage({ message: 'Error can\'t create LIVE session.' })
                        this.setState( { isCreatingLiveSession: false, error: error.toString(), liveErrorModal: true } );
                    });
                }

                // SalesChannelManager.getInstance().getChannelByStoreID(this.props.storeID).then((resultChannelByStoreID) => {
        
                //     if (resultChannelByStoreID.length > 0 && resultChannelByStoreID[0].hasOwnProperty('channels')) {
                //         const facebookPageID = resultChannelByStoreID[0]['channels']['facebook'];
                //         const facebookSelectedPageAccessToken = resultChannelByStoreID[0]['channels']['facebookSelectedPageAccessToken'];
                //         // alert(facebookPageID + ' ========== ' +facebookSelectedPageAccessToken);

                //         const apiUrl = `https://graph.facebook.com/${facebookPageID}/live_videos?status=LIVE_NOW&title=${eventData.name}&description=${eventData.description}&access_token=${facebookSelectedPageAccessToken}`;
                //         axios.post(apiUrl).then((res) => {
                //             eventData.facebookData.videoID = res.data.id;
                //             eventData.facebookData.streamURL = res.data.secure_stream_url;
                      
                //             this.props.updateLiveEvent(eventID, eventData, false);
                //             this.setState( { isCreatingLiveSession: false }, () => { this.props.history.push("/platform/live/studio/"+eventData.eventID); } );
                //         })
                //         .catch((error) => {
                //             console.error(error);

                //             showMessage({ message: 'Error can\'t create LIVE session.' })
                //             this.setState( { isCreatingLiveSession: false } );
                //         });

                //     }

                // });
            } else {
                showMessage({ message: 'Error not found your store.' })
                this.setState( { isCreatingLiveSession: false } );
            }

        }


    }

    checkObjIsEmpty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    prepareLiveEventData = () => {
        this.getFacebookVideoData();
        // this.setProductListToThisLiveEvent();
    }

    getFacebookVideoData = () => {
        if( this.state.liveEvent.facebookData.videoID.length > 0 && this.state.facebookPageID.length > 0 && this.state.facebookSelectedPageAccessToken.length > 0 ) {
            
            var videoID = this.state.liveEvent.facebookData.videoID;
            var facebookSelectedPageAccessToken = this.state.facebookSelectedPageAccessToken;
            const apiUrl = `https://graph.facebook.com/${videoID}?access_token=${facebookSelectedPageAccessToken}`;
            axios.get(apiUrl).then((res) => {
                if( res.data.hasOwnProperty('status') && res.data.status === 'LIVE' ) {
                    // do not something
                } else {
                    var embedHtml = res.data.embed_html;
                    let videoOrientation = 'VERTICAL';
                    // if( embedHtml.search("width=\"1280\"") > -1 && embedHtml.search("height=\"720\"") ) {
                    //     videoOrientation = 'HORIZONTAL';
                    // }

                    embedHtml = embedHtml.replace("width=\"720\"", "width=\"100%\"");
                    embedHtml = embedHtml.replace("height=\"1280\"", "height=\"100%\"");
                    // embedHtml = embedHtml.replace("width=\"1280\"", "");
                    // embedHtml = embedHtml.replace("height=\"720\"", "height=\"100%\"");
                    embedHtml = embedHtml.replace("width=\"1280\"", "width=\"100%\"");
                    embedHtml = embedHtml.replace("height=\"720\"", "height=\"100%\"");
                    this.setState( { embedVideo: embedHtml, videoOrientation: videoOrientation } );
                }
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
        }
    }

    setProductListToThisLiveEvent = () => {

        const data = this.props.productList;

        const newProductList = {};
        Object.keys(data).map((key, index) => {

            if( this.state.liveEvent.products ) {
                if( this.state.liveEvent.products.indexOf(data[key].productID) > -1 ) {
                    newProductList[this.state.liveEvent.products.indexOf(data[key].productID)] = data[key];
                }
            } else {
                if( this.props.liveEvent.products.indexOf(data[key].productID) > -1 ) {
                    newProductList[this.state.liveEvent.products.indexOf(data[key].productID)] = data[key];
                }
            }
            
            return newProductList;
        });
        
        // if( Object.keys(newProductList).length > 0 ) {
        //     this.setState({ productList: newProductList });
        // }

        this.setState({ productList: newProductList });
    };

    handleEditBtnClick = (event, liveEvent) => {
        this.props.pushTrackingData("Click", "Edit LIVE button");
        window.location.href = "platform/lives/"+liveEvent.eventID;
    };

    handleDeleteBtnClick = event => {
        event.preventDefault();

        this.props.pushTrackingData("Click", "Delete LIVE button");
        let eventID = this.props.liveEvent.eventID;
        this.props.openDeleteLiveEventPrompt(eventID);
    }

    handleGoLiveBtnClick = (event) => {
        this.props.pushTrackingData("Click", "Go LIVE button");
        this.props.pushTrackingData("Create", "20. Click Get Code");

        this.setState( { isCreatingLiveSession: true } );
    }

    toggleDialog = dialogName => {
        if (this.state[dialogName]) {
            this.setState({ error: "" });
        }
        this.setState({ [dialogName]: !this.state[dialogName] });
    };

    render() {
        const { classes } = this.props;
        const { liveEvent } = this.state;

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
                                this.toggleDialog("liveErrorModal");
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
                <div className={classNames(classes.card, "border-b lg:border-0")}>
                    <div className={classes.cardContent}>
                        <div className="flex">
                            <div className={"flex w-full lg:w-1/2 p-8 " + ( this.state.videoOrientation === 'VERTICAL' ? 'flex-row' : 'flex-col' )}>
                                <div className={"p-4 " + ( this.state.videoOrientation === 'VERTICAL' ? "w-2/5 md:w-1/6 lg:w-1/3" : "" )}>
                                    { this.state.embedVideo.length > 0 ? (
                                        <div className="w-full h-full text-center" dangerouslySetInnerHTML={ {__html: this.state.embedVideo} } />
                                    ) : (
                                        <div className="w-full h-full text-center"><img alt="Video Mockup" src="assets/images/etc/video-mockup.png" /></div>
                                    ) }
                                </div>
                                <div className={"p-4 flex " + ( this.state.videoOrientation === 'VERTICAL' ? "flex-col w-3/5 lg:w-2/3" : "flex-row" )}>
                                    {/* <div className={"flex-1 " + ( this.state.videoOrientation === 'VERTICAL' ? "w-full" : "" )} style={{ wordBreak: 'break-all' }}> */}
                                    <div className={( this.state.videoOrientation === 'VERTICAL' ? "w-full" : "" )} style={{ wordBreak: 'break-all' }}>
                                        <div className="text-xs mb-6 lg:text-base lg:mb-12 pr-8 font-bold">{liveEvent.name && liveEvent.name.length > this.state.maxLiveEventName ? ( liveEvent.name.substring(0, this.state.maxLiveEventName)+'...' ) : liveEvent.name }</div>
                                        <div className={"text-xs lg:text-base overflow-auto h-64 pr-8"}>{liveEvent.description}</div>
                                    </div>
                                    <div className={( this.state.videoOrientation === 'VERTICAL' ? "" : "flex-shark" )}>
                                        <div>
                                            <Button variant="outlined" size="small" className={classes.button} onClick={ event => this.handleEditBtnClick(event, liveEvent)}>
                                                <EditIcon className={classes.iconInButton}/>
                                                <Trans i18nKey="main.edit-btn">Edit</Trans>
                                            </Button>
                                            <IconButton aria-label="Delete" onClick={this.handleDeleteBtnClick}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </div>
                                        <div className="lg:hidden">
                                            <div className="font-bold mb-8 text-xs">
                                                <Trans i18nKey="live-event.product-in-live">Product in LIVE</Trans> ({this.state.liveEvent.products ? this.state.liveEvent.products.length : 0})
                                            </div>
                                            <div className="font-bold">
                                                { !this.state.isCreatingLiveSession ? (
                                                    <Fab variant="extended" size="small" aria-label="Play" disabled={ liveEvent.products && liveEvent.products.length > 0 ? false : true } className={classNames(classes.button, classes.highlightButton, "m-0")} onClick={this.handleGoLiveBtnClick} >
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
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:block w-1/2 p-8">
                                <div className="mb-8 flex justify-between items-center">
                                    <div className="font-bold text-lg">
                                        <Trans i18nKey="live-event.product-in-live">Product in LIVE</Trans> ({this.state.liveEvent.products ? this.state.liveEvent.products.length : 0})
                                    </div>
                                    <div className="font-bold">
                                        { !this.state.isCreatingLiveSession ? (
                                            <Fab variant="extended" size="small" aria-label="Play" disabled={ liveEvent.products && liveEvent.products.length > 0 ? false : true } className={classNames(classes.button, classes.highlightButton, "m-0")} onClick={this.handleGoLiveBtnClick} >
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
                                <div className="">
                                    <LiveEventProductTable
                                        canEditProducct={false}
                                        onRowClick={null}
                                        products={liveEvent.products}
                                        eventID={liveEvent.eventID}
                                        rowHeight={30}
                                        tableHeight={250}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );

    }
}

LiveEventInfoCard.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        openDeleteLiveEventPrompt   : Actions.openDeleteLiveEventPrompt,
        openDeleteProductPrompt     : Actions.openDeleteProductPrompt,
        openProductInfoFormPrompt   : Actions.openProductInfoFormPrompt,
        openExistingProductPrompt   : Actions.openExistingProductPrompt,
        updateLiveEvent             : Actions.updateLiveEvent,
        // getProductsList             : Actions.getProductsList
    }, dispatch);
}

function mapStateToProps({liveEventsApp}) {
    return {
        // productList                    : liveEventsApp.liveEvents.productList,
        // productList                 : liveEventsApp.liveProductSlider
    };
}

// ( connect(mapStateToProps, mapDispatchToProps)( withTranslation()(LiveEventInfoCard) ) )
export default withReducer('liveEventsApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LiveEventInfoCard)))));