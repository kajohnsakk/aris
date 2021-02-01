import React, { Component } from "react";
import withReducer from "app/store/withReducer";
import reducer from "./store/reducers";
import * as Actions from "./store/actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

import { Fab, Switch, FormControlLabel } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Trans, withTranslation } from "react-i18next";
import classNames from "classnames";
import _ from "@lodash";

import applause from "./sounds/applause.mp3";
import blowhorn from "./sounds/blowhorn.mp4";
import alarm from "./sounds/alarm.mp4";
import ticking from "./sounds/ticking.mp4";
import fail from "./sounds/fail.mp4";

import LiveEventProductTable from "../liveEvent/table/LiveEventProductTable";
import UtilityFunction from "../../modules/UtilityFunction";
import { WEB_URL } from "../../config/AppConfig";
import LiveEndDialog from "./LiveEndDialog";

const styles = (theme) => ({
  button: {
    textTransform: "none",
    border: "solid 1px #b7bbbe",
    background: "#fefefe",
    color: "#686868",
    fontWeight: "bolder",
    boxShadow: "none",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  highlightButton: {
    background: theme.palette.primary.color,
    color: "#ffffff",
  },
});

class LiveProductControl extends Component {
  state = {
    eventProductList: [],
    eventID: "",
    applause: new Audio(applause),
    blowhorn: new Audio(blowhorn),
    alarm: new Audio(alarm),
    ticking: new Audio(ticking),
    fail: new Audio(fail),
    displayDialog: false,
  };
  eventSource = undefined;

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyUp, false);

    const { eventProductList, eventID } = this.props;
    let products = encodeURI(eventProductList);
    if (this.eventSource == undefined) {
      this.eventSource = new EventSource(
        `${WEB_URL}api/product/getRealTimeProduct/${products}`,
        { withCredentials: true }
      );
      this.eventSource.onmessage = (e) =>
        this.setState({ eventProductList: JSON.parse(e.data) });
    }
    this.setState({ eventProductList: eventProductList, eventID: eventID });
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp, false);
    if (this.eventSource) this.eventSource.close();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      typeof this.props.storeInfo !== "undefined" &&
      !_.isEqual(this.props.storeInfo, prevProps.storeInfo)
    ) {
      this.setState({ storeInfo: this.props.storeInfo });
    }

    if (!_.isEqual(this.props.accessToken, prevProps.accessToken)) {
      this.updateCommentUrl();
    }
  }

  handleKeyUp = (event) => {
    if (event.keyCode === 49) {
      this.playSound("applause");
    } else if (event.keyCode === 50) {
      this.playSound("blowhorn");
    } else if (event.keyCode === 51) {
      this.playSound("alarm");
    } else if (event.keyCode === 52) {
      this.playSound("ticking");
    } else if (event.keyCode === 53) {
      this.playSound("fail");
    }
  };

  playSound = (soundName) => {
    switch (soundName) {
      case "applause":
        this.state.applause.play();
        break;
      case "blowhorn":
        this.state.blowhorn.play();
        break;
      case "alarm":
        this.state.alarm.play();
        break;
      case "ticking":
        this.state.ticking.play();
        break;
      case "fail":
        this.state.fail.play();
        break;
      default:
        break;
    }
  };

  closeLiveEndDialog = (event) => {
    this.setState({ displayDialog: false });
  };

  openLiveEndDialog = (event) => {
    this.setState({ displayDialog: true });
    this.props.pushTrackingData("Click", "Exit button");
  };

  render() {
    const { classes, theme, videoID, facebookAccessToken } = this.props;
    const { eventProductList, eventID, displayDialog } = this.state;

    let isEnabledProductImage = false;
    let isEnabledSizeTable = false;
    let disabledOverlayToggle = this.props.disabledOverlayToggle;

    if (
      Object.entries(this.props.selectedProductObj).length > 0 &&
      typeof this.props.selectedProductObj === "object"
    ) {
      let {
        enableProductImage,
        enableSizeTable,
      } = this.props.selectedProductObj.productInfo;
      isEnabledProductImage = enableProductImage;
      isEnabledSizeTable = enableSizeTable;
    }

    return (
      <React.Fragment>
        <div className="flex flex-col flex-1 content-between h-full">
          <div className="flex flex-1 flex-col p-12 border-solid border-b">
            <div className="flex w-full justify-between mb-12 items-center">
              <div className="font-bold hidden lg:flex">
                <Trans i18nKey="live-event.product-in-live">
                  Product in LIVE
                </Trans>
              </div>
              <div className="items-center hidden lg:flex">
                <div className="mr-8">
                  {eventProductList.length}{" "}
                  <Trans i18nKey="live-event.items">items</Trans> (
                  {this.props.selectedProductIndex ||
                  this.props.selectedProductIndex === 0
                    ? this.props.selectedProductIndex + 1
                    : 0}
                  )
                </div>
                <div>
                  <Fab
                    variant="extended"
                    size="small"
                    aria-label="Exit"
                    className={classNames(
                      classes.button,
                      classes.highlightButton,
                      "m-0 text-xs"
                    )}
                    onClick={() => this.openLiveEndDialog()}
                  >
                    <ExitToAppIcon />
                    <span className="mr-8">
                      <Trans i18nKey="live-event.exit">Exit</Trans>
                    </span>
                  </Fab>
                </div>
              </div>
              <div className="flex flex-1 justify-center lg:hidden">
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Exit"
                  className={classNames(
                    classes.button,
                    classes.highlightButton,
                    "m-0 text-xs"
                  )}
                  onClick={() => this.openLiveEndDialog()}
                >
                  <ExitToAppIcon />
                  <span className="mr-8">
                    <Trans i18nKey="live-event.exit">Exit</Trans>
                  </span>
                </Fab>
              </div>
            </div>
            <div className="flex flex-row justify-between w-full items-center">
              <FormControlLabel
                className="ml-0"
                control={
                  <Switch
                    color="primary"
                    checked={
                      disabledOverlayToggle ? false : isEnabledProductImage
                    }
                    name="enableProductImage"
                    onChange={this.props.handleProductImageToggle}
                  />
                }
                label={
                  <Trans i18nKey="product.product-image">Product image</Trans>
                }
                labelPlacement="start"
                disabled={disabledOverlayToggle}
              />
              <FormControlLabel
                className="ml-0"
                control={
                  <Switch
                    color="primary"
                    checked={disabledOverlayToggle ? false : isEnabledSizeTable}
                    name="enableSizeTable"
                    onChange={this.props.handleProductImageToggle}
                  />
                }
                label={
                  <Trans i18nKey="product.size-chart-image">
                    Size chart image
                  </Trans>
                }
                labelPlacement="start"
                disabled={disabledOverlayToggle}
              />
            </div>
            <div className="relative">
              {this.props.isOverlayImageLoading || !this.props.isStreaming ? (
                <div
                  className="h-full w-full absolute z-50"
                  style={{ background: "rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex flex-col h-full items-center justify-center">
                    <CircularProgress color="primary" />
                    {!this.props.isStreaming ? (
                      <div className="font-semibold mt-8">
                        <Trans i18nKey="live-event.start-stream-message">
                          Please start stream from your mobile phone.
                        </Trans>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
              <LiveEventProductTable
                canEditProducct={false}
                onRowClick={this.props.handleProductItemClick}
                products={eventProductList}
                eventID={eventID}
                selectedRowIndex={this.props.selectedProductIndex}
                tableHeight={
                  UtilityFunction.useMediaQuery(theme.breakpoints.down("md"))
                    ? null
                    : "550px"
                }
              />
            </div>
          </div>
          <div className="hidden lg:flex flex-col w-full p-24">
            <div className="flex w-full items-center mb-12">
              <div className="flex w-1/3 justify-center px-8">
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Applause"
                  className={classNames(
                    classes.button,
                    classes.highlightButton,
                    "m-0 text-xs w-full"
                  )}
                  onClick={() => this.playSound("applause")}
                  style={{ width: "100%" }}
                >
                  Applause (#1)
                </Fab>
              </div>
              <div className="flex w-1/3 justify-center px-8">
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Blowhorn"
                  className={classNames(
                    classes.button,
                    classes.highlightButton,
                    "m-0 text-xs"
                  )}
                  onClick={() => this.playSound("blowhorn")}
                  style={{ width: "100%" }}
                >
                  Blowhorn (#2)
                </Fab>
              </div>
              <div className="flex w-1/3 justify-center px-8">
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Alarm"
                  className={classNames(
                    classes.button,
                    classes.highlightButton,
                    "m-0 text-xs"
                  )}
                  onClick={() => this.playSound("alarm")}
                  style={{ width: "100%" }}
                >
                  Alarm (#3)
                </Fab>
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex w-1/3 justify-center px-8">
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Ticking"
                  className={classNames(
                    classes.button,
                    classes.highlightButton,
                    "m-0 text-xs"
                  )}
                  onClick={() => this.playSound("ticking")}
                  style={{ width: "100%" }}
                >
                  Ticking (#4)
                </Fab>
              </div>
              <div className="flex w-1/3 justify-center px-8">
                <Fab
                  variant="extended"
                  size="small"
                  aria-label="Fail"
                  className={classNames(
                    classes.button,
                    classes.highlightButton,
                    "m-0 text-xs"
                  )}
                  onClick={() => this.playSound("fail")}
                  style={{ width: "100%" }}
                >
                  Fail (#5)
                </Fab>
              </div>
            </div>
          </div>
        </div>
        {displayDialog ? (
          <LiveEndDialog
            cancelLiveEndDialog={this.closeLiveEndDialog}
            videoID={videoID}
            facebookAccessToken={facebookAccessToken}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProductsList: Actions.getProductsList,
    },
    dispatch
  );
}

function mapStateToProps({ liveApp }) {
  return {
    productListSlider: liveApp.liveProductSlider,
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
      )(withTranslation()(LiveProductControl))
    )
  )
);
