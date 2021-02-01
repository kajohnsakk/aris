import React, { Component } from "react";
import { Trans } from "react-i18next";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import withReducer from "app/store/withReducer";
import { Icon } from "@material-ui/core";
import { UtilityManager } from "../../modules/UtilityManager";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import Cookies from "js-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import GetAppIcon from "@material-ui/icons/GetApp";
import UtilityFunction from "../../modules/UtilityFunction";
import i18n from "../../../i18n";
import fundTransactions from "../fundsTransaction.json";
import axios from "axios";
import * as AppConfig from "../../config/AppConfig";

import TransactionsTable from "./TransactionsTable";
import BankAccountCard from "./BankAccountCard";
import MoneyCard from "./MoneyCard";
import WithdrawModal from "./WithdrawModal";
import AlertModal from "./AlertModal";
import OTPVerifyModal from "./OTPVerifyModal";
import SendOTPModal from "./SendOTPModal";
import Modal from "./Modal";
import BankAccountModal from "./BankAccountModal";
import _ from "@lodash";
import { updateStorePaymentInfo } from "../../setting/store/actions";
import { showMessage } from "app/store/actions/fuse";

import style from "./style";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "./MerchantTransactions.css";

const WEB_URL = AppConfig.WEB_URL;
const host = AppConfig.API_URL;
class MerchantTransactions extends Component {
  state = {
    auth0_uid: "",
    email: "",
    storeID: "",
    totalAmount: 0,
    actualAmount: 0,
    totalFee: 0,
    transactions: [],
    withdrawModal: false,
    bankAccountModal: false,
    alertModal: false,
    pinModal: false,
    sendOTPModal: false,
    sendBankAccountOTPModal: false,
    OTPVerifyModal: false,
    verifyBankAccountOTPModal: false,
    verifyOTPBankAccountModal: false,
    isPinConfirmed: false,
    error: "",
    paymentInfo: null,
    businessProfile: null,
    changeBankAccount: false,
    bankAccount: {
      isConfirmedAccount: false,
      isExisting: false,
    },
    fundsTransactions: null,
    startDate: Date.now() - 60 * 60 * 24 * 1000 * 7,
    endDate: Date.now(),
    searchOrderID: "",
    useBusinessWithdraw: false,
    alertModalMessage: "",
    alertModalType: "INFO",
    errorMessage: "",
    isNotCorrectOTP: false,
    isSendingOTP: false,
  };
  fee = Number(process.env.REACT_APP_GB_PAY_FEE);
  amountForNoFee = Number(process.env.REACT_APP_GB_PAY_AMOUNT_FOR_NO_FEE);
  pageCategory = "Merchant transactions";

  componentDidMount = async () => {
    this.setState({ transactions: fundTransactions });
    let cookieValue = Cookies.get("auth0_uid");

    let storeID = "";
    await UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then((resultStoreInfo) => {
        this.setState({
          auth0_uid: resultStoreInfo[0].auth0_uid,
          email: resultStoreInfo[0].email,
          storeID: resultStoreInfo[0].storeID,
          useBusinessWithdraw:
            resultStoreInfo[0].paymentInfo.useBusinessWithdraw,
        });
        storeID = resultStoreInfo[0].storeID;
        UtilityFunction.tagManagerPushDataLayer(
          this.pageCategory,
          "View",
          "View merchant transactions page",
          UtilityFunction.getExistValue(
            resultStoreInfo[0].auth0_uid,
            "Anonymous"
          )
        );
        this.updateBusinessProfileState();
      });

    // get fundsTransactions from database
    let url = "";
    if (storeID) {
      url = `${host}fundsTransaction/storeID/${storeID}`;
      const response = await axios.get(url);
      return this.setState({ fundsTransactions: response.data });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.businessProfile &&
      !this.state.paymentInfo &&
      !this.state.businessProfile
    ) {
      this.setState({
        paymentInfo: this.props.businessProfile.storeInfo.paymentInfo,
        businessProfile: this.props.businessProfile,
      });
    }

    if (!_.isEqual(this.props.businessProfile, prevProps.businessProfile)) {
      this.setState({
        paymentInfo: this.props.businessProfile.storeInfo.paymentInfo,
        businessProfile: this.props.businessProfile,
      });
    }

    if (this.props.exportOrderUrl !== prevProps.exportOrderUrl) {
      window.location.href = this.props.exportOrderUrl;
    }
  };

  componentWillUnmount() {
    this.pushTrackingData("Leave", "Leave merchant transactions page");
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

  updateBusinessProfileState = () => {
    const storeID = this.state.storeID;
    this.props.getBusinessProfile({ storeID: storeID });
  };

  toggleDialog = (dialogName) => {
    if (this.state[dialogName]) {
      this.setState({ error: "", errorMessage: "" });
    }
    this.setState({ [dialogName]: !this.state[dialogName] });
  };

  resetError = () => {
    this.setState({ error: "" });
  };

  updateBalance = (totalAmount, totalFee) => {
    this.setState({
      totalAmount: totalAmount,
      actualAmount: totalAmount - totalFee,
      totalFee: totalFee,
    });
  };

  handleChangeBankAccount = () => {
    this.setState({ changeBankAccount: true });
  };

  timeline = () => {
    const date = new Date();
    const hr = Number(
      date
        .toString()
        .split(" ")[4]
        .split(":")[0]
    );
    if (hr >= 0 && hr <= 11) {
      return 1;
    } else if (hr >= 12 && hr <= 23) {
      return 2;
    }
  };

  generateInvoiceCustomerData = (name, taxNumber, addressInfo) => {
    let invoiceCustomerData = {
      name: name,
      taxNumber: taxNumber,
      addressInfo: addressInfo,
    };

    return invoiceCustomerData;
  };

  checkInvalidInvoiceCustomerData = (invoiceCustomerData) => {
    return !(
      invoiceCustomerData["name"].length > 0 &&
      invoiceCustomerData["taxNumber"].length > 0 &&
      invoiceCustomerData["addressInfo"]["addressLine1"].length > 0 &&
      invoiceCustomerData["addressInfo"]["postalCode"].length > 0
    );
  };

  getAlertWithdrawMessage = () => {
    let personalInfo = this.state.businessProfile.storeInfo.hasOwnProperty(
      "personalInfo"
    )
      ? this.state.businessProfile.storeInfo.personalInfo
      : {};

    let companyInfo = this.state.businessProfile.storeInfo.hasOwnProperty(
      "companyInfo"
    )
      ? this.state.businessProfile.storeInfo.companyInfo
      : {};

    let useBusinessFeatures = this.state.businessProfile.storeInfo.config.hasOwnProperty(
      "useBusinessFeatures"
    )
      ? this.state.businessProfile.storeInfo.config.useBusinessFeatures
      : false;

    let replaceObj = {
      br: "<br>",
      settingsLink:
        "<a href='/platform/setting'>" + i18n.t("transactions.here") + "</a>",
      interpolation: { escapeValue: false },
    };

    let isDisplayAlertModal = true;
    let alertModalMessage = "";

    if (this.state.useBusinessWithdraw && useBusinessFeatures) {
      if (companyInfo["taxNumber"].length > 0) {
        isDisplayAlertModal = false;
      } else {
        isDisplayAlertModal = true;
        alertModalMessage = i18n.t(
          "transactions.warning-company-info",
          replaceObj
        );
      }
    } else if (!this.state.useBusinessWithdraw && !useBusinessFeatures) {
      if (personalInfo["idCard"].length > 0) {
        isDisplayAlertModal = false;
      } else {
        isDisplayAlertModal = true;
        alertModalMessage = i18n.t(
          "transactions.warning-personal-info",
          replaceObj
        );
      }
    } else {
      if (this.state.useBusinessWithdraw) {
        isDisplayAlertModal = true;
        alertModalMessage = i18n.t(
          "transactions.warning-company-info",
          replaceObj
        );
      } else {
        isDisplayAlertModal = true;
        alertModalMessage = i18n.t(
          "transactions.warning-personal-info",
          replaceObj
        );
      }
    }
    return { isDisplayAlertModal, alertModalMessage };
  };

  processBeforeWithdraw = () => {
    const {
      isDisplayAlertModal,
      alertModalMessage,
    } = this.getAlertWithdrawMessage();

    if (isDisplayAlertModal) {
      this.setState({
        withdrawModal: false,
        alertModal: true,
        alertModalMessage: alertModalMessage,
      });
    } else {
      this.withdraw();
    }
  };

  withdraw = async () => {
    let personalInfo = this.state.businessProfile.storeInfo.hasOwnProperty(
      "personalInfo"
    )
      ? this.state.businessProfile.storeInfo.personalInfo
      : {};
    let companyInfo = this.state.businessProfile.storeInfo.hasOwnProperty(
      "companyInfo"
    )
      ? this.state.businessProfile.storeInfo.companyInfo
      : {};
    let useBusinessFeatures = this.state.businessProfile.storeInfo.config.hasOwnProperty(
      "useBusinessFeatures"
    )
      ? this.state.businessProfile.storeInfo.config.useBusinessFeatures
      : false;

    let invoiceCustomerData = {};
    let cashbillName =
      companyInfo["name"] && companyInfo["name"].length > 0
        ? companyInfo["name"]
        : personalInfo["name"];
    if (useBusinessFeatures) {
      invoiceCustomerData = this.generateInvoiceCustomerData(
        companyInfo["name"],
        companyInfo["taxNumber"],
        companyInfo["registeredAddressInfo"]
      );
    } else if (!useBusinessFeatures) {
      invoiceCustomerData = this.generateInvoiceCustomerData(
        personalInfo["name"],
        personalInfo["idCard"],
        personalInfo["addressInfo"]
      );
    } else {
      invoiceCustomerData = this.generateInvoiceCustomerData(
        cashbillName,
        "",
        ""
      );
    }


    var data = {
      storeID: this.state.storeID,
      amount: Number(this.state.actualAmount),
      invoiceCustomerData: invoiceCustomerData,
    };

    try {
      await axios.post(WEB_URL + "queue/fundsTransaction/withdraw", data);
      setTimeout(function () {
        window.location.reload();
      }, 5000);
    } catch (error) {
      this.setState({
        errorMessage:
          error.response.data.status === "fail"
            ? error.response.data.message
            : error.message,
      });
    }
  };

  handleExportButton = (e) => {
    e.preventDefault();

    this.pushTrackingData("Click", "Export orders button");
    this.pushTrackingData("Export", "Export orders");
    const { storeID, startDate, endDate } = this.state;

    this.props.exportOrders({
      storeID: storeID,
      status: "SUCCESS",
      startDate: startDate,
      endDate: endDate,
      dateFilter: "paymentCompletedOn",
    });
  };

  setStartDate = (date) => {
    const newDate = new Date(
      new Date(
        new Date(new Date(date.setHours(0)).setMinutes(0)).setSeconds(0)
      ).setMilliseconds(0)
    ).getTime();
    this.setState({ startDate: newDate });
  };

  setEndDate = (date) => {
    const newDate = new Date(
      new Date(
        new Date(new Date(date.setHours(23)).setMinutes(59)).setSeconds(59)
      ).setMilliseconds(999)
    ).getTime();
    this.setState({ endDate: newDate });
  };

  handleInputChange = (event) => {
    this.setState(
      _.set(
        { ...this.state },
        event.target.name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
      )
    );
  };

  toggleWithdrawAccountType = async (e) => {
    const isChecked = e.target.checked;
    try {
      const storeID = this.state.storeID;
      await updateStorePaymentInfo(storeID, {
        useBusinessWithdraw: isChecked,
      });

      this.setState({
        useBusinessWithdraw: isChecked,
      });
    } catch (error) {
      this.props.showMessage({
        message: error.response.data.message
          ? error.response.data.message
          : error.message,
        variant: "error",
      });
    }
  };

  sendOTP = () => {
    return axios.post(host + "otp/send", {
      email: this.props.businessProfile.storeInfo.businessProfile.businessEmail,
      storeID: this.props.businessProfile.storeID,
    });
  };

  sendWithdrawOTP = async () => {
    this.setState({ isSendingOTP: true });
    try {
      await this.sendOTP();
      if (!this.state.OTPVerifyModal) {
        this.toggleDialog("OTPVerifyModal");
        this.toggleDialog("sendOTPModal");
      }
      this.setState({ isSendingOTP: false });
    } catch (error) {
      this.setState({ isSendingOTP: false });
    }
  };

  sendBankAccountOTP = async () => {
    this.setState({ isSendingOTP: true });
    try {
      await this.sendOTP();
      if (!this.state.OTPVerifyModal) {
        this.toggleDialog("verifyBankAccountOTPModal");
        this.toggleDialog("sendBankAccountOTPModal");
      }
      this.setState({ isSendingOTP: false });
    } catch (error) {
      this.setState({ isSendingOTP: false });
    }
  };

  verifyOTP = (otp) => {
    return axios.post(host + "otp/verify", {
      otp: otp,
      storeID: this.props.businessProfile.storeID,
    });
  };

  verifyWithdrawOTP = async (otp) => {
    this.setState({ isNotCorrectOTP: false });
    try {
      await this.verifyOTP(otp);
      this.toggleDialog("OTPVerifyModal");
      this.withdraw();
    } catch (error) {
      this.setState({ isNotCorrectOTP: true });
    }
  };

  verifyBankAccountOTP = async (otp) => {
    this.setState({ isNotCorrectOTP: false });
    try {
      await this.verifyOTP(otp);
      this.toggleDialog("verifyBankAccountOTPModal");
      this.toggleDialog("bankAccountModal");
    } catch (error) {
      this.setState({ isNotCorrectOTP: true });
    }
  };

  render() {
    const { searchOrderID } = this.state;
    return (
      <React.Fragment>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.withdrawModal}
          toggleDialog={this.toggleDialog}
          dialogName={"withdrawModal"}
          pushTrackingData={this.pushTrackingData}
          maxWidth="lg"
        >
          <WithdrawModal
            totalAmount={this.state.totalAmount}
            actualAmount={this.state.actualAmount}
            totalFee={this.state.totalFee}
            errorMessage={this.state.errorMessage}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
          />
        </Modal>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.sendOTPModal}
          toggleDialog={this.toggleDialog}
          dialogName={"sendOTPModal"}
          pushTrackingData={this.pushTrackingData}
          maxWidth="lg"
        >
          <SendOTPModal
            totalAmount={this.state.totalAmount}
            actualAmount={this.state.actualAmount}
            totalFee={this.state.totalFee}
            errorMessage={this.state.errorMessage}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            businessProfile={this.props.businessProfile}
            sendOTP={this.sendWithdrawOTP}
            isLoading={this.state.isSendOTPLoading}
          />
        </Modal>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.sendBankAccountOTPModal}
          toggleDialog={this.toggleDialog}
          dialogName={"sendBankAccountOTPModal"}
          pushTrackingData={this.pushTrackingData}
          maxWidth="lg"
        >
          <SendOTPModal
            totalAmount={this.state.totalAmount}
            actualAmount={this.state.actualAmount}
            totalFee={this.state.totalFee}
            errorMessage={this.state.errorMessage}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            businessProfile={this.props.businessProfile}
            sendOTP={this.sendBankAccountOTP}
            isLoading={this.state.isSendOTPLoading}
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
            totalAmount={this.state.totalAmount}
            actualAmount={this.state.actualAmount}
            totalFee={this.state.totalFee}
            errorMessage={this.state.errorMessage}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            businessProfile={this.props.businessProfile}
            verifyOTP={this.verifyWithdrawOTP}
            isNotCorrectOTP={this.state.isNotCorrectOTP}
            isSendingOTP={this.state.isSendingOTP}
            sendOTP={this.sendWithdrawOTP}
          />
        </Modal>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.verifyBankAccountOTPModal}
          toggleDialog={this.toggleDialog}
          dialogName={"verifyBankAccountOTPModal"}
          pushTrackingData={this.pushTrackingData}
        >
          <OTPVerifyModal
            errorMessage={this.state.errorMessage}
            toggleDialog={this.toggleDialog}
            pushTrackingData={this.pushTrackingData}
            businessProfile={this.props.businessProfile}
            verifyOTP={this.verifyBankAccountOTP}
            isNotCorrectOTP={this.state.isNotCorrectOTP}
            isSendingOTP={this.state.isSendingOTP}
            sendOTP={this.sendBankAccountOTP}
          />
        </Modal>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.bankAccountModal}
          toggleDialog={this.toggleDialog}
          dialogName={"bankAccountModal"}
          changeBankAccount={this.state.changeBankAccount}
          pushTrackingData={this.pushTrackingData}
        >
          <BankAccountModal
            toggleDialog={this.toggleDialog}
            changeBankAccount={this.state.changeBankAccount}
            businessProfile={this.state.businessProfile}
            savePaymentInfo={this.props.savePaymentInfo}
            dialogName={"bankAccountModal"}
            sendPaymentInfo={this.props.sendPaymentInfo}
            paymentInfo={this.state.paymentInfo}
            insertBankRecord={this.props.insertBankRecord}
            pushTrackingData={this.pushTrackingData}
            onBankAccountConfirm={this.onBankAccountConfirm}
            setMerchantState={this.setState}
          />
        </Modal>
        <Modal
          fullWidth={true}
          isDisplayHorizontalDialog={this.state.alertModal}
          toggleDialog={this.toggleDialog}
          dialogName={"alertModal"}
          pushTrackingData={this.pushTrackingData}
          maxWidth="lg"
        >
          <AlertModal
            messageType={this.state.alertModalType}
            message={this.state.alertModalMessage}
            handleClick={() => {
              this.toggleDialog("withdrawModal");
              this.toggleDialog("alertModal");
            }}
            pushTrackingData={this.pushTrackingData}
          />
        </Modal>

        <div className="mx-auto w-full merchant-font">
          <div className={style.standard + " mb-0"}>
            <div className="flex flex-1 flex-col md:flex-row items-center justify-between">
              <div className="flex w-auto text-2xl">
                <Trans i18nKey="transactions.transactions">Transactions</Trans>
              </div>

              <div className="flex w-auto justify-end h-full flex-col lg:flex-row">
                <div className="flex justify-end flex-col sm:flex-row sm:mx-8">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      keyboard
                      className="mr-8 main-font sm:mt-0 mt-8 lg:w-1/3"
                      label={
                        <span className="main-font">
                          {i18n.t("orders.orders-start-date")}
                        </span>
                      }
                      format={"dd/MM/yyyy"}
                      placeholder="10/10/2018"
                      mask={(value) =>
                        value
                          ? [
                            /\d/,
                            /\d/,
                            "/",
                            /\d/,
                            /\d/,
                            "/",
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                          ]
                          : []
                      }
                      value={this.state.startDate}
                      onChange={this.setStartDate}
                      disableOpenOnEnter
                      animateYearScrolling={false}
                    />
                    <DatePicker
                      keyboard
                      className="mr-8 main-font sm:mt-0 mt-8 lg:w-1/3"
                      label={
                        <span className="main-font">
                          {i18n.t("orders.orders-end-date")}
                        </span>
                      }
                      format={"dd/MM/yyyy"}
                      placeholder="10/10/2018"
                      mask={(value) =>
                        value
                          ? [
                            /\d/,
                            /\d/,
                            "/",
                            /\d/,
                            /\d/,
                            "/",
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                          ]
                          : []
                      }
                      value={this.state.endDate}
                      onChange={this.setEndDate}
                      disableOpenOnEnter
                      animateYearScrolling={false}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="flex py-8">
                  <div className="flex flex-1 items-center border border-2 border-teal py-2 px-8 rounded-full mr-8 h-10 w-2/3">
                    <Icon className="mr-8" color="action">
                      search
                    </Icon>
                    <input
                      className="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder={i18n.t(
                        "transactions.input-search-order-id-placeholder"
                      )}
                      value={searchOrderID}
                      name="searchOrderID"
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <button
                    className="inverted-button flex items-center whitespace-no-wrap py-4 ml-2 mr-16 px-16 rounded-full"
                    onClick={this.handleExportButton}
                  >
                    <GetAppIcon />
                    <div className="hidden sm:flex">
                      <Trans i18nKey="main.download-file">Download</Trans>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row ">
            <div className="w-full md:w-1/4">
              {this.state.paymentInfo &&
                this.state.paymentInfo.hasOwnProperty("bank") &&
                this.state.money !== "" ? (
                  <React.Fragment>
                    <MoneyCard
                      totalAmount={this.state.totalAmount}
                      actualAmount={this.state.actualAmount}
                      totalFee={this.state.totalFee}
                      toggleDialog={this.toggleDialog}
                      dialogName={"alertModal"}
                      _self={this}
                      getAlertWithdrawMessage={this.getAlertWithdrawMessage}
                      pushTrackingData={this.pushTrackingData}
                      isConfirmedAccount={
                        this.state.businessProfile.storeInfo.paymentInfo.hasOwnProperty(
                          "verifyInfo"
                        )
                          ? this.state.businessProfile.storeInfo.paymentInfo
                            .verifyInfo.isVerified
                          : false
                      }
                      useBusinessWithdraw={this.state.useBusinessWithdraw}
                      handleInputChange={this.toggleWithdrawAccountType}
                    />
                    <BankAccountCard
                      toggleDialog={this.toggleDialog}
                      dialogName={["bankAccountModal", "pinModal"]}
                      bankName={
                        this.state.paymentInfo.bank.hasOwnProperty("label")
                          ? this.state.paymentInfo.bank.label
                          : ""
                      }
                      bankNumber={this.state.paymentInfo.accountNumber}
                      bankHolderName={this.state.paymentInfo.accountName}
                      isConfirmedAccount={
                        this.state.businessProfile.storeInfo.paymentInfo.hasOwnProperty(
                          "verifyInfo"
                        )
                          ? this.state.businessProfile.storeInfo.paymentInfo
                            .verifyInfo.isVerified
                          : false
                      }
                      isExisting={this.state.paymentInfo.accountNumber}
                      pushTrackingData={this.pushTrackingData}
                      handleChangeBankAccount={this.handleChangeBankAccount}
                    />
                  </React.Fragment>
                ) : (
                  <div className="w-full flex justify-center items-center md:my-128 my-80">
                    <CircularProgress className="merchant-pink" />
                  </div>
                )}
            </div>
            <div className="md:flex-1 md:ml-16">
              {this.state.storeID && this.state.paymentInfo ? (
                <TransactionsTable
                  fundsTransactions={this.state.fundsTransactions}
                  updateBalance={this.updateBalance}
                  storeID={this.state.storeID}
                  paymentInfo={this.state.paymentInfo}
                  searchOrderID={this.state.searchOrderID}
                />
              ) : (
                  <div className="w-full flex justify-center items-center md:mt-40">
                    <CircularProgress className="merchant-pink" />
                  </div>
                )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      saveBusinessProfile: Actions.saveBusinessProfile,
      sendPaymentInfo: Actions.sendPaymentInfo,
      savePaymentInfo: Actions.savePaymentInfo,
      getPaymentInfo: Actions.getPaymentInfo,
      insertBankRecord: Actions.insertBankRecord,
      exportOrders: Actions.exportOrders,
      showMessage: showMessage,
    },
    dispatch
  );
}

function mapStateToProps({ merchantTransactions }) {
  return {
    businessProfile: merchantTransactions.businessProfile,
    exportOrderUrl: merchantTransactions.orders.exportOrderUrl,
  };
}

export default withReducer("merchantTransactions", reducer)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(MerchantTransactions)
  )
);
