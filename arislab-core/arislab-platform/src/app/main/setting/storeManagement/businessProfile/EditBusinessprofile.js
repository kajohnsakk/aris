import React, { Component } from 'react';
import '../StoreManagement.css';
import { FusePageSimple } from '@fuse';
import BusinessProfile from './businessProfile';
import { Trans, withTranslation } from 'react-i18next';

class EditBusinessprofile extends Component{

    componentDidMount() {
        this.props.pushTrackingData("View", "View " + this.props.dataLabel);
    }

    componentWillUnmount() {
        this.props.pushTrackingData("Leave", "Leave " + this.props.dataLabel);
    }

    render(){

        // const {handleChangeTab} = this.props;

        return(
            <FusePageSimple
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}

                content={
                    (
                        <div className="text-center content-center">

                            <div className="store-management-body-container w-full lg:w-2/3 md:my-32 lg:rounded overflow-hidden shadow inline-block">

                                <div className="px-20 sm:px-40 py-20 store-management-header">
                                    <div className="font-bold text-xl mb-2 text-left">
                                        <Trans i18nKey="settings.businessProfile.business-profile-title">
                                            Profile
                                        </Trans>
                                    </div>
                                </div>
                                
                                <BusinessProfile storeID={this.props.storeID} handleStepperNextButton={this.props.handleStepperNextButton} pushTrackingData={this.props.pushTrackingData} dataLabel={this.props.dataLabel}/>

                            </div>
                        </div>
                    )
                }

            />
        );
    }
}

export default (withTranslation()(EditBusinessprofile));