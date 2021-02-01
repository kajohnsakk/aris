import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { Trans, withTranslation } from "react-i18next";
import withReducer from "app/store/withReducer";
import Loading from "app/components/Loading";
import { withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import _ from "@lodash";
import axios from "axios";

import reducer from "app/store/reducers";

import * as Actions from "app/main/setting/store/actions";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import UtilityFunction from "app/main/modules/UtilityFunction";
import { UtilityManager } from "app/main/modules/UtilityManager";
import OTPVerifyModal from "app/components/Otp/OTPVerifyDialog";
import SendOTPModal from "app/components/Otp/SendOtpDialog";
import TermsModal from "./TermsModal";

import Modal from "app/main/merchantTransactions/merchantTransactionsManagement/Modal";

import * as AppConfig from "app/main/config/AppConfig";

import "./businessProfile.css";
import "../StoreManagement.css";

const host = AppConfig.API_URL;

const styles = (theme) => ({
  card: {
    backgroundColor: "#fff",
    maxWidth: "100%",
    [theme.breakpoints.up("md")]: {
      paddingBottom: theme.spacing.unit,
      overflow: "hidden",
      boxShadow:
        "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
      borderRadius: "4px",
      border: "2px solid transparent",
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
  button: {
    background: "#e83490",
    color: "#ffffff",
    fontWeight: "bold",
    border: "0px",
    "&:hover": {
      background: "#e83490",
      color: "#ffffff",
      fontWeight: "bold",
      border: "0px",
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  cardContent: {
    background: "#ffffff",
    padding: "0px",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing.unit * 2,
    },
  },
});
class NewShopBusinessForm extends Component {
  state = {
    form: null,
    name: "",
    phoneNo: "",
    OTP: "",
    disableOTPButton: false,
    smsInfo: {},
    error: "",
    isSubmitting: false,
    sendOTPModal: false,
    termsModal: false,
    OTPVerifyModal: false,
    isNotCorrectOTP: false,
    agree: false,
  };

  componentDidMount() {
    this.updateBusinessProfileState();
    if (this.props.businessProfile && !this.state.form) {
      this.updateFormState();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) { }

  handleChange = (event) => {
    let eventValue;
    if (
      event.target.name === "storeInfo['businessProfile']['businessPhoneNo']"
    ) {
      eventValue = event.target.value.replace(/-/g, "");
    } else {
      eventValue = event.target.value;
    }
    this.setState({
      form: _.set(
        { ...this.state.form },
        event.target.name,
        event.target.type === "checkbox" ? event.target.checked : eventValue
      ),
    });
  };

  handleOTP = (event) => {
    this.setState({
      OTP: event,
      error: "",
    });
  };

  updateFormState = () => {
    this.setState({
      form: this.props.businessProfile,
    });
  };

  updateBusinessProfileState = () => {
    const storeID = this.props.storeID;
    this.props.getBusinessProfile({
      storeID: storeID,
    });
  };

  saveStore = async () => {
    try {
      var verifyInfo = {
        pinCode: "000000",
        isVerified: true,
      };

      var storeInfoObject = { ...this.state.form, verifyInfo };
      if (storeInfoObject && storeInfoObject.hasOwnProperty("storeInfo")) {
        if (
          storeInfoObject.storeInfo &&
          storeInfoObject.storeInfo.hasOwnProperty("paymentInfo")
        ) {
          if (
            storeInfoObject.storeInfo.paymentInfo &&
            storeInfoObject.storeInfo.paymentInfo.hasOwnProperty("gbPayInfo")
          ) {
            if (
              storeInfoObject.storeInfo.paymentInfo.gbPayInfo &&
              storeInfoObject.storeInfo.paymentInfo.gbPayInfo.token === ""
            ) {
              var gbpayToken = await UtilityManager.getInstance().getDefaultGBPayToken();
              storeInfoObject.storeInfo.paymentInfo.gbPayInfo.token =
                gbpayToken["token"];
            }
          }
        }
      }

      if (
        storeInfoObject.registeredTimestamp === 0 ||
        !storeInfoObject.hasOwnProperty("registeredTimestamp")
      ) {
        storeInfoObject.registeredTimestamp = Date.now();
      }

      this.setState({ error: false });

      await this.props.saveBusinessProfile(storeInfoObject, {
        storeID: this.props.storeID,
      });

      await this.props.savePaymentInfo(storeInfoObject, {
        storeID: this.props.storeID,
      });

      return;
    } catch (error) {
      throw error;
    }
  };

  onConfirm = async () => {
    try {
      this.setState({ isSubmitting: true });
      await this.saveStore();
      window.location.href = "platform/dashboard";
    } catch (error) {
      this.setState({ isSubmitting: false });
      alert(`Sorry, something went wrong "${error.message}"`);
    }
  };

  toggleDialog = (dialogName) => {
    if (this.state[dialogName]) {
      this.setState({ error: "", errorMessage: "" });
    }
    this.setState({ [dialogName]: !this.state[dialogName] });
  };

  verifyOTP = async (otp) => {
    this.setState({ isNotCorrectOTP: false });
    try {
      await axios.post(host + "otp/verify", {
        otp: otp,
        storeID: this.props.businessProfile.storeID,
      });
      this.toggleDialog("OTPVerifyModal");
      this.onConfirm();
    } catch (error) {
      this.setState({ isNotCorrectOTP: true });
    }
  };

  sendOTP = async (email) => {
    this.setState({ isSendingOTP: true });
    try {
      await axios.post(host + "otp/send", {
        email: email,
        storeID: this.props.storeID,
      });
      if (!this.state.OTPVerifyModal) {
        this.toggleDialog("OTPVerifyModal");
        this.toggleDialog("sendOTPModal");
      }
      this.setState({ isSendingOTP: false });
    } catch (error) {
      this.setState({ isSendingOTP: false });
    }
  };

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
    const { form } = this.state;
    var name;
    var email;

    if (form && form.hasOwnProperty("storeInfo")) {
      if (form.storeInfo && form.storeInfo.hasOwnProperty("businessProfile")) {
        if (
          form.storeInfo.businessProfile &&
          form.storeInfo.businessProfile.hasOwnProperty("accountDetails")
        ) {
          if (
            form.storeInfo.businessProfile.accountDetails &&
            form.storeInfo.businessProfile.accountDetails.hasOwnProperty("name")
          ) {
            name = form.storeInfo.businessProfile.accountDetails.name;
          }
        }

        if (
          form.storeInfo.businessProfile &&
          form.storeInfo.businessProfile.hasOwnProperty("businessEmail")
        ) {
          email = form.storeInfo.businessProfile.businessEmail;
        }
      }
    }

    return (
      form && (
        <div className="w-full flex inline main-font">
          <Modal
            fullWidth={true}
            isDisplayHorizontalDialog={this.state.termsModal}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            dialogName={"termsModal"}
          >
            <TermsModal toggleDialog={this.toggleDialog} />
          </Modal>
          <Modal
            fullWidth={true}
            isDisplayHorizontalDialog={this.state.sendOTPModal}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            dialogName={"sendOTPModal"}
            maxWidth="lg"
          >
            <SendOTPModal
              toggleDialog={this.toggleDialog}
              sendOTP={() => this.sendOTP(email)}
              email={email}
            />
          </Modal>
          <Modal
            fullWidth={true}
            isDisplayHorizontalDialog={this.state.OTPVerifyModal}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            dialogName={"OTPVerifyModal"}
          >
            <OTPVerifyModal
              toggleDialog={this.toggleDialog}
              verifyOTP={this.verifyOTP}
              isNotCorrectOTP={this.state.isNotCorrectOTP}
              isSendingOTP={this.state.isSendingOTP}
              sendOTP={this.sendOTP}
            />
          </Modal>
          <div className="flex my-0 w-full">
            <div className="flex w-full md:justify-start">
              <div className="login-box flex flex-col">
                <div className="p-20 mt-24">
                  <div className="font-bold text-3xl mb-2 text-center login-text-dark-grey">
                    <Trans i18nKey="settings.businessProfile.business-profile-confirm-identity">
                      Confirm your information
                    </Trans>
                  </div>
                  <div className="mb-2 text-center login-text-light-grey">
                    <Trans i18nKey="settings.businessProfile.business-profile-for-accuracy">
                      To ensure accurate information
                    </Trans>
                  </div>
                </div>
                <div className="w-4/5 xs:w-full md:text-center mx-auto login-text-grey">
                  <div className="flex flex-col mb-12">
                    <label className="text-left mb-4">
                      <Trans i18nKey="settings.businessProfile.business-profile-form-input-name-label">
                        Name
                      </Trans>
                    </label>
                    <input
                      className="login"
                      name="storeInfo['businessProfile']['accountDetails']['name']"
                      value={name}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="flex flex-col mb-12">
                    <label className="text-left mb-4">
                      <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-email-label">
                        Email
                      </Trans>
                      *
                    </label>
                    <input
                      className="login"
                      name="storeInfo['businessProfile']['businessEmail']"
                      value={email}
                      onChange={this.handleChange}
                    />
                    <div className="flex text-left text-xs mt-4 text-red h-3">
                      {!UtilityFunction.validateStringData(
                        "EMAIL",
                        this.state.form.storeInfo.businessProfile.businessEmail
                      ) ? (
                          <Trans i18nKey="settings.businessProfile.business-profile-email-must-valid-format">
                            Email must valid format
                          </Trans>
                        ) : (
                          " "
                        )}
                    </div>
                  </div>
                </div>
                <br />
                <div
                  className="flex justify-center px-4 text-center font-light en inline-flex items-center"
                  style={{ fontSize: 16 }}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      this.setState({ agree: e.target.checked });
                    }}
                    className="form-checkbox h-5 w-5 text-pink mr-2"
                    style={{ height: 20, width: 20 }}
                  />
                  &nbsp;{" "}
                  <Trans i18nKey="settings.businessProfile.business-profile-agree">
                    ยอมรับข้อกำหนดและเงื่อนไขของทาง Arislab.ai
                  </Trans>
                </div>
                <div
                  className="flex justify-center"
                  onClick={() => {
                    this.toggleDialog("termsModal");
                  }}
                >
                  <a className="login-a en cursor-pointer">
                    <Trans i18nKey="settings.businessProfile.business-profile-agree-terms-conditions">
                      terms & conditions
                    </Trans>
                  </a>
                </div>
                <br />
                <div className="px-20 sm:px-40 pb-32 mt-18 text-right mt-12">
                  <Fab
                    className="login-primary-button login height-46 w-full"
                    onClick={() => {
                      this.toggleDialog("sendOTPModal");
                    }}
                    disabled={
                      !UtilityFunction.validateStringData(
                        "EMAIL",
                        this.state.form.storeInfo.businessProfile.businessEmail
                      ) ||
                      this.state.isSubmitting ||
                      !this.state.agree
                    }
                  >
                    {this.state.isSubmitting && (
                      <Loading size={24} className="mr-12" />
                    )}
                    <Trans i18nKey="main.save-btn">Save</Trans>
                  </Fab>
                </div>
                <div className="flex justify-center mb-28">
                  <div className="progress-container flex">
                    <div className="login-step-active">
                      <div>1</div>
                      <div className="login-step-massege hidden sm:block">
                        <Trans i18nKey="userMenu.login">Login</Trans>
                      </div>
                    </div>
                    <div className="login-step-line-active" />
                    <div className="login-step-active">
                      <div>2</div>
                      <div className="login-step-massege-active hidden sm:block">
                        <Trans i18nKey="settings.businessProfile.confirmation">
                          Confirmation
                        </Trans>
                      </div>
                    </div>
                    <div className="login-step-line" />
                    <div className="login-step">
                      <div>3</div>
                      <div className="login-step-massege hidden sm:block">
                        <Trans i18nKey="settings.businessProfile.complete">
                          Complete
                        </Trans>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      saveBusinessProfile: Actions.saveBusinessProfile,
      savePaymentInfo: Actions.savePaymentInfo,
      insertOtp: Actions.insertOtp,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    businessProfile: storeManagement.businessProfile,
    sms: storeManagement.sms,
    otp: storeManagement.otp,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(NewShopBusinessForm))
    )
  )
);
