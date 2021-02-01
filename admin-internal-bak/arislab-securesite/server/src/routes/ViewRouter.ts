import * as Express from "express";
import { ErrorObject } from "../utils/ErrorObject";
import { Log } from "../utils/Log";
import { ExternalProxy } from "../modules/ExternalProxy";
import { Channel } from "../models/Channel";
import { Store } from "../models/Store";
import { Order } from "../models/Order";
import { GBPayAccount } from "../models/GBPayAccount";
import { FundsTransaction } from "../models/FundsTransaction";
import { GoogleApi } from "../modules/GoogleApi";
import { Utils } from "../utils/Utils";
import { Chart } from "../utils/Chart";
const authMiddleware = require("../middlewares/auth.middleware");

const GBPAY_API_URL = "https://api.gbprimepay.com";
const router = Express.Router();

const multer = require("multer");
const upload = multer();

router.get("/", (req: any, res: any) => {
  res.render("main");
});

router.get("/logout", (req: any, res: any) => {
  if (req.cookies.isAuth) {
    res.clearCookie("isAuth");
  }
  res.render("login");
});

router.get("/store", authMiddleware(), (req: any, res: any) => {
  let from = req.query.from || 0;
  let showAll = req.query.showAll || false;
  let uri = "http://localhost:1780/api/store";

  if (from !== null || (from !== undefined && from >= 0)) {
    uri += "?from=" + from;
  }

  if (showAll) {
    uri += "?showAll=true";
  }

  ExternalProxy.getInstance()
    .sendRequest({
      uri: uri,
      method: "get",
    })
    .then((resultStore: any) => {
      let renderObj = { data: resultStore };
      Log.debug("rendering with", renderObj);
      res.render("main", renderObj);
    });
});

router.get("/otp", authMiddleware(), (req: any, res: any) => {
  res.render("utils/otp");
});

router.post("/otp", upload.none(), authMiddleware(), (req: any, res: any) => {
  const otp_refCode = req.body.otp_refCode;

  if (!otp_refCode) {
    Log.error("otp_refCode must not be empty");
    throw ErrorObject.NULL_OBJECT;
  } else {
    ExternalProxy.getInstance()
      .sendRequest({
        uri: `http://localhost:1780/api/otp/findByRef`,
        method: "post",
        body: { refCode: otp_refCode },
      })
      .then((resultFindByRefCode: any) => {
        Log.debug("resultFindByRefCode", resultFindByRefCode);
        let renderObj = { resultFindByRefCode: resultFindByRefCode };
        res.render("utils/otp", renderObj);
      });
  }
});

router.get("/product/add", authMiddleware(), (req: any, res: any) => {
  let storeID = req.query.storeID;
  if (!storeID) {
    Log.error("storeID must not be empty");
    throw ErrorObject.NULL_OBJECT;
  } else {
    ExternalProxy.getInstance()
      .sendRequest({
        uri: `http://localhost:1780/api/product/generateNewHashtag/storeID/${storeID}`,
        method: "get",
      })
      .then((resultNextHashtag: any) => {
        let renderObj = { storeID: storeID, nextHashtag: resultNextHashtag };
        res.render("product/addProduct", renderObj);
      });
  }
});

router.get("/gbpayAccount/list", authMiddleware(), (req: any, res: any) => {
  ExternalProxy.getInstance()
    .sendRequest({
      uri: `http://localhost:1780/api/gbpayAccount/all`,
      method: "get",
    })
    .then((resultFindAll: any) => {
      let renderObj = { resultFindAll: resultFindAll };
      Log.debug("rendering gbpay account with obj", renderObj);
      res.render("gbpayAccount/tokenList", renderObj);
    });
});

router.get("/gbpayAccount/new", authMiddleware(), (req: any, res: any) => {
  let renderObj = { isEdit: false };
  Log.debug("rendering gbpay account with obj", renderObj);
  res.render("gbpayAccount/form", renderObj);
});

router.get("/gbpayAccount/edit", authMiddleware(), (req: any, res: any) => {
  let id = req.query.id;
  if (!id) {
    Log.error("id must not be empty");
    throw ErrorObject.NULL_OBJECT;
  } else {
    ExternalProxy.getInstance()
      .sendRequest({
        uri: `http://localhost:1780/api/gbpayAccount/details?id=${id}`,
        method: "get",
      })
      .then((resultGBPayAccountDetails: any) => {
        let renderObj = {
          isEdit: true,
          resultGBPayAccountDetails: resultGBPayAccountDetails,
        };
        Log.debug("rendering gbpay account with obj", renderObj);
        res.render("gbpayAccount/form", renderObj);
      });
  }
});

router.get(
  "/gbpayAccount/loadAllToken",
  authMiddleware(),
  async (req: any, res: any) => {
    try {
      const resultLoadAllToken = await ExternalProxy.getInstance().sendRequest({
        uri: `http://localhost:1780/api/gbpayAccount/loadAllToken`,
        method: "get",
      });
      Log.debug("result load all token", resultLoadAllToken);
      res.send(resultLoadAllToken);
    } catch (error) {
      Log.error("Error while loading all token: ", error);
      res.send(error);
    }
  }
);

/* Reports */
router.get("/reports", authMiddleware(), (req: any, res: any) => {
  res.render("reports/index");
});

router.get("/orderReport", authMiddleware(), (req: any, res: any) => {
  ExternalProxy.getInstance()
    .sendRequest({
      uri: "http://localhost:1780/api/stores",
      method: "get",
    })
    .then((resultStore: any) => {
      let renderObj = { data: resultStore };
      Log.debug("rendering with", renderObj);
      res.render("reports/order", renderObj);
    });
});

router.get(
  "/fundsTransactionReport",
  authMiddleware(),
  (req: any, res: any) => {
    ExternalProxy.getInstance()
      .sendRequest({
        uri: "http://localhost:1780/api/stores",
        method: "get",
      })
      .then((resultStore: any) => {
        let renderObj = { data: resultStore };
        Log.debug("rendering with", renderObj);
        res.render("reports/fundsTransaction", renderObj);
      });
  }
);

router.get("/orderFrequencyReport", authMiddleware(), (req: any, res: any) => {
  ExternalProxy.getInstance()
    .sendRequest({
      uri: "http://localhost:1780/api/stores",
      method: "get",
    })
    .then((resultStore: any) => {
      let renderObj = { data: resultStore };
      Log.debug("rendering with", renderObj);
      res.render("reports/orderFrequency", renderObj);
    });
});

router.get("/summaryReport", authMiddleware(), (req: any, res: any) => {
  res.render("reports/summary");
});

router.get("/checkFee", authMiddleware(), (req: any, res: any) => {
  var storeID = req.query.storeID;
  var months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฏาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  ExternalProxy.getInstance()
    .sendRequest({
      uri:
        "http://localhost:1780/api/fundsTransaction/getFundsTransactionList/?selectedStoreID=" +
        storeID +
        "&selectedType=DEPOSIT",
      method: "get",
    })
    .then((fundsTransactionList: any) => {
      var feeResult: any = [];
      console.log("Found: " + fundsTransactionList.length);
      for (var i = 0; i < fundsTransactionList.length; i++) {
        var fundsTransaction = fundsTransactionList[i];
        var fee = fundsTransaction["fee"];
        var date = new Date(fundsTransaction["createdAt"]);
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var monthYear = `${month} ${year}`;

        var newFee = Math.round(fee * 100) / 100;
        console.log(
          i +
            " =====> " +
            monthYear +
            " (" +
            year +
            "-" +
            date.getMonth() +
            ") [" +
            fundsTransaction["createdAt"] +
            "] ===> " +
            newFee
        );
        if (typeof feeResult[monthYear] === "undefined") {
          feeResult[monthYear] = Math.round(fee * 100) / 100;
        } else {
          feeResult[monthYear] += Math.round(fee * 100) / 100;
        }
      }
      console.log(feeResult);
      var table = "<table border='1'>";
      for (var index in feeResult) {
        table +=
          "<tr><td>" +
          index +
          "</td><td>" +
          Math.round(feeResult[index] * 100) / 100 +
          "</td></tr>";
      }
      table += "</table>";
      res.send(table);
    });
});

/* Dashboard */
router.get("/dailyDashboard", authMiddleware(), async (req: any, res: any) => {
  let dayInterval = req.query.dayInterval ? req.query.dayInterval : 7;

  let startDate = Utils.getTimestamp(dayInterval, 13);
  let endDate = Utils.getTimestamp(0, 13);

  let googleApi = new GoogleApi();
  await googleApi.connectToAnalytics();
  googleApi.setAnalyticsDay(dayInterval);
  let newVisitorsOnHomepage = await googleApi.getNewVisitorsOnHomepage();
  let newVisitorsClickOnHomepage = await googleApi.getNewVisitorsClickOnHomepage();
  let newVisitorsOnLoginPage = await googleApi.getNewVisitorsOnLoginPage();
  let visitorsOnOTPConfirmationPage = await googleApi.getVisitorsOnOTPConfirmationPage();
  let visitorsOnPINCodePage = await googleApi.getVisitorsOnPINCodePage();
  let visitorsOnPINCode2Page = await googleApi.getVisitorsOnPINCode2Page();

  let storeList = await Store.getStoreList(startDate, endDate);
  let orderList = await Order.findAllOrder("", "SUCCESS", startDate, endDate);

  let xLabelList = [
    {
      label: "New Visitors",
      tag: "newVisitors",
    },
    {
      label: "Click login btn",
      tag: "clickLoginBtn",
    },
    {
      label: "Login Page",
      tag: "loginPage",
    },
    {
      label: "Registered",
      tag: "registered",
    },
    {
      label: "OTP Page",
      tag: "otpPage",
    },
    {
      label: "Pin code Page",
      tag: "pinCodePage",
    },
    {
      label: "Pin code Page 2",
      tag: "pinCodePage2",
    },
    {
      label: "Verified Users",
      tag: "verifiedUsers",
    },
    {
      label: "Connected facebook",
      tag: "connectedFacebook",
    },
    {
      label: "Actived Users",
      tag: "activedUsers",
    },
  ];

  let analyticsRawDataList: any = {};
  let platformRawDataList: any = {};

  analyticsRawDataList["newVisitors"] = newVisitorsOnHomepage;
  analyticsRawDataList["clickLoginBtn"] = newVisitorsClickOnHomepage;
  analyticsRawDataList["loginPage"] = newVisitorsOnLoginPage;
  analyticsRawDataList["otpPage"] = visitorsOnOTPConfirmationPage;
  analyticsRawDataList["pinCodePage"] = visitorsOnPINCodePage;
  analyticsRawDataList["pinCodePage2"] = visitorsOnPINCode2Page;

  platformRawDataList["storeList"] = storeList;
  platformRawDataList["orderList"] = orderList;

  let lineChartData = await Chart.generateLineChartData(
    xLabelList,
    analyticsRawDataList,
    platformRawDataList
  );

  let renderObj: any = {};
  renderObj["xLabelList"] = JSON.stringify(xLabelList);
  renderObj["lineChartData"] = JSON.stringify(lineChartData);
  console.log("Render 'dailyDashboard' with body: ", renderObj);
  res.render("reports/dailyDashboard", renderObj);
});

router.get("/calculatePackage", authMiddleware(), (req: any, res: any) => {
  res.render("package/calculate");
});

/* Search Order */
router.get("/searchOrder", authMiddleware(), async (req: any, res: any) => {
  var selectedField = req.query.field || "";
  var selectedValue = req.query.value || "";
  console.log(`${selectedField} ==> ${selectedValue}`);

  let orderList: any = [];
  if (selectedField.length > 0 && selectedValue.length > 0) {
    orderList = await Order.findOrderBySelection(selectedField, selectedValue);
  }
  console.log("orderList ==> ", orderList);

  let renderObj: any = [];
  renderObj["orderList"] = JSON.stringify(orderList);
  res.render("search/order", renderObj);
});

router.get("/storePackage", authMiddleware(), async (req: any, res: any) => {
  const rawStoreList = await ExternalProxy.getInstance().sendRequest({
    uri: `http://localhost:1780/api/stores`,
    method: "get",
  });

  const storePackageList = await ExternalProxy.getInstance().sendRequest({
    uri: `http://localhost:1780/api/storePackage`,
    method: "get",
  });

  const packageList = await ExternalProxy.getInstance().sendRequest({
    uri: `https://manage.arislab.ai/getPlatformPackage`,
    method: "get",
  });

  const storeList = await Utils.createStorePackageToStoreObj(
    rawStoreList,
    storePackageList
  );

  let renderObj = { storeList: storeList, packageList: packageList };
  Log.debug("rendering with", renderObj);

  res.render("storePackage/storePackageList", renderObj);
});

router.get(
  "/storePackage/store/:storeID",
  authMiddleware(),
  async (req: any, res: any) => {
    let storeID = req.params.storeID;

    const storeInfo = await ExternalProxy.getInstance().sendRequest({
      uri: `http://localhost:1780/api/storeInfo?storeID=${storeID}`,
      method: "get",
    });

    const rawStorePackageList = await ExternalProxy.getInstance().sendRequest({
      uri: `http://localhost:1780/api/storePackage?storeID=${storeID}`,
      method: "get",
    });

    const storePackageList = await Utils.processStorePackageList(
      rawStorePackageList
    );

    //res.send(storePackageList);
    let renderObj = {
      storeInfo: storeInfo,
      storePackageList: storePackageList,
    };
    Log.debug("rendering with", renderObj);

    res.render("storePackage/store", renderObj);
  }
);

router.get(
  "/storePackage/store/:storeID/storePackageID/:storePackageID",
  authMiddleware(),
  async (req: any, res: any) => {
    let storeID = req.params.storeID;
    let storePackageID = req.params.storePackageID;

    const storeInfo = await ExternalProxy.getInstance().sendRequest({
      uri: `http://localhost:1780/api/storeInfo?storeID=${storeID}`,
      method: "get",
    });

    const packageList = await ExternalProxy.getInstance().sendRequest({
      uri: `https://manage.arislab.ai/getPlatformPackage`,
      method: "get",
    });

    let storePackageInfo = {};
    if (storePackageID !== "new") {
      let resultStorePackageInfo = await ExternalProxy.getInstance().sendRequest(
        {
          uri: `http://localhost:1780/api/storePackageInfo?storePackageID=${storePackageID}`,
          method: "get",
        }
      );

      if (
        Array.isArray(resultStorePackageInfo) &&
        resultStorePackageInfo.length > 0
      ) {
        storePackageInfo = resultStorePackageInfo[0];
      }
    }

    //res.send(storePackageList);
    let renderObj = {
      storeInfo: storeInfo,
      storePackageInfo: storePackageInfo,
      storePackageInfoStr: JSON.stringify(storePackageInfo),
      packageList: packageList,
      packageListStr: JSON.stringify(packageList),
    };
    Log.debug("rendering with", renderObj);

    res.render("storePackage/storePackage", renderObj);
  }
);

router.get("/orderInspector", authMiddleware(), async (req: any, res: any) => {
  res.render("orderInspector/index");
});

router.get(
  "/orderInspector/orderDocID/:orderDocID",
  authMiddleware(),
  async (req: any, res: any) => {
    const orderDocID = req.params.orderDocID;
    //console.log('======================', orderDocID);
    let orderList: any = [];
    let orderInfo = {};
    let gbRespnoseInfo = {};
    let isOrderSuccess = false;
    if (orderDocID.length > 0) {
      orderList = await Order.findOrderBySelection("orderDocID", orderDocID);
    } else {
    }
    //console.log('orderList ==> ', orderList);

    let updateOrderData = {
      amount: 0,
      gbpRefNo: "",
      customerName: "",
      customerEmail: "",
    };
    if (orderList.length === 1) {
      orderInfo = orderList[0];
      const storeID = orderInfo["storeID"];
      const referenceNo = orderInfo["paymentInfo"]["referenceNo"];
      isOrderSuccess =
        orderInfo["paymentInfo"]["status"] === "SUCCESS" ? true : false;

      const storeInfo = await Store.getStoreByID(storeID);
      const token =
        storeInfo[0]["storeInfo"]["paymentInfo"]["gbPayInfo"]["token"];

      const gbInfo = await GBPayAccount.findByToken(token);

      if (
        gbInfo.hasOwnProperty("gbPayAccountInfo") &&
        gbInfo["gbPayAccountInfo"].hasOwnProperty("secret_key")
      ) {
        const secretKey = gbInfo["gbPayAccountInfo"]["secret_key"];

        const GBPAY_CHECK_STATUS_URL = `${GBPAY_API_URL}/v1/check_status_txn`;
        const apiResult = await ExternalProxy.getInstance().sendRequest({
          uri: GBPAY_CHECK_STATUS_URL,
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            user: secretKey,
            pass: "",
          },
          method: "post",
          body: {
            referenceNo: orderInfo["paymentInfo"]["referenceNo"],
          },
        });

        gbRespnoseInfo = apiResult;
        if (apiResult.hasOwnProperty("txn")) {
          updateOrderData["amount"] = Number(apiResult["txn"]["amount"]);
          updateOrderData["gbpRefNo"] = apiResult["txn"]["gbpReferenceNo"];
          updateOrderData["customerName"] = apiResult["txn"]["customerName"];
          updateOrderData["customerEmail"] = apiResult["txn"]["customerEmail"];
        }
      }
    }

    let renderObj = {
      orderInfo: JSON.stringify(orderInfo, undefined, 4),
      isOrderSuccess: isOrderSuccess,
      gbRespnoseInfo: JSON.stringify(gbRespnoseInfo, undefined, 4),
      updateOrderData: updateOrderData,
    };
    res.render("orderInspector/orderInfo", renderObj);

    /*
	let renderObj: any = [];
	renderObj['orderList'] = JSON.stringify(orderList);
    res.render('search/order', renderObj);

    res.render('orderInspector/order');
	*/
    //res.send(storeInfo);
    //res.end();
  }
);

router.post(
  "/orderInspector/orderDocID/:orderDocID/update",
  authMiddleware(),
  async (req: any, res: any) => {
    try {
      const orderDocID = req.params.orderDocID;
      const postData = req.body;
      const resultUpdateOrder = await ExternalProxy.getInstance().sendRequest({
        uri: `http://localhost:1780/api/order/orderDocID/${orderDocID}/update`,
        method: "post",
        body: JSON.stringify(postData),
      });
      Log.debug("result update order: ", resultUpdateOrder);
      res.send(resultUpdateOrder);
    } catch (error) {
      Log.error("Error while update order: ", error);
      res.send(error);
    }
  }
);

router.get(
  "/compareOrderFund",
  authMiddleware(),
  async (req: any, res: any) => {
    const orderList = await Order.findSuccessOrderForWallet();
    const successMerchantOrderList = await Order.findSuccessOrderForMerchant();
    const fundsList = await FundsTransaction.getDepositFundsTransactionList();

    let result = [];

    console.log("orderList: " + orderList.length);
    console.log("successMerchantOrderList: " + successMerchantOrderList.length);
    console.log("fundsList: " + fundsList.length);
    for (let i = 0; i < orderList.length; i++) {
      const order = orderList[i];

      const orderID = order["orderID"];
      const storeID = order["storeID"];
      let fundsDocID = [];
      let orderFunds = [];
      let doProcess = true;
      while (doProcess) {
        let index = fundsList.findIndex(
          (fund: any) => fund["orderInfo"]["orderID"] === orderID
        );
        if (index >= 0) {
          fundsDocID.push(fundsList[index]["fundTransactionID"]);
          orderFunds.push(fundsList[index]);
          fundsList.splice(index, 1);
        } else {
          doProcess = false;
        }
      }
      let isMoreThanOne = false;
      if (fundsDocID.length > 1) {
        isMoreThanOne = true;
      }

      result.push({
        orderID: orderID,
        storeID: storeID,
        orderFunds: orderFunds,
        countFunds: fundsDocID.length,
        fundsDocID: fundsDocID.join(),
        isMoreThanOne: isMoreThanOne,
      });
    }

    console.log("Remain funds list: " + fundsList.length);
    let problemFunds = {};
    let summaryResult = { countFund: 0, totalAmount: 0 };
    for (let i = 0; i < fundsList.length; i++) {
      let fund = fundsList[i];
      const createdAt = fund["createdAt"];
      const orderID = fund["orderInfo"]["orderID"];
      const fundStoreID = fund["storeID"];
      let index = successMerchantOrderList.findIndex(
        (order: any) => order["orderID"] === orderID
      );
      //console.log('Fund ==> '+ orderID+ ' ==> '+index);
      const orderType =
        index > -1 &&
        successMerchantOrderList[index].hasOwnProperty("recipientAccountType")
          ? successMerchantOrderList[index]["recipientAccountType"]
          : "N/A";

      fund["orderType"] = orderType;
      fund["isWalletType"] =
        orderType === "MERCHANT_BANK_ACCOUNT" ? false : true;
      fund["fundDate"] =
        new Date(createdAt).getFullYear() +
        "-" +
        (new Date(createdAt).getMonth() + 1) +
        "-" +
        new Date(createdAt).getDate();

      if (!problemFunds.hasOwnProperty(fundStoreID)) {
        problemFunds[fundStoreID] = {
          storeID: fundStoreID,
          actualAmount: 0,
          countFund: 0,
        };
      }

      problemFunds[fundStoreID]["actualAmount"] =
        Math.round(
          (parseFloat(problemFunds[fundStoreID]["actualAmount"]) +
            parseFloat(fund["actualAmount"])) *
            100
        ) / 100;
      problemFunds[fundStoreID]["countFund"]++;

      summaryResult["countFund"]++;
      summaryResult["totalAmount"] =
        Math.round(
          (parseFloat(summaryResult["totalAmount"].toString()) +
            parseFloat(fund["actualAmount"].toString())) *
            100
        ) / 100;
    }
    /*
	let renderObj: any = [];
	renderObj['orderList'] = JSON.stringify(orderList);
    res.render('search/order', renderObj);

    res.render('orderInspector/order');
	*/
    //res.send(result);
    //res.end();

    res.render("fundsTransaction/index", {
      result: result,
      remainFundsList: fundsList,
      problemFunds: problemFunds,
      summaryResult: summaryResult,
    });
  }
);

router.get(
  "/checkOrderAndFundsTransaction",
  authMiddleware(),
  async (req: any, res: any) => {
    const orderList = await Order.findSuccessOrderForWallet();
    const storeList = await Store.getStoreList(0, 0);
    const fundsList = await FundsTransaction.getFundsTransactionList("", 0, 0);

    let result = [];

    console.log("storeList: " + storeList.length);
    console.log("orderList: " + orderList.length);
    console.log("fundsList: " + fundsList.length);

    let totalSummary = {
      countOrder: 0,
      sumOrder: 0,
      countDepositFunds: 0,
      sumDepositFunds: 0,
      sumActualDepositFunds: 0,
      sumDepositFee: 0,
      countWithdrawFunds: 0,
      sumWithdrawFunds: 0,
      sumActualWithdrawFunds: 0,
      sumWithdrawFee: 0,
      remainFunds: 0,
      remainBalance: 0,
    };

    for (let i = 0; i < storeList.length; i++) {
      const storeObj = storeList[i];
      const storeID = storeObj["storeID"];
      const businessName =
        storeObj["storeInfo"]["businessProfile"]["accountDetails"][
          "businessName"
        ];

      let summaryObj = {
        countOrder: 0,
        sumOrder: 0,
        countDepositFunds: 0,
        sumDepositFunds: 0,
        sumActualDepositFunds: 0,
        sumDepositFee: 0,
        countWithdrawFunds: 0,
        sumWithdrawFunds: 0,
        sumActualWithdrawFunds: 0,
        sumWithdrawFee: 0,
        remainFunds: 0,
        remainBalance: 0,
      };

      if (businessName.length > 0) {
        let storeOrder = Utils.findObjectInArray(orderList, "storeID", storeID);
        let storeFunds = Utils.findObjectInArray(fundsList, "storeID", storeID);

        if (storeOrder.length > 0) {
          // console.log(`storeOrder ${storeID}: `, storeOrder);
          for (let j = 0; j < storeOrder.length; j++) {
            const storeOrderObj = storeOrder[j];
            const grandTotal = Number(storeOrderObj["summary"]["grandTotal"]);
            totalSummary["countOrder"]++;
            totalSummary["sumOrder"] =
              Math.round((totalSummary["sumOrder"] + grandTotal) * 100) / 100;

            summaryObj["countOrder"]++;
            summaryObj["sumOrder"] =
              Math.round((summaryObj["sumOrder"] + grandTotal) * 100) / 100;
          }
        }

        if (storeFunds.length > 0) {
          // console.log(`storeFunds ${storeID}: ${storeFunds.length}`);
          for (let j = 0; j < storeFunds.length; j++) {
            const storeFundsObj = storeFunds[j];
            const amount = Number(storeFundsObj["amount"]);
            const fee = Number(storeFundsObj["fee"]);
            const actualAmount = Number(storeFundsObj["actualAmount"]);
            if (storeFundsObj["type"] === "DEPOSIT") {
              totalSummary["countDepositFunds"]++;
              totalSummary["sumDepositFunds"] =
                Math.round((totalSummary["sumDepositFunds"] + amount) * 100) /
                100;
              totalSummary["sumDepositFee"] =
                Math.round((totalSummary["sumDepositFee"] + fee) * 100) / 100;
              totalSummary["sumActualDepositFunds"] =
                Math.round(
                  (totalSummary["sumActualDepositFunds"] + actualAmount) * 100
                ) / 100;

              summaryObj["countDepositFunds"]++;
              summaryObj["sumDepositFunds"] =
                Math.round((summaryObj["sumDepositFunds"] + amount) * 100) /
                100;
              summaryObj["sumDepositFee"] =
                Math.round((summaryObj["sumDepositFee"] + fee) * 100) / 100;
              summaryObj["sumActualDepositFunds"] =
                Math.round(
                  (summaryObj["sumActualDepositFunds"] + actualAmount) * 100
                ) / 100;
            } else {
              totalSummary["countWithdrawFunds"]++;
              totalSummary["sumWithdrawFunds"] =
                Math.round((totalSummary["sumWithdrawFunds"] + amount) * 100) /
                100;
              totalSummary["sumWithdrawFee"] =
                Math.round((totalSummary["sumWithdrawFee"] + fee) * 100) / 100;
              totalSummary["sumActualWithdrawFunds"] =
                Math.round(
                  (totalSummary["sumActualWithdrawFunds"] + actualAmount) * 100
                ) / 100;

              summaryObj["countWithdrawFunds"]++;
              summaryObj["sumWithdrawFunds"] =
                Math.round((summaryObj["sumWithdrawFunds"] + amount) * 100) /
                100;
              summaryObj["sumWithdrawFee"] =
                Math.round((summaryObj["sumWithdrawFee"] + fee) * 100) / 100;
              summaryObj["sumActualWithdrawFunds"] =
                Math.round(
                  (summaryObj["sumActualWithdrawFunds"] + actualAmount) * 100
                ) / 100;
            }
          }

          const remainBalance =
            Math.round(
              (summaryObj["sumActualDepositFunds"] -
                summaryObj["sumActualWithdrawFunds"] -
                summaryObj["sumWithdrawFee"]) *
                100
            ) / 100;
          totalSummary["remainBalance"] =
            Math.round((totalSummary["remainBalance"] + remainBalance) * 100) /
            100;
          summaryObj["remainBalance"] = remainBalance;
        }
        // console.log("");

        if (storeOrder.length > 0 || storeFunds.length > 0) {
          result.push({
            "storeID:": storeID,
            businessName: businessName,
            summaryObj: summaryObj,
          });
        }
      }
    }
    //res.send(result);

    res.render("fundsTransaction/orderAndFunds", {
      result: result,
      totalSummary: totalSummary,
    });
  }
);

router.get("/downloadInvoice", authMiddleware(), async (req: any, res: any) => {
  let invoiceList;
  try {
    const resultUpdateOrder = await ExternalProxy.getInstance().sendRequest({
      uri: `http://localhost:1780/api/invoice/`,
      method: "get",
    });
    invoiceList = await Utils.createInvoiceDateToInvoiceList(resultUpdateOrder);

    res.render("invoice/invoiceList", { invoiceList: invoiceList });
  } catch (error) {
    res.send(error);
  }
});

router.get("/monthlyReport", authMiddleware(), async (req: any, res: any) => {
  let startYear = 2019;
  let nowYear = new Date().getFullYear();
  let yearList = new Array();
  for (let i = nowYear; i >= startYear; i--) {
    yearList.push(i);
  }

  let monthList = [
    { index: 0, value: "January" },
    { index: 1, value: "February" },
    { index: 2, value: "March" },
    { index: 3, value: "April" },
    { index: 4, value: "May" },
    { index: 5, value: "June" },
    { index: 6, value: "July" },
    { index: 7, value: "August" },
    { index: 8, value: "September" },
    { index: 9, value: "October" },
    { index: 10, value: "November" },
    { index: 11, value: "December" },
  ];

  res.render("reports/monthly", { yearList: yearList, monthList: monthList });
});

module.exports = router;
