import React, { Component } from "react";
import { Table, TableBody, TableCell, TablePagination, TableRow, Checkbox, CircularProgress, Tooltip } from "@material-ui/core";
import { FuseScrollbars, FuseUtils } from "@fuse";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import _ from "@lodash";
import OrdersTableHead from "./OrdersTableHead";
import axios from "axios"
// import OrdersStatus from './';
import * as Actions from "../store/actions";
import * as moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import PublishIcon from '@material-ui/icons/Publish';
// import InfoIcon from '@material-ui/icons/Info';

import { Trans, withTranslation } from "react-i18next";
import OrderModal from "./OrderModal";
import UploadCsvModal from "./UploadCsvModal";
// import OrderDetails from "./OrderDetails";
// import editButton from "../../../../public/images/edit-button.svg";

// const host = AppConfig.API_URL;
import styles from "../styles/styles"

const CustomTableCell = withStyles({
    root: {
        padding: 0
    },
    body: {
        fontSize: "1.4rem",
        fontWeight: "300"
    }
})(TableCell);

class OrdersTable extends Component {
    constructor(props) {
        super(props)
    
        this.fileInput = React.createRef()
      }

    state = {
        order: "desc",
        orderBy: this.props.orderBy,
        selected: [],
        data: this.props.orders && this.props.orders.length > 0 ? this.props.orders : null,
        page: parseInt(new URLSearchParams(this.props.location.search).get("page")) || 0,
        rowsPerPage: parseInt(new URLSearchParams(this.props.location.search).get("row")) || 10,
        isLoading: this.props.orders && this.props.orders.length > 0 ? false : true,
        orderModal: false,
        orderModalData: null,
        orderDetails: false,
        uploadCsvModal: false,
        isTrackingUpdated: false
    };

    componentDidMount() {
        const { storeID, status, startDate, endDate, dateFilter } = this.props;
        this.props.getOrders({
            storeID: storeID,
            status: new URLSearchParams(this.props.location.search).get("status") || status,
            startDate: parseInt(new URLSearchParams(this.props.location.search).get("startDate")) || startDate,
            endDate: parseInt(new URLSearchParams(this.props.location.search).get("endDate")) || endDate,
            dateFilter: dateFilter
        });
        this.props.history.push(`/platform/orders?page=${this.state.page}&row=${this.state.rowsPerPage}&startDate=${this.props.startDate}&endDate=${this.props.endDate}&status=${this.props.status}&shipping=${this.props.shippingStatus}`) 
    }

    componentWillReceiveProps() {
    }

    componentDidUpdate (prevProps, prevState) {
        const { storeID, status, startDate, endDate, dateFilter } = this.props;

        if (this.props.isLoading !== this.state.isLoading) {
            this.props.setIsLoading();
        }

        if (this.props.status !== prevProps.status) {
                this.props.resetShippingStatus();

                this.props.clearOrders();
                this.setState({
                    selected: [],
                    isLoading: true,
                    data: null,
                });
                this.props.setIsLoading();
                this.props.getOrders({
                    storeID: storeID,
                    status: status,
                    startDate: startDate,
                    endDate: endDate,
                    dateFilter: dateFilter,
                });
                this.props.history.push(`/platform/orders?page=${page}&row=${this.state.rowsPerPage}&startDate=${this.props.startDate}&endDate=${this.props.endDate}&status=${this.props.status}&shipping=${this.props.shippingStatus}`)
        }

        if (
            (this.props.orders &&
                (!_.isEqual(this.props.searchText, prevProps.searchText) ||
                    !this.state.data ||
                    !_.isEqual(this.props.startDate, prevProps.startDate) ||
                    !_.isEqual(this.props.endDate, prevProps.endDate))) ||
            this.props.shippingStatus !== prevProps.shippingStatus || (!_.isEqual(prevProps.orders, this.props.orders))
        ) {
            var data = this.getFilteredArray(this.props.orders, this.props.searchText);
            var page = this.state.page;
            if(data){
                while(data.length < page * this.state.rowsPerPage){
                    page = page - 1;
                }
            } else {
                page = 0;
            }
            this.setState({ page : page })
            this.setState({ data, isLoading: false, orderBy: this.props.orderBy, isTrackingUpdated: false });
            this.props.history.push(`/platform/orders?page=${page}&row=${this.state.rowsPerPage}&startDate=${this.props.startDate}&endDate=${this.props.endDate}&status=${this.props.status}&shipping=${this.props.shippingStatus}`)
        }
    }

    filterArrayByShippingStatus = (data, status) => {
        if (status === "ALL") {
            return data;
        } else if (status === "WAITING" || status === "SENT") {
            data.forEach((item, index, object) => {
                if (item.hasOwnProperty("shippingStatus")) {
                    if (item.shippingStatus !== status || item.shippingStatus === "N/A") {
                        object.splice(index, 1, "");
                    }
                } else {
                    object.splice(index, 1, "");
                }
            });
            const filteredData = data.filter(el => {
                return el !== "";
            });
            return filteredData;
        }
    };

    getFilteredArray = (data, searchText) => {
        if (searchText.length === 0) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, searchText);
    };

    filterArrayByDate = (data, startDate, endDate) => {
        let filteredArray = [];
        data.forEach(data => {
            if (startDate <= data.orderDate && data.orderDate <= endDate) {
                filteredArray.push(data);
            }
        });
        return filteredArray;
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = "desc";

        if (this.state.orderBy === property && this.state.order === "desc") {
            order = "asc";
        }

        this.setState({
            order,
            orderBy
        });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: this.state.data.map(n => n.orderID) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = item => {
        // this.props.history.push('/apps/e-commerce/orders/' + item.orderID);
        this.props.history.push("/platform/orders/" + item.orderID);
    };

    handleCheck = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        this.setState({ selected: newSelected });
    };

    loadPreviousPage = () => {
        let page = this.state.page - 1;
        this.props.history.push(`/platform/orders?page=${page}&row=${this.state.rowsPerPage}&startDate=${this.props.startDate}&endDate=${this.props.endDate}&status=${this.props.status}&shipping=${this.props.shippingStatus}`) 
        this.setState({ page: page })
    }

    loadNextPage = () => {
        let page = this.state.page + 1;
        this.props.history.push(`/platform/orders?page=${page}&row=${this.state.rowsPerPage}&startDate=${this.props.startDate}&endDate=${this.props.endDate}&status=${this.props.status}&shipping=${this.props.shippingStatus}`) 
        this.setState({ page: page })
    }

    handleChangePage = () => {

    }

    handleChangeRowsPerPage = event => {
        this.props.history.push(`/platform/orders?page=${this.state.page}&row=${event.target.value}&startDate=${this.props.startDate}&endDate=${this.props.endDate}&status=${this.props.status}&shipping=${this.props.shippingStatus}`) 
        this.setState({ rowsPerPage: event.target.value });
    };

    changeShippingStatus = async status => {
        for (const id of this.state.selected) {
            for (const el of this.state.data) {
                if (id === el.orderID) {
                    let docID = el.orderDocID;
                    let data = {
                        ...el,
                        shippingStatus: status
                    };
                    this.setState({ isLoading: true });
                    await this.props.updateOrders({ storeID: this.props.storeID, orderID: docID }, data);
                }
            }
        }
    };

    loading = () => {
        this.setState({ isLoading: true });
    };

    handleTrackingUpdate = () => {
        this.setState({ isTrackingUpdated: true });
    };

    renderShippingStatus = status => {
        if (status) {
            if (status === "SENT") {
                return (
                    <div className="inline text-12 p-4 rounded truncate bg-green text-black text-white">
                        <Trans i18nKey="orders.status-sent">จัดส่งแล้ว</Trans>
                    </div>
                );
            } else if (status === "WAITING") {
                return (
                    <div className="inline text-12 p-4 rounded truncate bg-orange text-black text-white">
                        <Trans i18nKey="orders.status-waiting">รอจัดส่ง</Trans>
                    </div>
                );
            } else if (status === "N/A") {
                return (
                    <div className="inline text-12 p-4 rounded truncate bg-grey-darkest text-black text-white">
                        <Trans i18nKey="orders.status-na">ไม่ระบุ</Trans>
                    </div>
                );
            }
        } else {
            return (
                <div className="inline text-12 p-4 rounded truncate bg-grey-darkest text-black text-white">
                    <Trans i18nKey="orders.status-na">ไม่ระบุ</Trans>
                </div>
            );
        }
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    toggleDialog = dialogName => {
        if (this.state[dialogName]) {
            this.setState({ error: "" });
        }
        this.setState({ [dialogName]: !this.state[dialogName] });
    };

    setOrderModalData = data => {
        this.setState({ orderModalData: data });
    };

    clickUpload = () => {
        this.fileInput.current.click()
    }

    handleUpload = (e) => {
        axios.post('/api/order/upload', e.target.files[0]
        ).then().catch();
    }

    render() {
        const { order, orderBy, selected, data, isLoading, orderModalData, orderModal, uploadCsvModal } = this.state;
        const { shippingStatus, classes, status } = this.props;
        let rowsPerPage = this.state.rowsPerPage;
        let page = this.state.page;
        const capitalizeFirstLetter = string => {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        if (data) {
            var newData = [...data];
            if (status === "SUCCESS" || status === "SUCCESS_CASH_ON_DELIVERY") {
                newData = this.filterArrayByShippingStatus(newData, shippingStatus);
                var sentOrders = this.filterArrayByShippingStatus([...data], "SENT");
                var waitingOrders = this.filterArrayByShippingStatus([...data], "WAITING");
            }
        }

        return (
            <React.Fragment>
                {/* <Modal
                    fullWidth={true}
                    isDisplayHorizontalDialog={this.state.orderModal}
                    toggleDialog={this.toggleDialog}
                    dialogName={"orderModal"}
                    pushTrackingData={this.pushTrackingData}
                > */}
                {uploadCsvModal ? (
                    <UploadCsvModal
                        fullWidth={true}
                        open={this.state.uploadCsvModal}
                        toggleDialog={this.toggleDialog}
                        dialogName={"uploadCsvModal"}
                        pushTrackingData={this.pushTrackingData}
                    ></UploadCsvModal>
                ) : (
                    <React.Fragment></React.Fragment>
                )}
                {orderModalData && orderModal ? (
                    <OrderModal
                        fullWidth={true}
                        open={this.state.orderModal}
                        toggleDialog={this.toggleDialog}
                        dialogName={"orderModal"}
                        pushTrackingData={this.pushTrackingData}
                        data={orderModalData}
                        loading={this.loading}
                        handleTrackingUpdate={this.handleTrackingUpdate}
                    />
                ) : (
                    <React.Fragment></React.Fragment>
                )}

                {/* </Modal> */}
                {/* <Modal
                    fullWidth={true}
                    isDisplayHorizontalDialog={this.state.orderDetails}
                    toggleDialog={this.toggleDialog}
                    dialogName={"orderDetails"}
                    pushTrackingData={this.pushTrackingData}
                >
                    <OrderDetails />
                </Modal> */}
                <div className="w-full flex flex-col overflow-y-hidden">
                    {this.props.status === "SUCCESS" ? (
                        <div className="flex flex-col sm:flex-row w-full shipping-tabs-container my-12 items-center justify-between">
                            <div className="flex items-center">
                                {data ? (
                                    <React.Fragment>
                                        {/* <div className="mr-4">
                                            <Trans i18nKey="orders.shipping-status">สถานะการจัดส่ง</Trans>:
                                        </div> */}
                                        <button
                                            className={"shipping-tabs py-12 px-8 md:ml-12 " + (this.props.shippingStatus === "ALL" ? "active" : "")}
                                            onClick={() => this.props.handleShippingStatus("ALL")}
                                        >
                                            <Trans i18nKey="orders.status-all">ทั้งหมด</Trans>
                                            <span> ({data.length})</span>
                                        </button>
                                        <button
                                            className={"shipping-tabs middle py-12 px-8 " + (this.props.shippingStatus === "WAITING" ? "active" : "")}
                                            onClick={() => this.props.handleShippingStatus("WAITING")}
                                        >
                                            <Trans i18nKey="orders.status-waiting">รอจัดส่ง</Trans>
                                            <span> ({waitingOrders.length})</span>
                                        </button>
                                        <button
                                            className={"shipping-tabs py-12 px-8 mr-4 " + (this.props.shippingStatus === "SENT" ? "active" : "")}
                                            onClick={() => this.props.handleShippingStatus("SENT")}
                                        >
                                            <Trans i18nKey="orders.status-sent">จัดส่งแล้ว</Trans>
                                            <span> ({sentOrders.length})</span>
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <div className="sm:pl-32 flex justify-center">
                                        <CircularProgress></CircularProgress>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-16 sm:mt-0 flex-grow">
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <Trans i18nKey="orders.change-shipping-status">เปลี่ยนสถานะการจัดส่ง</Trans>:
                                    </div>
                                    <button className="mr-4 bg-pink" onClick={() => this.changeShippingStatus("SENT")}>
                                        <div
                                            className={
                                                "inline p-4 rounded truncate text-black text-white " +
                                                (isLoading || !selected.length ? "bg-grey cursor-not-allowed" : "bg-green")
                                            }
                                        >
                                            <Trans i18nKey="orders.status-sent">จัดส่งแล้ว</Trans>
                                        </div>
                                    </button>
                                    <button className="mr-4 bg-orange" onClick={() => this.changeShippingStatus("WAITING")}>
                                        <div
                                            className={
                                                "inline p-4 rounded truncate text-black text-white " +
                                                (isLoading || !selected.length ? "bg-grey cursor-not-allowed" : "bg-orange")
                                            }
                                        >
                                            <Trans i18nKey="orders.status-waiting">รอจัดส่ง</Trans>
                                        </div>
                                    </button>
                                    {/* <div className="text-grey text-12">*<Trans i18nKey="orders.select-order-to-change-shipping-status">เลือกออเดอร์เพื่อเปลี่ยนสถานะการจัดส่ง</Trans> </div> */}
                                    {/* <button className="mr-4 bg-grey" onClick={() => this.changeShippingStatus("N/A")}>
                                <div className="inline text-12 p-4 rounded truncate bg-grey-darkest text-black text-white">ไม่ระบุ</div>
                            </button> */}
                                </div>
                            </div>
                            <div className="h-full flex items-center justify-end mt-12 sm:mt-0 md:mr-16 md:ml-16">
                                <input className="hidden" type="file" id="upload-csv" ref={this.fileInput} onChange={this.handleUpload} />
                                <button
                                    className={classes.invertedButton + " flex items-center ml-2 py-4 px-16 rounded-full"}
                                    // onClick={this.clickUpload}
                                    onClick={() => this.toggleDialog("uploadCsvModal")}
                                >
                                    <PublishIcon />
                                    <Trans i18nKey="main.upload-file">อัพโหลดไฟล์</Trans>
                                </button>
                                {/* <Tooltip
                                    classes={{ tooltip: classes.tooltip }}
                                    title={<Trans i18nKey="live-event.post-description-tooltips"></Trans>}
                                >
                                    <InfoIcon className={classes.tooltipDotBadge} />
                                </Tooltip> */}
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    <FuseScrollbars className="flex-grow overflow-x-auto">
                        <Table classes={{ root: classes.table }} aria-labelledby="tableTitle">
                            <OrdersTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={newData ? newData.length : 0}
                                status={status}
                                isLoading={isLoading}
                            />

                            {isLoading ? (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <div className="flex justify-center my-16">
                                                <CircularProgress color="primary" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ) : newData ? (
                                newData.length > 0 ? (
                                    <TableBody>
                                        {_.orderBy(
                                            newData,
                                            [
                                                (o) => {
                                                    switch (orderBy) {
                                                        // case 'id':
                                                        //     {
                                                        //         return parseInt(o.orderID, 10);
                                                        //     }

                                                        case 'customer':
                                                            {
                                                                if (o.deliveryInfo.customerName) {
                                                                    return o.deliveryInfo.customerName;
                                                                } else {
                                                                    return o.userInfo.firstName;
                                                                }
                                                            }

                                                        // case 'paymentStatus':
                                                        //     {
                                                        //         return o.paymentInfo.status;
                                                        //     }

                                                        case "items": {
                                                            return o.selectedProduct[0].productName;
                                                        }
                                                        case "price": {
                                                            return o.summary.grandTotal;
                                                        }
                                                        case "paymentStatus": {
                                                            return o.paymentInfo.paymentCompletedOn;
                                                        }
                                                        case "shipping": {
                                                            return o.shippingStatus;
                                                        }
                                                        default: {
                                                            return o[orderBy];
                                                        }
                                                    }
                                                },
                                            ],
                                            [order]
                                        )
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((n, index) => {
                                                const isSelected = this.isSelected(n.orderID);
                                                var totalItem = 0;
                                                return (
                                                    <TableRow
                                                        className="cursor-pointer"
                                                        hover
                                                        aria-checked={isSelected}
                                                        tabIndex={-1}
                                                        // key={n.orderID}
                                                        key={index}
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            this.setOrderModalData(n);
                                                            this.toggleDialog("orderModal");
                                                        }}
                                                    >
                                                        {this.props.status === "SUCCESS" ? (
                                                            <CustomTableCell padding="checkbox" className="relative pl-4 sm:pl-12 px-8">
                                                                <Checkbox
                                                                    color="primary"
                                                                    className="flex justify-center"
                                                                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                                                                    checked={isSelected}
                                                                    onClick={(event) => event.stopPropagation()}
                                                                    onChange={(event) => this.handleCheck(event, n.orderID)}
                                                                />
                                                            </CustomTableCell>
                                                        ) : (
                                                            <React.Fragment></React.Fragment>
                                                        )}

                                                        <CustomTableCell component="th" scope="row" align="center">
                                                            {n.orderID}
                                                        </CustomTableCell>

                                                        <CustomTableCell component="th" scope="row" align="center">
                                                            <div>
                                                                <p>{moment.unix(n.orderDate / 1000).format("DD/MM/YYYY")}</p>
                                                                <p>{moment.unix(n.orderDate / 1000).format("HH:mm:ss")}</p>
                                                            </div>
                                                        </CustomTableCell>

                                                        <CustomTableCell className="w-24" component="th" scope="row" padding="none">
                                                            <div>{`${n.deliveryInfo.customerName || n.userInfo.firstName + ' ' + n.userInfo.lastName} `}</div>
                                                            {/* <div>
                                                                {n.userInfo.firstName && n.userInfo.lastName ? (
                                                                    <p>{`${n.userInfo.firstName} ${n.userInfo.lastName}`}</p>
                                                                ) : null}
                                                                {n.paymentInfo.gbPaymentDetails.customerAddress ? (
                                                                    <p>{n.paymentInfo.gbPaymentDetails.customerAddress}</p>
                                                                ) : n.deliveryInfo.address1 ? (
                                                                    <div>
                                                                        <p>{n.deliveryInfo.address1}</p>
                                                                        <p>{n.deliveryInfo.subDistrict + " " + n.deliveryInfo.district}</p>
                                                                        <p>{n.deliveryInfo.province + " " + n.deliveryInfo.postalCode}</p>
                                                                    </div>
                                                                ) : (
                                                                    <p>-</p>
                                                                )}
                                                                <div>
                                                                    <Trans i18nKey="orders.order-phone">Phone</Trans>:{" "}
                                                                    {n.paymentInfo.gbPaymentDetails.customerTelephone || n.deliveryInfo.phoneNo || ""}
                                                                </div>
                                                            </div> */}
                                                            {/* {n.deliveryInfo.firstName + ' ' + n.deliveryInfo.lastName} */}
                                                        </CustomTableCell>

                                                        {/* <CustomTableCell component="th" scope="row">
                                                            <div style={{ lineHeight: 1.5, paddingTop: '10px', paddingBottom: '10px' }}>
                                                                <p>{n.deliveryInfo.address1 ? n.deliveryInfo.address1 : '-'}</p>
                                                                <p>{n.deliveryInfo.address2 ? n.deliveryInfo.address2 : '-'}</p>
                                                                <p>{n.deliveryInfo.subDistrict ? n.deliveryInfo.subDistrict : '-'}</p>
                                                                <p>{n.deliveryInfo.district ? n.deliveryInfo.district : '-'}</p>
                                                                <p>{n.deliveryInfo.province ? n.deliveryInfo.province.split('|')[1] : '-'}</p>
                                                                <p>{n.deliveryInfo.postalCode ? n.deliveryInfo.postalCode : '-'}</p>
                                                            </div>
                                                        </CustomTableCell> */}

                                                        <CustomTableCell component="th" scope="row" padding="none">
                                                            {n.selectedProduct.length > 0
                                                                ? n.selectedProduct.map((selectedItem, index) => {
                                                                      let productName;
                                                                      let productColor;
                                                                      let productSize = "";

                                                                      if (selectedItem.hasOwnProperty("productNameWithoutColor")) {
                                                                          productName =
                                                                              selectedItem.productNameWithoutColor +
                                                                              ` (${selectedItem.availableQuantity || 1})`;
                                                                          totalItem += selectedItem.availableQuantity;
                                                                      }

                                                                      if (
                                                                          selectedItem.hasOwnProperty("productValue") &&
                                                                          selectedItem.productValue.hasOwnProperty("color")
                                                                      ) {
                                                                          productColor = capitalizeFirstLetter(selectedItem.productValue.color);
                                                                      }

                                                                      if (
                                                                          selectedItem.hasOwnProperty("productValue") &&
                                                                          selectedItem.productValue.hasOwnProperty("size")
                                                                      ) {
                                                                          productSize = selectedItem.productValue.size;
                                                                      }

                                                                      // if (productColor.length > 0) {
                                                                      //     let tempProductColor = capitalizeFirstLetter(productColor);
                                                                      //     let tempProductName = selectedItem.productName;
                                                                      //     productName = tempProductName.replace(' - ' + tempProductColor, '');
                                                                      // } else {
                                                                      //     productName = selectedItem.productName;
                                                                      // }

                                                                      return (
                                                                          <div key={index}>
                                                                              <div className="flex items-center">
                                                                                  <div className="flex text-left mr-4">
                                                                                      {selectedItem.hasOwnProperty("productImage") &&
                                                                                      selectedItem.productImage.length > 0 ? (
                                                                                          <img
                                                                                              className="rounded"
                                                                                              style={{ height: "50px", maxWidth: "50px" }}
                                                                                              src={selectedItem.productImage}
                                                                                              alt={productName}
                                                                                          />
                                                                                      ) : (
                                                                                          <img
                                                                                              className="rounded"
                                                                                              style={{ height: "50px", maxWidth: "50px" }}
                                                                                              src="assets//images/ecommerce/product-image-placeholder.png"
                                                                                              alt={productName}
                                                                                          />
                                                                                      )}
                                                                                  </div>
                                                                                  <div className="flex text-left">
                                                                                      {/* <Typography variant="body2"> */}
                                                                                      {productName} {productColor} {productSize}
                                                                                      {/* </Typography> */}
                                                                                      {/* <Typography variant="caption"> */}
                                                                                      {productColor ? productColor : null}
                                                                                      {/* </Typography> */}
                                                                                      <span className="flex items-center ml-4">
                                                                                          {" "}
                                                                                          x{selectedItem.availableQuantity}
                                                                                      </span>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  })
                                                                : null}
                                                        </CustomTableCell>

                                                        {/* <CustomTableCell component="th" scope="row" align="center">
                                                            <p>{totalItem > 0 ? totalItem : n.selectedProduct.length}</p>
                                                        </CustomTableCell> */}
                                                        <CustomTableCell component="th" scope="row" align="center">
                                                            <p>
                                                                {n.summary.grandTotal || n.selectedProduct[0].productValue.price}{" "}
                                                                <Trans i18nKey="orders.order-price-thb-suffix">THB</Trans>
                                                            </p>
                                                        </CustomTableCell>

                                                        <CustomTableCell component="th" scope="row" align="center" className="pt-6">
                                                            {n.paymentInfo.status === "PENDING" ? (
                                                                <div className="inline text-12 p-4 rounded truncate bg-orange text-black">
                                                                    Pending
                                                                </div>
                                                            ) : n.paymentInfo.status === "SUCCESS_CASH_ON_DELIVERY" ? (
                                                                <React.Fragment>
                                                                    <div className="inline text-12 p-4 rounded truncate bg-green text-white">
                                                                        Success (Cash on Delivery)
                                                                    </div>
                                                                    <div className="mt-4">
                                                                        {moment.unix(n.paymentInfo.paymentCompletedOn / 1000).format("DD/MM/YYYY")}{" "}
                                                                        {moment.unix(n.paymentInfo.paymentCompletedOn / 1000).format("HH:mm:ss")}
                                                                    </div>
                                                                </React.Fragment>
                                                            ) : (
                                                                <React.Fragment>
                                                                    <div className="inline text-12 p-4 rounded truncate bg-green text-white">
                                                                        Success
                                                                    </div>
                                                                    <div className="mt-4">
                                                                        {moment.unix(n.paymentInfo.paymentCompletedOn / 1000).format("DD/MM/YYYY")}{" "}
                                                                        {moment.unix(n.paymentInfo.paymentCompletedOn / 1000).format("HH:mm:ss")}
                                                                    </div>
                                                                </React.Fragment>
                                                            )}
                                                        </CustomTableCell>

                                                        {/* <CustomTableCell component="th" scope="row" align="center">
                                                            {n.paymentInfo.method}
                                                        </CustomTableCell> */}
                                                        <CustomTableCell component="th" scope="row" align="center">
                                                            {this.renderShippingStatus(n.shippingStatus)}
                                                        </CustomTableCell>
                                                        <CustomTableCell component="th" scope="row" align="center">
                                                            {n.trackingNumber ? (
                                                                <div className="flex justify-center">
                                                                    <div>
                                                                        {n.shippingMethod}: {n.trackingNumber}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>-</div>
                                                            )}
                                                        </CustomTableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={11}>
                                                <div className="my-16 text-center">
                                                    <h1 className="text-grey-darker">
                                                        <Trans i18nKey="orders.orders-not-found-in-this-store">No orders in this store</Trans>
                                                    </h1>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )
                            ) : (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <div className="flex justify-center my-16">
                                                <CircularProgress color="primary" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    </FuseScrollbars>

                    <div className="flex w-full justify-end">
                        <TablePagination
                            component="div"
                            count={data ? data.length : 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{
                                "aria-label": "Previous Page",
                                'onClick': this.loadPreviousPage,
                            }}
                            nextIconButtonProps={{
                                "aria-label": "Next Page",
                                'onClick': this.loadNextPage,
                            }}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getOrders: Actions.getOrders,
            clearOrders: Actions.clearOrders,
            updateOrders: Actions.updateOrders
        },
        dispatch
    );
}

function mapStateToProps({ ordersApp }) {
    return {
        orders: ordersApp.orders.data,
        searchText: ordersApp.orders.searchText
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(styles)(OrdersTable))));
