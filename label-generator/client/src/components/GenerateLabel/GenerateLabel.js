import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import ReactToPrint from "react-to-print";

import A5 from "./papers/a5";
import A17 from "./papers/a17";

const Form = (props) => {
  const {
    paper,
    labelInfo,
    handleUploadImage,
    handleChange,
    handleUploadfile,
  } = props;
  return (
    <div>
      {paper === "a5" && (
        <>
          <img
            className="m-auto login-logo"
            src={labelInfo.logo ? labelInfo.logo : "/no-image.png"}
            alt=""
            width="150"
            height="150"
          />
          <div className="w-full px-3 mb-6 mt-1 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              อัพโหลดโลโก้ร้าน
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="file"
              name="logo"
              onChange={handleUploadImage}
            />
          </div>
        </>
      )}
      <div className="w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          ชื่อผู้ส่ง
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          type="text"
          name="sender"
          onChange={handleChange}
        />
      </div>
      <div className="w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
          ที่อยู่
        </label>
        <textarea
          name="address"
          className="p-2 w-full bg-gray-200 resize-y border rounded focus:outline-none focus:shadow-outline focus:bg-white"
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="flex">
        <div className="w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            เบอร์โทร
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            name="telephone"
            onChange={handleChange}
          />
        </div>
        <div className="w-1/2 px-3 mb-6 mt-1 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            รหัสไปรษณีย์
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            name="postcode"
            onChange={handleChange}
          />
        </div>
      </div>
      {paper === "a5" && (
        <div className="w-full px-3 mb-6 md:mb-2">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            หมายเหตุ
          </label>
          <textarea
            name="comment"
            className="p-2 w-full bg-gray-200 resize-y border rounded focus:outline-none focus:shadow-outline focus:bg-white"
            onChange={handleChange}
          ></textarea>
        </div>
      )}
      <div className="w-full px-3 mb-6 mt-1 md:mb-0">
        <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex items-center">
          อัพโหลดรายการสั่งซื้อ
          <a href="/images/order-download.png" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-1 w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </a>
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          type="file"
          name="order_file"
          onChange={handleUploadfile}
        />
      </div>
    </div>
  );
};

const GenerateLabel = () => {
  const API = "";
  const [labelInfo, setLabelInfo] = useState({});
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState("a5");
  const componentRef = useRef();

  const handleUploadfile = async (e) => {
    try {
      var formData = new FormData();
      formData.append("order_file", e.target.files[0]);
      const { data: orderFileResponse } = await axios.post(
        `${API}/api/v1/generate-label/upload-file`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      setLabelInfo({
        ...labelInfo,
        orders: orderFileResponse.data,
      });

      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUploadImage = (e) => {
    setLabelInfo({
      ...labelInfo,
      logo: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleChange = (e) => {
    setLabelInfo({
      ...labelInfo,
      [e.target.name]: e.target.value,
    });
  };

  const onSelectePaperChange = (e) => {
    setSelectedPaper(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const _labelInfo = {
      logo: labelInfo.logo,
      tel: labelInfo.telephone,
      sender: labelInfo.sender,
      address: labelInfo.address,
      telephone: labelInfo.telephone,
      postcode: labelInfo.postcode,
      comment: labelInfo.comment,
    };

    setLabelInfo({
      info: _labelInfo,
      orders: labelInfo.orders,
    });

    setShowDownloadButton(true);
  };

  return (
    <div className="flex w-full p-8 items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <div className="w-full px-3 mb-6 md:mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            ขนาดกระดาษ
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paper"
              value="a5"
              className="form-radio h-5 w-5 text-gray-600"
              checked={selectedPaper === "a5"}
              onChange={onSelectePaperChange}
            />
            <span className="ml-2 text-gray-700">A5</span>
          </label>
          <label className="inline-flex items-center ml-4">
            <input
              type="radio"
              name="paper"
              value="a17"
              className="form-radio h-5 w-5 text-gray-600"
              checked={selectedPaper === "a17"}
              onChange={onSelectePaperChange}
            />
            <span className="ml-2 text-gray-700">A17</span>
          </label>
        </div>
        <div className="border-b-2 mb-6" />
        <Form
          paper={selectedPaper}
          labelInfo={labelInfo}
          handleUploadImage={handleUploadImage}
          handleChange={handleChange}
          handleUploadfile={handleUploadfile}
        />
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 mt-4 md:mb-0">
            <button
              onClick={onSubmitHandler}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              ยืนยัน
            </button>
            {!loading && showDownloadButton ? (
              <ReactToPrint
                trigger={() => (
                  <button className="w-full mt-2 bg-gray-200 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full">
                    Preview/Print
                  </button>
                )}
                content={() => componentRef.current}
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="ml-4">
        <div className="hidden">
          {!loading && showDownloadButton ? (
            selectedPaper === "a5" ? (
              <A5
                info={labelInfo.info}
                orders={labelInfo.orders}
                ref={componentRef}
              />
            ) : (
              <A17
                info={labelInfo.info}
                orders={labelInfo.orders}
                ref={componentRef}
              />
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

GenerateLabel.propTypes = {};

export default GenerateLabel;
