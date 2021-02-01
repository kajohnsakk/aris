import React, { Component } from 'react';
import _ from '@lodash';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import {
    Divider,
    Switch,
    TextField
} from "@material-ui/core";

import InputMask from 'react-input-mask';

import { Trans, withTranslation } from 'react-i18next';

const styles = theme => ({
    
});


class PackagePaymentMethod extends Component {

    state = {
        businessProfile: {},
        companyInfo: {},
        useBusinessFeatures: false
    }

    componentDidMount() {

        this.setState({ storeID: this.props.storeID });
        
    }

    componentDidUpdate(prevProps, prevState) {
        if( this.props.storeID !== prevProps.storeID ) {
            this.setState({ storeID: this.props.storeID });
        }

        if( !_.isEqual(this.state.businessProfile, this.props.businessProfile) ) {
            this.setState({ businessProfile: this.props.businessProfile });
        }

        if( !_.isEqual(this.state.companyInfo, this.props.companyInfo) ) {
            this.setState({ companyInfo: this.props.companyInfo });
        }

        if( this.state.useBusinessFeatures !== this.props.useBusinessFeatures ) {
            this.setState({ useBusinessFeatures: this.props.useBusinessFeatures });
        }
    }

    handleSavePage = (event) => {
        event.preventDefault();

        let sections = '';
        if( this.state.useBusinessFeatures ) {
            sections = 'COMPANY_PROFILE';
            this.props.pushTrackingData("Click", "Save company profile button");
        } else {
            sections = 'BUSINESS_PROFILE';
            this.props.pushTrackingData("Click", "Save business profile button");
        }
        
        this.props.saveBusinessProfileSections(sections);

    }


    render() {
        const { businessProfile, companyInfo, useBusinessFeatures } = this.state;

        return (
            <React.Fragment>
                <form onSubmit={this.handleSavePage}>
                { Object.entries(businessProfile).length > 0 ? (
                    <div className="">
                        <div className="flex flex-row justify-between items-center px-8 lg:px-12">
                            <div className="flex">
                                <Trans i18nKey="settings.businessProfile.business-profile">Profile</Trans>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center">
                                <div className="flex"><Trans i18nKey="settings.businessProfile.enabled-company-account">Enabled company account</Trans></div>
                                <div className="flex">
                                    <Switch
                                        color="primary"
                                        checked={useBusinessFeatures}
                                        name="businessProfile.storeInfo.config.useBusinessFeatures"
                                        onChange={this.props.handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <Divider />
                        <div className="mb-8">
                            { useBusinessFeatures ? (
                                <div className="flex flex-col p-8 sm:p-12">
                                    <div className="mb-24">
                                        <div className='w-full mb-8'>
                                            <Trans i18nKey="settings.businessProfile.company-profile">
                                                Company Profile
                                            </Trans>
                                        </div>
                                        <div className='w-full sm:w-3/5'>
                                            <TextField
                                                required
                                                name="businessProfile.storeInfo.companyInfo.name"
                                                label={
                                                    <Trans i18nKey="settings.businessProfile.company-profile-form-input-name-label">
                                                        Company Name
                                                    </Trans>
                                                }
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                                onChange={this.props.handleInputChange}
                                                value={companyInfo.name}
                                            />
                                        </div>
                                        <div className='w-full sm:w-3/5'>
                                            <InputMask
                                                mask="9999999999999"
                                                onChange={this.props.handleInputChange}
                                                value={companyInfo.taxNumber}
                                            >
                                                {() => <TextField
                                                    required
                                                    pattern="[0-9]*"
                                                    name="businessProfile.storeInfo.companyInfo.taxNumber"
                                                    label={
                                                        <Trans i18nKey="settings.businessProfile.company-profile-form-input-company-tax-number-label">
                                                            Company Tax Number
                                                        </Trans>
                                                    }
                                                    margin="dense"
                                                    variant="outlined"
                                                    fullWidth
                                                />}
                                            </InputMask>
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className='w-full mb-8'>
                                            <Trans i18nKey="settings.businessProfile.company-address">
                                                Company Address
                                            </Trans>
                                        </div>
                                        <div className='w-full sm:w-4/5'>
                                            <TextField
                                                required
                                                name="businessProfile.storeInfo.companyInfo.addressInfo.addressLine1"
                                                label={
                                                    <Trans i18nKey="settings.businessProfile.company-profile-form-input-address-line-1-label">
                                                        Address Line 1
                                                    </Trans>
                                                }
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                                onChange={this.props.handleInputChange}
                                                value={companyInfo.addressInfo.addressLine1}
                                            />
                                        </div>
                                        <div className='w-full sm:w-4/5'>
                                            <TextField
                                                required
                                                name="businessProfile.storeInfo.companyInfo.addressInfo.addressLine2"
                                                label={
                                                    <Trans i18nKey="settings.businessProfile.company-profile-form-input-address-line-2-label">
                                                        Address Line 2
                                                    </Trans>
                                                }
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                                onChange={this.props.handleInputChange}
                                                value={companyInfo.addressInfo.addressLine2}
                                            />
                                        </div>
                                        <div className='flex w-full'>
                                            <div className="w-full sm:w-1/2 sm:pr-8">
                                                <TextField
                                                    required
                                                    name="businessProfile.storeInfo.companyInfo.addressInfo.city"
                                                    label={
                                                        <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-address-city-label">
                                                            City
                                                        </Trans>
                                                    }
                                                    margin="dense"
                                                    variant="outlined"
                                                    fullWidth
                                                    onChange={this.props.handleInputChange}
                                                    value={companyInfo.addressInfo.city}
                                                />
                                            </div>
                                            <div className="w-full sm:w-1/2 sm:pl-8">
                                                <TextField
                                                    required
                                                    name="businessProfile.storeInfo.companyInfo.addressInfo.postalCode"
                                                    label={
                                                        <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-address-postal-code-label">
                                                            Postal Code
                                                        </Trans>
                                                    }
                                                    margin="dense"
                                                    variant="outlined"
                                                    fullWidth
                                                    onChange={this.props.handleInputChange}
                                                    value={companyInfo.addressInfo.postalCode}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col p-8 sm:p-12">
                                    < div className='w-full sm:w-3/5'>
                                        <TextField
                                            name="businessProfile.storeInfo.businessProfile.accountDetails.name"
                                            label={
                                                <Trans i18nKey="settings.businessProfile.business-profile-form-input-name-label">
                                                    Name
                                                </Trans>
                                            }
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            onChange={this.props.handleInputChange}
                                            value={businessProfile.accountDetails.name}
                                        />
                                    </div>
                                    <div className='w-full sm:w-3/5'>
                                        <TextField
                                            type="email"
                                            name="businessProfile.storeInfo.businessProfile.businessEmail"
                                            label={
                                                <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-email-label">
                                                    Business email
                                                </Trans>
                                            }
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            onChange={this.props.handleInputChange}
                                            value={businessProfile.businessEmail}
                                        />
                                    </div>
                                    <div className='w-full sm:w-3/5'>
                                        <InputMask
                                            mask="999-999-9999"
                                            onChange={this.props.handleInputChange}
                                            value={businessProfile.businessPhoneNo}
                                        >
                                            {() => <TextField
                                                pattern="[0-9]*"
                                                name="businessProfile.storeInfo.businessProfile.businessPhoneNo"
                                                label={
                                                    <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-phone-no-label">
                                                        Business phone
                                                    </Trans>
                                                }
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                            />}
                                        </InputMask>
                                    </div>
                                </div>
                            ) }
                        </div>
                        <div className="flex flex-row justify-end items-center px-8 lg:px-12">
                            <button className="button-primary" type="submit">
                                <Trans i18nKey="main.save-btn">Save</Trans>
                            </button>
                        </div>
                        
                    </div>
                ) : (
                    null
                )}
                </form>
            </React.Fragment>
        );
    }
}


export default (withStyles(styles, { withTheme: true })(withRouter((withTranslation()(PackagePaymentMethod)))));