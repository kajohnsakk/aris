import React, { Component } from "react";
import { Trans } from "react-i18next";
import { Fab, CircularProgress } from "@material-ui/core";

class WithdrawModal extends Component {
  state = {
    isWithdrawing: false,
  };

  thousandSeperator = (number) => {
    number = Number(number).toFixed(2);
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  render() {
    const WITHDRAW_FEE = Number(process.env.REACT_APP_GB_PAY_FEE);
    const amountForNoFee = Number(
      process.env.REACT_APP_GB_PAY_AMOUNT_FOR_NO_FEE
    );
    const props = this.props;

    return (
      <div className="mt-20">
        <div className="text-xl">
          <Trans i18nKey="transactions.balance">Balance</Trans> (
          <Trans i18nKey="transactions.baht">Baht</Trans>)
        </div>
        <div className="font-medium text-5xl merchant-pink">
          {this.thousandSeperator(
            (props.actualAmount - WITHDRAW_FEE).toFixed(2)
          )}
        </div>

        <div className="flex flex-col border-b py-12 my-12 merchant-border-grey mb-24">
          <div className="flex justify-between">
            <div>
              <Trans i18nKey="transactions.income">Total income</Trans>
            </div>
            <div>
              {this.thousandSeperator(props.totalAmount)}{" "}
              <Trans i18nKey="transactions.baht">Baht</Trans>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <Trans i18nKey="transactions.service-fee">Service Fee</Trans>
            </div>
            <div>
              {this.thousandSeperator(props.totalFee)}{" "}
              <Trans i18nKey="transactions.baht">Baht</Trans>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <Trans i18nKey="transactions.withdraw-fee">Withdraw Fee</Trans>
            </div>
            <div>
              {props.totalAmount >= amountForNoFee ? 0 : WITHDRAW_FEE}{" "}
              <Trans i18nKey="transactions.baht">Baht</Trans>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Fab
            variant="extended"
            aria-label="Withdraw"
            className="merchant-button px-40"
            disabled={
              props.actualAmount - WITHDRAW_FEE > 0 && !this.state.isWithdrawing
                ? false
                : true
            }
            onClick={() => {
              props.toggleDialog("sendOTPModal")
              props.toggleDialog("withdrawModal")
            }}
          >
            {!props.errorMessage && this.state.isWithdrawing ? (
              <div className="flex items-center">
                <CircularProgress color="primary" className="mr-8" size={22} />
                <Trans i18nKey="transactions.transfer-withdraw">
                  Transferring...
                </Trans>
              </div>
            ) : (
              <Trans i18nKey="transactions.withdraw">Withdraw</Trans>
            )}
          </Fab>
        </div>
        <h2 className="mt-20 text-red">{props.errorMessage}</h2>
        <div className="merchant-grey mt-36 text-xs text-left">
          *
          <Trans i18nKey="transactions.download-invoice-in-history">
            Balance will be transfered to bank account in 1-2 days
          </Trans>
        </div>
        {!props.errorMessage && this.state.isWithdrawing ? (
          <div className="text-red text-xs text-left italic mt-4">
            <Trans i18nKey="transactions.transfer-warning">
              Your request is in progress. After 1 minute, please refresh the
              screen to see an updated amount
            </Trans>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default WithdrawModal;
