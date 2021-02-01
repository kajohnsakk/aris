import React, { Component } from "react";

import withReducer from "app/store/withReducer";
import reducer from "../../store/reducers";
import * as Actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import _ from "@lodash";
import PinPrompt from "../payment/PinPrompt";
import "../StoreManagement.css";
import { UtilityManager } from "../../../modules/UtilityManager";
import { TextField } from "@material-ui/core";
import classNames from "classnames";
import InputMask from "react-input-mask";

import i18n from "../../../../i18n";

import { Trans, withTranslation } from "react-i18next";

const styles = (theme) => ({
  card: {
    backgroundColor: "#fff",
    maxWidth: "100%",
    [theme.breakpoints.up("md")]: {
      paddingBottom: theme.spacing.unit,
      // border: 'solid 1px #ededed',
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
    // paddingTop: theme.spacing.unit,
    // paddingBottom: theme.spacing.unit,
    padding: "0px",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing.unit * 2,
    },
  },
});

class BusinessProfile extends Component {
  state = {
    form: null,
    isInvalidDataFormat: {},
    isDisplayPinPrompt: true,
    error: "",
  };

  componentDidMount() {
    this.updateBusinessProfileState();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.businessProfile && !this.state.form) {
      this.updateFormState();
    }
  }

  handleChange = (event) => {
    this.setState({
      form: _.set(
        { ...this.state.form },
        event.target.name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
      ),
    });
  };

  updateFormState = () => {
    this.setState({
      form: this.props.businessProfile,
    });
  };

  updateBusinessProfileState = () => {
    const storeID = this.props.storeID;

    this.props.getBusinessProfileOnly({
      storeID: storeID,
    });
  };

  checkExternalFunctionIsExist = () => {
    return typeof this.props.handleStepperNextButton === "function";
  };

  validateFieldDataFormat = (fieldName, fieldValue, regex) => {
    let resultTest = new RegExp(regex).test(fieldValue);
    Object.assign(this.state.isInvalidDataFormat, { [fieldName]: false });

    if (!resultTest) {
      this.setState({
        isInvalidDataFormat: _.set(
          { ...this.state.isInvalidDataFormat },
          fieldName,
          true
        ),
      });
    } else {
      this.setState({
        isInvalidDataFormat: _.set(
          { ...this.state.isInvalidDataFormat },
          fieldName,
          false
        ),
      });
    }
    return resultTest;
  };

  doValidateField = async (fieldList) => {
    // let isAllChecked = false;
    let isAllPassed = false;

    let tempFields = fieldList;
    tempFields = tempFields.map((v) => ({ ...v, pass: false }));

    for (let i = 0; i < tempFields.length; i++) {
      let fieldObj = tempFields[i];

      if (!fieldObj["fieldValue"]) {
        fieldObj["pass"] = false;
      } else {
        fieldObj["pass"] = true;
        if (fieldObj["useRegex"]) {
          fieldObj["pass"] = false;

          const resultValidateFieldDataFormat = await this.validateFieldDataFormat(
            fieldObj["fieldName"],
            fieldObj["fieldValue"],
            fieldObj["regex"]
          );
          if (resultValidateFieldDataFormat) {
            fieldObj["pass"] = true;
          }
        }
      }
    }
    // isAllChecked = true;
    const countNotPassedFields = await tempFields.filter((field) => {
      return field["pass"] === false;
    });

    if (countNotPassedFields.length > 0) {
      isAllPassed = false;
    } else {
      isAllPassed = true;
    }

    return isAllPassed;
  };

  handleSavePage = async (event) => {
    event.preventDefault();

    const fieldList = [
      {
        fieldName: "businessPhoneNo",
        fieldValue: this.state.form.storeInfo.businessProfile.businessPhoneNo,
        useRegex: true,
        regex: /(([0-9]){3}-*([0-9]){3}-*([0-9]){4})/,
      },
      {
        fieldName: "businessEmail",
        fieldValue: this.state.form.storeInfo.businessProfile.businessEmail,
        useRegex: true,
        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      },
    ];

    const resultValidateField = await this.doValidateField(fieldList);

    if (resultValidateField) {
      this.props.pushTrackingData("Update", "Update " + this.props.dataLabel);
      if (this.checkExternalFunctionIsExist()) {
        this.props.saveBusinessProfile(this.state.form, {
          storeID: this.props.storeID,
        });
        this.props.handleStepperNextButton();
      } else {
        this.props.saveBusinessProfile(this.state.form, {
          storeID: this.props.storeID,
        });
      }
    }
  };

  submitPin = (pin) => {
    if (pin === "") {
      this.setState({ error: i18n.t("transactions.pin-code-error") });
    }

    UtilityManager.getInstance()
      .checkPinCode(pin)
      .then((result) => {
        var isCorrectPinCode = false;
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if (this.props.storeID === result[i]["storeID"]) {
              isCorrectPinCode = true;
              break;
            }
          }
        }

        if (isCorrectPinCode) {
          this.setState({ isDisplayPinPrompt: false, error: "" });
        } else {
          this.setState({ error: i18n.t("transactions.pin-code-error") });
        }
      });
  };

  resetError = () => {
    this.setState({ error: "" });
  };

  clickSaveBtn = (event) => {
    this.props.pushTrackingData("Click", "Save business profile button");
  };

  render() {
    const { classes } = this.props;
    const { form } = this.state;

    let businessProfile_StoreName = {};
    let businessProfile_Email = {};
    let businessProfile_PhoneNo = {};

    if (form !== null) {
      businessProfile_StoreName = {
        defaultValue: this.state.form.storeInfo.businessProfile.accountDetails
          .name,
      };

      businessProfile_Email = {
        defaultValue: this.state.form.storeInfo.businessProfile.businessEmail,
      };

      businessProfile_PhoneNo = {
        defaultValue: this.state.form.storeInfo.businessProfile.businessPhoneNo,
      };

      if (this.state.isInvalidDataFormat.businessEmail) {
        businessProfile_Email["error"] = true;
        businessProfile_Email["helperText"] = i18n.t(
          "settings.businessProfile.business-profile-email-must-valid-format"
        );
      }

      if (this.state.isInvalidDataFormat.businessPhoneNo) {
        businessProfile_PhoneNo["error"] = true;
        businessProfile_PhoneNo["helperText"] = i18n.t(
          "settings.businessProfile.business-profile-mobile-phone-no-must-10-digit"
        );
      }
    }

    return (
      form && (
        <form onSubmit={this.handleSavePage}>
          <div className={classes.card}>
            <div className={classNames(classes.cardContent, "p-24")}>
              {this.state.isDisplayPinPrompt ? (
                <div className="py-24">
                  <PinPrompt
                    storeID={this.props.storeID}
                    isDisplayPinPrompt={this.state.isDisplayPinPrompt}
                    // toggleDialog={this.toggleDialog}
                    submitPin={this.submitPin}
                    error={this.state.error}
                    resetError={this.resetError}
                    pushTrackingData={this.props.pushTrackingData}
                  />
                </div>
              ) : (
                <div>
                  <div className="sm:w-1/2 xs:w-full md:text-center mx-auto">
                    <TextField
                      required
                      id="outlined-name"
                      name="storeInfo['businessProfile']['accountDetails']['name']"
                      // label="Store name"
                      label={
                        <Trans i18nKey="settings.businessProfile.business-profile-form-input-name-label">
                          Name
                        </Trans>
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      onChange={this.handleChange}
                      {...businessProfile_StoreName}
                    />
                  </div>

                  <div className="sm:w-1/2 xs:w-full md:text-center mx-auto">
                    <TextField
                      required
                      type="email"
                      id="outlined-email"
                      name="storeInfo['businessProfile']['businessEmail']"
                      label={
                        <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-email-label">
                          Business email
                        </Trans>
                      }
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      onChange={this.handleChange}
                      {...businessProfile_Email}
                    />
                  </div>

                  <div className="sm:w-1/2 xs:w-full md:text-center mx-auto">
                    <InputMask
                      mask="999-999-9999"
                      // maskChar = "_ "
                      onChange={this.handleChange}
                      {...businessProfile_PhoneNo}
                    >
                      {() => (
                        <TextField
                          required
                          pattern="[0-9]*"
                          id="outlined-number"
                          name="storeInfo['businessProfile']['businessPhoneNo']"
                          label={
                            <Trans i18nKey="settings.businessProfile.business-profile-form-input-company-business-phone-no-label">
                              Business phone
                            </Trans>
                          }
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          // onChange={this.handleChange}
                          {...businessProfile_PhoneNo}
                        />
                      )}
                    </InputMask>
                  </div>
                </div>
              )}
            </div>

            {this.state.isDisplayPinPrompt ? null : (
              <div className="px-20 sm:px-40 py-20 text-right store-management-footer">
                <button
                  className="button-primary"
                  type="submit"
                  onClick={this.clickSaveBtn}
                >
                  {this.checkExternalFunctionIsExist() ? (
                    <Trans i18nKey="main.next-btn">Next</Trans>
                  ) : (
                    <Trans i18nKey="main.save-btn">Save</Trans>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      )
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfileOnly: Actions.getBusinessProfileOnly,
      saveBusinessProfile: Actions.saveBusinessProfile,
      // handleStepperNextButton: Actions.handleStepperNextButton
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
      )(withTranslation()(BusinessProfile))
    )
  )
);
