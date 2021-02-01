import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { UtilityManager } from "../modules/UtilityManager";
import { FusePageSimple } from "@fuse";
import Classnames from "classnames";
import StoreProfileCard from "../live/liveEvent/card/StoreProfileCard";
import DownloadMobileAppCard from "../live/liveEvent/card/DownloadMobileAppCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import UtilityFunction from "../modules/UtilityFunction";
import styles from "./styles/styles";
import { withStyles } from "@material-ui/core/styles";
import { Line } from "react-chartjs-2";
import { Trans, withTranslation } from "react-i18next";
import DashboardCards from "./DashboardCards";

const Dashboard = (props) => {
  const [storeID, setStoreID] = useState("");
  const [auth0_uid, setAuth0Uid] = useState("");
  const [email, setEmail] = useState("");
  const pageCategory = "Dashboard";
  const classes = props.classes;

  useEffect(() => {
    let cookieValue = Cookies.get("auth0_uid");
    let dotplay = Cookies.get("dotplay");
    if (storeID.length === 0 || auth0_uid.length === 0) {
      UtilityManager.getInstance()
        .storeInfoLookup(cookieValue)
        .then((resultStoreInfo) => {
          setAuth0Uid(resultStoreInfo[0].auth0_uid);
          setEmail(resultStoreInfo[0].email);
          setStoreID(resultStoreInfo[0].storeID);
        });
    }
  }, []);

  const pushTrackingData = (pageAction, pageLabel) => {
    // let email = UtilityFunction.getExistValue(this.state.email, "Anonymous");
    let auth0_uid = UtilityFunction.getExistValue(auth0_uid, "Anonymous");
    UtilityFunction.tagManagerPushDataLayer(
      pageCategory,
      pageAction,
      pageLabel,
      auth0_uid
    );
  };

  const thousandSeperator = (number) => {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <FusePageSimple
      classes={{
        root: classes.layoutRoot,
      }}
      content={
        <React.Fragment>
          {storeID ? (
            <div className="flex justify-between my-12 lg:my-24">
              <div className="hidden lg:block mb-24 mr-24 w-1/5">
                <div className="mb-24">
                  <StoreProfileCard
                    storeID={storeID}
                    pushTrackingData={pushTrackingData}
                  />
                </div>
                <div>
                  <DownloadMobileAppCard pushTrackingData={pushTrackingData} />
                </div>
              </div>
              <div className="flex-1 mb-24">
                <DashboardCards
                  storeID={storeID}
                  pushTrackingData={pushTrackingData}
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
};

export default withStyles(styles, { withTheme: true })(Dashboard);
