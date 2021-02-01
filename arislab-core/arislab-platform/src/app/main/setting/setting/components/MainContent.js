import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import reducer from "../../../store/reducers";
import withReducer from "app/store/withReducer";
import * as MainActions from "../../../store/actions";
import { withStyles, Tab, Tabs, Card } from "@material-ui/core";

import styles from "../../../live/liveEvent/styles/styles";
import { Trans, withTranslation } from "react-i18next";

import StorePackageCard from "./StorePackageCard";
import StoreInfoCard from "./StoreInfoCard";
import StoreConfigCard from "./StoreConfigCard";
import UserManagement from "./UserManagement/UserManagement";
import { showMessage } from "app/store/actions/fuse";
class MainContent extends React.Component {
  state = {
    tabValue: 0,
    auth0_uid: "",
    email: "",
    storeID: "",
    queryString: "",
    packagePaymentInfoError: false,
  };

  componentDidMount() {
    this.setState({
      auth0_uid: this.props.auth0_uid,
      email: this.props.email,
      storeID: this.props.storeID,
      queryString:
        this.props.location.hash.length > 0
          ? this.props.location.hash.replace("#", "")
          : "",
    });

    if (
      this.props.location.hash === "#storeConfig" &&
      this.state.tabValue === 0
    ) {
      this.handleChangeTab(null, 1);
    }
  }

  handleChangeTab = (event, newIndex) => {
    this.props.changeTab(newIndex);
    this.setState({ queryString: "" });
  };

  checkHashValue = (tabDataList) => {
    if (this.state.queryString.length > 0) {
      tabDataList.map((item, index) => {
        if (
          item.tabHash === this.state.queryString &&
          this.state.tabValue !== index
        ) {
          this.setState({
            tabValue: index,
          });
        }

        return true;
      });
    }
  };

  scrollToPackagePayment = () => {
    this.setState(
      { tabValue: 0, queryString: "", packagePaymentInfoError: true },
      () => {
        setTimeout(() => {
          document.getElementById("package-payment-info").scrollIntoView();
        }, 500);
      }
    );
  };

  disappearPackagePaymentInfoError = () => {
    this.setState({ packagePaymentInfoError: false });
  };

  checkEnableUserManagement(tabs) {
    if (
      this.props.businessProfile &&
      this.props.businessProfile.storeInfo.config.enabledUserManagement
    ) {
      tabs.push({
        tabName: "User Management",
        tabHash: "userManagement",
        tabI18nKey: "settings.settings-tab.USER_MANAGEMENT",
        tabContent: (
          <UserManagement
            t={this.props.t}
            store={{
              storeID: this.props.storeID,
              storeName:
                this.props.businessProfile &&
                this.props.businessProfile.storeInfo.businessProfile
                  .accountDetails.businessName,
              userLimit:
                this.props.businessProfile &&
                this.props.businessProfile.storeInfo.features
                  ? this.props.businessProfile.storeInfo.features.user.limit
                  : 0,
            }}
            showMessage={this.props.showMessage}
          />
        ),
      });
    }
  }

  render() {
    const { storeID, packagePaymentInfoError } = this.state;
    const { tabValue } = this.props;
    const tabDataList = [
      {
        tabName: "Store Info",
        tabHash: "storeInfo",
        tabI18nKey: "settings.settings-tab.store-info",
        tabContent: (
          <StoreInfoCard
            storeID={storeID}
            pushTrackingData={this.props.pushTrackingData}
            dataLabel="setting store info page"
            packagePaymentInfoError={packagePaymentInfoError}
            disappearPackagePaymentInfoError={
              this.disappearPackagePaymentInfoError
            }
          />
        ),
      },
      {
        tabName: "Store Config",
        tabHash: "storeConfig",
        tabI18nKey: "settings.settings-tab.store-config",
        tabContent: (
          <StoreConfigCard
            storeID={storeID}
            pushTrackingData={this.props.pushTrackingData}
            dataLabel="setting store config page"
          />
        ),
      },
    ];

    const currentTabs = this.checkEnableUserManagement(tabDataList);
    this.checkHashValue(currentTabs);

    return (
      <React.Fragment>
        {storeID.length > 0 ? (
          <div className="w-full">
            <div className="flex mb-12 lg:hidden md:hidden lg:mb-0 ">
              <StorePackageCard
                storeID={this.state.storeID}
                scrollToPackagePayment={this.scrollToPackagePayment}
              />
            </div>
            <div className="mb-12">
              <Card className="p-0">
                <Tabs
                  value={tabValue}
                  onChange={this.handleChangeTab}
                  indicatorColor="primary"
                  textColor="primary"
                  className="flex flex-auto"
                  align="center"
                >
                  {tabDataList.map((item, index) => {
                    return (
                      <Tab
                        className="h-64 normal-case"
                        label={
                          <Trans i18nKey={item.tabI18nKey}>
                            {item.tabName}
                          </Trans>
                        }
                        key={item.tabName}
                      />
                    );
                  })}
                </Tabs>
              </Card>
            </div>
            <div className="flex flex-row">
              <div className="flex-1">
                {tabValue >= 0 ? tabDataList[tabValue].tabContent : null}
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeTab: MainActions.changeTab,
      showMessage: (props) => dispatch(showMessage(props)),
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    businessProfile: state.liveEventsApp.businessProfile,
    tabValue: state.mainContent.mainContent.tabValue,
  };
}

export default withReducer("mainContent", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(MainContent))
    )
  )
);
