import React, { Component } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";

import "../../../storeManagement/StoreManagement.css";
import { SalesChannelManager } from "../../../../context/sales_channel/salesChannelManager";

import { Trans, withTranslation } from "react-i18next";
import { FacebookService } from "../../../../modules/FacebookService";

import * as Actions from "../../../store/actions";
import Cookies from "js-cookie";
import reducer from "../../../store/reducers";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import withReducer from "app/store/withReducer";
import _ from "@lodash";

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
  table: {
    marginBottom: "300px",
  },
});

class Facebook extends Component {
  state = {
    storeID: "",
    storeBusinessProfile: null,
    channelInfo: {},
    facebookSelectedPage: {},
    isSaving: false,
    selectedPage: {},
    pages: [],
    isLoadData: true,
    isLoadFacebookPageData: false,
    displayFacebookPageList: false,
  };

  componentDidMount() {
    this.setState({ storeID: this.props.storeID }, () => {
      this.getFacebookChannelInfo();
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.storeID !== prevProps.storeID) {
      this.setState({ storeID: this.props.storeID }, () => {
        this.getFacebookChannelInfo();
      });
    }

    if (
      !_.isEqual(
        this.state.storeBusinessProfile,
        this.props.storeBusinessProfile
      )
    ) {
      this.setState({ storeBusinessProfile: this.props.storeBusinessProfile });
    }
  }

  getFacebookChannelInfo = async () => {
    var resultChannelByStoreID = await SalesChannelManager.getInstance().getChannelByStoreID(
      this.state.storeID
    );
    if (
      resultChannelByStoreID.length > 0 &&
      resultChannelByStoreID[0].hasOwnProperty("channels")
    ) {
      var facebookPageID =
        "facebook_" + resultChannelByStoreID[0]["channels"]["facebook"];

      var resultGetConvolabChannelInfo = await SalesChannelManager.getInstance().getConvolabChannelInfo(
        facebookPageID
      );
      this.setState(
        {
          channelInfo: resultGetConvolabChannelInfo,
          isLoadData: false,
        },
        () => {
          this.setSelectedFacebookPageData();
        }
      );
    }
  };

  onFacebookAuthClicked = () => {
    this.setState({ isLoadFacebookPageData: true }, () => {
      if (FacebookService.getInstance().pages.length > 0) {
        this.onFacebookPageLoaded();
      } else {
        FacebookService.getInstance()
          .authenticate()
          .then(() => {
            return FacebookService.getInstance().loadPages();
          })
          .then(this.onFacebookPageLoaded);
      }
    });
  };

  onFacebookPageLoaded = () => {
    this.setState(
      { isLoadFacebookPageData: false, displayFacebookPageList: true },
      () => {
        this.setSelectedFacebookPageData();
      }
    );
  };

  setSelectedFacebookPageData = () => {
    FacebookService.getInstance().pages.map((page) => {
      if (
        this.state.channelInfo.hasOwnProperty("channel_id") &&
        this.state.channelInfo.channel_id === page.id
      ) {
        this.setState({ selectedPage: page });
        return true;
      }
      return false;
    });
  };

  handleClickCloseButton = (event) => {
    this.setState({
      isDialogOpen: false,
    });
  };

  removeChannelFromConvolab = async (channelID) => {
    SalesChannelManager.getInstance().removeChannelFromConvolab(channelID);

    return new Promise((resolve) =>
      setTimeout(() => {
        resolve("success");
      }, 2000)
    );
  };

  handleSavePage = async (event) => {
    event.preventDefault();
    const { selectedPage } = this.state;

    this.props.pushTrackingData(
      "Click",
      "Click save Facebook sale channel button"
    );
    this.props.pushTrackingData("Update", "Update Facebook sale channel page");

    if (FacebookService.getInstance().pages.length > 0) {
      this.setState({ isSaving: true });

      let pageInfo = FacebookService.getInstance().pages.filter((page) => {
        return page.id === selectedPage.id;
      });

      let channelID = "facebook_" + pageInfo[0]["id"];
      let convolab_channelBody = {
        id: "facebook_" + pageInfo[0]["id"],
        channel_type: "facebook",
        name: pageInfo[0]["name"],
        token: pageInfo[0]["access_token"],
        channel_id: pageInfo[0]["id"],
        status: "active",
        created_at: Date.now(),
        user_count: 0,
        message_count: 0,
        bot_id: "origin",
        entity_link: [],
        last_refresh: Date.now(),
      };

      // Check channelID is exists in database or not
      let channelInfo = await SalesChannelManager.getInstance().getChannelInfo(
        channelID
      );
      if (
        channelInfo.length <= 0 ||
        (channelInfo.length > 0 &&
          channelInfo[0].hasOwnProperty("storeID") &&
          channelInfo[0]["storeID"] === "undefined")
      ) {
        let channelID = this.state.channelInfo["id"];

        if (channelID) {
          await this.removeChannelFromConvolab(channelID);
        }

        await SalesChannelManager.getInstance().addChannelToConvolab(
          convolab_channelBody.id,
          convolab_channelBody
        );
        let updateChannelBody = {
          facebook: pageInfo[0]["id"],
          facebookSelectedPage: selectedPage,
          facebookSelectedPageAccessToken: pageInfo[0]["access_token"],
        };
        await SalesChannelManager.getInstance().updateChannel(
          this.state.storeID,
          updateChannelBody
        );

        // await this.props.saveBusinessProfileSections('SALE_CHANNELS');'

        var updateStoreData = {
          businessProfile: {
            ...this.state.storeBusinessProfile,
            accountDetails: {
              ...this.state.storeBusinessProfile.accountDetails,
              businessName: selectedPage.name,
            },
            logo: selectedPage.profilePicture,
          },
        };
        await this.props.saveBusinessProfileSections(updateStoreData, {
          storeID: this.state.storeID,
          sections: "SALE_CHANNELS",
        });

        if (Cookies.get("dotplay")) {
          window.location.href =
            Cookies.get("redirect_url") +
            "?facebookId=" +
            updateChannelBody.facebook +
            "&facebookPage=" +
            updateChannelBody.facebookSelectedPage.name;
        }

        this.setState({
          isSaving: false,
          isError: false,
          errorCode: "",
          errorMessage: "",
          isDialogOpen: false,
          displayFacebookPageList: false,
          channelInfo: convolab_channelBody,
        });
      } else {
        if (this.state.storeID !== channelInfo[0]["storeID"]) {
          // If this channelID exists in the database
          this.setState({
            isSaving: false,
            isError: true,
            errorCode: "sales-channels-modal-error-duplicate-page",
            errorMessage: "Duplicate page",
            isDialogOpen: true,
          });
        } else {
          if (!this.state.channelInfo.hasOwnProperty("channel_id")) {
            SalesChannelManager.getInstance().addChannelToConvolab(
              convolab_channelBody.id,
              convolab_channelBody
            );
          }

          this.setState({
            isSaving: false,
            isError: false,
            isDialogOpen: false,
            displayFacebookPageList: false,
          });
        }
      }
    }
  };

  renderFacebookPageList = () => {
    const pages = FacebookService.getInstance().pages;

    return (
      <div className="flex items-center w-full">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col md:flex-row flex-1 mb-8">
            <div className="flex mb-8 md:w-1/4">
              <Trans i18nKey="settings.salesChannels.sales-channels-input-facebook-page-placeholder">
                Select Facebook Page
              </Trans>
            </div>
            <div className="flex flex-1 mb-8 flex-col pl-16 md:pl-8">
              {pages.map((page) => {
                return (
                  <div className="flex items-center mb-8 w-full" key={page.id}>
                    <input
                      id={page.id}
                      type="radio"
                      name="radio"
                      className="mr-8"
                      value={page.id}
                      onClick={() => {
                        this.setState({ selectedPage: page });
                        this.props.setSelectedFacebookPageDataToStore(
                          page.name,
                          page.profilePicture
                        );
                      }}
                      defaultChecked={
                        this.state.channelInfo.hasOwnProperty("channel_id")
                          ? this.state.channelInfo.channel_id === page.id
                          : false
                      }
                    />
                    <label
                      htmlFor={page.id}
                      className="flex items-center cursor-pointer"
                    >
                      {/* <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span> */}
                      {page.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-row justify-end items-center px-8 lg:px-12">
            {this.state.isSaving ? (
              <button className="button-primary" disabled>
                <Trans i18nKey="settings.salesChannels.sales-channels-button-saving-label">
                  Saving
                </Trans>
                .....
              </button>
            ) : (
              <button className="button-primary" onClick={this.handleSavePage}>
                <Trans i18nKey="main.save-btn">Save</Trans>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  renderLoginFacebookContent = () => {
    return (
      <div className="flex items-center w-full">
        <div className="flex flex-1 py-8">
          {this.state.isLoadData ? (
            <button className="loading-facebook">
              <Trans i18nKey="settings.salesChannels.sales-channels-loading-facebook-label">
                Loading
              </Trans>
              .....
            </button>
          ) : this.state.storeBusinessProfile &&
            this.state.storeBusinessProfile.hasOwnProperty("accountDetails") &&
            this.state.storeBusinessProfile.accountDetails.hasOwnProperty(
              "businessName"
            ) &&
            this.state.storeBusinessProfile.accountDetails.businessName.length >
              0 ? (
            <button
              className="edit-login-facebook-small-button"
              onClick={() => {
                this.onFacebookAuthClicked();
              }}
            >
              <div className="flex flex-row items-center">
                <div className="flex flex-1 items-center text-left mr-4">
                  {this.state.storeBusinessProfile.logo && (
                    <img
                      alt={
                        this.state.storeBusinessProfile.accountDetails
                          .businessName
                      }
                      className="h-40 mx-4 rounded-full"
                      src={this.state.storeBusinessProfile.logo}
                    />
                  )}
                  {this.state.storeBusinessProfile.accountDetails.businessName}
                </div>
                <div className="flex">
                  <EditIcon className="mx-4" />
                </div>
              </div>
            </button>
          ) : (
            <button
              className="login-facebook-button"
              onClick={() => {
                this.onFacebookAuthClicked();
              }}
            >
              <Trans i18nKey="settings.salesChannels.sales-channels-button-login-with-facebook-label">
                LOGIN WITH FACEBOOK
              </Trans>
            </button>
          )}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="">
        {this.state.displayFacebookPageList && !this.state.isLoadData
          ? this.renderFacebookPageList()
          : this.renderLoginFacebookContent()}

        {this.state.isError === true ? (
          <Dialog
            open={this.state.isDialogOpen}
            fullWidth={true}
            maxWidth={"sm"}
            aria-labelledby="customized-dialog-title"
          >
            <DialogTitle id="customized-dialog-title">
              <Trans
                i18nKey={`settings.salesChannels.sales-channels-modal-error-title`}
              >
                Error
              </Trans>
            </DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                <Trans
                  i18nKey={`settings.salesChannels.${this.state.errorCode}`}
                >
                  {this.state.errorMessage}
                </Trans>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickCloseButton} autoFocus>
                <Trans
                  i18nKey={`settings.salesChannels.sales-channels-modal-error-close-button`}
                >
                  Close
                </Trans>
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
      </div>
    );
  }
}

// export default withStyles(styles, { withTheme: true })(withTranslation()(Facebook));
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      saveBusinessProfile: Actions.saveBusinessProfile,
      saveBusinessProfileSections: Actions.saveBusinessProfileSections,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    businessProfile: storeManagement.storeBusinessProfile,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(Facebook))
    )
  )
);
