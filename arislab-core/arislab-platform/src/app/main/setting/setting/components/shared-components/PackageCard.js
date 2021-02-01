import React, { Component } from "react";
import { Trans, withTranslation } from "react-i18next";
// import i18n from '../../../../i18n';

import { 
    withStyles,
    Card
} from '@material-ui/core';
import _ from '@lodash';
import Classnames from 'classnames';

const styles = theme => ({
    highlightText: {
        color: theme.palette.primary.color
    }
});

class PackageCard extends Component {
    state = {
        packageInfo: {},
        isSelectedPackage: false
    };

    componentDidMount() {
        this.setState({ packageInfo: this.props.packageInfo, isSelectedPackage: this.props.isSelectedPackage });
    }

    componentDidUpdate(prevProps, prevState) {
        if( !_.isEqual(prevProps.packageInfo, this.props.packageInfo)) {
            this.setState({ packageInfo: this.props.packageInfo, isSelectedPackage: this.props.isSelectedPackage });
        }
    }

    render() {
        const { packageInfo, isSelectedPackage } = this.state;

        const web = process.env.REACT_APP_HOME_PAGE_URL || 'https://www.arislab.ai';
        
        return (

            packageInfo && packageInfo.hasOwnProperty('name') ? (
                <Card className={Classnames("flex mx-4 w-full lg:w-1/4 justify-center py-12 ", isSelectedPackage ? "selected-package-card" : "package-card")}>
                    <div className="flex flex-1 flex-col text-center mt-12">
                        <div className="text-lg mb-16">{packageInfo.name}</div>
                        <div className="mb-40 highlight-text">{ packageInfo.memberPrice === 0 ? (
                            <div className="text-3xl mb-8">FREE</div>
                        ) : (
                            <div className="flex flex-row justify-center">
                                <div className="mb-8 text-3xl">฿{packageInfo.memberPrice}</div>
                                <div className="mt-8 flex flex-col justify-end">/<Trans i18nKey="main.month">Month</Trans></div>
                            </div>
                        ) }
                        </div>
                        <div className="font-light mb-32">
                            <div className="mb-8"><Trans i18nKey="settings.store-package-info.service-fee">Service fee</Trans> <span className="font-medium">{packageInfo.feeInfo.service.charge}</span>{ packageInfo.feeInfo.service.chargeType === "PERCENT" ? "%" : <Trans i18nKey="main.baht"></Trans> }</div>
                            <div className="mb-8"><Trans i18nKey="settings.store-package-info.payment-fee">Payment fee</Trans> <span className="font-medium">{packageInfo.feeInfo.qrCodeService.charge}</span>{ packageInfo.feeInfo.qrCodeService.chargeType === "PERCENT" ? "%" : <Trans i18nKey="main.baht"></Trans> }</div>
                            <div className="mb-8">
                                <a href={web+"/package"} target="_blank" rel="noopener noreferrer">
                                    <Trans i18nKey="settings.store-package-info.use-all-features">Use all features</Trans>
                                </a>
                            </div>
                            <div className="mb-8"><Trans i18nKey="settings.store-package-info.support-coming-features">Support coming features</Trans></div>
                        </div>
                        <div className="flex px-16">
                            <button className="select-package-button" disabled={isSelectedPackage} onClick={(event) => {
                                event.preventDefault();
                                this.props.handleSelectPackageButton(packageInfo);
                            }}>
                                <Trans i18nKey="main.select"></Trans>
                            </button>
                        </div>
                    </div>
                </Card>
            ) : (null)
            
        );
    }
}

export default (withStyles(styles, { withTheme: true })(withTranslation()(PackageCard)));
