import React from "react";
import { Trans } from "react-i18next";
import { Fab, Switch } from "@material-ui/core";
import style from "./style";

const MoneyCard = (props) => {
  const thousandSeperator = (number) => {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const WITHDRAW_FEE = Number(process.env.REACT_APP_GB_PAY_FEE);
  const amountForNoFee = Number(process.env.REACT_APP_GB_PAY_AMOUNT_FOR_NO_FEE);
  let displayBalance = "-";
  if (props.actualAmount >= amountForNoFee) {
    displayBalance = thousandSeperator(props.actualAmount.toFixed(2));
  } else {
    if (props.actualAmount > WITHDRAW_FEE) {
      displayBalance = thousandSeperator(
        (props.actualAmount - WITHDRAW_FEE).toFixed(2)
      );
    } else {
      displayBalance = "-";
    }
  }

  return (
    <div className={style.standard + " flex flex-col"}>
      <div className="flex flex-row mb-24">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center font-medium text-4xl merchant-pink">
            {displayBalance}
          </div>
          <div className="flex justify-center font-normal text-lg merchant-grey">
            <Trans i18nKey="transactions.balance">Balance</Trans> (
            <Trans i18nKey="transactions.baht">Baht</Trans>)
          </div>
        </div>
      </div>

      <div className="flex flex-row mb-24">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center font-medium text-3xl">
            {thousandSeperator(props.totalAmount.toFixed(2))}
          </div>
          <div className="flex justify-center font-normal text-xs merchant-grey">
            <Trans i18nKey="transactions.income">Income</Trans> (
            <Trans i18nKey="transactions.baht">Baht</Trans>)
          </div>
        </div>
      </div>

      <div className="flex flex-row mb-16">
        <div className="flex flex-col w-1/2">
          <div className="flex justify-center font-medium text-3xl">
            {thousandSeperator(props.totalFee.toFixed(2))}
          </div>
          <div className="flex justify-center font-normal text-xs merchant-grey">
            <Trans i18nKey="transactions.service-fee">Service Fee</Trans> (
            <Trans i18nKey="transactions.baht">Baht</Trans>)
          </div>
        </div>
        <div className="flex flex-col w-1/2">
          <div className="flex justify-center font-medium text-3xl">
            {props.actualAmount >= amountForNoFee ? 0 : WITHDRAW_FEE}
          </div>
          <div className="flex justify-center font-normal text-xs merchant-grey">
            <Trans i18nKey="transactions.withdraw-fee">Withdraw Fee</Trans> (
            <Trans i18nKey="transactions.baht">Baht</Trans>)
          </div>
        </div>
      </div>

      <div className="flex flex-row mb-32">
        <div className="flex w-full justify-center merchant-grey small-text">
          *<Trans i18nKey="transactions.withdraw-fee-condition" />
        </div>
      </div>

      <div className="flex flex-row">
        <div className="flex w-full justify-center">
          <Fab
            disabled={
              props.actualAmount > WITHDRAW_FEE && props.isConfirmedAccount
                ? false
                : true
            } //ถ้าถอนเงินต่ำกว่า 50000 จะต้องเสีย 20 บาท
            variant="extended"
            aria-label="withdraw"
            className="merchant-button px-40"
            onClick={() => {
              const {
                isDisplayAlertModal,
                alertModalMessage,
              } = props.getAlertWithdrawMessage();

              if (isDisplayAlertModal) {
                props._self.setState({
                  withdrawModal: false,
                  alertModal: true,
                  alertModalMessage: alertModalMessage,
                });
                props.toggleDialog(props.dialogName);
              } else {
                props.toggleDialog("withdrawModal");
              }

              props.pushTrackingData(
                "Click",
                "Click withdraw button to show withdraw modal"
              );
            }}
          >
            <Trans i18nKey="transactions.withdraw">Withdraw</Trans>
          </Fab>
        </div>
      </div>
    </div>
  );
};

export default MoneyCard;
