import React from 'react';
//import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Classnames from 'classnames';
import styles from '../styles/styles';
var QRCode = require('qrcode-react');

class DownloadMobileAppCard extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <Card className={Classnames(classes.card, "p-0")}>
                <CardContent className={Classnames(classes.donwloadCardContent, "px-32 py-48")}>
                    <div>
                        <div className="text-lg break-words mb-4">Application <br />for LIVE Event</div>
                        <div className="font-light">DOWNLOAD NOW!!</div>
                    </div>
                    <div className="my-24">
                        <QRCode 
                            value={process.env.REACT_APP_WEB_URL+'download/app/mobile'}
                            size={128}
                            logoWidth={58}
                            logo="assets/images/logos/qr-code-logo.png"
                        />
                    </div>
                    <div className="mb-12">
                        <a href={process.env.REACT_APP_ANDROID_APP_URL} target="_blank" rel="noopener noreferrer" onClick={ () => this.props.pushTrackingData("Click", "Android App button") }><img alt="Play Store Logo" src="assets/images/logos/play-store-logo.png" /></a>
                    </div>
                    <div>
                        <a href={process.env.REACT_APP_IOS_APP_URL} target="_blank" rel="noopener noreferrer" onClick={ () => this.props.pushTrackingData("Click", "iPhone App button") }><img alt="App Store Logo" src="assets/images/logos/app-store-logo.png" /></a>
                    </div>
                </CardContent>
            </Card>
        );
    }
}

/*
DownloadMobileAppCard.propTypes = {
    classes: PropTypes.object.isRequired,
};
*/


export default withStyles(styles)(DownloadMobileAppCard);