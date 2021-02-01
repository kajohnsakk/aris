import React, { useState } from "react";
import * as AppConfig from "../../config/AppConfig";
import Cookies from "js-cookie";
import CircularProgress from "@material-ui/core/CircularProgress";

import { ApiService } from "app/main/modules/ApiService";

import { VpnKey as VpnKeyIcon } from "@material-ui/icons";

const WEB_URL = AppConfig.WEB_URL;

const StoreManagement = (props) => {
  const [storeText, setStoreText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (event) => {
    setStoreText(event.target.value);
  };

  const accessStore = async () => {
    try {
      let response = await ApiService.getInstance().request({
        method: "post",
        url: "/controlpanel/stores/access",
        data: {
          storeID: storeText,
        },
      });

      if (response.data.statusCode === 200) {
        Cookies.remove("auth0_uid");
        Cookies.set("auth0_uid", response.data.details.authID, {
          domain: ".arislab.ai",
        });

        window.open(WEB_URL);
        setIsLoading(false);
      }
    } catch (error) {
      alert(error.response.data ? error.response.data.message : error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="my-32 flex flex-col items-center w-full">
      <div className="flex items-center border border-2 border-teal py-2 rounded-full h-60 w-3/5">
        <input
          className="appearance-none bg-transparent border-none text-center w-full text-grey-darker text-2xl"
          type="text"
          placeholder={"Please enter store id"}
          value={storeText}
          onChange={(e) => handleTextChange(e)}
        />
      </div>
      {isLoading ? <CircularProgress className="mt-32" size="40px" /> : <div />}
      <button
        className={
          "my-32 px-16 rounded-full w-2/5 border-2 h-64 bg-pink text-white text-2xl"
        }
        onClick={() => {
          setIsLoading(true, accessStore());
        }}
        disabled={isLoading}
      >
        <VpnKeyIcon style={{ fontSize: 20 }} /> Access Store
      </button>
    </div>
  );
};

export default StoreManagement;
