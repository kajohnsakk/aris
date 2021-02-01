import React, { Component } from 'react';
import _ from '@lodash';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import {
    Divider,
    TextField,
    InputAdornment,
    CircularProgress
} from "@material-ui/core";

import { Trans, withTranslation } from 'react-i18next';
import Classnames from 'classnames';

const styles = theme => ({
    subTitle: {
        fontSize: "1.2rem"
    }
});


class DeliveryInfo extends Component {

    state = {
        storeID: "",
        deliveryInfo: {}
    }

    componentDidMount() {

        this.setState({ storeID: this.props.storeID });
        
    }

    componentDidUpdate(prevProps, prevState) {
        if( this.props.storeID !== prevProps.storeID ) {
            this.setState({ storeID: this.props.storeID });
        }

        if( !_.isEqual(this.state.deliveryInfo, this.props.deliveryInfo) ) {
            this.setState({ deliveryInfo: this.props.deliveryInfo });
        }

    }

    render() {
        const { deliveryInfo } = this.state;
        const { classes } = this.props;

        return (
            <React.Fragment>
                <div className="">
                    <div className="flex flex-row justify-between items-center p-8 lg:p-12">
                        <div className="flex">
                            <Trans i18nKey="settings.delivery.delivery-details">Delivery details</Trans>
                        </div>
                    </div>
                    <Divider />
                    { deliveryInfo.hasOwnProperty("price") ? (
                        <div>
                            <div className="flex flex-col p-8 sm:p-12 mb-8">
                                <div className="flex flex-col w-full sm:w-3/5">
                                    <div className={Classnames(classes.subTitle, "mb-12 font-light")}><Trans i18nKey="settings.delivery.first-piece-title">First piece</Trans></div>
                                    <div className='pb-12'>
                                        <TextField
                                            id="first-piece"
                                            label={<Trans i18nKey="settings.delivery.price-title">Price</Trans>}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">THB</InputAdornment>
                                            }}
                                            type="number"
                                            name="businessProfile.storeInfo.delivery.price.firstPiece"
                                            value={Number(deliveryInfo.price.firstPiece).toString()}
                                            onChange={this.props.handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full sm:w-3/5">
                                    <div className={Classnames(classes.subTitle, "mb-12 font-light")}><Trans i18nKey="settings.delivery.additional-piece-title">Additional piece</Trans></div>
                                    <div className='pb-12'>
                                        <TextField
                                            id="additional-piece"
                                            label={<Trans i18nKey="settings.delivery.price-title">Price</Trans>}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">THB</InputAdornment>
                                            }}
                                            type="number"
                                            // disabled={ this.state.storeConfig.hasOwnProperty('useCart') && !this.state.storeConfig.useCart ? true : false }
                                            name="businessProfile.storeInfo.delivery.price.additionalPiece"
                                            value={Number(deliveryInfo.price.additionalPiece).toString()}
                                            onChange={this.props.handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row justify-end items-center px-8 lg:px-12">
                                <button className="button-primary" onClick={(event) => {
                                    event.preventDefault();
                                    this.props.pushTrackingData("Click", "Click save delivery info button");
                                    this.props.saveBusinessProfileSections("DELIVERY_INFO");
                                }}>
                                    <Trans i18nKey="main.save-btn">Save</Trans>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={Classnames(classes.loadingPage, "my-64")}>
                            <CircularProgress className={classes.highlightText} />
                        </div>
                    ) }
                                    
                </div>
            </React.Fragment>
        );
    }
}


export default (withStyles(styles, { withTheme: true })(withRouter((withTranslation()(DeliveryInfo)))));