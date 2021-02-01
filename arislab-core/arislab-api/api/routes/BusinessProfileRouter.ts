export {};

import { Log } from "../ts-utils/Log";
import { sha256 } from "js-sha256";

import {
  JSONData as BusinessProfileJSON,
  BusinessProfile,
} from "../models/BusinessProfile";
import * as express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/all", (req: Request, res: Response) => {
  BusinessProfile.getAll().then((result) => {
    res.send(result);
    res.end();
  });
});

router.get("/storeID/:storeID/", (req: Request, res: Response) => {
  let storeID = req.params.storeID;
  BusinessProfile.findById(storeID).then((resultFindByID) => {
    res.send(resultFindByID);
    res.end();
  });
});

router.get("/storeEmail/:storeEmail", (req: Request, res: Response) => {
  let email = req.params.storeEmail;
  BusinessProfile.findByEmail(email).then((result) => {
    res.send(result);
    res.end();
  });
});

router.post("/storeID/:storeID/update", (req: Request, res: Response) => {
  Log.debug("update without section");
  Log.debug("storeID is ", req.params.storeID);
  Log.debug("req body", req.body);

  let requestBody = req.body;
  let storeID = req.params.storeID;
  let updateData: any;

  updateData = {
    storeID: "",
    verifyInfo: {
      isVerified: false,
      verifiedAt: 0,
      otpID: "",
      pinCode: "",
    },
    storeInfo: {
      businessProfile: {
        logo: "",
        businessEmail: "",
        businessPhoneNo: "",
        accountDetails: {
          name: "",
          businessName: "",
        },
        businessAddress: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      },
    },
  };

  if (requestBody.hasOwnProperty("storeID")) {
    updateData["storeID"] = storeID;
  }

  if (requestBody.hasOwnProperty("verifyInfo")) {
    if (
      requestBody.verifyInfo &&
      requestBody.verifyInfo.hasOwnProperty("isVerified")
    ) {
      updateData["verifyInfo"]["isVerified"] =
        requestBody.verifyInfo.isVerified;
    }
    if (
      requestBody.verifyInfo &&
      requestBody.verifyInfo.hasOwnProperty("verifiedAt")
    ) {
      updateData["verifyInfo"]["verifiedAt"] =
        requestBody.verifyInfo.verifiedAt;
    }
    if (
      requestBody.verifyInfo &&
      requestBody.verifyInfo.hasOwnProperty("otpID")
    ) {
      updateData["verifyInfo"]["otpID"] = requestBody.verifyInfo.otpID;
    }
    if (
      requestBody.verifyInfo &&
      requestBody.verifyInfo.hasOwnProperty("pinCode")
    ) {
      let requestPinCode = "";
      if (
        requestBody.verifyInfo.pinCode.length === 6 &&
        /^\d{6}$/.test(requestBody.verifyInfo.pinCode.toString())
      ) {
        requestPinCode = sha256(requestBody.verifyInfo.pinCode);
      } else {
        requestPinCode = requestBody.verifyInfo.pinCode;
      }
      updateData["verifyInfo"]["pinCode"] = requestPinCode;
    }
  }

  if (
    requestBody.hasOwnProperty("storeInfo") &&
    requestBody.storeInfo.hasOwnProperty("businessProfile")
  ) {
    if (requestBody.storeInfo.businessProfile.hasOwnProperty("logo")) {
      let businessProfile_logoURL = requestBody.storeInfo.businessProfile.logo;
      updateData["storeInfo"]["businessProfile"][
        "logo"
      ] = businessProfile_logoURL;
    }

    if (requestBody.storeInfo.businessProfile.hasOwnProperty("businessEmail")) {
      let businessProfile_businessEmail =
        requestBody.storeInfo.businessProfile.businessEmail;
      updateData["storeInfo"]["businessProfile"][
        "businessEmail"
      ] = businessProfile_businessEmail;
    }
    if (
      requestBody.storeInfo.businessProfile.hasOwnProperty("businessPhoneNo")
    ) {
      let businessProfile_businessPhoneNo =
        requestBody.storeInfo.businessProfile.businessPhoneNo;
      updateData["storeInfo"]["businessProfile"][
        "businessPhoneNo"
      ] = businessProfile_businessPhoneNo;
    }

    if (
      requestBody.storeInfo.businessProfile.hasOwnProperty("accountDetails")
    ) {
      if (
        requestBody.storeInfo.businessProfile.accountDetails.hasOwnProperty(
          "name"
        )
      ) {
        let businessProfile_name =
          requestBody.storeInfo.businessProfile.accountDetails.name;
        updateData["storeInfo"]["businessProfile"]["accountDetails"][
          "name"
        ] = businessProfile_name;
      }
      if (
        requestBody.storeInfo.businessProfile.accountDetails.hasOwnProperty(
          "businessName"
        )
      ) {
        let businessProfile_businessName =
          requestBody.storeInfo.businessProfile.accountDetails.businessName;
        updateData["storeInfo"]["businessProfile"]["accountDetails"][
          "businessName"
        ] = businessProfile_businessName;
      }
    }

    if (
      requestBody.storeInfo.businessProfile.hasOwnProperty("businessAddress")
    ) {
      if (
        requestBody.storeInfo.businessProfile.businessAddress.hasOwnProperty(
          "addressLine1"
        )
      ) {
        let businessProfile_addressLine1 =
          requestBody.storeInfo.businessProfile.businessAddress.addressLine1;
        updateData["storeInfo"]["businessProfile"]["businessAddress"][
          "addressLine1"
        ] = businessProfile_addressLine1;
      }
      if (
        requestBody.storeInfo.businessProfile.businessAddress.hasOwnProperty(
          "addressLine2"
        )
      ) {
        let businessProfile_addressLine2 =
          requestBody.storeInfo.businessProfile.businessAddress.addressLine2;
        updateData["storeInfo"]["businessProfile"]["businessAddress"][
          "addressLine2"
        ] = businessProfile_addressLine2;
      }
      if (
        requestBody.storeInfo.businessProfile.businessAddress.hasOwnProperty(
          "city"
        )
      ) {
        let businessProfile_city =
          requestBody.storeInfo.businessProfile.businessAddress.city;
        updateData["storeInfo"]["businessProfile"]["businessAddress"][
          "city"
        ] = businessProfile_city;
      }
      if (
        requestBody.storeInfo.businessProfile.businessAddress.hasOwnProperty(
          "state"
        )
      ) {
        let businessProfile_state =
          requestBody.storeInfo.businessProfile.businessAddress.state;
        updateData["storeInfo"]["businessProfile"]["businessAddress"][
          "state"
        ] = businessProfile_state;
      }
      if (
        requestBody.storeInfo.businessProfile.businessAddress.hasOwnProperty(
          "postalCode"
        )
      ) {
        let businessProfile_postalCode =
          requestBody.storeInfo.businessProfile.businessAddress.postalCode;
        updateData["storeInfo"]["businessProfile"]["businessAddress"][
          "postalCode"
        ] = businessProfile_postalCode;
      }
      if (
        requestBody.storeInfo.businessProfile.businessAddress.hasOwnProperty(
          "country"
        )
      ) {
        let businessProfile_country =
          requestBody.storeInfo.businessProfile.businessAddress.country;
        updateData["storeInfo"]["businessProfile"]["businessAddress"][
          "country"
        ] = businessProfile_country;
      }
    }
  }

  if (requestBody.hasOwnProperty("createdAt")) {
    updateData["createdAt"] = requestBody.createdAt;
  }
  if (requestBody.hasOwnProperty("registeredTimestamp")) {
    updateData["registeredTimestamp"] = requestBody.registeredTimestamp;
  }

  Log.debug("update data is ", JSON.stringify(updateData));
  // res.send(updateData);
  res.send("Success");
  res.end();

  let updateObj = new BusinessProfile(updateData);
  return updateObj.update(updateData);
});

router.post(
  "/storeID/:storeID/sections/:sections/update",
  (req: Request, res: Response) => {
    Log.debug("update with section");
    Log.debug("storeID is ", req.params.storeID);
    Log.debug("sections is ", req.params.sections);
    let sections = req.params.sections;
    let storeID = req.params.storeID;

    let updateData: any;

    if (sections === "LOGO") {
      let businessProfile_logoURL = req.body.businessProfile_logoURL;

      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: {
            logo: businessProfile_logoURL,
          },
        },
      };
    } else if (sections === "ACCOUNT_DETAILS") {
      let businessProfile_name = req.body.businessProfile_Name;
      let businessProfile_businessName = req.body.businessProfile_BusinessName;

      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: {
            accountDetails: {
              name: businessProfile_name,
              businessName: businessProfile_businessName,
            },
          },
        },
      };
    } else if (sections === "BUSINESS_EMAIL") {
      let businessProfile_businessEmail = req.body.businessProfile_Email;

      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: {
            businessEmail: businessProfile_businessEmail,
          },
        },
      };
    } else if (sections === "BUSINESS_PHONE_NUMBER") {
      let businessProfile_businessPhoneNo = req.body.businessProfile_PhoneNo;

      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: {
            businessPhoneNo: businessProfile_businessPhoneNo,
          },
        },
      };
    } else if (sections === "BUSINESS_ADDRESS") {
      let businessProfile_addressLine1 = req.body.businessProfile_AddressLine1;
      let businessProfile_addressLine2 = req.body.businessProfile_AddressLine2;
      let businessProfile_city = req.body.businessProfile_City;
      let businessProfile_state = req.body.businessProfile_State;
      let businessProfile_postalCode = req.body.businessProfile_PostalCode;
      let businessProfile_country = req.body.businessProfile_Country;

      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: {
            businessAddress: {
              addressLine1: businessProfile_addressLine1,
              addressLine2: businessProfile_addressLine2,
              city: businessProfile_city,
              state: businessProfile_state,
              postalCode: businessProfile_postalCode,
              country: businessProfile_country,
            },
          },
        },
      };
    } else if (sections === "BUSINESS_PROFILE") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: req.body.businessProfile,
          personalInfo: req.body.personalInfo,
          config: {
            useBusinessFeatures: req.body.config.useBusinessFeatures,
          },
        },
      };
    } else if (sections === "COMPANY_PROFILE") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          companyInfo: req.body.companyInfo,
          config: {
            useBusinessFeatures: req.body.config.useBusinessFeatures,
          },
        },
      };
    } else if (sections === "PAYMENT_INFO") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          paymentInfo: req.body.paymentInfo,
        },
      };
    } else if (sections === "SALE_CHANNELS") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          businessProfile: req.body.businessProfile,
        },
      };
    } else if (sections === "DELIVERY_INFO") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          delivery: req.body.delivery,
        },
      };
    } else if (sections === "STORE_CONFIG") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          config: req.body.config,
        },
      };
    } else if (sections === "PACKAGE_PAYMENT_INFO") {
      updateData = {
        storeID: storeID,
        storeInfo: {
          storePackagePaymentInfo: req.body.storePackagePaymentInfo,
        },
      };
    }

    Log.debug("update data is ", JSON.stringify(updateData));
    res.send(updateData);
    // res.send('Success');
    res.end();

    let updateObj = new BusinessProfile(updateData);
    return updateObj.update(updateData);
  }
);

router.get("/findByAuth0ID", (req: Request, res: Response) => {
  const auth0ID = req.query.auth0ID;
  BusinessProfile.findByAuth0ID(auth0ID).then((resultFindByAuth0ID) => {
    res.send(resultFindByAuth0ID);
    res.end();
  });
});

module.exports = router;
