import React, { Component } from 'react';
import _ from '@lodash';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import {
    Divider
} from "@material-ui/core";


import { Trans, withTranslation } from 'react-i18next';
import Facebook from './Facebook';

const styles = theme => ({
    
});


class SaleChannel extends Component {

    state = {
        storeID: "",
        storeBusinessProfile: null
    }

    componentDidMount() {
        this.setState({ storeID: this.props.storeID });
    }

    componentDidUpdate(prevProps, prevState) {
        if( this.props.storeID !== prevProps.storeID ) {
            this.setState({ storeID: this.props.storeID });
        }

        if( !_.isEqual(this.state.storeBusinessProfile, this.props.storeBusinessProfile) ) {
            this.setState({ storeBusinessProfile: this.props.storeBusinessProfile });
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if( this.props.storeID !== prevProps.storeID ) {
    //         this.setState({ storeID: this.props.storeID });
    //     }

    //     if( !_.isEqual(this.state.businessProfile, this.props.businessProfile) ) {
    //         this.setState({ businessProfile: this.props.businessProfile });
    //     }

    //     if( !_.isEqual(this.state.companyInfo, this.props.companyInfo) ) {
    //         this.setState({ companyInfo: this.props.companyInfo });
    //     }

    //     if( this.state.useBusinessFeatures !== this.props.useBusinessFeatures ) {
    //         this.setState({ useBusinessFeatures: this.props.useBusinessFeatures });
    //     }
    // }

    // handleSavePage = (event) => {
    //     event.preventDefault();

    //     let sections = '';
    //     if( this.state.useBusinessFeatures ) {
    //         sections = 'COMPANY_PROFILE';
    //         this.props.pushTrackingData("Click", "Save company profile button");
    //     } else {
    //         sections = 'BUSINESS_PROFILE';
    //         this.props.pushTrackingData("Click", "Save business profile button");
    //     }
        
    //     this.props.saveBusinessProfileSections(sections);

    // }


    render() {
        const { storeID, storeBusinessProfile } = this.state;

        return (
            <React.Fragment>
                { storeID.length > 0 ? (
                    <div className="">
                        <div className="flex flex-row justify-between items-center p-8 lg:p-12">
                            <div className="flex">
                                <Trans i18nKey="settings.salesChannels.sales-channels-title">Sale Channels</Trans>
                            </div>
                        </div>
                        <Divider />
                        <div className="mb-8 p-8 lg:p-12">
                            <Facebook
                                storeID={storeID}
                                storeBusinessProfile={storeBusinessProfile}
                                pushTrackingData={this.props.pushTrackingData}
                                setSelectedFacebookPageDataToStore={this.props.setSelectedFacebookPageDataToStore}
                                // saveBusinessProfileSections={this.props.saveBusinessProfileSections}
                            />
                        </div>            
                    </div>
                ) : (
                    null
                )}
            </React.Fragment>
        );
    }
}


export default (withStyles(styles, { withTheme: true })(withRouter((withTranslation()(SaleChannel)))));