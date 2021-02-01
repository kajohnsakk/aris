import React, { Component } from "react";
import {
  Tab,
  Tabs,
  // Button,
  Card,
  CardContent,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FusePageSimple } from "@fuse";

import Cookies from "js-cookie";

import { SalesChannelManager } from "../../context/sales_channel/salesChannelManager";
import { UtilityManager } from "../../modules/UtilityManager";

import GeneralSettings from "./generalSettings";
import MessageSettings from "./messageSettings";
import { Trans, withTranslation } from "react-i18next";

const styles = (theme) => ({
  layoutRoot: {},
  card: {
    maxWidth: "100%",
    border: "solid 1px #ededed",
    paddingBottom: 5,
  },
  header: {
    background: "#fbfbfb",
    borderBottom: "solid 2px #ededed",
    color: "#8d9095",
    fontWeight: "bolder",
  },
  content: {
    background: "#ffffff",
    paddingTop: 5,
    paddingBottom: 5,
  },
});

class ChatbotManagement extends Component {
  state = {
    tabValue: 0,
    auth0_uid: "",
    email: "",
    storeID: "",
    channelInfo: {},
  };

  componentDidMount() {
    // let cookieValue = Cookies.get('email');
    let cookieValue = Cookies.get("auth0_uid");

    this.storeInfoLookup(cookieValue).then((resultStoreInfoLookup) => {
      SalesChannelManager.getInstance()
        .getChannelByStoreID(this.state.storeID)
        .then((resultChannelByStoreID) => {
          let facebookPageID;

          if (
            resultChannelByStoreID.length > 0 &&
            resultChannelByStoreID[0].hasOwnProperty("channels")
          ) {
            facebookPageID =
              "facebook_" + resultChannelByStoreID[0]["channels"]["facebook"];

            SalesChannelManager.getInstance()
              .getConvolabChannelInfo(facebookPageID)
              .then((resultGetConvolabChannelInfo) => {
                this.setState({
                  channelInfo: resultGetConvolabChannelInfo,
                });
              });
          }
        });
    });
  }

  storeInfoLookup = (cookie) => {
    return UtilityManager.getInstance()
      .storeInfoLookup(cookie)
      .then((resultStoreInfo) => {
        this.setState({
          auth0_uid: resultStoreInfo[0].auth0_uid,
          email: resultStoreInfo[0].email,
          storeID: resultStoreInfo[0].storeID,
        });

        return resultStoreInfo;
      });
  };

  handleChangeTab = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { tabValue, storeID, channelInfo } = this.state;
    return (
      <FusePageSimple
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        content={
          <div>
            <div className="pb-6 sm:p-24 sm:pb-4">
              <Card>
                <CardContent>
                  <Tabs
                    value={tabValue}
                    onChange={this.handleChangeTab}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    classes={{ root: "w-full h-64" }}
                  >
                    <Tab
                      className="h-64 normal-case"
                      label={
                        <Trans i18nKey="settings.chatbot.chatbot-general-tab-title">
                          General
                        </Trans>
                      }
                    />
                    <Tab
                      className="h-64 normal-case"
                      label={
                        <Trans i18nKey="settings.chatbot.chatbot-message-tab-title">
                          Message
                        </Trans>
                      }
                    />
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="p-16 sm:p-24">
              {tabValue === 0 && [
                storeID !== "" && channelInfo.hasOwnProperty("name") ? (
                  <GeneralSettings
                    storeID={storeID}
                    channelInfo={channelInfo}
                    key={Date.now()}
                  />
                ) : null,
              ]}
              {tabValue === 1 && [
                storeID !== "" && channelInfo.hasOwnProperty("name") ? (
                  <MessageSettings
                    storeID={storeID}
                    channelInfo={channelInfo}
                    key={Date.now()}
                  />
                ) : null,
              ]}
            </div>
          </div>
        }
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(ChatbotManagement)
);
