import React, { Component } from "react";
import * as Actions from "../setting/store/actions";
import reducer from "../setting/store/reducers";
import Cookies from "js-cookie";
import { UtilityManager } from "../modules/UtilityManager";
import UtilityFunction from "../modules/UtilityFunction";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import withReducer from "app/store/withReducer";
import _ from "@lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import NewShopBusinessForm from "../setting/storeManagement/businessProfile/newShopBusinessForm";
import "../../../styles/login.css";
import logo from "../../../public/images/aris-logo.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import i18n from "../../../app/i18n";
import SmallLanguageMenu from "app/fuse-layouts/shared-components/SmallLanguageMenu";
import image1 from "../../../public/images/login/c1.png";
import image2 from "../../../public/images/login/c2.png";

const styles = (theme) => ({
  layoutRoot: {},
  highlightText: {
    color: theme.palette.primary.color,
    fontWeight: "bolder",
  },
});

class Landing extends Component {
  state = {
    auth0_uid: "",
    email: "",
    storeID: "",
    storeInfo: null,
    verificationInfo: {},
    channels: {},
    hasBusinessName: false,
    hasFacebookConnect: false,
    hasPayments: false,
    isLoadingBusinessProfileData: true,
    isLoadingSaleChannelData: true,
    isProcessPageState: true,
    stepState: 0,
    otp: "",
    otpRef: "",
  };
  pageCategory = "Landing";

  componentDidMount() {
    let cookieValue = Cookies.get("auth0_uid");

    UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then((resultStoreInfo) => {
        this.setState({
          auth0_uid: resultStoreInfo[0].auth0_uid,
          email: resultStoreInfo[0].email,
          storeID: resultStoreInfo[0].storeID,
        });
        this.updateBusinessProfileState(resultStoreInfo[0].storeID);
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.businessProfile &&
      this.props.businessProfile.hasOwnProperty("storeInfo") &&
      !_.isEqual(this.props.businessProfile, prevProps.businessProfile)
    ) {
      if (this.props.businessProfile.hasOwnProperty("registeredTimestamp")) {
        if (
          this.props.businessProfile.registeredTimestamp > 0 &&
          this.props.businessProfile.hasOwnProperty("verifyInfo") &&
          this.props.businessProfile.verifyInfo.isVerified &&
          this.props.businessProfile.verifyInfo.pinCode.length > 0
        ) {
          window.location.href = "platform/dashboard";
        } else {
          this.setState({
            isProcessPageState: false,
          });
        }
      } else {
        this.setState(
          {
            storeInfo: this.props.businessProfile.storeInfo,
            verificationInfo: this.props.businessProfile.verifyInfo,
            isLoadingBusinessProfileData: false,
            isProcessPageState: false,
          },
          () => {
            this.checkBusinessProfileData();
          }
        );
      }
    }

    if (this.props.stepState !== prevProps.stepState) {
      this.setState({
        stepState: this.props.stepState,
        isProcessPageState: false,
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

  updateBusinessProfileState = (storeID) => {
    this.props.getBusinessProfile({ storeID: storeID });
  };

  checkBusinessProfileData = () => {
    var stepState = this.state.stepState;

    if (
      stepState === 0 &&
      this.state.storeInfo.hasOwnProperty("businessProfile")
    ) {
      if (this.checkHasSetData("PROFILE")) {
      } else {
        this.setState({ isProcessPageState: false });
      }
    } else {
      this.setState({ isProcessPageState: false });
    }
  };

  checkHasSetData = (dataType) => {
    var storeInfo = this.state.storeInfo;
    switch (dataType) {
      case "PROFILE":
        return (
          storeInfo.businessProfile.hasOwnProperty("accountDetails") &&
          storeInfo.businessProfile.accountDetails.hasOwnProperty("name") &&
          storeInfo.businessProfile.accountDetails.name.length > 0
        );
      default:
        return false;
    }
  };

  loadPage = () => {
    var stepState = this.state.stepState;
    if (this.state.storeID === "") {
      return (
        <div className="w-full flex justify-center items-center">
          <CircularProgress className={this.props.classes.highlightText} />
        </div>
      );
    } else {
      switch (stepState) {
        case 0:
          return (
            <NewShopBusinessForm
              storeID={this.state.storeID}
              handleStepperNextButton={this.props.handleStepperNextButton}
              pushTrackingData={this.pushTrackingData}
              dataLabel="initial business profile page"
            />
          );

        default:
          if (
            this.props.businessProfile &&
            this.state.storeID.length > 0 &&
            this.props.businessProfile.hasOwnProperty("verifyInfo") &&
            this.state.verificationInfo.isVerified &&
            this.state.verificationInfo.pinCode.length > 0
          ) {
            let businessProfile = this.props.businessProfile;
            businessProfile.registeredTimestamp = Date.now();
            this.props.saveBusinessProfile(businessProfile, {
              storeID: this.state.storeID,
            });
          }
          window.location.href = "platform/dashboard";
      }
    }
  };

  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 6000,
    };
    const { classes } = this.props;
    return this.state.isProcessPageState ? (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgress className={classes.highlightText} />
      </div>
    ) : (
        <div
          id="login-page"
          className={
            "flex flex-col h-full w-full relative " +
            (i18n.language.includes("en") ? "en" : "th")
          }
        >
          <div className="md:block absolute hidden md:ml-64 md:mt-32">
            <a href="https://arislab.ai/">
              <img className="login-logo" src={logo} />
            </a>
          </div>
          <div className="login-language-menu">
            <SmallLanguageMenu />
          </div>

          <div className="flex h-screen justify-center items-center">
            <div className="md:flex hidden justify-center mt-8 md:w-1/2 items-center">
              <div className="w-3/4">
                <Slider {...settings}>
                  <div>
                    <img alt="Img 1" src={image1} />
                  </div>
                  <div>
                    <img alt="Img 2" src={image2} />
                  </div>
                </Slider>
              </div>
            </div>
            <div className="login-right-container sm:ml-88 flex md:px-0 px-4 md:w-1/2">
              {this.loadPage()}
            </div>
          </div>
        </div>
      );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      saveBusinessProfile: Actions.saveBusinessProfile,
      handleStepperNextButton: Actions.handleStepperNextButton,
      handleSetStepperStepButton: Actions.handleSetStepperStepButton,
      handleStepperBackButton: Actions.handleStepperBackButton,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    businessProfile: storeManagement.businessProfile,
    stepState: storeManagement.LayoutReducer.stepState,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(Landing)
    )
  )
);
