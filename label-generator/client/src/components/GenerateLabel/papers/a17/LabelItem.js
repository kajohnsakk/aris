import React from "react";
const HtmlToReactParser = require("html-to-react").Parser;

var htmlToReactParser = new HtmlToReactParser();

const LabelItem = (props) => {
  const { info, order } = props;
  const styles = {
    textSpace: {
      letterSpacing: "0.5em",
      fontWeight: "bolder",
    },
    paperSize: {
      width: "302.362204724px",
      height: "396.850393701px",
    },
  };

  return (
    <div
      className="border-solid border-2 border-gray-400"
      style={styles.paperSize}
    >
      <div className="p-2">
        <div className="flex">
          <div className="items-center justify-center flex text-xs">
            Powered by <img className="ml-1 w-8" src="/logo.png" alt="" />
          </div>
        </div>
        <div className="flex mt-2">
          <div className="border w-full p-2">
            <div className="text-xs font-bold">ผู้ส่งพัสดุ(Sender)</div>
            <div className="ml-4">
              <div className="text-xs">{info.sender}</div>
              <div className="description text-xs">
                {info.address} โทร {info.telephone}
              </div>
              <div className="text-sm space-x-4" style={styles.textSpace}>
                {info.postcode}
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="border w-full p-2">
            <div className="text-xs font-bold">ผู้รับพัสดุ(Receiver)</div>
            <div className="ml-4">
              <div className="text-xs">{order.customerName}</div>
              <div className="description text-xs">
                {order.customerAddress} โทร {order.customerTelephone}
              </div>
              <div className="text-sm space-x-4" style={styles.textSpace}>
                {order.postalCode}
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="border p-2 w-full text-xs">
            <div>
              <div className="font-bold mr-1">OrderID: </div>
              <span className="ml-2">{order.orderID}</span>
            </div>
            <div>
              <div className="font-bold mr-1">Payment: </div>
              <span className="ml-2">{order.paymentDate}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="border p-2 w-4/5 text-xs">
            <div>รายการสั่งซื้อ</div>
          </div>
          <div className="border p-2 w-1/5 text-xs ">
            <div>QTY</div>
          </div>
        </div>
        <div className="flex">
          <div className="border p-2 w-4/5 text-xs">
            <div className="break-words">
              {order.selectedProduct.substr(0, 80)}
              {order.selectedProduct.length > 80 && "..."}
            </div>
          </div>
          <div className="border p-2 w-1/5 text-xs ">
            <p>
              {htmlToReactParser.parse(
                order.quantity.replaceAll("\n", "<br/>")
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelItem;
