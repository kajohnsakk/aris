import React, { Component } from "react";
import { Trans } from "react-i18next";
import CircularProgress from "@material-ui/core/CircularProgress";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import withReducer from "app/store/withReducer";
// import * as Actions from "../store/actions";
import reducer from "../store/reducers";

import Transactions from "./Transactions";

import style from "./style";

class TransactionsTable extends Component {
    state = {
        transactionsLists: null,
        currentPage: 1,
        rowsPerPage: 50,
        maxDisplayPage: 5,
        fundsTransactions: null,
        searchOrderID: ""
    };

    componentDidMount = async () => {
        if (this.props.fundsTransactions) {
            this.updateTransactionsListsAndTotalAmount();
        }
    };

    componentDidUpdate = () => {
        if (this.props.fundsTransactions && !this.state.transactionsLists) {
            this.updateTransactionsListsAndTotalAmount();
        }

        if( this.state.searchOrderID !== this.props.searchOrderID ) {
            this.setState({ searchOrderID: this.props.searchOrderID }, () => {
                this.updateTransactionsListsAndTotalAmount();
            });
        }
    };

    sortedTransactions = fundTransactions => {
        return fundTransactions.sort((a, b) => b.createdAt - a.createdAt);
    };

    findLastWithdrawTime = fundTransactions => {
        let lastWithdrawTime = 0;

        for(let i=0; i<fundTransactions.length; i++) {
            if( fundTransactions[i]['type'] === "WITHDRAW" ) {
                lastWithdrawTime = fundTransactions[i]['createdAt'];
                break;
            }
        }

        return Promise.resolve(lastWithdrawTime);
    }

    convertTo2decimal = (processNumber) => {
        return Math.round( (processNumber)  * 100) / 100;
    }

    processFundsTransactions = (transactions) => {
        let totalWithdraw = 0;
        let totalDeposit = 0;
        let depositFundsTransactionList = [];
        let summary = { deposit: 0, depositFee: 0, withdraw: 0, withdrawFee: 0 };

        let countTransactions = transactions.length;
        for( let i = countTransactions - 1; i >= 0; i-- ) {
            if( transactions[i]['type'] === 'WITHDRAW' ) {
                totalWithdraw = this.convertTo2decimal( (totalWithdraw + Number(transactions[i]['amount'])) );
            }
        }

        for( let i = countTransactions - 1; i >= 0; i-- ) {
            if( transactions[i]['type'] === 'DEPOSIT' ) {
                totalDeposit = this.convertTo2decimal( (totalDeposit + Number(transactions[i]['actualAmount'])) );
            
                if( totalWithdraw < totalDeposit ) {
                    depositFundsTransactionList.push(transactions[i]);
                    // totalFee = this.convertTo2decimal( (totalFee + Number(transactions[i]['fee'])) );
                }
            
            }
        }

        
        for(let i = 0; i < depositFundsTransactionList.length; i++) {
            let fundsTransactions = depositFundsTransactionList[i];
            if( fundsTransactions['type'] === 'DEPOSIT' ) {
                summary['deposit'] = this.convertTo2decimal( (summary['deposit'] + Number(fundsTransactions['amount'])) );
                summary['depositFee'] = this.convertTo2decimal( (summary['depositFee'] + Number(fundsTransactions['fee'])) );
            } else {
                summary['withdraw'] = this.convertTo2decimal( (summary['withdraw'] + Number(fundsTransactions['amount'])) );
                summary['withdrawFee'] = this.convertTo2decimal( (summary['withdrawFee'] + Number(fundsTransactions['fee'])) );
            }
        }

        return {
            totalAmount: this.convertTo2decimal( ( summary['deposit'] - summary['withdraw'] ) ),
            totalFee: this.convertTo2decimal( summary['depositFee'] )
        };
    }

    updateTransactionsListsAndTotalAmount = async () => {
        var transactionsLists = [];
        var description = "";
        const searchOrderID = this.state.searchOrderID;
        const sortedTransactions = this.props.fundsTransactions;
        const summaryTransactions = this.processFundsTransactions(sortedTransactions);
        sortedTransactions.forEach((transaction, index) => {

            if (transaction.type === "DEPOSIT") {
                description = (
                    <span>
                        <Trans i18nKey="transactions.payment-from-order">Payment from order</Trans> #{transaction.orderInfo.orderID}
                    </span>
                );
                transactionsLists.push(
                    <Transactions
                        key={index}
                        customerName={transaction.orderInfo.customerName}
                        date={this.convertDate(transaction.createdAt)}
                        action={transaction.type}
                        description={description}
                        accountName={this.props.paymentInfo.accountName}
                        amount={transaction.amount}
                        fee={transaction.fee}
                        actualAmount={transaction.actualAmount}
                        orderID={transaction.orderInfo.orderID}
                        invoiceFileUrl=""
                        orderFileUrl=""
                        isHiddenRow={ searchOrderID.length > 0 && transaction['orderInfo']['orderID'].search(searchOrderID) === -1 }
                    />
                );
            } else if (transaction.type === "WITHDRAW") {
                description = <Trans i18nKey="transactions.withdraw">Withdraw</Trans>;
                transactionsLists.push(
                    <Transactions
                        key={index}
                        customerName={transaction.orderInfo.customerName}
                        date={this.convertDate(transaction.createdAt)}
                        action={transaction.type}
                        description={description}
                        accountName={this.props.paymentInfo.accountName}
                        amount=""
                        fee=""
                        actualAmount={transaction.actualAmount}
                        orderID={transaction.orderInfo.orderID}
                        invoiceFileUrl={ transaction.withdrawInfo.hasOwnProperty('invoiceFileUrl') ? transaction.withdrawInfo.invoiceFileUrl : "" }
                        orderFileUrl={ transaction.withdrawInfo.hasOwnProperty('orderFileUrl') ? transaction.withdrawInfo.orderFileUrl : "" }
                        isHiddenRow={ searchOrderID.length > 0 && transaction['orderInfo']['orderID'].search(searchOrderID) === -1 }
                    />
                );
            }
        });

        this.setState({ transactionsLists: transactionsLists });
        this.props.updateBalance( summaryTransactions['totalAmount'], summaryTransactions['totalFee']);
    };

    checkSearchOrderID = (searchOrderID, transaction) => {
        return ( searchOrderID.length > 0 && transaction['orderInfo']['orderID'] );
    };

    convertDate = time => {
        const date = new Date(time);
        var newDate = date
            .toISOString()
            .split("T")[0]
            .split("-");
        newDate = newDate[2] + "-" + newDate[1] + "-" + newDate[0][2] + newDate[0][3];
        return newDate;
    };

    pageButton = () => {
        var buttons = [];
        if (this.state.transactionsLists) {
            var maxDisplayPage = this.state.maxDisplayPage;
            var startPage = Math.max(this.state.currentPage - Math.floor(maxDisplayPage / 2), 1);
            var totalPage = Math.ceil(this.state.transactionsLists.length / this.state.rowsPerPage);
            var endPage = Math.min(this.state.currentPage + Math.floor(maxDisplayPage / 2), totalPage);
            if( endPage - startPage !== (maxDisplayPage - 1) ) {
                if( endPage === totalPage ) {
                    startPage = Math.max(startPage - ( maxDisplayPage - (endPage - startPage) - 1 ), 1);
                } else {
                    endPage = Math.min(endPage + ( maxDisplayPage - (endPage - startPage) - 1 ), totalPage);
                }
            }

            buttons.push(
                <button
                    key="First"
                    className={this.state.currentPage === 1 ? "merchant-page-text-active-btn mr-8" : "merchant-page-text-btn mr-8" }
                    onClick={this.changePage}
                    value={1}
                >
                    First
                </button>
            );
            buttons.push(
                <button
                    key="Previous"
                    className={this.state.currentPage === 1 ? "merchant-page-text-active-btn mr-8" : "merchant-page-text-btn mr-8" }
                    onClick={this.changePage}
                    value={this.state.currentPage - 1}
                >
                    {"<"}
                </button>
            );

            for (let i = startPage; i <= endPage; i++) {
                buttons.push(
                    <button
                        key={i}
                        className={this.state.currentPage === i ? "merchant-page-btn-active cursor-default" : "merchant-page-btn"}
                        onClick={this.changePage}
                        value={i}
                    >
                        {i}
                    </button>
                );
            }

            buttons.push(
                <button
                    key="Next"
                    className={this.state.currentPage === totalPage ? "merchant-page-text-active-btn ml-8" : "merchant-page-text-btn ml-8" }
                    onClick={this.changePage}
                    value={this.state.currentPage + 1}
                >
                    {">"}
                </button>
            );
            buttons.push(
                <button
                    key="Last"
                    className={this.state.currentPage === totalPage ? "merchant-page-text-active-btn ml-8" : "merchant-page-text-btn ml-8" }
                    onClick={this.changePage}
                    value={totalPage}
                >
                    Last
                </button>
            );

        }
        return buttons;
    };

    changePage = event => {
        this.setState({ currentPage: Number(event.target.value) }, () => { 
            window.location.hash = "#root";
            window.location.hash = "";
        });
    };

    render() {
        return (
            <div className={style.standard + " merchant-p0 mt-0 md:my-16"} id="merchant">
                <div className="merchant-table-header merchant-grey p-20 text-center">
                    <div className="flex">
                        <div className="w-2/5 md:w-1/4">
                            <Trans i18nKey="transactions.date">Date</Trans>
                        </div>
                        <div className="w-full text-left pl-16 md:pl-64">
                            <Trans i18nKey="transactions.details">Details</Trans>
                        </div>
                        <div className="w-1/4">
                            <Trans i18nKey="transactions.total">Total</Trans>
                        </div>
                        <div className="w-1/4">
                            <Trans i18nKey="transactions.fee">Fee</Trans>
                        </div>
                        <div className="w-1/4">
                            <Trans i18nKey="transactions.amount">Amount</Trans>
                        </div>
                    </div>
                </div>
                <div className="border-color-gradient">
                    <div className="bg-white"></div>
                </div>

                {this.state.transactionsLists ? (
                    this.state.transactionsLists.map((transactions, index) => {
                        if (
                            index >= (this.state.currentPage - 1) * this.state.rowsPerPage &&
                            index < this.state.currentPage * this.state.rowsPerPage
                        ) {
                            return transactions;
                        } else {
                            return "";
                        }
                    })
                ) : (
                    <div className="w-full flex justify-center items-center p-36">
                        <CircularProgress className="merchant-pink" />
                    </div>
                )}
                {this.state.transactionsLists && this.state.transactionsLists.length > 0 ? (
                    <div className="flex justify-center merchant-table-footer">{this.pageButton()}</div>
                ) : (
                    ""
                )}
                {this.state.transactionsLists && this.state.transactionsLists.length === 0 ? (
                    <div className="text-center merchant-grey text-lg p-40">
                        <Trans i18nKey="transactions.no-transactions">No transactions</Trans>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            // getOrders: Actions.getOrders
        },
        dispatch
    );
}

function mapStateToProps({ transactionsTable }) {
    return {
        orders: transactionsTable.orders.data,
        searchText: transactionsTable.orders.searchText
    };
}

export default withReducer("transactionsTable", reducer)(
    withRouter(
        connect(
            mapStateToProps,
            mapDispatchToProps
        )(TransactionsTable)
    )
);
