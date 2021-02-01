import React from "react";
import "./label.css";

const LabelItem = (props) => {
  const { info, order } = props;
  const styles = {
    textSpace: {
      letterSpacing: "0.5em",
      fontWeight: "bolder",
    },
  };

  return (
    <div className="border-solid border-2 border-gray-400">
      <div className="p-8" style={styles.a5}>
        <div className="flex">
          {info.logo ? (
            <img className="w-24 h-14" src={info.logo} alt="" />
          ) : (
            <img className="w-24 h-14" src="/no-image.png" alt="" />
          )}
          <div className="ml-4 mt-6 items-center justify-center flex">
            Powered by <img className="ml-1 w-16" src="/logo.png" alt="" />
          </div>
        </div>
        <div className="flex mt-4">
          <div className="border p-2 w-1/2">
            <div className="text-xl font-bold m-2">ผู้ส่งพัสดุ(Sender)</div>
            <div className="ml-4">
              <div className="text-xl">{info.sender}</div>
              <div className="description">{info.address}</div>
              <div className="tel">โทร {info.telephone}</div>
              <div className="text-2xl" style={styles.textSpace}>
                {info.postcode}
              </div>
            </div>
          </div>
          <div className="border p-2 w-1/2">
            <div className="text-xl font-bold m-2">ผู้รับพัสดุ(Receiver)</div>
            <div className="ml-4">
              <div className="text-xl">{order.customerName}</div>
              <div className="description">{order.customerAddress}</div>
              <div className="tel">โทร {order.customerTelephone}</div>
              <div className="text-2xl space-x-4" style={styles.textSpace}>
                {order.postalCode}
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="border p-2 w-1/2">
            <p>หมายเลขคำสั่งซื้อ {order.orderID}</p>
            <p>วันที่สั่งซื้อ {order.orderDate}</p>
          </div>
          <div className="border p-2 w-1/2">
            <span>หมายเหตุ:</span>
            <p className="ml-4">{info.comment}</p>
          </div>
        </div>
        <div className="text-xl text-center mt-4">
          ให้ <span className="text-pink-500">ARIS</span> ช่วยปิดการขายทุกการ
          Live
        </div>
      </div>
      <div className="page-break" />
    </div>
  );
};

export default LabelItem;
