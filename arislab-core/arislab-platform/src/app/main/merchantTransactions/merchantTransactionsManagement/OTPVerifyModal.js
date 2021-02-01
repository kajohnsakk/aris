import React, { Component } from "react";
import { Trans } from "react-i18next";
import { Fab, CircularProgress } from "@material-ui/core";
import OTPInput from "otp-input-react";

class OTPVerifyModal extends Component {
  state = {
    inputPin: "",
    isLoading: false,
    countdown: 300,
    countdownInterval: {},
    verifyFailedCount: 0,
  };

  handlePIN = (event) => {
    this.setState({
      inputPin: event,
      isLoading: false,
    });
  };

  componentDidMount() {
    let countdownInterval = setInterval(() => {
      if (this.state.countdown !== 0)
        this.setState({ countdown: this.state.countdown - 1 });
    }, 1000);
    this.setState({ countdownInterval: countdownInterval });
  }

  componentWillUnmount() {
    clearInterval(this.state.countdownInterval);
  }

  render() {
    const props = this.props;
    const inputPin = this.state.inputPin;
    return (
      <div className="mt-20 flex flex-col">
        <div className="flex flex-col mx-4 items-start">
          <div className="text-2xl">
            <Trans i18nKey="transactions.otp-verify-message">
              OTP Verification
            </Trans>
          </div>
          <div className="text-md merchant-pink mt-32">
            <Trans i18nKey="transactions.enter-otp">
              Enter the OTP you received from
            </Trans>
          </div>
          <div className="text-md">
            {props.businessProfile.storeInfo.businessProfile.businessEmail}
          </div>
          <div className="mt-32 self-center">
            <div className="pin-input-container mx-auto">
              <OTPInput
                className="flex justify-between pin-input"
                value={inputPin}
                onChange={(event) => {
                  this.handlePIN(event);
                }}
                autoFocus
                secure
                inputClassName="my-6 text-grey m-4 xs:m-0"
                inputStyles={{ marginRight: "6px" }}
                OTPLength={6}
                otpType="number"
                pattern="[0-9]*"
                disabled={false}
              />
            </div>
          </div>
          <div className="mt-20 flex flex-row">
            {this.state.countdown !== 0 || props.isSendingOTP ? (
              <div
                className="text-grey text-lg font-light thumbs"
                disabled={true}
                style={{ marginLeft: "6px" }}
              >
                <Trans i18nKey="transactions.resend-otp">Resend OTP</Trans>
              </div>
            ) : (
              <button
                className="merchant-pink text-lg font-light thumbs"
                disabled={false}
                style={{ marginLeft: "6px" }}
                onClick={() => {
                  this.props.sendOTP();
                  this.setState({ countdown: 300 });
                  this.setState({ verifyFailedCount: 0 });
                }}
              >
                <Trans i18nKey="transactions.resend-otp">Resend OTP</Trans>
              </button>
            )}
            <div className="merchant-pink text-lg font-light mx-4">
              ({this.state.countdown})
            </div>
          </div>
          {(this.state.isLoading && !props.isNotCorrectOTP) ||
          props.isSendingOTP ? (
            <div className="mt-20 self-center">
              <CircularProgress color="primary" className="mr-8" size={50} />
            </div>
          ) : (
            <div />
          )}
          {props.isNotCorrectOTP && this.state.verifyFailedCount < 3 ? (
            <div className="mt-20 text-md text-red self-center">
              <Trans i18nKey="transactions.wrong-otp">
                the OTP you had entered is not correct
              </Trans>{" "}
              ({this.state.verifyFailedCount})
            </div>
          ) : this.state.verifyFailedCount >= 3 ? (
            <div className="mt-20 text-md text-red self-center">
              <Trans i18nKey="transactions.failed-otp">
                You have entered the otp incorrectly more than 3 times. Please
                close this window and request the new OTP.
              </Trans>
            </div>
          ) : (
            <div />
          )}
          <div className="flex flex-row self-center justify-center mt-32">
            <Fab
              variant="extended"
              aria-label="sendOTP"
              className="merchant-button px-40"
              disabled={
                this.state.isLoading || this.state.verifyFailedCount >= 3
              }
              onClick={() => {
                this.setState({ isLoading: true }, () => {
                  props.verifyOTP(inputPin);
                  this.setState({ inputPin: "" });
                  this.setState({
                    verifyFailedCount: this.state.verifyFailedCount + 1,
                  });
                });
              }}
            >
              <Trans i18nKey="transactions.verify-otp-button">Submit</Trans>
            </Fab>
          </div>
        </div>
      </div>
    );
  }
}

export default OTPVerifyModal;
