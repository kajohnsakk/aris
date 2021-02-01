import React, { Component } from "react";
import { CircularProgress } from "@material-ui/core";
import { FusePageSimple } from "@fuse";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import { UtilityManager } from "../../modules/UtilityManager";
import UtilityFunction from "../../modules/UtilityFunction";
import Cookies from "js-cookie";
import { withTranslation } from "react-i18next";
import Classnames from "classnames";

import StoreProfileCard from "../../live/liveEvent/card/StoreProfileCard";
import DownloadMobileAppCard from "../../live/liveEvent/card/DownloadMobileAppCard";
import MainContent from "./components/MainContent";
import StorePackageCard from "./components/StorePackageCard";

import styles from "../../live/liveEvent/styles/styles";
class Settings extends Component {
  state = {
    auth0_uid: "",
    email: "",
    storeID: "",
  };
  pageCategory = "Settings";

  componentDidMount() {
    let cookieValue = Cookies.get("auth0_uid");

    if (this.state.storeID.length === 0 || this.state.auth0_uid.length === 0) {
      UtilityManager.getInstance()
        .storeInfoLookup(cookieValue)
        .then((resultStoreInfo) => {
          this.setState({
            auth0_uid: resultStoreInfo[0].auth0_uid,
            email: resultStoreInfo[0].email,
            storeID: resultStoreInfo[0].storeID,
          });
        });
    }
  }

  pushTrackingData = (pageAction, pageLabel) => {
    let auth0_uid = UtilityFunction.getExistValue(
      this.state.auth0_uid,
      "Anonymous"
    );
    UtilityFunction.tagManagerPushDataLayer(
      this.pageCategory,
      pageAction,
      pageLabel,
      auth0_uid
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot,
        }}
        content={
          <React.Fragment>
            {this.state.storeID ? (
              <div className="flex justify-between my-12 lg:my-24">
                <div className="hidden lg:block mb-24 mr-24 w-1/5">
                  <div className="mb-24">
                    <StoreProfileCard
                      storeID={this.state.storeID}
                      pushTrackingData={this.pushTrackingData}
                    />
                  </div>
                  <div className="mb-24">
                    <StorePackageCard
                      storeID={this.state.storeID}
                      scrollToPackagePayment={this.scrollToPackagePayment}
                    />
                  </div>
                  <div>
                    <DownloadMobileAppCard
                      pushTrackingData={this.pushTrackingData}
                    />
                  </div>
                </div>
                <div className="flex-1 mb-24">
                  <MainContent
                    storeID={this.state.storeID}
                    email={this.state.email}
                    auth0_uid={this.state.auth0_uid}
                    pushTrackingData={this.pushTrackingData}
                  />
                </div>
              </div>
            ) : (
              <div className={Classnames(classes.loadingPage, "my-64")}>
                <CircularProgress className={classes.highlightText} />
              </div>
            )}
          </React.Fragment>
        }
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(withTranslation()(Settings))
);
