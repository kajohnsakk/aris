const moment = require("moment");

export class Utils {
  public static timeline(WITHDRAW_MODE: string) {
    let timeline: number = 0;
    if (WITHDRAW_MODE === "REALTIME") {
      timeline = 0;
    } else {
      const date = new Date();
      const hr = Number(date.toString().split(" ")[4].split(":")[0]);
      if (hr >= 0 && hr <= 11) {
        timeline = 1;
      } else if (hr >= 12 && hr <= 23) {
        timeline = 2;
      }
    }
    return timeline;
  }

  public static convertTo2decimal(processNumber: number) {
    return Math.round(processNumber * 100) / 100;
  }

  public static generateInvoiceData(
    documentNumber: string,
    invoiceCustomerData: { [key: string]: any },
    serviceFeeList: Array<{ [key: string]: any }>,
    invoiceVatPercent: number,
    orders: Array<{ [key: string]: any }>
  ) {
    let invoiceData: any = {};

    let documentData: any[] = [];
    let customerInfo: any = {};
    let summaryInfo: any = {};
    let invoiceSubtotal = 0;
    let invoiceVat = 0;

    serviceFeeList.map((serviceFeeInfo, index) => {
      let discount = this.convertTo2decimal(
        (serviceFeeInfo["unitPrice"] * serviceFeeInfo["discountPercent"]) / 100
      );
      let price = this.convertTo2decimal(
        serviceFeeInfo["amount"] * serviceFeeInfo["unitPrice"] - discount
      );
      let dataTransaction = {
        index: index + 1,
        description: serviceFeeInfo["description"],
        amount: serviceFeeInfo["amount"],
        unitPrice: serviceFeeInfo["unitPrice"],
        discountPercent: serviceFeeInfo["discountPercent"],
        discount: discount,
        price: price,
      };
      invoiceSubtotal = this.convertTo2decimal(invoiceSubtotal + price);
      documentData.push(dataTransaction);
    });

    invoiceVat = this.convertTo2decimal(
      (invoiceSubtotal * invoiceVatPercent) / 100
    );

    if (
      invoiceCustomerData.hasOwnProperty("taxNumber") &&
      invoiceCustomerData["taxNumber"].length > 0
    ) {
      invoiceData["isInvoice"] = true;
      customerInfo["name"] = invoiceCustomerData["name"];
      customerInfo["address"] =
        invoiceCustomerData["addressInfo"]["addressLine1"] +
        " " +
        invoiceCustomerData["addressInfo"]["addressLine2"] +
        " " +
        invoiceCustomerData["addressInfo"]["state"] +
        " " +
        invoiceCustomerData["addressInfo"]["city"] +
        " " +
        invoiceCustomerData["addressInfo"]["postalCode"] +
        " " +
        invoiceCustomerData["addressInfo"]["country"];
      customerInfo["taxID"] = invoiceCustomerData["taxNumber"];
    } else {
      invoiceData["isInvoice"] = false;
      customerInfo["name"] = invoiceCustomerData.hasOwnProperty("name")
        ? invoiceCustomerData["name"]
        : "";
      customerInfo["address"] = "";
      customerInfo["taxID"] = "";
    }

    summaryInfo["subtotal"] = invoiceSubtotal;
    summaryInfo["vatPercent"] = invoiceVatPercent;
    summaryInfo["vat"] = invoiceVat;
    summaryInfo["total"] = this.convertTo2decimal(invoiceSubtotal + invoiceVat);

    invoiceData["documentNumber"] = documentNumber;
    invoiceData["documentDate"] = moment().format("DD/MM/YYYY");
    invoiceData["customerInfo"] = customerInfo;
    invoiceData["documentData"] = documentData;
    invoiceData["summaryInfo"] = summaryInfo;
    invoiceData["orders"] = orders;

    return invoiceData;
  }

  public static calculateFundsTransaction(fundsTransactionList: {
    [key: string]: any;
  }) {
    let result = { deposit: 0, depositFee: 0, withdraw: 0, withdrawFee: 0 };
    for (var i: number = 0; i < fundsTransactionList.length; i++) {
      if (fundsTransactionList[i]["type"] === "DEPOSIT") {
        result["deposit"] = this.convertTo2decimal(
          result["deposit"] + Number(fundsTransactionList[i]["amount"])
        );
        result["depositFee"] = this.convertTo2decimal(
          result["depositFee"] + Number(fundsTransactionList[i]["fee"])
        );
      } else {
        result["withdraw"] = this.convertTo2decimal(
          result["withdraw"] + Number(fundsTransactionList[i]["amount"])
        );
        result["withdrawFee"] = this.convertTo2decimal(
          result["withdrawFee"] + Number(fundsTransactionList[i]["fee"])
        );
      }
    }

    return Promise.resolve(result);
  }

  public static findLastWithdrawTime(fundsTransactionList: {
    [key: string]: any;
  }) {
    let lastWithdrawTime = 0;
    fundsTransactionList.map((fundsTransaction: { [key: string]: any }) => {
      if (fundsTransaction["type"] === "WITHDRAW") {
        lastWithdrawTime = Math.max(
          lastWithdrawTime,
          fundsTransaction["createdAt"]
        );
      }
    });

    return Promise.resolve(lastWithdrawTime);
  }

  public static generateInvoiceDocumentNumber(
    invoiceType: string,
    countInvoiceInMonth: number
  ) {
    let date = new Date();
    let year = date.getFullYear();
    let month = this.addZeroBeforeNumber(date.getMonth() + 1, 2);
    let runningNumber = this.addZeroBeforeNumber(countInvoiceInMonth + 1, 4);
    return `INV${invoiceType}${year}${month}${runningNumber}`;
  }

  public static addZeroBeforeNumber(number: number, digit: number) {
    var numDigit = Math.pow(10, digit);
    var numberString = (number + numDigit).toString();
    return numberString.substring(1);
  }

  public static generateOrderDataForInvoice(
    fundsTransactionList: Array<{ [key: string]: any }>,
    orderList: Array<{ [key: string]: any }>
  ) {
    let resultOrderList: Array<{ [key: string]: any }> = [];
    for (let i = 0; i < fundsTransactionList.length; i++) {
      let fundsTransaction = fundsTransactionList[i];
      let orderID = fundsTransaction["orderInfo"]["orderID"];

      let selectedOrder = orderList.find((orderInfo) => {
        return orderInfo["orderID"] === orderID;
      });

      if (selectedOrder && selectedOrder.hasOwnProperty("orderID")) {
        selectedOrder["summary"]["fee"] = fundsTransaction["fee"];
        selectedOrder["summary"]["afterFee"] = fundsTransaction["actualAmount"];
        resultOrderList.push(selectedOrder);
      }
    }

    return Promise.resolve(resultOrderList);
  }

  public static generateOrderCsvHeader() {
    return [
      "orderID",
      "paymentDate",
      "customerName",
      "selectedProduct",
      "quantity",
      "productHashtag",
      "productSKU",
      "totalPrice",
      "totalDeliveryCost",
      "grandTotal",
      "fee",
      "afterFee",
    ];
  }

  public static generateOrderCsvData(orderList: Array<{ [key: string]: any }>) {
    let csvData: Array<{ [key: string]: any }> = [];
    orderList.map((order) => {
      let orderID = order["orderID"];
      let paymentDate =
        order["paymentInfo"].hasOwnProperty("paymentCompletedOn") &&
        order["paymentInfo"]["paymentCompletedOn"].length > 0
          ? order["paymentInfo"]["paymentCompleted"]
          : order["orderDate"];
      let customerName =
        order["paymentInfo"].hasOwnProperty("gbPaymentDetails") &&
        order["paymentInfo"]["gbPaymentDetails"].hasOwnProperty(
          "customerName"
        ) &&
        order["paymentInfo"]["gbPaymentDetails"]["customerName"].length > 0
          ? order["paymentInfo"]["gbPaymentDetails"]["customerName"]
          : order["userInfo"]["firstName"] +
            " " +
            order["userInfo"]["lastName"];
      let selectedProduct = "";
      let quantity = "";
      let productHashtag = "";
      let productSKU = "";
      let totalPrice = order["summary"]["totalPrice"];
      let totalDeliveryCost = order["summary"]["totalDeliveryCost"];
      let grandTotal = order["summary"]["grandTotal"];
      let fee = order["summary"].hasOwnProperty("fee")
        ? order["summary"]["fee"]
        : 0;
      let afterFee = order["summary"].hasOwnProperty("afterFee")
        ? order["summary"]["afterFee"]
        : 0;

      let products = order["selectedProduct"];
      for (let i = 0; i < products.length; i++) {
        let size = "";
        let color = "";
        let price = "";
        let tempQuantity;
        let concatAll;
        let tempSku;

        if (products[i]["productValue"]["size"]) {
          size = `${products[i]["productValue"]["size"]}`;
        }

        if (Object.keys(products[i]["productValue"]["colorObj"]).length > 0) {
          color = `${products[i]["productValue"]["colorObj"]["label"]}`;
        }

        if (products[i]["productValue"]["price"]) {
          price = `${products[i]["productValue"]["price"]} THB`;
        }

        if (products[i]["availableQuantity"]) {
          tempQuantity = products[i]["availableQuantity"];
        } else {
          tempQuantity = 1;
        }

        if (
          products[i]["productValue"].hasOwnProperty("sku") &&
          products[i]["productValue"]["sku"].length > 0
        ) {
          tempSku = products[i]["productValue"]["sku"];
        } else {
          tempSku = "-";
        }

        if (color && size) {
          concatAll = `${color} - ${size} ${price}`;
        } else {
          concatAll = `${price}`;
        }

        selectedProduct += `${products[i]["productNameWithoutColor"]} ${concatAll} \n`;
        quantity += `${tempQuantity}\n`;
        productHashtag += `${products[i]["productHashtag"]}\n`;
        productSKU += `${tempSku}\n`;
      }

      csvData.push({
        orderID: orderID,
        paymentDate: moment(paymentDate).format("DD/MM/YYYY"),
        customerName: customerName,
        selectedProduct: selectedProduct,
        quantity: quantity,
        productHashtag: productHashtag,
        productSKU: productSKU,
        totalPrice: totalPrice,
        totalDeliveryCost: totalDeliveryCost,
        grandTotal: grandTotal,
        fee: fee,
        afterFee: afterFee,
      });
    });

    return csvData;
  }

  public static calculateDepositFundsTransaction(
    fundsTransactionList: Array<{ [key: string]: any }>
  ) {
    let depositFundsTransactionList: Array<{ [key: string]: any }> = [];
    let totalWithdraw = 0;
    let totalDeposit = 0;

    for (let i: number = fundsTransactionList.length - 1; i >= 0; i--) {
      if (fundsTransactionList[i]["type"] === "WITHDRAW") {
        totalWithdraw = this.convertTo2decimal(
          totalWithdraw +
            Number(fundsTransactionList[i]["actualAmount"]) +
            Number(fundsTransactionList[i]["fee"])
        );
      }
    }

    for (let i: number = fundsTransactionList.length - 1; i >= 0; i--) {
      if (fundsTransactionList[i]["type"] === "DEPOSIT") {
        totalDeposit = this.convertTo2decimal(
          totalDeposit + Number(fundsTransactionList[i]["actualAmount"])
        );

        if (totalWithdraw < totalDeposit) {
          depositFundsTransactionList.push(fundsTransactionList[i]);
        }
      }
    }

    return Promise.resolve(depositFundsTransactionList);
  }
}
