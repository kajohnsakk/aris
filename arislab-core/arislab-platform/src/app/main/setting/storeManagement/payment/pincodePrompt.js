import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Fab, Divider } from "@material-ui/core";
import * as Actions from "../../../setting/store/actions";
import reducer from "../../../setting/store/reducers";
import withReducer from "app/store/withReducer";
import * as authActions from "app/auth/store/actions";
import { bindActionCreators } from "redux";
import OTPInput from "otp-input-react";
import { Trans, withTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import "../../../merchantTransactions/merchantTransactionsManagement/MerchantTransactions.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { sha256 } from 'js-sha256';
import { UtilityManager } from "../../../modules/UtilityManager";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
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

class PincodePrompt extends React.Component {
  state = {
    PIN: "",
    error: "",
    verifyInfo: null,
    storeID: "",
  };

  componentDidMount() {
    this.setState({ storeID: this.props.storeID });
    // this.updateBusinessProfileState();
  }

  // updateBusinessProfileState = () => {
  //     this.props.getBusinessProfileOnly({
  //         storeID: this.props.storeID
  //     });
  // };

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //     if (!this.state.verifyInfo && this.props.businessProfile) {
  //         this.updateFormState();
  //     }
  // }

  // updateFormState = () => {
  //     if (this.props.businessProfile && this.props.businessProfile.verifyInfo){
  //         if (this.props.businessProfile.verifyInfo){
  //             this.setState({
  //                 verifyInfo: this.props.businessProfile.verifyInfo
  //             });
  //         }
  //     }
  // };

  handlePIN = (event) => {
    this.setState({
      PIN: event,
    });
  };

  handleSubmit = () => {
    //Complete all steps then if pass, toggleDialog

    var pin = this.state.PIN;
    UtilityManager.getInstance()
      .checkPinCode(pin)
      .then((result) => {
        var isCorrectPinCode = false;
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if (this.state.storeID === result[i]["storeID"]) {
              isCorrectPinCode = true;
              break;
            }
          }
        }

        if (isCorrectPinCode) {
          this.props.toggleDialog();
        } else {
          this.setState({
            error: i18n.t("transactions.pin-code-error"),
          });
        }
      });

    // let hashedPIN = sha256(this.state.PIN);
    // if (hashedPIN === this.state.verifyInfo.pinCode){
    //     this.props.toggleDialog()
    // }else{
    //     this.setState({
    //         error: <Trans i18nKey="settings.payments.wrong-pin-code">Wrong pin code</Trans>
    //     })
    // }
  };

  resetError = () => {
    this.setState({ error: "" });
  };

  render() {
    return (
      <div className="store-management-body-container w-full lg:w-2/3 md:my-32 lg:rounded overflow-hidden shadow inline-block">
        <div className="flex flex-col justify-center px-64 py-32 my-64">
          <div className="my-12 flex content-center justify-center">
            <img
              alt=""
              src="assets/images/logos/aris-logo.png"
              width="100px"
              className="flex h-full"
            />
          </div>

          <div className="text-xl font-bold my-4 flex content-center justify-center">
            <Trans i18nKey="settings.payments.enter-pin-code">
              Enter pin code
            </Trans>
          </div>

          <div className="text-lg text-gray my-4 flex content-center justify-center">
            <Trans i18nKey="settings.payments.verify-yourself">
              To verify yourself
            </Trans>
          </div>

          <Divider className="mx-64 mt-12 mb-24 bg-pink" />

          <div className="mb-24 text-red flex content-center justify-center">
            {this.state.error}
          </div>

          <div className="mb-24 content-center">
            <OTPInput
              className="flex justify-center"
              value={this.state.PIN}
              onChange={(event) => {
                this.handlePIN(event);
                this.resetError();
              }}
              autoFocus
              secure
              inputClassName="flex my-6 border-solid border-1 border-gray-600 text-grey mx-12"
              inputStyles={!this.props.isLastChild && { marginRight: 0 }}
              OTPLength={6}
              otpType="number"
              disabled={false}
            />
          </div>

          <div className="text-center">
            {/* <Fab variant="extended" aria-label="Next" className={classNames(classes.button, classes.highlightButton, "m-0 w-1/4")} onClick={this.handleSubmit} >
                            <span><Trans i18nKey="main.finish-btn">Finish</Trans></span>
                        </Fab> */}

            <Fab
              variant="extended"
              aria-label="Confirm"
              className="merchant-button mt-24 px-24"
              onClick={this.handleSubmit}
            >
              <Trans i18nKey="transactions.confirm">Confirm</Trans>
            </Fab>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfileOnly: Actions.getBusinessProfileOnly,
      logout: authActions.logoutUser,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    businessProfile: storeManagement.businessProfile,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(PincodePrompt))
    )
  )
);
