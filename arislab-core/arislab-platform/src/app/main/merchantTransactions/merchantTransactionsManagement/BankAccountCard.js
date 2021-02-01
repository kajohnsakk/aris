import React from "react";
import { Trans } from "react-i18next";

import style from "./style";

const BankAccountCard = (props) => {
  var flex = "flex";
  if (props.isExisting) {
    flex = "flex justify-between";
  }

  const secureBankNumber = (bankNumber) => {
    var newBankNumber = "";
    for (let i = 0; i < bankNumber.length; i++) {
      if (i > 1 && i < 9 && bankNumber[i] !== "-") {
        newBankNumber += "*";
      } else {
        newBankNumber += bankNumber[i];
      }
    }
    return newBankNumber;
  };

  return (
    <div className={style.standard + " p-32"}>
      <div className={flex}>
        <div className="merchant-grey text-lg">
          <Trans i18nKey="transactions.account">Bank account</Trans>
        </div>
        {props.isExisting ? (
          <button
            className="flex items-center"
            onClick={() => {
              props.toggleDialog("sendBankAccountOTPModal");
              props.handleChangeBankAccount();
              props.pushTrackingData(
                "Click",
                "Click change bank account button"
              );
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.82244 3.175C8.09744 2.45 7.10244 2 5.99744 2C3.78744 2 2.00244 3.79 2.00244 6C2.00244 8.21 3.78744 10 5.99744 10C7.86244 10 9.41744 8.725 9.86244 7H8.82244C8.41244 8.165 7.30244 9 5.99744 9C4.34244 9 2.99744 7.655 2.99744 6C2.99744 4.345 4.34244 3 5.99744 3C6.82744 3 7.56744 3.345 8.10744 3.89L6.49744 5.5H9.99744V2L8.82244 3.175Z"
                fill="#999999"
              />
            </svg>

            <div className="merchant-grey">
              <Trans i18nKey="transactions.change">Change</Trans>
            </div>
          </button>
        ) : (
          <React.Fragment>
            <div className="warning-icon-container">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.25 0C2.8 0 0 2.8 0 6.25C0 9.7 2.8 12.5 6.25 12.5C9.7 12.5 12.5 9.7 12.5 6.25C12.5 2.8 9.7 0 6.25 0ZM5.625 9.37499V8.12499H6.875V9.37499H5.625ZM5.625 3.12501V6.87501H6.875V3.12501H5.625Z"
                  fill="#FF0000"
                />
              </svg>
            </div>
          </React.Fragment>
        )}
      </div>
      <div>
        <div className="flex items-center justify-center merchant-grey bank-account-container rounded-20 h-136 mt-16">
          {props.isExisting ? (
            <div className="w-full h-full p-20 flex flex-col justify-between">
              <div className="flex justify-between w-full">
                <div>{props.bankName}</div>
                {props.isConfirmedAccount ? (
                  <div className="text-green">
                    <Trans i18nKey="transactions.approved">Approved</Trans>
                  </div>
                ) : (
                  <div className="merchant-red">
                    <Trans i18nKey="transactions.pending">Pending</Trans>
                  </div>
                )}
              </div>
              <div className="text-2xl text-black">
                {secureBankNumber(props.bankNumber)}
              </div>
              <div className="text-m">{props.bankHolderName}</div>
            </div>
          ) : (
            <button
              className="flex items-center merchant-grey"
              onClick={() => {
                props.toggleDialog("sendBankAccountOTPModal");
                props.pushTrackingData(
                  "Click",
                  "Click add bank account button"
                );
              }}
            >
              <svg
                className="pr-6"
                width="48"
                height="48"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="17"
                  cy="17.0353"
                  rx="16"
                  ry="16.0353"
                  stroke="url(#paint0_linear)"
                  strokeWidth="0.6"
                />
                <path
                  d="M16.0681 16.0094H12V17.6604H16.0681V22H17.9319V17.6604H22V16.0094H17.9319V12H16.0681V16.0094Z"
                  fill="url(#paint1_linear)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="-13.0913"
                    y1="-78.2923"
                    x2="-1.06804"
                    y2="-81.3411"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FCAF4E" />
                    <stop offset="1" stopColor="#ED3590" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="22"
                    y1="12"
                    x2="9.00762"
                    y2="12.3559"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#ED3590" />
                    <stop offset="0.515625" stopColor="#F14655" />
                    <stop offset="1" stopColor="#FCB04E" />
                  </linearGradient>
                </defs>
              </svg>
              <Trans i18nKey="transactions.addAccount">Add bank account</Trans>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankAccountCard;
