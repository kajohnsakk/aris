import React, { Component } from "react";
import { FusePageSimple } from "@fuse";
import { withStyles, Icon, Tabs, Tab } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import OrdersTable from "./OrdersTable";
import withReducer from "app/store/withReducer";
import reducer from "../store/reducers";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import InputBase from "@material-ui/core/InputBase";
// import InputLabel from "@material-ui/core/InputLabel";
// import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import GetAppIcon from '@material-ui/icons/GetApp';

import {
    // Link,
    withRouter
} from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import * as Actions from "../store/actions";

import Cookies from "js-cookie";
import { UtilityManager } from "../../modules/UtilityManager";
import UtilityFunction from "../../modules/UtilityFunction";

import { Trans, withTranslation } from "react-i18next";
import i18n from "../../../i18n";

import classnames from "classnames";

import "./Orders.css";

const styles = theme => ({
    // card: {
    //     maxWidth: '100%',
    //     border: 'solid 1px #ededed',
    //     paddingBottom: 5
    // },
    // card: {
    //     backgroundColor: "#fff",
    //     maxWidth: "100%",
    //     [theme.breakpoints.up("lg")]: {
    //         paddingBottom: theme.spacing.unit,
    //         // border: 'solid 1px #ededed',
    //         overflow: "hidden",
    //         boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
    //         borderRadius: "4px",
    //         border: "2px solid transparent"
    //     }
    // },
    cardContent: {
        background: "#ffffff",
        // paddingTop: theme.spacing.unit,
        // paddingBottom: theme.spacing.unit,
        padding: "0px",
        [theme.breakpoints.up("lg")]: {
            padding: theme.spacing.unit * 2
        }
    },
    header: {
        background: "#fbfbfb",
        borderBottom: "solid 2px #ededed",
        color: "#8d9095",
        fontWeight: "bolder"
    },
    content: {
        background: "#ffffff",
        paddingTop: 5,
        paddingBottom: 5
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
            border: "0px"
        }
    },
    invertedButton: {
        background: "#ffffff",
        color: "#e83490",
        // fontWeight: 'bold',
        border: "1px solid #e83490",
        "&:hover": {
            background: "#ffffff",
            color: "#e83490",
            // fontWeight: 'bold',
            border: "1px solid #e83490"
        }
    },
    highlightText: {
        color: theme.palette.primary.color,
        fontWeight: "bolder"
    },
    loadingPage: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
    },
    datePicker: {
        width: "10em"
    }
});

const BootstrapInput = withStyles(theme => ({
    root: {
        "label + &": {
            marginTop: theme.spacing.unit * 3
        },
        fontFamily: "inherit"
    },
    input: {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #ced4da",
        fontSize: 14,
        width: "6em",
        minWidth: "7rem",
        padding: "10px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        fontFamily: "inherit",
        "&:focus": {
            borderRadius: 4,
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
        }
    }
}))(InputBase); 

class Orders extends Component {
    state = {
        auth0_uid: "",
        email: "",
        storeID: "",
        orderBy: "orderDate",
        orderTabValue: 0,
        tabFilterValue: new URLSearchParams(this.props.location.search).get("status") || "ALL",
        shippingStatus: new URLSearchParams(this.props.location.search).get("shipping") || "ALL",
        startDate: parseInt(new URLSearchParams(this.props.location.search).get("startDate")) || Date.now() - 2592000000 * 3,
        endDate: parseInt(new URLSearchParams(this.props.location.search).get("endDate")) || Date.now(),
        dateFilter: "orderDate",
        isLoading: true // prevent people from changing tab too fast causing getOrders to be called multiple times
    };
    pageCategory = "Orders";

    componentDidMount() {
        // let cookieValue = Cookies.get('email');
        let cookieValue = Cookies.get("auth0_uid");

        UtilityManager.getInstance()
            .storeInfoLookup(cookieValue)
            .then(resultStoreInfo => {
                this.setState({
                    auth0_uid: resultStoreInfo[0].auth0_uid,
                    email: resultStoreInfo[0].email,
                    storeID: resultStoreInfo[0].storeID
                });

                UtilityFunction.tagManagerPushDataLayer(
                    this.pageCategory,
                    "View",
                    "View orders page",
                    UtilityFunction.getExistValue(resultStoreInfo[0].auth0_uid, "Anonymous")
                );
            });
        
        let status = new URLSearchParams(this.props.location.search).get("status")
        if(status === "ALL")
            this.setState({ orderTabValue : 0 })
        else if(status === "SUCCESS")
            this.setState({ orderTabValue : 1 })
        else if(status === "PENDING")
            this.setState({ orderTabValue : 2 })
        else if(status === "FAILED")
            this.setState({ OrderTabValue : 3 })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.exportOrderUrl !== prevProps.exportOrderUrl) {
            window.location.href = this.props.exportOrderUrl;
        }
    };

    componentWillUnmount() {
        this.pushTrackingData("Leave", "Leave orders page");
        this.props.clearOrders();
    }

    pushTrackingData = (pageAction, pageLabel) => {
        // let email = UtilityFunction.getExistValue(this.state.email, "Anonymous");
        let auth0_uid = UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous");
        UtilityFunction.tagManagerPushDataLayer(this.pageCategory, pageAction, pageLabel, auth0_uid);
    };

    setIsLoading = () =>{
        this.setState({ isLoading: !this.state.isLoading });
    }

    resetShippingStatus =  () => {
        this.setState({ shippingStatus: "ALL"} )
    }

    handleExportButton = e => {
        e.preventDefault();

        this.pushTrackingData("Click", "Export orders button");
        this.pushTrackingData("Export", "Export orders");
        const { storeID, tabFilterValue, startDate, endDate, dateFilter } = this.state;
        if (tabFilterValue === "ALL") {
            this.props.exportOrders({
                storeID: storeID,
                startDate: startDate,
                endDate: endDate,
                dateFilter: dateFilter
            });
        } else {
            this.props.exportOrders({
                storeID: storeID,
                status: tabFilterValue,
                startDate: startDate,
                endDate: endDate,
                dateFilter: dateFilter
            });
        }
    };

    handleTabChange = (e, newIndex) => {
        let newTabFilterValue = "ALL";

        if (newIndex === 0) {
            newTabFilterValue = "ALL";
        } else if (newIndex === 1) {
            newTabFilterValue = "SUCCESS";
        } else if (newIndex === 2) {
            newTabFilterValue = "PENDING";
        } else if (newIndex === 3) {
            newTabFilterValue = "FAILED";
        }

        let orderBy = "";
        if (newTabFilterValue === "SUCCESS") {
            orderBy = "paymentStatus";
        } else {
            orderBy = "orderDate";
        }

        this.setState({
            orderTabValue: newIndex,
            tabFilterValue: newTabFilterValue,
            orderBy: orderBy
        });
    };

    handleShippingStatus = status => {
        this.setState({shippingStatus: status});
    }

    setStartDate = date => {
        const newDate = new Date(new Date(new Date(new Date(date.setHours(0)).setMinutes(0)).setSeconds(0)).setMilliseconds(0)).getTime();
        this.setState({ startDate: newDate });
        const { storeID, tabFilterValue, endDate, dateFilter } = this.state;
        this.props.getOrders({
            storeID: storeID,
            status: tabFilterValue,
            // startDate: Math.floor(newDate / 1000),
            startDate: newDate,
            endDate: endDate,
            dateFilter: dateFilter
        });
    };

    setEndDate = date => {
        const newDate = new Date(new Date(new Date(new Date(date.setHours(23)).setMinutes(59)).setSeconds(59)).setMilliseconds(999)).getTime();
        this.setState({ endDate: newDate });
        const { storeID, tabFilterValue, startDate, dateFilter } = this.state;
        this.props.getOrders({
            storeID: storeID,
            status: tabFilterValue,
            startDate: startDate,
            endDate: newDate,
            dateFilter: dateFilter
        });
    };

    handleDateFilter = e => {
        this.setState({ [e.target.name]: e.target.value });
        const { storeID, tabFilterValue, startDate, endDate } = this.state;
        this.props.getOrders({
            storeID: storeID,
            status: tabFilterValue,
            startDate: startDate,
            endDate: endDate,
            dateFilter: e.target.value
        });
    };

    render() {
        const { classes, searchText, setSearchText } = this.props;
        const { storeID, orderTabValue, tabFilterValue, shippingStatus, isLoading} = this.state;
        return (
            <FusePageSimple
                classes={
                    {
                        // root: {}
                    }
                }
                content={
                    <div className="lg:p-16 mb-16">
                        <div className="flex lg:flex-row flex-col flex-reverse lg:items-center items-start rounded-lg shadow mb-16 bg-white">
                            <div className="flex-1 text-left">
                                <Tabs value={orderTabValue} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary">
                                    <Tab
                                        className="h-64 normal-case main-font text-base min-w-80"
                                        label={i18n.t("orders.orders-tab-status-title-all")}
                                        disabled={isLoading}
                                    />
                                    <Tab
                                        className="h-64 normal-case main-font text-base min-w-80"
                                        label={i18n.t("orders.orders-tab-status-title-success")}
                                        disabled={isLoading}

                                    />
                                    <Tab
                                        className="h-64 normal-case main-font text-base min-w-80"
                                        label={i18n.t("orders.orders-tab-status-title-pending")}
                                        disabled={isLoading}
                                    />
                                    <Tab
                                        className="h-64 normal-case main-font text-base min-w-80"
                                        label={i18n.t("orders.orders-tab-status-title-failed")}
                                        disabled={isLoading}
                                    />
                                </Tabs>
                            </div>
                            <div className="flex w-full lg:my-0 my-12 lg:justify-end lg:ml-0 sm:ml-12">
                                <div className="flex justify-end lg:flex-row flex-col h-full w-full sm:ml-0 ml-12">
                                    <div className="flex sm:flex-row flex-col sm:mx-8">
                                        <div className="flex items-center mr-12">
                                            <NativeSelect name="dateFilter" value={this.state.dateFilter} onChange={this.handleDateFilter} input={<BootstrapInput />}>
                                                <option value="orderDate">
                                                    {i18n.t("orders.order-date")}
                                                </option>
                                                <option value="paymentCompletedOn">
                                                    {i18n.t("orders.order-paid-date")}
                                                </option>
                                            </NativeSelect>
                                        </div>
                                    
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker
                                                keyboard
                                                className={classes.datePicker + " mr-8 main-font sm:mt-0 mt-8"}
                                                label={<span className="main-font">{i18n.t("orders.orders-start-date")}</span>}
                                                format={"dd/MM/yyyy"}
                                                placeholder="10/10/2018"
                                                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                                                value={this.state.startDate}
                                                onChange={this.setStartDate}
                                                disableOpenOnEnter
                                                animateYearScrolling={false}
                                            />
                                            <DatePicker
                                                keyboard
                                                className={classes.datePicker + " main-font sm:mt-0 mt-8"}
                                                label={<span className="main-font">{i18n.t("orders.orders-end-date")}</span>}
                                                format={"dd/MM/yyyy"}
                                                placeholder="10/10/2018"
                                                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                                                value={this.state.endDate}
                                                onChange={this.setEndDate}
                                                disableOpenOnEnter
                                                animateYearScrolling={false}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                    <div className="flex py-8">
                                        <div className="flex items-center border border-2 border-teal py-2 px-8 rounded-full mr-8 h-10 w-2/3">
                                            <Icon className="mr-8" color="action">
                                                search
                                            </Icon>
                                            <input
                                                className="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                                                type="text"
                                                placeholder={i18n.t("orders.order-input-search-placeholder")}
                                                value={searchText}
                                                onChange={setSearchText}
                                            />
                                        </div>
                                        <button
                                            className={classnames(classes.invertedButton, "flex items-center whitespace-no-wrap py-4 ml-2 mr-16 px-16 rounded-full")}
                                            onClick={this.handleExportButton}
                                        >
                                            <GetAppIcon />
                                            <Trans i18nKey="main.download-file">Download</Trans>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={classes.card + " relative"}>
                            <div className="flex flex-col items-center rounded-lg shadow mb-16 bg-white">
                                {storeID !== "" ? (
                                    <OrdersTable
                                        storeID={storeID}
                                        status={tabFilterValue}
                                        shippingStatus={shippingStatus}
                                        handleShippingStatus={this.handleShippingStatus}
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        dateFilter={this.state.dateFilter}
                                        resetShippingStatus={this.resetShippingStatus}
                                        orderBy={this.state.orderBy}
                                        isLoading={this.state.isLoading}
                                        setIsLoading={this.setIsLoading}
                                    />
                                ) : null}
                            </div>
                            
                        </div>
                    </div>
                }
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setSearchText: Actions.setOrdersSearchText,
            exportOrders: Actions.exportOrders,
            clearOrders: Actions.clearOrders,
            getOrders: Actions.getOrders
        },
        dispatch
    );
}

function mapStateToProps({ ordersApp }) {
    return {
        searchText: ordersApp.orders.searchText,
        exportOrderUrl: ordersApp.orders.exportOrderUrl
    };
}

export default withReducer(
    "ordersApp",
    reducer
)(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(styles, { withTheme: true })(Orders)))));
// export default withReducer('ordersApp', reducer)(Orders);
