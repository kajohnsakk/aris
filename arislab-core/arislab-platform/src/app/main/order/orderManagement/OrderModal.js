import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans, withTranslation } from "react-i18next";
import i18n from "../../../i18n";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import axios from "axios";
import _ from "@lodash";
import * as Actions from "../store/actions";
import * as AppConfig from "../../../main/config/AppConfig";
import {
  Dialog,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from "@material-ui/core";
import UtilityFunction from "../../../main/modules/UtilityFunction";
import CloseIcon from "@material-ui/icons/Close";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import * as moment from "moment";
const host = AppConfig.API_URL;

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  formLabel: {
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  button: {
    fontFamily: "inherit",
    fontWeight: "400",
    textTransform: "none",
    boxShadow: "none",
    margin: 0,
    "&:hover": {
      backgroundColor: theme.palette.primary.lightMain,
    },
  },
  dialog: {
    fontFamily: "inherit",
    fontWeight: 300,
    lineHeight: 1.8,
  },
  tabs: {
    padding: 0,
  },
  tab: {
    fontFamily: "inherit",
    fontSize: "16px",
    fontWeight: 400,
    textTransform: "none",
  },
});

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing.unit * 3,
    },
    fontFamily: "inherit",
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    minWidth: "7rem",
    padding: "10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: "inherit",
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const VoucherInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing.unit * 3,
    },
    fontFamily: "inherit",
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    minWidth: "120%",
    marginTop: 5,
    padding: "10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: "inherit",
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

class OrderModal extends Component {
  state = {
    shippingMethod: this.props.data.shippingMethod || "EMS",
    trackingNumber: this.props.data.trackingNumber || "",
    shippingStatus: this.props.data.shippingStatus,
    menuIndex: 2,
    windowWidth: 0,
    initState: {},
    isSelectingShippingStatus: false,
    isShippingStatusLoading: false,
    isSaveButtonLoading: false,
    voucherCodeList: [],
    voucherDataList: [],
    haveVoucher: false,
  };

  componentWillReceiveProps = (prevProps) => {
    for (const i in prevProps.orders) {
      if (prevProps.orders[i].orderID === this.props.data.orderID) {
        this.setState({
          shippingStatus: prevProps.orders[i].shippingStatus,
          isShippingStatusLoading: false,
        });
      }
    }
  };

  componentDidMount = () => {
    const { shippingMethod, trackingNumber } = this.state;
    this.setState({
      initState: {
        shippingMethod: shippingMethod,
        trackingNumber: trackingNumber,
      },
    });
    let voucherCodeListTemp = [];
    let voucherDataListTemp = [];
    this.props.data.selectedProduct.forEach((item, index) => {
      for (let i = 0; i < item.availableQuantity; i++) {
        if (item.isVoucher) {
          if (item.code && item.code[i]) {
            voucherCodeListTemp.push(item.code[i]);
            voucherDataListTemp.push({
              code: item.code[i],
              productName: item.productName,
              productID: item.productID,
              prevCode: item.code[i],
            });
          } else {
            voucherCodeListTemp.push("");
            voucherDataListTemp.push({
              code: "",
              productName: item.productName,
              productID: item.productID,
              prevCode: "",
            });
          }
        }
      }
      if (item.isVoucher) {
        this.setState({ haveVoucher: true });
      }
    });
    this.setState({
      voucherCodeList: voucherCodeListTemp,
      voucherDataList: voucherDataListTemp,
    });
  };

  componentDidUpdate = (prevProps, prevState) => { };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleShippingMethod = (e) => {
    this.setState({ shippingMethod: e.target.getAttribute("name") });
  };

  loading = () => {
    const { initState, shippingMethod, trackingNumber } = this.state;
    if (!_.isEqual({ ...initState }, { shippingMethod, trackingNumber })) {
      this.props.loading();
    }
  };

  handleSelectButton = () => {
    this.setState({
      isSelectingShippingStatus: !this.state.isSelectingShippingStatus,
    });
  };

  renderProducts = () => {
    const { data } = this.props;

    var el = [];
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    if (data.selectedProduct.length > 0) {
      data.selectedProduct.forEach((selectedItem, index) => {
        let productName;
        let productColor;
        let productSize = "";

        if (selectedItem.hasOwnProperty("productNameWithoutColor")) {
          productName =
            selectedItem.productNameWithoutColor +
            ` (${selectedItem.availableQuantity || 1})`;
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

        el.push(
          <div key={index}>
            <div className="flex items-center">
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
              <div className="ml-4">
                {productName} {productColor} {productSize}
                {productColor ? productColor : null}
              </div>
              <div className="ml-auto">x{selectedItem.availableQuantity}</div>
            </div>
          </div>
        );
      });
      return el;
    } else {
      return <React.Fragment />;
    }
  };

  renderVoucher = () => {
    const { data } = this.props;
    var el = [];
    var voucherList = [];
    if (data.selectedProduct.length > 0) {
      data.selectedProduct.forEach((selectedItem, index) => {
        if (selectedItem.isVoucher) {
          voucherList.push(selectedItem);
        }
      });
      if (voucherList.length > 0) {
        let codeCount = 0;
        voucherList.forEach((item, index) => {
          el.push(
            <div key={index} className="flex flex-col mt-4 w-full">
              <div className="flex flex-row items-center w-full">
                <img
                  className="rounded"
                  style={{ height: "50px", maxWidth: "50px" }}
                  src={item.productImage}
                  alt={item.productName}
                />
                <div className="ml-4">{item.productName}</div>
                <div className="ml-4"> x {item.availableQuantity}</div>
              </div>
              <div className="w-full mt-2">
                {this.createTextFieldForVoucher(
                  codeCount,
                  item.availableQuantity + codeCount,
                  item.productName,
                  item.productID
                )}
              </div>
            </div>
          );
          codeCount += item.availableQuantity;
        });
      }
    }
    return el;
  };

  createTextFieldForVoucher = (
    startingPoint,
    amount,
    productName,
    productID
  ) => {
    let fields = [];
    for (let i = startingPoint; i < amount; i++) {
      fields.push(
        <VoucherInput
          placeholder={"Code " + (i + 1)}
          onChange={(e) =>
            this.handleChangeVoucherCode(e, i, productName, productID)
          }
          value={this.state.voucherCodeList[i]}
        />
      );
    }
    return fields;
  };

  handleChangeVoucherCode = (event, index, productName, productID) => {
    let voucherCodes = this.state.voucherCodeList;
    let voucherDatas = this.state.voucherDataList;
    voucherCodes[index] = event.target.value;
    voucherDatas[index] = {
      code: event.target.value,
      productName: productName,
      productID: productID,
      prevCode: this.state.voucherDataList[index].prevCode,
    };
    this.setState({
      voucherCodeList: voucherCodes,
      voucherDataList: voucherDatas,
    });
  };

  onSaveVoucher = () => {
    const { data } = this.props;
    let orderList = this.state.voucherDataList
      .filter((voucherDetail) => voucherDetail.code !== "")
      .map((item, index) => {
        const order = {
          ...data,
          code: item.code,
          productName: item.productName,
          productID: item.productID,
          prevCode: item.prevCode,
        };
        return order;
      });
    try {
      axios.post(`${host}order/updateCode`, orderList);
    } catch (error) { }
    return Promise.all(
      orderList.map((order) => axios.post(`${host}order/send/voucher`, order))
    ).catch((error) => {
      return;
    });
  };

  renderShippingStatus = (status) => {
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

  renderPaymentStatus = (status) => {
    if (status === "PENDING") {
      return (
        <div className="inline text-12 p-4 rounded truncate bg-orange text-black">
          Pending
        </div>
      );
    } else {
      return (
        <div className="inline text-12 p-4 rounded truncate bg-green text-white">
          Success
        </div>
      );
    }
  };

  renderChangeShippingStatus = () => {
    const { isShippingStatusLoading, shippingStatus } = this.state;
    const { data } = this.props;
    if (isShippingStatusLoading) {
      return <CircularProgress className="ml-4" size="1.5em" />;
    } else {
      return (
        <React.Fragment>
          {this.state.isSelectingShippingStatus ? (
            <React.Fragment>
              <NativeSelect
                name="shippingStatus"
                value={shippingStatus}
                onChange={this.handleChange}
                input={<BootstrapInput />}
              >
                <option key={1} className="text-green" value="SENT">
                  {i18n.t("orders.status-sent")}
                </option>
                <option key={2} className="text-orange" value="WAITING">
                  {i18n.t("orders.status-waiting")}
                </option>
                <option key={3} value="N/A">
                  {i18n.t("orders.status-na")}
                </option>
              </NativeSelect>
              <button
                className="small-text-button ml-8 text-grey-dark font-sm underline"
                onClick={() => {
                  this.handleSelectButton();
                  this.props.updateOrders(
                    { storeID: data.storeID, orderID: data.orderDocID },
                    {
                      ...data,
                      shippingStatus: shippingStatus,
                    }
                  );
                  this.setState({ isShippingStatusLoading: true });
                }}
              >
                <Trans i18nKey="main.confirm">ยืนยัน</Trans>
              </button>
            </React.Fragment>
          ) : (
              <React.Fragment>
                {this.renderShippingStatus(shippingStatus)}{" "}
                <button
                  className="small-text-button ml-8 text-grey-dark font-sm underline"
                  onClick={this.handleSelectButton}
                >
                  <Trans i18nKey="main.change">เปลี่ยน</Trans>
                </button>
              </React.Fragment>
            )}
        </React.Fragment>
      );
    }
  };

  onSave = async () => {
    const { data } = this.props;
    const { trackingNumber, shippingMethod } = this.state;
    const updatedData = {
      ...data,
      trackingNumber: trackingNumber,
      shippingMethod: shippingMethod,
      shippingStatus: "SENT",
    };
    this.props.updateOrders(
      { storeID: data.storeID, orderID: data.orderDocID },
      updatedData
    );

    this.setState({ isSaveButtonLoading: true });
    this.loading();
    this.sendEmail();
    await this.sendTracking(updatedData);
    this.props.toggleDialog("orderModal");
    this.props.handleTrackingUpdate();
  };

  renderContent = () => {
    const deliveryServices = [
      { value: "EMS", label: "EMS" },
      { value: "KERRY", label: "KERRY" },
      { value: "J&T", label: "J&T" },
      { value: "NINJA", label: "NINJA" },
      { value: "FLASH", label: "FLASH" },
      { value: "ALPHA", label: "ALPHA" },
      { value: "DHL", label: "DHL" },
      { value: "BEST", label: "BEST" },
      { value: "SCG", label: "SCG" },
      { value: "ลงทะเบียน", label: "ลงทะเบียน" },
    ];

    const { shippingMethod, trackingNumber, menuIndex } = this.state;
    const { data, classes } = this.props;
    if (window.innerWidth < 1200) {
      if (menuIndex === 0) {
        return (
          <div className="flex flex-col w-full">
            <div className="flex">
              <div className="w-1/3 pr-4 text-right font-bold">
                <Trans i18nKey="orders.customer-name">ชื่อลูกค้า</Trans>
              </div>
              <div className="w-2/3 pl-4 m-auto">
                {data.deliveryInfo.firstName || data.userInfo.firstName}{" "}
                {data.deliveryInfo.firstName || data.userInfo.lastName}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/3 pr-4 text-right font-bold">
                <Trans i18nKey="orders.customer-phone">เบอร์โทรศัพท์</Trans>
              </div>
              <div className="w-2/3 pl-4 m-auto">
                {data.paymentInfo.gbPaymentDetails.customerTelephone ||
                  data.deliveryInfo.phoneNo ||
                  "-"}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/3 pr-4 text-right font-bold">
                <Trans i18nKey="orders.customer-address">ที่อยู่จัดส่ง</Trans>
              </div>
              <div className="w-2/3 pl-4">
                {data.paymentInfo.gbPaymentDetails.customerAddress ? (
                  <div>{data.paymentInfo.gbPaymentDetails.customerAddress}</div>
                ) : data.deliveryInfo.address1 ? (
                  <div>
                    {`${data.deliveryInfo.address1}
                                        ${data.deliveryInfo.subDistrict} ${data.deliveryInfo.district
                      }
                                        ${data.deliveryInfo.province} ${data.deliveryInfo.postalCode
                      }`}
                  </div>
                ) : (
                      <div>-</div>
                    )}
              </div>
            </div>
          </div>
        );
      } else if (menuIndex === 1) {
        return (
          <div className="w-full">
            <div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-date">วันที่สั่งซื้อ</Trans>
                </div>
                <div className="w-1/2 pl-4">
                  {moment.unix(data.orderDate / 1000).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-time">เวลาสั่งซื้อ</Trans>
                </div>
                <div className="w-1/2 pl-4">
                  {moment.unix(data.orderDate / 1000).format("HH:mm:ss")}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-paid-at">เวลาที่ชำระเงิน</Trans>
                </div>
                <div className="w-1/2 pl-4 flex items-center">
                  {data.paymentInfo.paymentCompletedOn
                    ? moment
                      .unix(data.paymentInfo.paymentCompletedOn / 1000)
                      .format("HH:mm:ss")
                    : "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold section">
                <Trans i18nKey="orders.items">รายการสินค้า</Trans>
              </div>
              {this.renderProducts()}
              <div className="text-right">
                <Trans i18nKey="orders.shipping">ค่าส่ง</Trans>{" "}
                {data.summary.totalDeliveryCost}{" "}
                <Trans i18nKey="main.baht">บาท</Trans>
              </div>
              <div className="text-right font-bold">
                <span>
                  <Trans i18nKey="orders.total-price">ราคารวม</Trans>
                </span>
                <span>
                  {" "}
                  {data.summary.grandTotal ||
                    data.selectedProduct[0].productValue.price}{" "}
                  <Trans i18nKey="main.baht">บาท</Trans>
                </span>
              </div>
            </div>
          </div>
        );
      } else if (menuIndex === 2) {
        return (
          <div className="w-full">
            <div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-table-title-payment-status">
                    สถานะการชำระเงิน
                  </Trans>
                </div>
                <div className="w-1/2 pl-4">
                  {this.renderPaymentStatus(data.paymentInfo.status)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-table-title-payment-method">
                    ช่องทางการชำระเงิน
                  </Trans>
                </div>
                <div className="w-1/2 pl-4">{data.paymentInfo.method}</div>
              </div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-table-title-shipping">
                    สถานะการจัดส่ง
                  </Trans>
                </div>
                <div className="w-1/2 pl-4">
                  {this.renderChangeShippingStatus()}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold section text-center">
                <Trans i18nKey="orders.tracking-number">
                  หมายเลขติดตามพัสดุ
                </Trans>
              </div>
              <div className="flex justify-center">
                <div>
                  <FormControl>
                    <InputLabel shrink className={classes.formLabel}>
                      <Trans i18nKey="orders.shipping-method">
                        วิธีการจัดส่ง
                      </Trans>
                    </InputLabel>
                    <NativeSelect
                      name="shippingMethod"
                      value={shippingMethod}
                      onChange={this.handleChange}
                      input={<BootstrapInput />}
                    >
                      {deliveryServices.map((el, index) => {
                        return (
                          <option key={index} value={el.value}>
                            {el.label}
                          </option>
                        );
                      })}
                    </NativeSelect>
                  </FormControl>
                </div>
                <FormControl className="pl-4">
                  <InputLabel shrink className={classes.formLabel}>
                    <Trans i18nKey="orders.tracking-number">
                      หมายเลขติดตามพัสดุ
                    </Trans>
                  </InputLabel>
                  <BootstrapInput
                    name="trackingNumber"
                    value={trackingNumber}
                    onChange={this.handleChange}
                  />
                </FormControl>
              </div>
              <div className="flex justify-center mt-12">
                {this.state.isSaveButtonLoading ? (
                  <CircularProgress />
                ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={() => {
                        this.onSave();
                      }}
                    >
                      <Trans i18nKey="orders.save-and-send">
                        บันทึกและส่งเลขพัสดุให้ลูกค้า
                    </Trans>
                    </Button>
                  )}
              </div>
              <div>
                *
                <Trans i18nKey="orders.save-button-description">
                  เมื่อกดบันทึก
                  ระบบจะทำการส่งหมายเลขพัสดุไปยังลูกค้าผ่านทางอีเมล
                  และทำการเปลี่ยนสถานะการจัดส่งเป็นจัดส่งแล้ว
                </Trans>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (
        <React.Fragment>
          <div
            className={
              (this.state.haveVoucher ? "w-1/4" : "w-1/3") + " flex flex-col"
            }
          >
            <div className="flex">
              <div className="w-1/3 pr-4 text-right font-bold">
                <Trans i18nKey="orders.customer-name">ชื่อลูกค้า</Trans>
              </div>
              <div className="w-2/3 pl-4">
                {data.deliveryInfo.firstName || data.userInfo.firstName}{" "}
                {data.deliveryInfo.firstName || data.userInfo.lastName}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/3 pr-4 text-right font-bold">
                <Trans i18nKey="orders.customer-phone">เบอร์โทรศัพท์</Trans>
              </div>
              <div className="w-2/3 pl-4">
                {data.paymentInfo.gbPaymentDetails.customerTelephone ||
                  data.deliveryInfo.phoneNo ||
                  "-"}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/3 pr-4 text-right font-bold">
                <Trans i18nKey="orders.customer-address">ที่อยู่จัดส่ง</Trans>
              </div>
              <div className="w-2/3 pl-4">
                {data.paymentInfo.gbPaymentDetails.customerAddress ? (
                  <div>{data.paymentInfo.gbPaymentDetails.customerAddress}</div>
                ) : data.deliveryInfo.address1 ? (
                  <div>
                    <div>{data.deliveryInfo.address1}</div>
                    <div>
                      {data.deliveryInfo.subDistrict +
                        " " +
                        data.deliveryInfo.district}
                    </div>
                    <div>
                      {data.deliveryInfo.province +
                        " " +
                        data.deliveryInfo.postalCode}
                    </div>
                  </div>
                ) : (
                      <div>-</div>
                    )}
              </div>
            </div>
          </div>
          <div className={this.state.haveVoucher ? "w-1/4" : "w-1/3"}>
            <div>
              <div className="flex">
                <div className="w-2/5 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-date">วันที่สั่งซื้อ</Trans>
                </div>
                <div className="w-3/5 pl-4">
                  {moment.unix(data.orderDate / 1000).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="flex">
                <div className="w-2/5 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-time">เวลาสั่งซื้อ</Trans>
                </div>
                <div className="w-3/5 pl-4">
                  {moment.unix(data.orderDate / 1000).format("HH:mm:ss")}
                </div>
              </div>
              <div className="flex">
                <div className="w-2/5 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-paid-at">เวลาที่ชำระเงิน</Trans>
                </div>
                <div className="w-3/5 pl-4 flex items-center">
                  {data.paymentInfo.paymentCompletedOn
                    ? moment
                      .unix(data.paymentInfo.paymentCompletedOn / 1000)
                      .format("HH:mm:ss")
                    : "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold section">
                <Trans i18nKey="orders.items">รายการสินค้า</Trans>
              </div>
              {this.renderProducts()}
              <div className="text-right">
                <Trans i18nKey="orders.shipping">ค่าส่ง</Trans>{" "}
                {data.summary.totalDeliveryCost}{" "}
                <Trans i18nKey="main.baht">บาท</Trans>
              </div>
              <div className="text-right font-bold">
                <span>
                  <Trans i18nKey="orders.total-price">ราคารวม</Trans>
                </span>
                <span>
                  {" "}
                  {data.summary.grandTotal ||
                    data.selectedProduct[0].productValue.price}{" "}
                  <Trans i18nKey="main.baht">บาท</Trans>
                </span>
              </div>
            </div>
          </div>
          <div className={this.state.haveVoucher ? "w-1/4" : "w-1/3"}>
            <div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-table-title-payment-status">
                    สถานะการชำระเงิน
                  </Trans>
                </div>
                <div className="w-1/2 pl-4">
                  {this.renderPaymentStatus(data.paymentInfo.status)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-table-title-payment-method">
                    ช่องทางการชำระเงิน
                  </Trans>
                </div>
                <div className="w-1/2 pl-4">{data.paymentInfo.method}</div>
              </div>
              <div className="flex items-center">
                <div className="w-1/2 pr-4 text-right font-bold">
                  <Trans i18nKey="orders.order-table-title-shipping">
                    สถานะการจัดส่ง
                  </Trans>
                </div>
                <div className="w-1/2 pl-4 flex">
                  {this.renderChangeShippingStatus()}
                </div>
              </div>
            </div>
            <div>
              <div className="font-bold section">
                <Trans i18nKey="orders.tracking-number">
                  หมายเลขติดตามพัสดุ
                </Trans>
              </div>
              <div className="flex">
                <div>
                  <FormControl>
                    <InputLabel shrink className={classes.formLabel}>
                      <Trans i18nKey="orders.shipping-method">
                        วิธีการจัดส่ง
                      </Trans>
                    </InputLabel>
                    <NativeSelect
                      name="shippingMethod"
                      value={shippingMethod}
                      onChange={this.handleChange}
                      input={<BootstrapInput />}
                    >
                      {deliveryServices.map((el, index) => {
                        return (
                          <option key={index} value={el.value}>
                            {el.label}
                          </option>
                        );
                      })}
                    </NativeSelect>
                  </FormControl>
                </div>
                <FormControl className="pl-4">
                  <InputLabel shrink className={classes.formLabel}>
                    <Trans i18nKey="orders.tracking-number">
                      หมายเลขติดตามพัสดุ
                    </Trans>
                  </InputLabel>
                  <BootstrapInput
                    name="trackingNumber"
                    value={trackingNumber}
                    onChange={this.handleChange}
                  />
                </FormControl>
              </div>
              <div className="flex justify-end mt-12">
                {this.state.isSaveButtonLoading ? (
                  <CircularProgress />
                ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={() => {
                        this.onSave();
                      }}
                    >
                      <Trans i18nKey="orders.save-and-send">
                        บันทึกและส่งเลขพัสดุให้ลูกค้า
                    </Trans>
                    </Button>
                  )}
              </div>
              <div className="mt-6" style={{ fontSize: "1.4rem" }}>
                *
                <Trans i18nKey="orders.save-button-description">
                  เมื่อกดบันทึก
                  ระบบจะทำการส่งหมายเลขพัสดุไปยังลูกค้าผ่านทางอีเมล
                  และทำการเปลี่ยนสถานะการจัดส่งเป็นจัดส่งแล้ว
                </Trans>
              </div>
            </div>
          </div>
          {this.state.haveVoucher ? (
            <div className="w-1/4">
              <div className="ml-4 font-bold">
                <Trans i18nKey="orders.voucher-list">
                  รายการสินค้าประเภทดิจิตัล
                </Trans>
              </div>
              <div className="flex flex-col mt-2 w-full overflow-y-scroll">
                {this.renderVoucher()}
                <div className="flex justify-end mt-12">
                  {this.state.isSaveButtonLoading ? (
                    <CircularProgress />
                  ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={async () => {
                          await this.onSaveVoucher();
                          this.props.toggleDialog("orderModal");
                          window.location.reload();
                        }}
                      >
                        <Trans i18nKey="orders.save-and-send-voucher">
                          บันทึกและส่งเลขสินค้าประเภทดิจิตัล
                      </Trans>
                      </Button>
                    )}
                </div>
              </div>
            </div>
          ) : null}
        </React.Fragment>
      );
    }
  };

  handleTabChange = (event, value) => {
    this.setState({ menuIndex: value });
  };

  async sendEmail() {
    let emailData = {
      to: this.props.data.paymentInfo.gbPaymentDetails.customerEmail,
      from: this.props.data.channel.name,
      subject: `ร้าน ${this.props.data.channel.name
        } ได้ทำการจัดส่งสินค้าของคุณแล้ว`,
      text: `ร้าน ${this.props.data.channel.name
        } ได้ทำการจัดส่งสินค้าของคุณแล้ว\nลูกค้าสามารถตรวจสอบสถานะของสินค้าได้ตามหมายเลขพัสดุด้านล่างเลยค่ะ :D\n${this.state.shippingMethod
        }: ${this.state.trackingNumber}`,
    };
    await axios.post(host + "email/send", emailData);
  }

  async sendTracking(order) {
    if (order.hasOwnProperty("isTrackingSent")) {
      if (order.isTrackingSent === false) {
        await axios
          .post("/api/order/send/tracking", order)
          .then((res) => {
            return res;
          })
          .catch((error) => { });
      } else {
        return;
      }
    }
  }

  render() {
    const { menuIndex } = this.state;
    const { data, classes } = this.props;
    return (
      <Dialog
        fullWidth={this.props.fullWidth}
        fullScreen={UtilityFunction.useMediaQuery("(max-width: 1199px)")}
        maxWidth={this.state.haveVoucher ? "lg" : "md"}
        open={this.props.open}
        className={classes.dialog}
      >
        <div className="modal-header">
          <Trans i18nKey="orders.order-table-title-id">หมายเลขสั่งซื้อ</Trans> :{" "}
          {data.orderID}
        </div>

        <div className="absolute right pin-t pin-r">
          <IconButton
            aria-label="Close"
            onClick={() => {
              this.props.toggleDialog(this.props.dialogName);
            }}
          >
            <CloseIcon fontSize="default" />
          </IconButton>
        </div>

        {/* <DialogContent className=""> */}
        <div className="modal-menu text-center">
          {window.innerWidth < 1200 ? (
            <Tabs
              className={classes.tabs}
              value={menuIndex}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                className={classes.tab}
                label={i18n.t("orders.customer-details")}
              />
              <Tab
                className={classes.tab}
                label={i18n.t("orders.order-details")}
              />
              <Tab
                className={classes.tab}
                label={i18n.t("orders.payment-and-shipping")}
              />
            </Tabs>
          ) : (
              <React.Fragment>
                {" "}
                <div className={this.state.haveVoucher ? "w-1/4" : "w-1/3"}>
                  <Trans i18nKey="orders.customer-details">ข้อมูลลูกค้า</Trans>
                </div>
                <div className={this.state.haveVoucher ? "w-1/4" : "w-1/3"}>
                  <Trans i18nKey="orders.order-details">รายการสั่งซื้อ</Trans>
                </div>
                <div className={this.state.haveVoucher ? "w-1/4" : "w-1/3"}>
                  <Trans i18nKey="orders.payment-and-shipping">
                    การชำระเงินและการจัดส่ง
                </Trans>
                </div>
                {this.state.haveVoucher ? (
                  <div className="w-1/4">
                    <Trans i18nKey="orders.send-voucher">
                      การจัดส่งสินค้าประเภทดิจิตัล
                  </Trans>
                  </div>
                ) : null}
              </React.Fragment>
            )}
        </div>
        <div className="modal-content">{this.renderContent()}</div>
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateOrders: Actions.updateOrders,
    },
    dispatch
  );
}

function mapStateToProps({ ordersApp }) {
  return {
    orders: ordersApp.orders.data,
    searchText: ordersApp.orders.searchText,
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation()(withStyles(styles, { withTheme: true })(OrderModal)))
);
