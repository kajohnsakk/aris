import React, { useState, useEffect } from "react";
import Datatable from "app/components/Datatable";
import i18n from "../../i18n";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import moment from "moment";
import Classnames from "classnames";
import CircularProgress from "@material-ui/core/CircularProgress";
import UtilityFunction from "../modules/UtilityFunction";
import styles from "./styles/styles";
import { withStyles } from "@material-ui/core/styles";
import { Line } from "react-chartjs-2";
import { Trans, withTranslation } from "react-i18next";
import { SalesChannelManager } from "../context/sales_channel/salesChannelManager";
import Facebook from "../setting/channelManagement/Facebook/Facebook";
import axios from "axios";
import * as AppConfig from "../../main/config/AppConfig";

const DashboardCards = (props) => {
    const host = AppConfig.API_URL;
    const {
        testBestSeller,
        testTop10Province,
        storeID,
        pushTrackingData,
    } = props;
    const classes = props.classes;
    const [isLoading, setIsLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [fee, setFee] = useState(0);
    const [amountAfterFee, setAmountAfterFee] = useState(0);
    const [startDate, setStartDate] = useState(
        moment(Date.now() - 2592000000).format("YYYY/MM/DD HH:mm:ss")
    );
    const [endDate, setEndDate] = useState(
        moment(Date.now()).format("YYYY/MM/DD HH:mm:ss")
    );
    const [startDateUnix, setStartDateUnix] = useState(Date.now() - 2592000000);
    const [endDateUnix, setEndDateUnix] = useState(Date.now());
    const [labels, setLabels] = useState([]);
    const [datas, setDatas] = useState([]);
    const [facebookInfo, setFacebookInfo] = useState({});
    const [isCheckingData, setIsCheckingData] = useState(true);
    const [validFacebookPage, setValidFacebookPage] = useState(false);
    const [bestSeller, setBestSeller] = useState([]);
    const [top10Province, setTop10Province] = useState([]);
    const data = {
        labels: labels,
        datasets: [
            {
                label: i18n.t("dashboard.totalSales"),
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(237,53,144,1)",
                borderColor: "rgba(237,53,144,1)",
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(237,53,144,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(237,53,144,1)",
                pointHoverBorderColor: "rgba(237,53,144,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: datas,
            },
        ],
    };
    let bestSellerIndex = 0;

    useEffect(() => {
        SalesChannelManager.getInstance()
            .getChannelByStoreID(storeID)
            .then((resultChannelByStoreID) => {
                if (
                    resultChannelByStoreID.length > 0 &&
                    resultChannelByStoreID[0].hasOwnProperty("channels")
                ) {
                    setFacebookInfo({
                        facebookPageID: resultChannelByStoreID[0]["channels"]["facebook"],
                        facebookSelectedPageAccessToken:
                            resultChannelByStoreID[0]["channels"][
                            "facebookSelectedPageAccessToken"
                            ],
                    });
                } else {
                    setIsCheckingData(false);
                }
            });
        loadData();
    }, []);

    useEffect(() => {
        if (
            facebookInfo &&
            facebookInfo.hasOwnProperty("facebookSelectedPageAccessToken") &&
            facebookInfo.hasOwnProperty("facebookPageID")
        ) {
            isTokenValid(
                facebookInfo.facebookSelectedPageAccessToken,
                facebookInfo.facebookPageID
            );
        }
    }, [facebookInfo]);

    const loadData = () => {
        let start = moment(startDate);
        let end = moment(endDate);
        let dateLabels = [];
        while (start <= end) {
            dateLabels.push(moment(start).format("DD/MM/YYYY"));
            start += 86400000;
        }
        setLabels(dateLabels);
        getAnalytics();
        getMonthlyData();
        getBestSeller();
        getTop10Province();
    };

    const getAnalytics = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${host}v1/analytics/grand-total?startDate=${startDate}&endDate=${endDate}&storeID=${storeID}`
            );

            const analyticData = response.data.data;
            setTotalAmount(analyticData.totalAmount);
            setOrderCount(analyticData.orderCount);
            setFee(analyticData.totalFee);
            setAmountAfterFee(analyticData.totalAmountAfterFee);
        } catch (error) { }
    };

    const getMonthlyData = async () => {
        try {
            const response = await axios.get(
                `${host}v1/analytics/daily-amount?startDate=${startDate}&endDate=${endDate}&storeID=${storeID}`
            );

            const monthlyData = response.data.data;
            let data = [];
            for (let i = 0; i < labels.length; i++) {
                let amount = 0;
                for (let j = 0; j < monthlyData.unixTimestamps.length; j++) {
                    if (
                        labels[i] ===
                        moment(monthlyData.unixTimestamps[j]).format("DD/MM/YYYY")
                    ) {
                        amount = monthlyData.dailySummaries[j];
                    }
                }
                data.push(amount);
            }
            setDatas(data);
        } catch (error) { }
    };

    const getBestSeller = async () => {
        try {
            const response = await axios.get(
                `${host}v1/analytics/best-selling-products?storeID=${storeID}&startDate=${startDate}&endDate=${endDate}&productCount=10`
            );
            const bestSellerResSort = response.data.data.products.sort((a, b) => {
                return b.productCount - a.productCount;
            });
            const bestSellerRes = bestSellerResSort.map((data, index) => {
                return {
                    rank: index + 1,
                    productName: data.name,
                    orderCount: data.orderCount,
                    itemCount: data.productCount,
                };
            });
            setBestSeller(bestSellerRes);
        } catch (error) { }
    };

    const getTop10Province = async () => {
        try {
            const response = await axios.get(
                `${host}v1/analytics/best-selling-provinces?storeID=${storeID}&startDate=${startDate}&endDate=${endDate}&provinceCount=10`
            );
            const top10ProvinceResSort = response.data.data.provinces.sort((a, b) => {
                return b.orderCount - a.orderCount;
            });
            const top10ProvinceRes = top10ProvinceResSort.map((data, index) => {
                return {
                    rank: index + 1,
                    provinceName: data.name,
                    orderCount: data.orderCount,
                    amount: data.amount,
                };
            });
            setTop10Province(top10ProvinceRes);
            setIsLoading(false);
        } catch (error) { }
    };

    const thousandSeperator = (number) => {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

    const onStartDateChange = (date) => {
        let startDate = moment(date).format("YYYY/MM/DD HH:mm:ss");
        setStartDate(startDate);
        setStartDateUnix(date);
    };

    const onEndDateChange = (date) => {
        let endDate = moment(date).format("YYYY/MM/DD HH:mm:ss");
        setEndDate(endDate);
        setEndDateUnix(date);
    };

    useEffect(() => {
        loadData();
    }, [startDate, endDate]);

    useEffect(() => {
        getMonthlyData();
    }, [labels]);

    const isTokenValid = (pageToken, pageID) => {
        let tokenObject = { token: pageToken };
        let facebookID = "facebook_" + pageID;
        if (pageToken.length > 0) {
            axios
                .post("api/channels/validatePageToken", tokenObject)
                .then((response) => {
                    if (response.data.data.is_valid === true) {
                        axios
                            .get(
                                "api/channels/cvl-platform/channelID/" + facebookID + "/details"
                            )
                            .then((res) => {
                                if (
                                    res.data.id === facebookID &&
                                    facebookInfo.facebookPageID !== ""
                                ) {
                                    setValidFacebookPage(true);
                                    setIsCheckingData(false);
                                } else {
                                    setIsCheckingData(false);
                                }
                            });
                    } else {
                        setIsCheckingData(false);
                    }
                });
        } else {
            setIsCheckingData(false);
        }
    };

    return (
        <React.Fragment>
            {isCheckingData ? (
                <div className={Classnames(classes.loadingPage, "my-24")}>
                    <CircularProgress className={classes.highlightText} />
                </div>
            ) : (
                    <div>
                        {!validFacebookPage ? (
                            <Facebook
                                parentPage="LIVE_EVENTS_PAGE"
                                storeID={storeID}
                                pushTrackingData={pushTrackingData}
                                dataLabel="Dashboard connect new sales channel"
                            />
                        ) : (
                                <div>
                                    <div className={classes.card + " mb-16"}>
                                        <div className="px-24 py-16">
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <DateTimePicker
                                                    keyboard
                                                    className={
                                                        classes.datePicker +
                                                        " mr-8 main-font sm:mt-0 mt-8 mr-16"
                                                    }
                                                    label={
                                                        <span className="main-font">
                                                            {i18n.t("orders.orders-start-date")}
                                                        </span>
                                                    }
                                                    format={"dd/MM/yyyy HH:mm:ss"}
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
                                                                " ",
                                                                /\d/,
                                                                /\d/,
                                                                ":",
                                                                /\d/,
                                                                /\d/,
                                                                ":",
                                                                /\d/,
                                                                /\d/,
                                                            ]
                                                            : []
                                                    }
                                                    value={startDate}
                                                    onChange={onStartDateChange}
                                                    disableOpenOnEnter
                                                    animateYearScrolling={false}
                                                />
                                                <DateTimePicker
                                                    keyboard
                                                    className={
                                                        classes.datePicker + " main-font sm:mt-0 mt-8 ml-16"
                                                    }
                                                    label={
                                                        <span className="main-font">
                                                            {i18n.t("orders.orders-end-date")}
                                                        </span>
                                                    }
                                                    format={"dd/MM/yyyy HH:mm:ss"}
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
                                                                " ",
                                                                /\d/,
                                                                /\d/,
                                                                ":",
                                                                /\d/,
                                                                /\d/,
                                                                ":",
                                                                /\d/,
                                                                /\d/,
                                                            ]
                                                            : []
                                                    }
                                                    value={endDate}
                                                    onChange={onEndDateChange}
                                                    disableOpenOnEnter
                                                    animateYearScrolling={false}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </div>
                                    </div>
                                    {isLoading ? (
                                        <div className={Classnames(classes.loadingPage, "my-24")}>
                                            <CircularProgress className={classes.highlightText} />
                                        </div>
                                    ) : (
                                            <div>
                                                <div className="flex flex-row">
                                                    <div className={classes.card + " w-1/4 mr-32"}>
                                                        <div className="mx-12 my-8 text-lg text-grey-darker">
                                                            <Trans i18nKey="dashboard.totalSales">ยอดขาย</Trans>
                                                        </div>
                                                        <div className="text-right text-bold text-4xl mr-20">
                                                            {thousandSeperator(totalAmount)}
                                                        </div>
                                                    </div>
                                                    <div className={classes.card + " w-1/4 mr-32"}>
                                                        <div className="mx-12 my-8 text-lg text-grey-darker">
                                                            <Trans i18nKey="dashboard.orders">จำนวนออเดอร์</Trans>
                                                        </div>
                                                        <div className="text-right text-bold text-4xl mr-20">
                                                            {thousandSeperator(orderCount)}
                                                        </div>
                                                    </div>
                                                    <div className={classes.card + " w-1/4 mr-32"}>
                                                        <div className="mx-12 my-8 text-lg text-grey-darker">
                                                            <Trans i18nKey="dashboard.fee">ค่าธรรมเนียม</Trans>
                                                        </div>
                                                        <div className="text-right text-bold text-4xl mr-20">
                                                            {thousandSeperator(fee)}
                                                        </div>
                                                    </div>
                                                    <div className={classes.card + " w-1/4"}>
                                                        <div className="mx-12 my-8 text-lg text-grey-darker">
                                                            <Trans i18nKey="dashboard.amountAfterFee">
                                                                ยอดรวมสุทธิ
                        </Trans>
                                                        </div>
                                                        <div className="text-right text-bold text-4xl mr-20">
                                                            {thousandSeperator(amountAfterFee)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={classes.card + " my-16"}>
                                                    <div className="my-16 mx-16 text-xl text-bold">
                                                        <Trans i18nKey="dashboard.dailysales">
                                                            ยอดขายประจำวัน
                      </Trans>
                                                    </div>
                                                    <Line
                                                        data={data}
                                                        height={100}
                                                        options={{
                                                            maintainAspectRatio: true,
                                                            legend: {
                                                                position: "bottom",
                                                            },
                                                        }}
                                                    />
                                                </div>
                                                <div className={classes.card + " w-full my-8"}>
                                                    <Datatable
                                                        title={
                                                            <div className="mx-16">
                                                                <Trans i18nKey="dashboard.bestSellers">
                                                                    สินค้าขายดี
                          </Trans>
                                                            </div>
                                                        }
                                                        columns={[
                                                            {
                                                                title: i18n.t("dashboard.rank"),
                                                                field: "rank",
                                                            },
                                                            {
                                                                title: i18n.t("dashboard.productName"),
                                                                field: "productName",
                                                            },
                                                            {
                                                                title: i18n.t("dashboard.orderCount"),
                                                                field: "orderCount",
                                                                sorting: true,
                                                            },
                                                            {
                                                                title: i18n.t("dashboard.itemCount"),
                                                                field: "itemCount",
                                                                sorting: true,
                                                            },
                                                        ]}
                                                        data={bestSeller}
                                                        loading={false}
                                                    />
                                                </div>
                                                <div className={classes.card + " w-full my-8"}>
                                                    <Datatable
                                                        title={
                                                            <div className="mx-16">
                                                                <Trans i18nKey="dashboard.top10province">
                                                                    10 อันดับจังหวัดที่สั่งซื้อมากที่สุด
                          </Trans>
                                                            </div>
                                                        }
                                                        columns={[
                                                            {
                                                                title: i18n.t("dashboard.rank"),
                                                                field: "rank",
                                                            },
                                                            {
                                                                title: i18n.t("dashboard.province"),
                                                                field: "provinceName",
                                                            },
                                                            {
                                                                title: i18n.t("dashboard.orderCount"),
                                                                field: "orderCount",
                                                            },
                                                            {
                                                                title: i18n.t("dashboard.amount"),
                                                                field: "amount",
                                                            },
                                                        ]}
                                                        data={top10Province}
                                                        loading={false}
                                                        optionProps={{ search: false, paging: false }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}
                    </div>
                )}
        </React.Fragment>
    );
};

export default withStyles(styles, { withTheme: true })(DashboardCards);
