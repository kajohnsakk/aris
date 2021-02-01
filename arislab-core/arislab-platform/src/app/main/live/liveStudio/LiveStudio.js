import axios from "axios";
import React, { Component } from "react";
import { FusePageSimple } from "@fuse";
import classnames from "classnames";

import CircularProgress from "@material-ui/core/CircularProgress";

import withReducer from "app/store/withReducer";
import reducer from "./store/reducers";
import * as Actions from "./store/actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

import Cookies from "js-cookie";
import { UtilityManager } from "../../modules/UtilityManager";
import { SalesChannelManager } from "../../context/sales_channel/salesChannelManager";
import * as AppConfig from "../../config/AppConfig";
import { withTranslation } from "react-i18next";
import EventCodePrompt from "./dialog/EventCodePrompt";
import VideoExpirePrompt from "./dialog/VideoExpirePrompt";
import VideoDisconnectPrompt from "./dialog/VideoDisconnectPrompt";

import _ from "@lodash";

import Comments from "./Comments";
import LiveVideoFlvPlayer from "./LiveVideoFlvPlayer";
import LiveProductControl from "./LiveProductControl";
import UtilityFunction from "../../modules/UtilityFunction";

const styles = (theme) => ({
  card: {
    backgroundColor: "#fff",
    maxWidth: "100%",
    [theme.breakpoints.up("lg")]: {
      paddingBottom: theme.spacing.unit,
      overflow: "hidden",
      boxShadow:
        "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
      borderRadius: "4px",
      border: "2px solid transparent",
    },
  },
  cardContent: {
    background: "#ffffff",
    padding: "0px",
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing.unit * 2,
    },
  },
  mediaArea: {
    [theme.breakpoints.up("lg")]: {
      backgroundColor: "#C9CDE6",
    },
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
  footer: {
    background: "#333B44",
  },
  root: {
    width: "100%",
  },
  grayButton: {
    background: "#6C7682",
    color: "#C5CDD5",
    fontWeight: "bold",
    "&:hover": {
      background: "#6C7682",
      color: "#C5CDD5",
      fontWeight: "bold",
    },
  },
  playButton: {
    background:
      "linear-gradient(-90deg, rgba(222, 44, 125, 1), rgba(227, 178, 97, 1))",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      background:
        "linear-gradient(-90deg, rgba(222, 44, 125, 1), rgba(227, 178, 97, 1))",
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  },
  redButton: {
    background: "#FF0000",
    color: "#FFFFFF",
    fontWeight: "bold",
    "&:hover": {
      background: "#FF0000",
      color: "#C5CDD5",
      fontWeight: "bold",
    },
  },
  layoutRoot: {},
  loadingPage: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  highlightText: {
    color: theme.palette.primary.color,
    fontWeight: "bolder",
  },
});

class LiveStudio extends Component {
  state = {
    auth0_uid: "",
    storeID: "",
    email: "",
    data: {},
    // clickedSlider: {},
    overlayImage: "",
    isDisplayEventCodeDialog: true,
    isLoadedEventInfo: false,
    facebookPageID: "",
    facebookVideoID: "",
    facebookAccessToken: "",
    isVideoExpire: false,
    isVideoDisconnect: false,
    businessProfile: {},
    tmpProductList: [],
    selectedProductIndex: "",
    selectedProductObj: {},
    isStreaming: false,
    streamingIpAddress: "",
    isOverlayImageLoading: false,
    eventTransaction: {},
    disabledOverlayToggle: true,
  };
  eventSource = undefined;
  FACEBOOK_VIDEO_NOT_EXPIRED = "Not expired";
  FACEBOOK_VIDEO_EXPIRED = "Expired";
  FACEBOOK_VIDEO_ERROR = "Error";
  pageCategory = "Lives";
  intervalTime = undefined;

  componentDidMount() {
    this.setState({ tmpProductList: this.props.productList });
    let cookieValue = Cookies.get("auth0_uid");

    UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then((resultStoreInfo) => {
        this.setState({
          auth0_uid: resultStoreInfo[0].auth0_uid,
          email: resultStoreInfo[0].email,
          storeID: resultStoreInfo[0].storeID,
        });

        const params = this.props.match.params;
        const { eventID } = params;

        this.props.getEventInfo({
          storeID: resultStoreInfo[0].storeID,
          eventID: eventID,
        });

        this.props.getBusinessProfile({
          storeID: resultStoreInfo[0].storeID,
        });

        this.props.getProducts(resultStoreInfo[0].storeID);

        UtilityFunction.tagManagerPushDataLayer(
          this.pageCategory,
          "View",
          "View LIVE Command Center",
          UtilityFunction.getExistValue(
            resultStoreInfo[0].auth0_uid,
            "Anonymous"
          )
        );
        UtilityFunction.tagManagerPushDataLayer(
          this.pageCategory,
          "View",
          "21. View Command Center",
          UtilityFunction.getExistValue(
            resultStoreInfo[0].auth0_uid,
            "Anonymous"
          )
        );
      });
  }

  componentWillUnmount() {
    this.pushTrackingData("Leave", "Leave LIVE Command Center");
    this.clearStreamStatusListener();
    if (this.eventSource) this.eventSource.close();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.checkObjIsEmpty(this.state.businessProfile) &&
        !this.checkObjIsEmpty(this.props.businessProfile)) ||
      !_.isEqual(this.props.businessProfile, prevProps.businessProfile)
    ) {
      this.setState({ businessProfile: this.props.businessProfile });
    }

    if (!_.isEqual(this.props.liveEventInfo, prevProps.liveEventInfo)) {
      const data = this.props.liveEventInfo;

      const facebookVideoID = data.facebookData.videoID;
      this.setState({
        data: data,
        facebookVideoID: facebookVideoID,
        isLoadedEventInfo: true,
      });

      if (this.state.facebookPageID === "") {
        SalesChannelManager.getInstance()
          .getChannelByStoreID(this.state.storeID)
          .then((resultChannelByStoreID) => {
            if (
              resultChannelByStoreID.length > 0 &&
              resultChannelByStoreID[0].hasOwnProperty("channels")
            ) {
              const facebookPageID =
                resultChannelByStoreID[0]["channels"]["facebook"];
              const facebookSelectedPageAccessToken =
                resultChannelByStoreID[0]["channels"][
                  "facebookSelectedPageAccessToken"
                ];
              this.setState({
                facebookAccessToken: facebookSelectedPageAccessToken,
                facebookPageID: facebookPageID,
              });
            }
          });
      }
    }

    if (
      this.state.isLoadedEventInfo === true &&
      this.state.isLoadedEventInfo !== prevState.isLoadedEventInfo
    ) {
      if (this.state.data.hasOwnProperty("code")) {
        this.streamStatusListener(this.state.data.code);
      }
    }

    if (!_.isEqual(this.props.productList, prevProps.productList)) {
      this.setState({ tmpProductList: this.props.productList });
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

  streamStatusListener = (liveEventCode) => {
    if (this.intervalTime === undefined) {
      this.intervalTime = setInterval(() => {
        UtilityManager.getInstance()
          .getLastEventTransactionByCode(liveEventCode)
          .then((resultLastEventTransactionList) => {
            if (resultLastEventTransactionList.length > 0) {
              let eventTransaction = resultLastEventTransactionList[0];

              if (this.state.isStreaming) {
                if (
                  this.state.streamingIpAddress !==
                  eventTransaction.streamingInfo.streamingToIpAddress
                ) {
                  this.setLiveVideoStatus(
                    "LIVE",
                    eventTransaction.streamingInfo.streamingToIpAddress
                  );
                } else if (
                  eventTransaction.streamingInfo.status === "END" &&
                  eventTransaction.streamingInfo.detail ===
                    "Operation not permitted"
                ) {
                  this.setLiveVideoStatus("EXPIRED");
                } else if (eventTransaction.streamingInfo.status === "END") {
                  this.setLiveVideoStatus("DISCONNECTED");
                }
              } else {
                if (eventTransaction.streamingInfo.status === "LIVE") {
                  this.setLiveVideoStatus(
                    "LIVE",
                    eventTransaction.streamingInfo.streamingToIpAddress
                  );
                }
              }
            }
          });
      }, 5000);
    }
  };

  setLiveVideoStatus = (status, streamingIpAddress = "") => {
    this.setState({ isDisplayEventCodeDialog: false }, () => {
      if (status === "LIVE") {
        // start LIVE
        this.setState({
          isStreaming: true,
          isVideoExpire: false,
          isVideoDisconnect: false,
          streamingIpAddress: streamingIpAddress,
        });
      } else if (status === "DISCONNECTED") {
        // LIVE is disconnected from mobile or Media Server
        this.setState({
          isStreaming: false,
          isVideoExpire: false,
          isVideoDisconnect: true,
          streamingIpAddress: "",
        });
      } else if (status === "EXPIRED") {
        // Facebook LIVE session is expired
        this.setState({
          isStreaming: false,
          isVideoExpire: true,
          isVideoDisconnect: false,
          streamingIpAddress: "",
        });
      }
    });
  };

  checkFacebookLiveSession = (
    facebookVideoID,
    facebookSelectedPageAccessToken
  ) => {
    return new Promise((resolve, reject) => {
      const apiUrl = `https://graph.facebook.com/${facebookVideoID}?access_token=${facebookSelectedPageAccessToken}`;
      axios
        .get(apiUrl)
        .then((res) => {
          if (
            res.data.hasOwnProperty("status") &&
            (res.data.status === "LIVE" || res.data.status === "UNPUBLISHED")
          ) {
            resolve({ status: this.FACEBOOK_VIDEO_NOT_EXPIRED });
          } else {
            resolve({ status: this.FACEBOOK_VIDEO_EXPIRED });
          }
        })
        .catch((error) => {
          reject({ status: this.FACEBOOK_VIDEO_ERROR });
        });
    });
  };

  clearStreamStatusListener = () => {
    if (this.intervalTime !== undefined) {
      clearInterval(this.intervalTime);
      this.intervalTime = undefined;
    }
  };

  checkObjIsEmpty = (obj) => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };

  toggleDialog = (event) => {
    this.setState({
      isDisplayEventCodeDialog: !this.state.isDisplayEventCodeDialog,
    });
  };

  onImageLoad = () => {
    this.setState({ isOverlayImageLoading: false });
  };

  onClickProductItem = async (event) => {
    let isDisabledOverlay = false;
    const params = this.props.match.params;
    const { eventID } = params;
    let selectedProductIndex = event.index;
    let activeProductId = "";
    let selectedProductObj = this.state.selectedProductObj;

    if (selectedProductIndex === this.state.selectedProductIndex) {
      selectedProductIndex = "";
      selectedProductObj = {};
      isDisabledOverlay = true;
    } else {
      activeProductId = event.rowData.productOption;
      selectedProductObj = this.getSelectedProductObj(
        this.state.tmpProductList,
        activeProductId
      );
      isDisabledOverlay = false;
    }

    const apiUrl =
      AppConfig.MEDIA_URL +
      `events/${eventID}/mask/png?time=${Date.now()}&activeProductId=${activeProductId}&ip=${
        this.state.streamingIpAddress
      }`;
    this.setState({
      selectedProductIndex: selectedProductIndex,
      overlayImage: apiUrl,
      isOverlayImageLoading: true,
      selectedProductObj: selectedProductObj,
      disabledOverlayToggle: isDisabledOverlay,
    });
  };

  getSelectedProductObj = (productList, activeProductId) => {
    let returnObj = {};
    for (let i = 0; i < productList.length; i++) {
      let processProductData = productList[i];
      if (processProductData.productID === activeProductId) {
        returnObj = processProductData;
        break;
      }
    }

    return returnObj;
  };

  onToggleProductImage = async (event) => {
    const params = this.props.match.params;
    const { eventID } = params;

    let newSelectedProductObj = { ...this.state.selectedProductObj };
    newSelectedProductObj["productInfo"][event.target.name] =
      event.target.checked;

    let updateSelectedProductObj = {
      productID: this.state.selectedProductObj.productID,
      storeID: this.state.selectedProductObj.storeID,
      productInfo: {
        [event.target.name]: event.target.checked,
      },
    };

    let productID = newSelectedProductObj.productID;
    await this.props.saveProduct(updateSelectedProductObj.productInfo, {
      storeID: newSelectedProductObj.storeID,
      productID: productID,
    });

    setTimeout(() => {
      // รอให้บันทึกฐานข้อมูลเสร็จก่อนแล้วค่อยเรียกใช้รูป
      const apiUrl =
        AppConfig.MEDIA_URL +
        `events/${eventID}/mask/png?time=${Date.now()}&activeProductId=${productID}&ip=${
          this.state.streamingIpAddress
        }`;
      this.setState({
        overlayImage: apiUrl,
        isOverlayImageLoading: true,
        selectedProductObj: { ...newSelectedProductObj },
      });
    }, 1000);
  };

  handleCloseLiveDisconnectDialogBtn = (event) => {
    event.preventDefault();
    this.setState({ isVideoDisconnect: false });
    window.location.href = "platform/lives";
  };

  render() {
    const { classes } = this.props;
    const {
      data,
      isLoadedEventInfo,
      facebookVideoID,
      isVideoExpire,
      isVideoDisconnect,
      businessProfile,
      selectedProductIndex,
      isOverlayImageLoading,
      selectedProductObj,
    } = this.state;

    const params = this.props.match.params;
    const { eventID } = params;

    return (
      <FusePageSimple
        classes={{
          root: classes.layoutRoot,
        }}
        content={
          isLoadedEventInfo && businessProfile.hasOwnProperty("storeInfo") ? (
            <div className="mb-16 lg:my-24 lg:p-16">
              <div
                className={classnames(
                  classes.card,
                  "py-24 flex flex-col lg:flex-row lg:p-0"
                )}
              >
                <div
                  className={classnames(
                    classes.mediaArea,
                    "flex w-full lg:w-2/3 lg:p-24 justify-center"
                  )}
                >
                  <div className="w-1/2">
                    <LiveVideoFlvPlayer
                      liveCode={data.code}
                      onImageLoad={this.onImageLoad}
                      overlayImage={this.state.overlayImage}
                      isStreaming={this.state.isStreaming}
                      streamingIpAddress={this.state.streamingIpAddress}
                    />
                  </div>
                  <div className="hidden lg:block lg:w-1/2 bg-white">
                    {facebookVideoID ? (
                      <Comments
                        videoID={facebookVideoID}
                        accessToken={this.state.facebookAccessToken}
                        storeInfo={this.state.businessProfile.storeInfo}
                        eventInfo={data}
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex w-full py-8 lg:w-1/3 lg:p-0">
                  <LiveProductControl
                    eventProductList={data.products}
                    eventID={eventID}
                    videoID={facebookVideoID}
                    facebookAccessToken={this.state.facebookAccessToken}
                    isStreaming={this.state.isStreaming}
                    selectedProductIndex={selectedProductIndex}
                    selectedProductObj={selectedProductObj}
                    isOverlayImageLoading={isOverlayImageLoading}
                    handleProductItemClick={this.onClickProductItem}
                    handleProductImageToggle={this.onToggleProductImage}
                    pushTrackingData={this.pushTrackingData}
                    disabledOverlayToggle={this.state.disabledOverlayToggle}
                  />
                </div>
              </div>

              {!isVideoExpire && !isVideoDisconnect && data.code ? (
                <EventCodePrompt
                  isDisplayEventCodeDialog={this.state.isDisplayEventCodeDialog}
                  toggleDialog={this.toggleDialog}
                  liveEventCode={data.code}
                />
              ) : isVideoExpire ? (
                <VideoExpirePrompt />
              ) : isVideoDisconnect ? (
                <VideoDisconnectPrompt
                  onCloseDialogClick={this.handleCloseLiveDisconnectDialogBtn}
                />
              ) : null}
            </div>
          ) : (
            <div className={classes.loadingPage}>
              <CircularProgress className={classes.highlightText} />
            </div>
          )
        }
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEventInfo: Actions.getEventInfo,
      updateLiveEvent: Actions.updateLiveEvent,
      getBusinessProfile: Actions.getBusinessProfile,
      getProducts: Actions.getProducts,
      saveProduct: Actions.saveProduct,
    },
    dispatch
  );
}

function mapStateToProps({ liveApp }) {
  return {
    liveEventInfo: liveApp.liveEventInfo,
    businessProfile: liveApp.businessProfile,
    productList: liveApp.liveEventProducts.productList,
  };
}

export default withReducer(
  "liveApp",
  reducer
)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(LiveStudio))
    )
  )
);
