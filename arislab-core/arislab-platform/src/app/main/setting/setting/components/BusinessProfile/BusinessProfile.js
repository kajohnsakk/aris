import React, { Component } from "react";
import _ from "@lodash";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { Divider, Switch, TextField } from "@material-ui/core";

import InputMask from "react-input-mask";
import AlertModal from "../shared-components/AlertModal";
import Modal from "../../../../merchantTransactions/merchantTransactionsManagement/Modal";
import SendOTPModal from "../../../../merchantTransactions/merchantTransactionsManagement/SendOTPModal";
import OTPVerifyModal from "../../../../merchantTransactions/merchantTransactionsManagement/OTPVerifyModal";
import axios from "axios";

import * as AppConfig from "../../../../config/AppConfig";
import { Trans, withTranslation } from "react-i18next";

import UtilityFunction from "../../../../modules/UtilityFunction";

const styles = (theme) => ({});

const host = AppConfig.API_URL;
class BusinessProfile extends Component {
  state = {
    storeID: "",
    storeBusinessProfile: {},
    oldStoreBusinessProfile: {},
    companyInfo: {},
    personalInfo: {},
    useBusinessFeatures: false,
    displayAlertModal: false,
    errorMessageI18n: "",
    sendOTPModal: false,
    OTPVerifyModal: false,
    isNotCorrectOTP: false,
    isSendingOTP: false,
    count: 0,
    data: {
      useBusinessFeatures: false,
    },
  };

  async componentDidMount() {
    const storeBusinessProfile = await this.getBusinessProfileFromDB();
    this.setState({
      storeID: this.props.storeID,
      oldStoreBusinessProfile: storeBusinessProfile.data,
    });

    this.setData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.storeID !== prevProps.storeID) {
      this.setState({ storeID: this.props.storeID });
    }

    if (
      !_.isEqual(
        this.state.storeBusinessProfile,
        this.props.storeBusinessProfile
      )
    ) {
      this.setState({ storeBusinessProfile: this.props.storeBusinessProfile });
    }

    if (!_.isEqual(this.state.companyInfo, this.props.companyInfo)) {
      this.setState({ companyInfo: this.props.companyInfo });
    }

    if (!_.isEqual(this.state.personalInfo, this.props.personalInfo)) {
      this.setState({ personalInfo: this.props.personalInfo });
    }

    if (this.state.useBusinessFeatures !== this.props.useBusinessFeatures) {
      this.setState({ useBusinessFeatures: this.props.useBusinessFeatures });
    }

    if (this.state.useBusinessFeatures !== this.props.useBusinessFeatures) {
      this.setState({ useBusinessFeatures: this.props.useBusinessFeatures });
    }
  }

  getBusinessProfileFromDB = () => {
    return axios.get(host + "storeConfig/storeID/" + this.props.storeID);
  };

  toggleAlertModal = () => {
    this.setState({
      displayAlertModal: !this.state.displayAlertModal,
      errorMessageI18n: "",
    });
  };

  handleSavePage = () => {
    let sections = "";
    let saveDate = false;
    let errorMessageI18n = "error-message.something-went-wrong";

    const data = this.state.data;

    const businessProfileInfo = {
      businessProfile: {
        accountDetails: {
          businessName: data.businessName,
          name: data.accountName,
        },
        businessAddress: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          country: "",
          postalCode: "",
          state: "",
        },
        businessEmail: data.email,
        businessPhoneNo: data.telephoneNumber,
      },
      config: {
        useBusinessFeatures: false,
      },
      personalInfo: {
        addressInfo: {
          addressLine1: data.personalAddressLine1,
          addressLine2: data.personalAddressLine2,
          city: data.personalCity,
          country: "",
          postalCode: data.personalPostalCode,
          state: "",
        },

        idCard: data.personalCardID,
        name: data.personalName,
      },
    };

    const companyInfo = {
      companyInfo: {
        addressInfo: {
          addressLine1: data.companyAddressLine1,
          addressLine2: data.companyAddressLine2,
          city: data.companyCity,
          country: "",
          postalCode: data.companyPostalCode,
          state: "",
        },
        name: data.companyName,
        email: data.companyEmail,
        registeredAddressInfo: {
          addressLine1: data.companyRegisteredAddressLine1,
          addressLine2: data.companyRegisteredAddressLine2,
          city: data.companyRegisteredCity,
          country: "",
          postalCode: data.companyRegisteredPostalCode,
          state: "",
        },
        taxNumber: data.companyTaxNumber,
      },
      config: {
        useBusinessFeatures: true,
      },
    };

    const storeInfo = data.useBusinessFeatures
      ? companyInfo
      : businessProfileInfo;

    if (data.useBusinessFeatures) {
      if (this.checkCompanyTaxNumberIsValid(storeInfo.companyInfo.taxNumber)) {
        saveDate = true;
        sections = "COMPANY_PROFILE";
        this.props.pushTrackingData(
          "Click",
          "Click save company profile button"
        );
      } else {
        errorMessageI18n = "error-message.tax-number-invalid";
      }
    } else {
      saveDate = true;
      sections = "BUSINESS_PROFILE";
      this.props.pushTrackingData(
        "Click",
        "Click save business profile button"
      );
    }

    if (saveDate) {
      this.props.saveBusinessProfileSections(sections, storeInfo);
      window.location.reload();
    } else {
      this.setState({
        displayAlertModal: true,
        errorMessageI18n: errorMessageI18n,
      });
    }
  };

  checkCompanyTaxNumberIsValid = (companyTaxNumber) => {
    return companyTaxNumber.length === 13;
  };

  sendOTP = async () => {
    this.setState({ isSendingOTP: true });
    try {
      let OTPResponse = await axios.post(host + "otp/send", {
        email: this.state.oldStoreBusinessProfile.storeInfo.businessProfile
          .businessEmail,
        storeID: this.props.businessProfile.storeID,
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

  verifyOTP = async (otp) => {
    this.setState({ isNotCorrectOTP: false });
    try {
      let OTPResponse = await axios.post(host + "otp/verify", {
        otp: otp,
        storeID: this.props.businessProfile.storeID,
      });
      this.toggleDialog("OTPVerifyModal");
      this.handleSavePage();
    } catch (error) {
      this.setState({ isNotCorrectOTP: true });
    }
  };

  toggleDialog = (dialogName) => {
    if (this.state[dialogName]) {
      this.setState({ error: "", errorMessage: "" });
    }
    this.setState({ [dialogName]: !this.state[dialogName] });
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

  checkEmailChange() {
    const data = this.state.data;
    let isEmailMatch = false;

    if (data.useBusinessFeatures) {
      const oldCompanyEmail = this.state.oldStoreBusinessProfile.storeInfo
        .companyInfo.email;
      const newCompanysEmail = this.state.data.companyEmail;

      isEmailMatch = oldCompanyEmail === newCompanysEmail;
    } else {
      const oldBusinessEmail = this.state.oldStoreBusinessProfile.storeInfo
        .businessProfile.businessEmail;
      const newBusinessEmail = this.state.data.email;

      isEmailMatch = oldBusinessEmail === newBusinessEmail;
    }

    if (!isEmailMatch) {
      this.toggleDialog("sendOTPModal");
      return;
    }

    this.handleSavePage();
  }

  handleChange(e) {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      },
    });
  }

  setData() {
    const { storeInfo } = this.state.oldStoreBusinessProfile;
    const { businessProfile, companyInfo, personalInfo, config } = storeInfo;

    this.setState({
      data: {
        useBusinessFeatures: !config.useBusinessFeatures,
      },
    });

    const data = {
      useBusinessFeatures: config.useBusinessFeatures,
      email: businessProfile.businessEmail,
      accountName: businessProfile.accountDetails.name,
      businessName: businessProfile.accountDetails.businessName,
      telephoneNumber: businessProfile.businessPhoneNo,
      personalName: personalInfo.name,
      personalCardID: personalInfo.idCard,
      personalAddressLine1: personalInfo.addressInfo.addressLine1,
      personalAddressLine2: personalInfo.addressInfo.addressLine2,
      personalCity: personalInfo.addressInfo.city,
      personalPostalCode: personalInfo.addressInfo.postalCode,
      companyName: companyInfo.name,
      companyEmail: companyInfo.email || businessProfile.businessEmail,
      companyTaxNumber: companyInfo.taxNumber,
      companyRegisteredAddressLine1:
        companyInfo.registeredAddressInfo.addressLine1,
      companyRegisteredAddressLine2:
        companyInfo.registeredAddressInfo.addressLine2,
      companyRegisteredCity: companyInfo.registeredAddressInfo.city,
      companyRegisteredPostalCode: companyInfo.registeredAddressInfo.postalCode,
      companyAddressLine1: companyInfo.addressInfo.addressLine1,
      companyAddressLine2: companyInfo.addressInfo.addressLine2,
      companyCity: companyInfo.addressInfo.city,
      companyPostalCode: companyInfo.addressInfo.postalCode,
    };

    this.setState({ data });
  }

  render() {
    const { t } = this.props;
    const { storeBusinessProfile, displayAlertModal, data } = this.state;

    return (
      <React.Fragment>
        {displayAlertModal ? (
          <AlertModal
            errorMessageI18n={this.state.errorMessageI18n}
            handleCancelBtn={this.toggleAlertModal}
          />
        ) : null}
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.sendOTPModal}
          toggleDialog={this.toggleDialog}
          dialogName={"sendOTPModal"}
          pushTrackingData={this.pushTrackingData}
          maxWidth="lg"
        >
          <SendOTPModal
            toggleDialog={this.toggleDialog}
            businessProfile={this.state.oldStoreBusinessProfile}
            pushTrackingData={this.pushTrackingData}
            sendOTP={this.sendOTP}
          />
        </Modal>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.OTPVerifyModal}
          toggleDialog={this.toggleDialog}
          dialogName={"OTPVerifyModal"}
          pushTrackingData={this.pushTrackingData}
        >
          <OTPVerifyModal
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            businessProfile={this.state.oldStoreBusinessProfile}
            verifyOTP={this.verifyOTP}
            isNotCorrectOTP={this.state.isNotCorrectOTP}
            isSendingOTP={this.state.isSendingOTP}
            sendOTP={this.sendOTP}
          />
        </Modal>
        {Object.entries(storeBusinessProfile).length > 0 ? (
          <div className="">
            <div className="flex flex-row justify-between items-center px-8 lg:px-12">
              <div className="flex">
                {t("settings.businessProfile.business-profile")}
              </div>
              <div className="flex flex-col lg:flex-row items-center">
                <div className="flex">
                  {t("settings.businessProfile.enabled-company-account")}
                </div>
                <div className="flex">
                  <Switch
                    color="primary"
                    checked={data.useBusinessFeatures}
                    value={true}
                    name="useBusinessFeatures"
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
            </div>
            <Divider />
            <div className="mb-8">
              {data.useBusinessFeatures ? (
                <div className="flex flex-col p-8 sm:p-12">
                  <div className="mb-24">
                    <div className="w-full mb-8">
                      {t("settings.businessProfile.company-profile")}
                    </div>
                    <div>
                      <div className="w-full sm:w-3/5">
                        <TextField
                          required
                          name="companyName"
                          label={t(
                            "settings.businessProfile.company-profile-form-input-name-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyName}
                        />
                      </div>
                      <div className="w-full sm:w-3/5">
                        <InputMask
                          mask="9999999999999"
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyTaxNumber}
                        >
                          {() => (
                            <TextField
                              required
                              pattern="[0-9]*"
                              name="companyTaxNumber"
                              label={t(
                                "settings.businessProfile.company-profile-form-input-company-tax-number-label"
                              )}
                              margin="dense"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        </InputMask>
                      </div>
                      <div className="w-full sm:w-3/5">
                        <TextField
                          type="email"
                          name="companyEmail"
                          label={t(
                            "settings.businessProfile.business-profile-form-input-company-business-email-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyEmail}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-24">
                    <div className="w-full mb-8">
                      {t("settings.businessProfile.registered-company-address")}
                    </div>
                    <div>
                      <div className="w-full sm:w-4/5">
                        <TextField
                          required
                          name="companyRegisteredAddressLine1"
                          label={t(
                            "settings.businessProfile.company-profile-form-input-address-line-1-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyRegisteredAddressLine1}
                        />
                      </div>
                      <div className="w-full sm:w-4/5">
                        <TextField
                          required
                          name="companyRegisteredAddressLine2"
                          label={t(
                            "settings.businessProfile.company-profile-form-input-address-line-2-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyRegisteredAddressLine2}
                        />
                      </div>
                      <div className="flex w-full">
                        <div className="w-full sm:w-1/2 sm:pr-8">
                          <TextField
                            required
                            name="companyRegisteredCity"
                            label={t(
                              "settings.businessProfile.business-profile-form-input-company-business-address-city-label"
                            )}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => this.handleChange(e)}
                            value={data.companyRegisteredCity}
                          />
                        </div>
                        <div className="w-full sm:w-1/2 sm:pl-8">
                          <TextField
                            required
                            name="companyRegisteredPostalCode"
                            label={t(
                              "settings.businessProfile.business-profile-form-input-company-business-address-postal-code-label"
                            )}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => this.handleChange(e)}
                            value={data.companyRegisteredPostalCode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="w-full mb-8">
                      {t("settings.businessProfile.company-address")}
                    </div>
                    <div className="w-full sm:w-4/5">
                      <TextField
                        required
                        name="companyAddressLine1"
                        label={t(
                          "settings.businessProfile.company-profile-form-input-address-line-1-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.companyAddressLine1}
                      />
                    </div>
                    <div className="w-full sm:w-4/5">
                      <TextField
                        required
                        name="companyAddressLine2"
                        label={t(
                          "settings.businessProfile.company-profile-form-input-address-line-2-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.companyAddressLine2}
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="w-full sm:w-1/2 sm:pr-8">
                        <TextField
                          required
                          name="companyCity"
                          label={t(
                            "settings.businessProfile.business-profile-form-input-company-business-address-city-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyCity}
                        />
                      </div>
                      <div className="w-full sm:w-1/2 sm:pl-8">
                        <TextField
                          required
                          name="companyPostalCode"
                          label={t(
                            "settings.businessProfile.business-profile-form-input-company-business-address-postal-code-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.companyPostalCode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col p-8 sm:p-12">
                  <div className="mb-24">
                    <div className="w-full mb-8">
                      {t("settings.businessProfile.general-profile")}
                    </div>
                    <div className="w-full sm:w-3/5">
                      <TextField
                        name="accountName"
                        label={t(
                          "settings.businessProfile.business-profile-form-input-name-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.accountName}
                      />
                    </div>
                    <div className="w-full sm:w-3/5">
                      <TextField
                        type="email"
                        name="email"
                        label={t(
                          "settings.businessProfile.business-profile-form-input-company-business-email-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.email}
                      />
                    </div>
                    <div className="w-full sm:w-3/5">
                      <InputMask
                        mask="999-999-9999"
                        onChange={(e) => this.handleChange(e)}
                        value={data.telephoneNumber}
                      >
                        {() => (
                          <TextField
                            pattern="[0-9]*"
                            name="telephoneNumber"
                            label={t(
                              "settings.businessProfile.business-profile-form-input-company-business-phone-no-label"
                            )}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </InputMask>
                    </div>
                  </div>

                  <div className="">
                    <div className="w-full mb-8">
                      <Trans i18nKey="settings.businessProfile.personal-profile">
                        Personal Profile
                      </Trans>
                    </div>
                    <div className="w-full sm:w-3/5">
                      <TextField
                        name="personalName"
                        label={t(
                          "settings.businessProfile.personal-profile-form-input-name-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.personalName}
                      />
                    </div>
                    <div className="w-full sm:w-2/5">
                      <InputMask
                        mask="9999999999999"
                        onChange={(e) => this.handleChange(e)}
                        value={data.personalCardID}
                      >
                        {() => (
                          <TextField
                            pattern="[0-9]*"
                            name="personalCardID"
                            label={t(
                              "settings.businessProfile.personal-profile-form-input-id-card"
                            )}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      </InputMask>
                    </div>
                    <div className="w-full sm:w-4/5">
                      <TextField
                        required
                        name="personalAddressLine1"
                        label={t(
                          "settings.businessProfile.company-profile-form-input-address-line-1-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.personalAddressLine1}
                      />
                    </div>
                    <div className="w-full sm:w-4/5">
                      <TextField
                        required
                        name="personalAddressLine2"
                        label={t(
                          "settings.businessProfile.company-profile-form-input-address-line-2-label"
                        )}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => this.handleChange(e)}
                        value={data.personalAddressLine2}
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="w-full sm:w-1/2 sm:pr-8">
                        <TextField
                          required
                          name="personalCity"
                          label={t(
                            "settings.businessProfile.business-profile-form-input-company-business-address-city-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.personalCity}
                        />
                      </div>
                      <div className="w-full sm:w-1/2 sm:pl-8">
                        <TextField
                          required
                          name="personalPostalCode"
                          label={t(
                            "settings.businessProfile.business-profile-form-input-company-business-address-postal-code-label"
                          )}
                          margin="dense"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => this.handleChange(e)}
                          value={data.personalPostalCode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-row justify-end items-center px-8 lg:px-12">
              <button
                className="button-primary"
                onClick={() => this.checkEmailChange()}
              >
                <Trans i18nKey="main.save-btn">Save</Trans>
              </button>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(withTranslation()(BusinessProfile))
);
