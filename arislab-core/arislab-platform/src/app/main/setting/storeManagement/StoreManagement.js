import React, { Component } from 'react';
import {
    Tab,
    Tabs,
    Card
} from '@material-ui/core';
import './StoreManagement.css';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';

import Cookies from "js-cookie";
import { UtilityManager } from '../../modules/UtilityManager';
import UtilityFunction from '../../modules/UtilityFunction';
import { Trans, withTranslation } from 'react-i18next';

import EditBusinessprofile from './businessProfile/EditBusinessprofile';
import Payment from './payment/payments';
import Delivery from './delivery/delivery';
import StoreConfig from './storeConfig/storeConfig';


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
});

class StoreManagement extends Component {
    state = {
        tabValue: 0,
        form: null,
        auth0_uid: '',
        email: '',
        storeID: '',
        hideTabs: false,
    };
    pageCategory = "Store Management";

    componentDidMount() {
        let cookieValue = Cookies.get('auth0_uid');

        UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {
            this.setState({
                auth0_uid: resultStoreInfo[0].auth0_uid,
                email: resultStoreInfo[0].email,
                storeID: resultStoreInfo[0].storeID
            });
        });
    }

    pushTrackingData = (pageAction, pageLabel) => {
        let auth0_uid = UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous");
        UtilityFunction.tagManagerPushDataLayer(this.pageCategory, pageAction, pageLabel, auth0_uid);
    }

    handleChangeTab = (event, newIndex) => {
        this.setState({ tabValue: newIndex });
    };

    handleBackTab = () => {
        let tab = this.state.tabValue - 1;
        this.setState({
            tabValue: tab
        })
    }

    doneTab = () => {
        window.location.href = "/platform/dashboard";
    }

    checkHashValue = (tabDataList) => {
        if (this.props.location.hash.length > 0) {
            var hash = this.props.location.hash.replace("#", "");

            tabDataList.map((item, index) => {
                if (item.tabHash === hash && this.state.tabValue !== index) {
                    this.setState({
                        tabValue: index,
                        hideTabs: true,
                    });
                }

                return true;
            });
        }
    }

    render() {
        const { tabValue, storeID } = this.state;
        const tabDataList = [
            { tabName: "Business profile", tabHash: "profile", tabI18nKey: "settings.businessProfile.business-profile-tab-title", tabContent: <EditBusinessprofile storeID={this.state.storeID} pushTrackingData={this.pushTrackingData} dataLabel="setting business profile page" /> },
            { tabName: "Payments", tabHash: "payments", tabI18nKey: "settings.payments.payments-tab-title", tabContent: <Payment storeID={this.state.storeID} pushTrackingData={this.pushTrackingData} dataLabel="setting payments page" parentPage="STORE_MANAGEMENT" /> },
            { tabName: "Delivery", tabHash: "delivery", tabI18nKey: "settings.delivery.delivery-tab-title", tabContent: <Delivery key="Delivery" storeID={storeID} pushTrackingData={this.pushTrackingData} dataLabel="setting delivery profile page" /> },
            { tabName: "Store config", tabHash: "store-config", tabI18nKey: "settings.store-config.store-config-tab-title", tabContent: <StoreConfig key="StoreConfig" storeID={storeID} pushTrackingData={this.pushTrackingData} dataLabel="setting store config page" /> },
        ];

        this.checkHashValue(tabDataList);


        return (
            <FusePageSimple
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}

                content={
                    (
                        <div>
                            {this.state.hideTabs ?
                                null
                                :
                                <div className="mb-6 md:p-24 md:pb-4">
                                    <Card className="p-0">

                                        <Tabs
                                            value={tabValue}
                                            onChange={this.handleChangeTab}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            className="flex flex-auto"
                                            align='center'
                                        >
                                            {tabDataList.map((item, index) => {
                                                return (
                                                    <Tab
                                                        className="h-64 normal-case"
                                                        label={
                                                            <Trans i18nKey={item.tabI18nKey}>{item.tabName}</Trans>
                                                        }
                                                        key={item.tabName}
                                                    />
                                                );
                                            })}
                                        </Tabs>
                                    </Card>
                                </div>
                            }


                            <div className="lg:p-24 sm:p-16">
                                {storeID !== '' ? (
                                    tabDataList[tabValue].tabContent
                                ) : (null)}
                            </div>
                        </div>
                    )
                }

            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(StoreManagement));