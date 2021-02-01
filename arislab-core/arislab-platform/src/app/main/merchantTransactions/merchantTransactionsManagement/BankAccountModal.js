import React, { Component } from "react";
import { Trans } from "react-i18next";
import { Fab, TextField } from "@material-ui/core";
import banks from "../../config/payment/bankList.json";
import i18n from "../../../i18n";
import InputMask from "react-input-mask";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
  errorAlert: {
    color: "#c5302f",
    border: "1px #fc8181 solid",
    backgroundColor: "#fef4f5",
    padding: "10px",
    borderRadius: "5px",
  },
};
export default class BankAccountModal extends Component {
  state = {
    bankName: "",
    bankLabel: "Select bank...",
    bankCode: "",
    bankNumber: "",
    bankHolderName: "",
    error: {
      bankName: false,
      bankNumber: false,
      bankHolderName: false,
    },
    businessProfile: null,
    banks: null,
    errorMessage: "",
    isSubmitting: false,
  };

  componentDidMount = () => {};

  handleChange = (event, isSelect = false) => {
    if (isSelect && event.target.value) {
      const bank = event.target.value.split("_");
      this.setState({
        bankLabel: bank[0],
        bankName: bank[1],
        bankCode: bank[2],
      });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
    // ทำให้ error หายไป หลังจากเริ่มกรอกข้อมูลใหม่
    if (
      this.state.error.bankName ||
      this.state.error.bankNumber ||
      this.state.error.bankHolderName
    ) {
      this.setState({ error: {} });
    }
  };

  handleSubmit = async () => {
    let isValidate = false;
    this.setState({ isSubmitting: true });

    var reNum = /^\d{3}-\d{3}-\d{4}$/;
    if (!reNum.test(this.state.bankNumber)) {
      await this.setState((prevState) => ({
        error: { ...prevState.error, bankNumber: true },
      }));
      isValidate = true;
    }

    var reName = /^[a-z0-9A-Zก-๛ .&/\-+_,():!?]+$/;
    if (!reName.test(this.state.bankHolderName)) {
      await this.setState((prevState) => ({
        error: { ...prevState.error, bankHolderName: true },
      }));
      isValidate = true;
    }

    var reBankName = /^\w+$/;
    if (!reBankName.test(this.state.bankName)) {
      await this.setState((prevState) => ({
        error: { ...prevState.error, bankName: true },
      }));
      isValidate = true;
    }

    if (isValidate) {
      this.setState({ isSubmitting: false });
      return;
    }

    if (
      !this.state.error.bankName &&
      !this.state.error.bankNumber &&
      !this.state.error.bankHolderName &&
      this.props.businessProfile &&
      this.state.bankName &&
      this.state.bankLabel
    ) {
      var data = this.props.businessProfile;
      const storeID = data.storeID;
      const newData = {
        ...data.storeInfo,
        paymentInfo: {
          gbPayInfo: {
            token: "",
          },
          ...data.storeInfo.paymentInfo,
          accountName: this.state.bankHolderName,
          accountNumber: this.state.bankNumber,
          bank: {
            ...data.storeInfo.bank,
            label: this.state.bankLabel,
            value: this.state.bankName,
            bankCode: this.state.bankCode,
          },
          verifyInfo: {
            isVerified: false,
            verifyID: "",
          },
        },
      };
      data = { ...data, storeInfo: newData };
      let storeData = data;
      const dataForRecord = {
        accountName: this.state.bankHolderName,
        accountNumber: this.state.bankNumber,
        bank: {
          ...data.storeInfo.bank,
          label: this.state.bankLabel,
          value: this.state.bankName,
          bankCode: this.state.bankCode,
        },
      };

      var oldPaymentData = null;
      if (
        this.props.businessProfile &&
        this.props.businessProfile.storeInfo.paymentInfo.hasOwnProperty(
          "accountName"
        ) &&
        this.props.businessProfile.storeInfo.paymentInfo.accountName.length > 0
      ) {
        oldPaymentData = {
          bankName: this.props.businessProfile.storeInfo.paymentInfo.bank.label,
          accountName: this.props.businessProfile.storeInfo.paymentInfo
            .accountName,
          accountNumber: this.props.businessProfile.storeInfo.paymentInfo
            .accountNumber,
        };
      }
      const emailData = {
        accountName: this.state.bankHolderName,
        accountNumber: this.state.bankNumber,
        bankName: this.state.bankLabel,
        oldPaymentData: oldPaymentData,
      };

      try {
        await this.props.insertBankRecord(
          dataForRecord,
          storeData,
          emailData,
          storeID
        );
        await this.props.toggleDialog("bankAccountModal");
        window.location.reload();
      } catch (error) {
        this.setState({
          errorMessage: error.response.data.message
            ? error.response.data.message
            : error.message,
        });
        this.setState({ isSubmitting: false });
      }
    }
  };

  switchPushTrackingData = () => {
    if (this.props.changeBankAccount) {
      this.props.pushTrackingData("Update", "Update bank account");
    } else {
      this.props.pushTrackingData("Create", "Create bank account");
    }
  };

  switchPushTrackingDataForCancelButton = () => {
    if (this.props.changeBankAccount) {
      this.props.pushTrackingData("Leave", "Leave change bank account modal");
    } else {
      this.props.pushTrackingData("Leave", "Leave create bank account modal");
    }
  };

  render() {
    const newBanks = [
      { value: "", label: "Select bank...", bankCode: "" },
      ...banks,
    ];
    return (
      <div className="mt-20">
        <div className="text-xl">
          {this.props.changeBankAccount ? (
            <Trans i18nKey="transactions.change-bank-account">
              Change bank account
            </Trans>
          ) : (
            <Trans i18nKey="transactions.add-new-bank-account">
              Add new bank account
            </Trans>
          )}
        </div>
        <svg
          className="my-20"
          width="64"
          height="2"
          viewBox="0 0 64 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 1H64" stroke="url(#paint0_linear)" />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="4.04882e-05"
              y1="-29.009"
              x2="63.6756"
              y2="-28.7232"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FCAF4E" />
              <stop offset="1" stopColor="#ED3590" />
            </linearGradient>
          </defs>
        </svg>
        {this.state.errorMessage && (
          <div className="text-red mb-16" style={styles.errorAlert}>
            {this.state.errorMessage}
          </div>
        )}
        <div className="m-auto merchant-font text-left">
          <div
            className={
              this.state.error.bankName
                ? "flex justify-between merchant-red"
                : ""
            }
          >
            <Trans i18nKey="transactions.bank-name">Bank Name</Trans> *
          </div>
          <TextField
            select
            error={this.state.error.bankName}
            className="merchant-font mb-24"
            name="bank"
            onChange={(event) => this.handleChange(event, true)}
            SelectProps={{
              native: true,
              MenuProps: {
                className: "",
              },
            }}
            margin="dense"
            fullWidth
            variant="outlined"
          >
            {newBanks.map((option) => (
              <option
                key={option.value}
                value={
                  option.label + "_" + option.value + "_" + option.bankCode
                }
              >
                {option.label}
              </option>
            ))}
          </TextField>
          <div
            className={
              this.state.error.bankNumber
                ? "flex justify-between merchant-red"
                : ""
            }
          >
            <span>
              <Trans i18nKey="transactions.bank-number">
                Bank account Number
              </Trans>{" "}
              *
            </span>
          </div>
          <InputMask
            mask="999-999-9999"
            onChange={this.handleChange}
            {...this.state.bankNumber}
          >
            {() => (
              <TextField
                className="mb-24"
                name="bankNumber"
                error={this.state.error.bankNumber}
                onChange={this.handleChange}
                placeholder={i18n.t("transactions.bank-number")}
                margin="dense"
                fullWidth
                variant="outlined"
              />
            )}
          </InputMask>
          <div
            className={
              this.state.error.bankHolderName
                ? "flex justify-between merchant-red"
                : ""
            }
          >
            <span>
              <Trans i18nKey="transactions.bank-holder-name">
                Bank account holder name
              </Trans>{" "}
              *
            </span>
          </div>
          <TextField
            className="mb-16"
            name="bankHolderName"
            error={this.state.error.bankHolderName}
            onChange={this.handleChange}
            placeholder={i18n.t("transactions.bank-holder-name")}
            margin="dense"
            fullWidth
            variant="outlined"
          />
        </div>
        <div className="flex items-center justify-end mt-24">
          <button
            className="pr-16 merchant-grey"
            disabled={this.state.isSubmitting}
            onClick={() => {
              this.props.toggleDialog(this.props.dialogName);
              this.switchPushTrackingDataForCancelButton();
            }}
          >
            <Trans i18nKey="transactions.cancel">Cancel</Trans>
          </button>
          <Fab
            variant="extended"
            aria-label="Withdraw"
            className="merchant-button px-24"
            disabled={this.state.isSubmitting}
            onClick={() => {
              this.handleSubmit();
              this.switchPushTrackingData();
            }}
          >
            {this.state.isSubmitting && (
              <CircularProgress
                className="text-white"
                style={{ marginRight: "0.5em", color: "rgb(146 146 146)" }}
                size="1.2em"
              />
            )}
            <Trans i18nKey="transactions.confirm">Confirm</Trans>
          </Fab>
        </div>
      </div>
    );
  }
}
