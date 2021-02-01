import React from "react";
import { Trans } from "react-i18next";
import Button from "@material-ui/core/Button";

const Transactions = props => {
    const thousandSeperator = number => {
        number = Number(number).toFixed(2);
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    return (
        <React.Fragment>
            { !props.isHiddenRow ? (
                <div>
                    <div className="flex p-20 text-center">
                        <div className="w-2/5 md:w-1/4">{props.date}</div>
                        <div className="w-full text-left pl-16 md:pl-64">
                            <div>
                                {props.description}
                                {/* <Trans i18nKey="transactions.payment-from-order">Payment from order</Trans> #{props.orderID} */}
                            </div>
                            <div className="merchant-grey">
                                {props.action === "DEPOSIT" ? (
                                    <span>
                                        <Trans i18nKey="transactions.from">From: </Trans> {props.customerName}
                                    </span>
                                ) : (
                                    <div>
                                        <div><Trans i18nKey="transactions.to">To: </Trans> {props.accountName}</div>
                                        <div>
                                            <div>{ props.invoiceFileUrl.length > 0 ? <Button className="mr-4" color="primary" href={props.invoiceFileUrl} target="_blank"><Trans className="merchant-pink" i18nKey="transactions.download-invoice">Download invoice</Trans></Button> : "" }</div>
                                            <div>{ props.orderFileUrl.length > 0 ? <Button color="primary" href={props.orderFileUrl} target="_blank"><Trans i18nKey="transactions.download-order">Download order</Trans></Button> : "" }</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-1/4">
                            {props.action === "DEPOSIT" ? thousandSeperator(props.amount) : ""}
                        </div>
                        <div className="w-1/4">
                            {props.action === "DEPOSIT" ? thousandSeperator(props.fee) : ""}
                        </div>
                        <div className={props.action === "DEPOSIT" ? "w-1/4 text-green" : "w-1/4 merchant-red"}>
                            {props.action === "DEPOSIT" ? "+" : "-"}
                            {thousandSeperator(props.actualAmount)}
                        </div>
                    </div>
                    <div className="merchant-cell-border ml-16 mr-16"></div>
                </div>
                
            ) : null }
        </React.Fragment>
    );
};

export default Transactions;
