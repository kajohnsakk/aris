import React, { Component } from "react";
import _ from "@lodash";
import * as Actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";

import { UtilityManager } from "../../../modules/UtilityManager";
import Cookies from "js-cookie";

import { Trans, withTranslation } from "react-i18next";
import i18n from "../../../../i18n";

import bankList from "../../../config/payment/bankList.json";
import { FuseChipSelect } from "@fuse";
import InputMask from "react-input-mask";

import {
  TextField,
  // Button,
  // Card,
  // CardContent,
  // CardActions,
  // Grid,
  // Typography,
  Link,
  // Dialog,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  Divider,
} from "@material-ui/core";
import PincodePrompt from "./pincodePrompt";
import { withStyles } from "@material-ui/core/styles";
import GBGuide from "./GBGuide.js";
import WhyGBPay from "./whyGBPay.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import withReducer from "app/store/withReducer";
import reducer from "../../store/reducers";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import { ApiService } from "../../../modules/ApiService";
import CircularProgress from "@material-ui/core/CircularProgress";
import UtilityFunction from "../../../modules/UtilityFunction";

const styles = (theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },

  uploadMainProductImageText: {
    color: "#606060",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  mainAddProductImage: {
    padding: theme.spacing.unit * 2,
    display: "flex",
    borderColor: "#a0acb8",
    justifyContent: "center",
  },
});

class Payment extends Component {
  state = {
    form: null,
    backupPaymentData: null,
    isOpen: false,
    whyGB: false,
    auth0_uid: "",
    email: "",
    storeID: "",
    paymentChoice: "bankacc",
    showDialog: true,
  };

  componentDidMount() {
    let cookieValue = Cookies.get("auth0_uid");

    UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then((resultStoreInfo) => {
        this.setState({
          storeID: resultStoreInfo[0].storeID,
        });
      });

    this.props.pushTrackingData("View", "View " + this.props.dataLabel);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (this.props.payment && !this.state.form) {
    if (
      !_.isEqual(this.props.payment, this.state.form) &&
      this.props.payment.hasOwnProperty("storeID")
    ) {
      this.updateFormState();
    }

    if (
      this.state.showDialog === false &&
      this.state.showDialog !== prevState.showDialog &&
      this.state.storeID !== ""
    ) {
      this.props.getPaymentInfo({ storeID: this.state.storeID });
    }
  }

  componentWillUnmount() {
    this.props.pushTrackingData("Leave", "Leave " + this.props.dataLabel);
  }

  handleFileChange = (event) => {
    if (!event) return;
    event.preventDefault();
    let validExtensions = ["jpg", "png", "jpeg", "gif", "bmp"]; //array of vali

    let file = event.target.files[0];
    if (typeof file === "undefined") return;
    let fileName = file.name.toLowerCase();
    var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
    let targetName = event.target.name;
    if (validExtensions.indexOf(fileNameExt) === -1) {
      alert(
        "Only these file types are accepted : " + validExtensions.join(", ")
      );
    } else {
      ApiService.getInstance()
        .uploadFile(file, (progress) => {})
        .then((url) => {
          this.setState(
            {
              form: _.set({ ...this.state.form }, targetName, url),
            },
            () => {}
          );
        });
    }
  };

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

  handleChangeNum = (event) => {
    this.setState({
      form: _.set(
        { ...this.state.form },
        event.target.name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value.replace(/^[A-Z]+$/i, "")
      ),
    });
  };

  handleBankChange = (selectedBank, name) => {
    this.setState({
      form: _.set({ ...this.state.form }, name, selectedBank),
    });
  };

  updateFormState = () => {
    let backupData;
    if (this.props.payment.storeInfo.paymentInfo.accountName.length > 0) {
      backupData = {
        bankName: this.props.payment.storeInfo.paymentInfo.bank.label,
        accountName: this.props.payment.storeInfo.paymentInfo.accountName,
        accountNumber: this.props.payment.storeInfo.paymentInfo.accountNumber,
      };
    } else {
      backupData = null;
    }

    this.setState({ form: this.props.payment, backupPaymentData: backupData });
  };

  updatePaymentInfoState = () => {
    const storeID = this.props.storeID;
    this.props.getPaymentInfo({
      storeID: storeID,
    });
  };

  onKeyPress(event) {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/\+|-/.test(keyValue)) event.preventDefault();
  }

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleWhyGB = () => {
    this.setState({ whyGB: !this.state.whyGB });
  };

  checkExternalFunctionIsExist = () => {
    return typeof this.props.handleStepperNextButton === "function";
  };

  handleSavePage = async (event) => {
    event.preventDefault();

    this.props.pushTrackingData("Click", "Save payments button");
    this.props.pushTrackingData("Update", "Update " + this.props.dataLabel);
    var storeID;
    if (this.props.storeID) {
      storeID = this.props.storeID;
    } else {
      storeID = this.state.storeID;
    }
    const newForm = {
      ...this.state.form,
      storeInfo: {
        ...this.state.form.storeInfo,
        paymentInfo: {
          ...this.state.form.storeInfo.paymentInfo,
          verifyInfo: {
            verifyID: "",
            isVerified: false,
          },
        },
      },
    };

    if (this.checkExternalFunctionIsExist()) {
      this.props.savePaymentInfo(newForm, { storeID: storeID });
      this.props.handleStepperNextButton();
    } else {
      this.props.savePaymentInfo(newForm, { storeID: storeID });
    }

    // Data has to be in the following format:
    // {
    //     "to": "parintr@arislab.ai",
    //         "text": "rinrinrirnrinrirn"
    // }
    // Check if paymentInfo is of bank account and if so, check if they are all filled out. If filled out, send email to GBPay)
    if (this.state.paymentChoice === "bankacc") {
      if (
        this.state.form.storeInfo.paymentInfo.accountName !== "" &&
        this.state.form.storeInfo.paymentInfo.accountNumber !== "" &&
        this.state.form.storeInfo.paymentInfo.bank.hasOwnProperty("label")
      ) {
        let bankCode = this.state.form.storeInfo.paymentInfo.bank.bankCode;
        let bankName = this.state.form.storeInfo.paymentInfo.bank.label;
        let accountName = this.state.form.storeInfo.paymentInfo.accountName;
        let accountNumber = this.state.form.storeInfo.paymentInfo.accountNumber;
        let verifiedAccount = await UtilityManager.getInstance().checkVerifiedBankAccount(
          bankCode,
          accountNumber
        );

        if (verifiedAccount.length === 0) {
          UtilityFunction.sendPaymentInfo(
            accountName,
            accountNumber,
            bankName,
            this.state.backupPaymentData
          );
          this.props.insertBankRecord(
            this.state.form.storeInfo.paymentInfo,
            this.state.form.storeID
          );
        }

        var backupData = {
          bankName: bankName,
          accountName: accountName,
          accountNumber: accountNumber,
        };
        this.setState({ backupPaymentData: backupData });
      }
    }
  };

  handleRadioChange = (event) => {
    this.setState({
      paymentChoice: event.target.value,
    });
  };

  toggleDialog = () => {
    this.setState({
      showDialog: !this.state.showDialog,
    });
  };

  render() {
    const { form } = this.state;
    let payment_gbpayToken = {};
    let payment_bank = {};
    let payment_accountName = {};
    let payment_accountNumber;
    // let qrImage;

    // const classes = this.props;

    if (form !== null && form !== {}) {
      if (form && form.hasOwnProperty("storeInfo")) {
        if (form.storeInfo && form.storeInfo.hasOwnProperty("paymentInfo")) {
          payment_bank = form.storeInfo.paymentInfo.bank;
          //  ? form.storeInfo.paymentInfo.bank : '';
          payment_accountName = {
            defaultValue: this.state.form.storeInfo.paymentInfo.accountName,
          };

          payment_accountNumber = {
            defaultValue: this.state.form.storeInfo.paymentInfo.accountNumber,
          };

          // qrImage = this.state.form.storeInfo.paymentInfo.qrImage

          if (
            form.storeInfo.paymentInfo &&
            form.storeInfo.paymentInfo.hasOwnProperty("gbPayInfo")
          ) {
            payment_gbpayToken = {
              defaultValue: this.state.form.storeInfo.paymentInfo.gbPayInfo
                .token,
            };
          }
        }
      }
    }

    return (
      <div className="text-center content-center">
        {this.state.storeID.length === 0 ? (
          <div className="w-full flex justify-center items-center md:my-128 my-80">
            <CircularProgress color="primary" />
          </div>
        ) : null}

        {this.props.parentPage &&
        this.props.parentPage === "STORE_MANAGEMENT" &&
        this.state.showDialog === true &&
        this.state.storeID.length > 0 ? (
          <PincodePrompt
            isDisplayDialog={this.state.showDialog}
            toggleDialog={this.toggleDialog}
            storeID={this.state.storeID}
          />
        ) : null}

        {this.state.showDialog === false && this.state.storeID.length > 0 ? (
          <div className="store-management-body-container w-full lg:w-2/3 md:my-32 lg:rounded overflow-hidden shadow inline-block">
            <div className="px-24 sm:px-40 py-20 store-management-header">
              <div className="font-bold text-xl mb-2 text-left">
                <Trans i18nKey="settings.payments.payments-details">
                  Payment Details
                </Trans>
              </div>
            </div>

            <div className="block text-left mx-12 pt-12 lg:flex">
              <label className="mx-20 pt-12 w-full lg:w-1/5 text-gray-700 text-base mb-12">
                <Trans i18nKey="settings.payments.method">
                  Method of payment
                </Trans>
              </label>
              <FormControl component="fieldset">
                {/* removed value = gbpay */}
                <RadioGroup
                  aria-label="position"
                  name="position"
                  onChange={this.handleRadioChange}
                  row
                >
                  {/* <FormControlLabel
                                        className='px-12 w-full lg:w-2/5'
                                        value="gbpay"
                                        control={<Radio color="primary" />}
                                        label="GBPay"
                                        labelPlacement="end"
                                    /> */}
                  <FormControlLabel
                    className="px-12"
                    value="bankacc"
                    control={
                      <Radio
                        color="primary"
                        checked={this.state.paymentChoice === "bankacc"}
                      />
                    }
                    label={
                      <Trans i18nKey="settings.payments.bankacc">
                        Bank account
                      </Trans>
                    }
                    labelPlacement="end"
                    // disabled
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <Divider variant="middle" className="mt-6" />

            <form className="py-20 px-24 store-management-body">
              {this.state.paymentChoice === "gbpay" ? (
                <div>
                  <div className="w-full sm:w-1/2 pr-12 inline-block align-top">
                    <div className="mb-24 text-left ">
                      <label
                        className="block text-gray-700 text-base mb-12"
                        htmlFor="gbpay-code"
                      >
                        <Trans i18nKey="settings.payments.payments-form-input-gbpay-token-label">
                          GB Pay Token
                        </Trans>
                      </label>
                      <TextField
                        id="outlined-name"
                        name="storeInfo['paymentInfo']['gbPayInfo']['token']"
                        label={i18n.t(
                          "settings.payments.payments-form-input-gbpay-token-placeholder"
                        )}
                        margin="dense"
                        variant="outlined"
                        required
                        onChange={this.handleChange}
                        {...payment_gbpayToken}
                        fullWidth
                      />
                      <div className="mt-12">
                        <span
                          className="material-icons MuiIcon-root MuiIcon-colorAction mr-4 align-middle"
                          aria-hidden="true"
                        >
                          info
                        </span>
                        <Trans i18nKey="settings.payments.arisGBPay">
                          Using GBPay as default
                        </Trans>
                      </div>
                      <div className="mt-6">
                        <span
                          className="material-icons MuiIcon-root MuiIcon-colorAction mr-4 align-middle"
                          aria-hidden="true"
                        >
                          info
                        </span>
                        <Trans i18nKey="settings.payments.donthaveGBPay">
                          Dont have GBpay
                        </Trans>{" "}
                        <Link
                          className="click-link cursor-pointer"
                          onClick={this.toggleModal}
                          style={{ background: "transparent" }}
                        >
                          <Trans i18nKey="settings.payments.registerhere">
                            Register here
                          </Trans>
                        </Link>
                        <GBGuide
                          show={this.state.isOpen}
                          onClose={this.toggleModal}
                        />
                      </div>
                      <div className="mt-6">
                        <span
                          className="material-icons MuiIcon-root MuiIcon-colorAction mr-4 align-middle"
                          aria-hidden="true"
                        >
                          info
                        </span>
                        <Trans i18nKey="settings.payments.whyGBPay">
                          Why GBPay
                        </Trans>{" "}
                        <Link
                          className="click-link cursor-pointer"
                          onClick={this.toggleWhyGB}
                          style={{ background: "transparent" }}
                        >
                          <Trans i18nKey="settings.payments.GBPaygood">
                            Click
                          </Trans>
                        </Link>
                        <WhyGBPay
                          show={this.state.whyGB}
                          onClose={this.toggleWhyGB}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {this.state.paymentChoice === "bankacc" ? (
                <div className="block lg:flex">
                  {/* <div className="lg:w-1/3 pr-12 ">
                                        <div className='mb-24'>
                                            <label className="block text-gray-700 text-base mb-12" htmlFor="gbpay-code"><Trans i18nKey="settings.payments.qrcode">Qrcode for bank transfer</Trans></label>
                                            <label htmlFor="bank-qr-code">
                                                {qrImage ? (
                                                    <img className="border border-solid rounded cursor-pointer" src={qrImage} alt="QRCode" component="span" />
                                                ) : (
                                                        <Button className={classes.mainAddProductImage} component="span">
                                                            <span>
                                                                <img alt="Upload icon" src={'/assets/images/store-management/upload.png'} />
                                                            </span>
                                                        </Button>
                                                    )}
                                            </label>
                                            <div>
                                                <input
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="bank-qr-code"
                                                    type="file"
                                                    name="storeInfo['paymentInfo']['qrImage']"
                                                    onChange={this.handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </div> */}

                  <div className="mb-24 w-full">
                    <label
                      className="block text-gray-700 text-base mb-12 mx-auto"
                      htmlFor="gbpay-code"
                    >
                      <Trans i18nKey="settings.payments.payment-details">
                        Payment details
                      </Trans>
                    </label>
                    <div className="my-24 sm:text-center">
                      <FuseChipSelect
                        className="w-full sm:w-2/3 mx-auto"
                        value={payment_bank}
                        onChange={(value) =>
                          this.handleBankChange(
                            value,
                            "storeInfo['paymentInfo']['bank']"
                          )
                        }
                        placeholder="Choose your bank"
                        textFieldProps={{
                          label: "Bank name",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        options={bankList}
                        isSearchable={false}
                      />
                    </div>

                    <div className="mb-24 sm:text-center">
                      <InputMask
                        mask="999-999-9999"
                        // maskChar = "_ "
                        onChange={this.handleChange}
                        {...payment_accountNumber}
                        value={
                          this.state.form
                            ? this.state.form.storeInfo.paymentInfo
                                .accountNumber
                            : ""
                        }
                      >
                        {() => (
                          <TextField
                            // type="number"
                            required
                            id="outlined-name"
                            label="Account no."
                            name="storeInfo['paymentInfo']['accountNumber']"
                            variant="outlined"
                            className="w-full sm:w-2/3 mx-auto"
                            // onChange={this.handleChange}
                            {...payment_accountNumber}
                          />
                        )}
                      </InputMask>
                    </div>

                    <div className="mb-24  sm:text-center">
                      <TextField
                        id="outlined-name"
                        name="storeInfo['paymentInfo']['accountName']"
                        label="Account name"
                        placeholder="Enter your account name"
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        required
                        className="w-full sm:w-2/3 mx-auto"
                        onChange={this.handleChange}
                        {...payment_accountName}
                        value={
                          this.state.form
                            ? this.state.form.storeInfo.paymentInfo.accountName
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </form>

            {this.checkExternalFunctionIsExist() ? (
              <div className="px-20 sm:px-40 py-20 text-right store-management-footer">
                <button
                  className="button-secondary"
                  onClick={() => {
                    this.props.handleStepperBackButton();
                  }}
                >
                  &lt;&nbsp; <Trans i18nKey="main.back-btn">Back</Trans>
                </button>
                <button
                  className="button-primary"
                  onClick={this.handleSavePage}
                >
                  <Trans i18nKey="main.skip-btn">Skip</Trans>
                </button>
              </div>
            ) : (
              <div className="px-20 sm:px-40 py-20 text-right store-management-footer">
                <button
                  className="button-primary"
                  onClick={this.handleSavePage}
                >
                  <Trans i18nKey="main.save-btn">Save</Trans>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPaymentInfo: Actions.getPaymentInfo,
      savePaymentInfo: Actions.savePaymentInfo,
      sendPaymentInfo: Actions.sendPaymentInfo,
      insertBankRecord: Actions.insertBankRecord,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    payment: storeManagement.payments,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(Payment))
    )
  )
);
