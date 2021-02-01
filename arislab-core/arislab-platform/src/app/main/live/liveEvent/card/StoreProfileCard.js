import React from 'react';
import { 
    withStyles, 
    Card, 
    CardContent, 
    Avatar,
    Divider,
    Button
} from '@material-ui/core';
import ALink from '@material-ui/core/Link';
import InfoIcon from '@material-ui/icons/Info';
import CameraIcon from '@material-ui/icons/CameraAlt'
import CircularProgress from "@material-ui/core/CircularProgress";

import {
    withRouter,
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import * as MainActions from '../../../store/actions';
import reducer from '../store/reducers';
import axios from "axios";
import * as AppConfig from "../../../config/AppConfig";

import styles from '../styles/styles';

import { Trans, withTranslation } from 'react-i18next';
import { ApiService } from "../../../modules/ApiService";

const Compress = require("compress.js");

const host = AppConfig.API_URL;

class StoreProfileCard extends React.Component {

    state = {
        storeID: '',
        accountBalance: 0,
        logoImage: ''
    };

    componentDidMount() {

        this.setState( { storeID: this.props.storeID }, () => { this.getBusinessProfile(); } );

    }

    getBusinessProfile = () => {
        this.props.getBusinessProfile({
            storeID: this.state.storeID
        });
    };

    uploadLogoImage = (event) => {
        const compress = new Compress();
        if (!event) return;
        event.preventDefault();

        let validExtensions = ["jpg", "png", "jpeg", "gif", "bmp", "jfif"];
        let file = event.target.files[0];
        if (typeof file === "undefined") return;
        let fileName = file.name.toLowerCase();
        var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
        if (validExtensions.indexOf(fileNameExt) === -1) {
            alert("Only these file types are accepted : " + validExtensions.join(", "));
        } else {
            const files = [...event.target.files];
            const businessProfile = this.props.businessProfile.storeInfo.businessProfile
            compress
                .compress(files, {
                    size: 4, // the max size in MB, defaults to 2MB
                    quality: 1, // the quality of the image, max is 1,
                    maxWidth: 780, // the max width of the output image, defaults to 1920px
                    maxHeight: 780, // the max height of the output image, defaults to 1920px
                    resize: true // defaults to true, set false if you do not want to resize the image width and height
                })
                .then(data => {
                    const img1 = data[0];
                    const base64str = img1.data;
                    const imgExt = img1.ext;
                    const file = this.blobToFile(Compress.convertBase64ToFile(base64str, imgExt), fileName);
                    this.setState({ logoImage: "LOADING" });
                    ApiService.getInstance()
                        .uploadFile(file, progress => {})
                        .then(async url => {
                            this.setState({ logoImage: url });
                            await this.props.saveBusinessProfileSections({businessProfile: {
                                businessEmail: businessProfile.businessEmail,
                                accountDetails: businessProfile.accountDetails,
                                logo: url,
                                businessAddress: businessProfile.businessAddress,
                                businessPhoneNo: businessProfile.businessPhoneNo 
                            }}, { storeID: this.state.storeID, sections: "SALE_CHANNELS" })
                        });
                });
        }
    };

    blobToFile = (theBlob, fileName) => {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    };

    render() {
        const { classes, productList, businessProfile } = this.props;

        var haveWarningMessage = false;
        var hasDeliveryWarning = false;
        var hasPaymentWarning = false;

        if( businessProfile && businessProfile.hasOwnProperty('storeInfo') ) {

            if( businessProfile.storeInfo.delivery && businessProfile.storeInfo.delivery.hasOwnProperty('price') ) {
                if( businessProfile.storeInfo.delivery.price.hasOwnProperty('firstPiece') && !(businessProfile.storeInfo.delivery.price.firstPiece > 0) ) {
                    haveWarningMessage = true;
                    hasDeliveryWarning = true;
                }
            }

            if( businessProfile.storeInfo.paymentInfo && businessProfile.storeInfo.paymentInfo.hasOwnProperty('gbPayInfo') ) {
                if(businessProfile.storeInfo.paymentInfo.gbPayInfo.hasOwnProperty('token') && businessProfile.storeInfo.paymentInfo.gbPayInfo.token === '' ) {
                    haveWarningMessage = true;
                    hasPaymentWarning = true;
                }
            }
    
        }

        return (

            businessProfile && (
                businessProfile.hasOwnProperty('storeInfo') ? (

                    <Card className={classes.card}> 
                        <CardContent className={classes.cardContent}>
                            
                            <div align='center'>
                                <div className='my-12'>
                                    <label htmlFor="logo-image" className="cursor-pointer">
                                        <Button component="span" className="rounded-full">
                                        {
                                            this.state.logoImage == "LOADING" ? (
                                                <CircularProgress className="pink" />
                                            ) : (
                                                <div className="relative w-full h-full flex flex-col">
                                                    <div ref="cameraIcon" className="absolute ml-auto mr-auto z-10" style={{
                                                        bottom: 0, 
                                                        left: 0, 
                                                        right: 0, 
                                                        textAlign: 'center',
                                                        lineHeight: '110px',
                                                        verticalAlign: 'middle',
                                                        width: '150px',
                                                        height: '75px',
                                                        background: 'linear-gradient(rgba(0,0,0,0) 5%, rgba(0,0,0,0.6) 95%)',
                                                        borderBottomLeftRadius: '75px',
                                                        borderBottomRightRadius: '75px',
                                                    }}>
                                                        <CameraIcon
                                                            style={{
                                                                color: '#FFFFFF',
                                                                fontSize: '25px'
                                                            }}
                                                        />
                                                    </div>
                                                { 
                                                    businessProfile.storeInfo.businessProfile.hasOwnProperty('logo') && businessProfile.storeInfo.businessProfile.logo ? 
                                                    (<Avatar alt={businessProfile.storeInfo.businessProfile.accountDetails.businessName} 
                                                        src={businessProfile.storeInfo.businessProfile.logo}
                                                        style = {{height: '150px', width: '150px'}}
                                                    />
                                                    )
                                                    : 
                                                    (<Avatar alt="Profile" 
                                                        src="assets/images/store-management/avatar2.jpg"
                                                        style={{ height: '150px', width: '150px' }}
                                                    />)
                                                }
                                                </div>
                                            )
                                        }
                                        </Button>
                                    </label>
                                    <input
                                        accept="image/*"
                                        id="logo-image"
                                        className="hidden"
                                        type="file"
                                        onChange={this.uploadLogoImage}
                                    />
                                </div>
                                <div className='mt-12 text-xl mb-12'>
                                    {businessProfile.storeInfo.businessProfile.accountDetails.businessName !== "" ? 
                                    businessProfile.storeInfo.businessProfile.accountDetails.businessName : 
                                    <Trans i18nKey="settings.salesChannels.sales-channels-no-page">No page selected</Trans>}
                                </div>
                                <div id="store-profile-card-connect-channels" className='text-red'>
                                    {businessProfile.storeInfo.businessProfile.accountDetails.businessName !== "" ?
                                    (<ALink style={{ color: "#f00" }} href='/platform/setting#storeConfig' onClick={() => this.props.changeTab(1)}><Trans i18nKey="settings.salesChannels.sales-channels-change-page">Change page</Trans></ALink>) :
                                    (<ALink style={{ color: "#f00" }} href='/platform/setting#storeConfig' onClick={() => this.props.changeTab(1)}><Trans i18nKey="settings.salesChannels.sales-channels-input-facebook-page-placeholder">Select facebook page</Trans></ALink>)}
                                </div>
                            </div>

                            <Divider className='mx-0 my-24'/>

                            {/* <div className='flex justify-between mx-12 mb-12'>
                                <div><Trans i18nKey="live-event.live-event">LIVE Event</Trans></div>
                                <div>{ liveEventList ? liveEventList.length : 0 }</div>
                            </div> */}
                            <div className='flex justify-between mx-12'>
                                <div><Trans i18nKey="live-event.products">Products</Trans></div>
                                <div>{ productList ? productList.length : 0 }</div>
                            </div>

                            { haveWarningMessage ?
                                // <React.Component>
                                    <div className="mt-12">
                                        {/* <Divider className='mx-12 my-24' /> */}
    
                                        { hasPaymentWarning ? (
                                            <div className='flex items-center justify-between mx-12 mb-8 text-red'>
                                                <div><ALink style={{color: "#f00"}} href="platform/setting/storeManagement#payments" onClick={ () => this.props.pushTrackingData("Click", "Payment details button") }><Trans i18nKey="live-event.payment-details">Payment details</Trans></ALink></div>
                                                <div><InfoIcon fontSize="small" /></div>
                                            </div>
                                        ) : null }
    
                                        { hasDeliveryWarning ? (
                                            <div className='flex items-center justify-between mx-12 text-red'>
                                                <div><ALink style={{color: "#f00"}} href="platform/setting/storeManagement#delivery" onClick={ () => this.props.pushTrackingData("Click", "Delivery charge button") }><Trans i18nKey="live-event.delivery-charge">Delivery Charge</Trans></ALink></div>
                                                <div><InfoIcon fontSize="small" /></div>
                                            </div>
                                        ) : null }
                                    </div>
                                    
                                // </React.Component>
                            : null }

                        </CardContent>
                    </Card>
                ) : (
                    <Card className={classes.card}> 
                        <CardContent className={classes.cardHeader}>
                            ยังไม่มีข้อมูลร้านค้า กรุณากรอกข้อมูลก่อน
                        </CardContent>
                    </Card>
                )
            )
        );
    }
}



function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBusinessProfile          : Actions.getBusinessProfile,
        saveBusinessProfileSections : Actions.saveBusinessProfileSections,
        changeTab: MainActions.changeTab
    }, dispatch);
}

function mapStateToProps({liveEventsApp}) {
    return {
        liveEventList                   : liveEventsApp.liveEvents.liveEventList,
        businessProfile                 : liveEventsApp.businessProfile,
        productList                     : liveEventsApp.liveEvents.productList
    };
}


export default withReducer('liveEventsApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps) (withTranslation()(StoreProfileCard) ) )));