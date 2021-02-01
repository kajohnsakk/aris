import { Router } from "express";
import Cryptr = require("cryptr");

const fs = require("fs");
const path = require("path");

import { AuthenticatorUtility } from "./AuthenticatorUtility";
import { ApiProxy } from "./ApiProxy";
import { IdentityProvider, ServiceProvider } from "saml2-js";
import { Log } from "../utils/Log";
import { UserManager } from "./UserManager";

import * as AppConfig from "../config/AppConfig";
import { PRIVACY_POLICY } from "../config/PrivacyPolicy";
import { ExternalProxy } from "../modules/ExternalProxy";
import Authentication from "./Authentication";

const SAML_LOGIN_URL = `https://${process.env.AUTH0_DOMAIN}/samlp/${process.env.AUTH0_CLIENT_ID}`;
const SAML_LOGOUT_URL = `https://${process.env.AUTH0_DOMAIN}/samlp/${process.env.AUTH0_CLIENT_ID}`;
const SAML_IDP_CERT = fs
  .readFileSync(
    path.join(
      __dirname,
      "..",
      "..",
      `sslcert/${process.env.AUTH0_SAML_IDP_CERT_FILE}`
    )
  )
  .toString();

const REDIRECT_URL = process.env.WEB_URL || AppConfig.WEB_URL;
const PACKAGE_URL: string =
  process.env.PACKAGE_URL ||
  "https://manage.arislab.ai/getPlatformPackage?packageName=default";
const CALCULATE_STORE_PACKAGE_URL: string =
  process.env.CALCULATE_STORE_PACKAGE_URL ||
  "https://manage.arislab.ai/calculateStorePackage";
const API_URL = process.env.API_URL;

export interface SAMLResponseJson {
  type: string;
  user: {
    name_id: string;
    session_index: string;
    name: string;
    upn: string;
    email: string;
    attributes: {
      "http://schemas.auth0.com/identities/default/access_token": string[];
    };
  };
}
export interface cookieObj {
  cookieName: string;
  cookieValue: any;
}
export class SAMLService {
  private static service: SAMLService;

  public static getInstance() {
    if (!SAMLService.service) SAMLService.service = new SAMLService();
    return SAMLService.service;
  }
  private identityProvider: IdentityProvider;
  protected SECRET_KEY: Cryptr;

  private getServiceProvider(hostname: string) {
    let USE_HTTPS = process.env.SAML_USE_HTTPS || "YES";
    let protocol = USE_HTTPS === "YES" ? "https://" : "http://";

    Log.debug("[SAMLService] protocol is ", protocol);

    return new ServiceProvider({
      entity_id: protocol + hostname + "/login/metadata.xml",
      private_key: fs
        .readFileSync(
          path.join(__dirname, "..", "..", "sslcert/STAR_convolab_ai.key")
        )
        .toString(),
      certificate: fs
        .readFileSync(
          path.join(
            __dirname,
            "..",
            "..",
            "sslcert/STAR_convolab_ai_bundle.crt"
          )
        )
        .toString(),
      assert_endpoint: protocol + hostname + "/login/assert",
      allow_unencrypted_assertion: true,
    });
  }
  constructor() {
    this.identityProvider = new IdentityProvider({
      sso_login_url: SAML_LOGIN_URL + "",
      sso_logout_url: SAML_LOGOUT_URL + "",
      certificates: [(SAML_IDP_CERT + "").replace(/\\n/g, "\n")],
      allow_unencrypted_assertion: true,
    });
    this.SECRET_KEY = new Cryptr("@R!$LAB");
  }

  public bindRouter(router: Router) {
    Log.debug("Binding SAML Service to router");

    router.get("/metadata.xml", (req: any, res: any) => {
      res.type("application/xml");
      Log.debug(
        res.send(this.getServiceProvider(req.headers.host).create_metadata())
      );
      res.send(this.getServiceProvider(req.headers.host).create_metadata());
    });

    router.post("/manual", async (req: any, res: any) => {
      try {
        const { email, password } = req.body;
        const loginResponse = await ApiProxy.getInstance().sendRequest(
          "POST",
          "/login/manual",
          {
            email,
            password,
          }
        );

        const store = await ApiProxy.getInstance().sendRequest(
          "GET",
          `/store/${loginResponse.details.storeID}`
        );

        const auth = new Authentication();
        const token = auth.sign({
          storeID: loginResponse.details.storeID,
          email,
        });

        let cookieList: cookieObj[] = [
          {
            cookieName: "auth0_uid",
            cookieValue: store.data.auth0_uid,
          },
          {
            cookieName: "token",
            cookieValue: token,
          },
          {
            cookieName: "isLoggedIn",
            cookieValue: true,
          },
          {
            cookieName: "isManualLogin",
            cookieValue: true,
          },
        ];

        let encryptedEmail = this.SECRET_KEY.encrypt(email);
        cookieList.push({
          cookieName: "email",
          cookieValue: encryptedEmail,
        });

        this.setCookie(res, cookieList, true);

        res.status(200).json(loginResponse);
      } catch (error) {
        const statusCode = error.statusCode ? error.statusCode : 400;
        const errorMessage = error.error ? error.error.message : error.message;
        res.status(statusCode).send(errorMessage);
      }
    });

    router.get("/", (req: any, res: any) => {
      Log.debug("Generating SAML login link");

      this.getServiceProvider(req.headers.host).create_login_request_url(
        this.identityProvider,
        {},
        (err: Error, login_url: string, request_id: string) => {
          if (err != null) {
            Log.error("Error while getting SAML login url " + err.stack);
            return res.send(500);
          } else {
            if (!UserManager.getTokenInfo(req.cookies.token)) {
              res.render("login", {
                layout: false,
                API_URL,
                domain: process.env.AUTH0_DOMAIN,
                clientID: process.env.AUTH0_CLIENT_ID,
                PRIVACY_POLICY: PRIVACY_POLICY,
              });
            } else {
              res.redirect(REDIRECT_URL);
            }
          }
        }
      );
    });

    router.get("/dotplay", (req: any, res: any) => {
      Log.debug("Generating SAML login link");
      let redirect_url = req.query.redirect_url;
      res.cookie("redirect_url", redirect_url);
      this.getServiceProvider(req.headers.host).create_login_request_url(
        this.identityProvider,
        {},
        (err: Error, login_url: string, request_id: string) => {
          if (err != null) {
            Log.error("Error while getting SAML login url " + err.stack);
            return res.send(500);
          } else {
            if (!UserManager.getTokenInfo(req.cookies.token)) {
              res.render("loginDotplay", {
                layout: false,
                domain: process.env.AUTH0_DOMAIN,
                clientID: process.env.AUTH0_CLIENT_ID,
                PRIVACY_POLICY: PRIVACY_POLICY,
              });
            } else {
              res.redirect(REDIRECT_URL);
            }
          }
        }
      );
    });

    router.post("/assert", async (req: any, res: any) => {
      let data = JSON.stringify(req.body);
      let dataObj = JSON.parse(data);

      Log.debug("is from dot play : ", req.query.dotplay);
      if (req.query.dotplay) res.cookie("dotplay", req.query.dotplay);

      Log.debug("SAML asset callback received: ", dataObj);
      const { cookieList } = await this.onLoggedIn(dataObj);

      this.setCookie(res, cookieList, true);
      res.redirect(REDIRECT_URL);
    });
  }

  private async onLoggedIn(data: any) {
    try {
      Log.debug("SAML response: ", data);
      const access_token = data["access_token"];
      const token = data["id_token"];

      const auth0UserInfo = await AuthenticatorUtility.getAuth0UserInfo(
        access_token
      );

      const store = await ApiProxy.getInstance().sendRequest(
        "GET",
        `/store/auth0/${auth0UserInfo.sub}`
      );

      const userInfo = {
        user_id: auth0UserInfo.sub,
        email: auth0UserInfo.email,
        fullName: auth0UserInfo.name,
      };

      if (!store.status) {
        Log.debug(
          "No store id linked with this user id: ",
          userInfo.user_id,
          " creating new store id"
        );

        let storeBody = {
          user_id: userInfo.user_id,
          email: userInfo.email,
          name: userInfo.fullName,
        };

        const resultInitStore = await this.initStore(storeBody);
        Log.debug(
          "New store created successful with initial result: ",
          resultInitStore
        );
      }

      Log.debug("onLoggedIn token is", token);

      UserManager.registerTokenInfo(token, userInfo);
      Log.debug("User ", userInfo, " successfully authenticated");

      let tempTokenInfo = UserManager.getTokenInfo(token);

      Log.debug("tempTokenInfo ", tempTokenInfo);

      let cookieList: cookieObj[] = [
        {
          cookieName: "auth0_uid",
          cookieValue: userInfo["user_id"],
        },
        {
          cookieName: "token",
          cookieValue: token,
        },
        {
          cookieName: "isLoggedIn",
          cookieValue: true,
        },
      ];

      if (userInfo.email) {
        let encryptedEmail = this.SECRET_KEY.encrypt(userInfo.email);
        cookieList.push({
          cookieName: "email",
          cookieValue: encryptedEmail,
        });
      }

      return { cookieList };
    } catch (error) {
      Log.error("[onLoggedIn] Error: ", error);
      throw error;
    }
  }

  private async initStore(initStoreBody: {
    user_id: string;
    email: string;
    name: string;
  }) {
    try {
      Log.debug("Initing store with body: ", initStoreBody);

      const resultInitStore = await ApiProxy.getInstance().sendRequest(
        "POST",
        "/utility/initStore/",
        initStoreBody
      );

      if (resultInitStore.hasOwnProperty("storeID")) {
        let storeID = resultInitStore["storeID"];

        return Promise.all([
          this.initChatbotConfig(storeID),
          this.initSalesChannel(storeID),
          this.initStorePackage(storeID),
        ])
          .then((resultInitAllConfig) => {
            Log.debug("resultInitAllConfig: ", resultInitAllConfig);
            return resultInitAllConfig;
          })
          .catch((error) => {
            Log.error("Error while initing all config ", error);
            throw error;
          });
      }
    } catch (error) {
      Log.error("Error while initing store ", error);
      throw error;
    }
  }

  private async initChatbotConfig(storeID: string) {
    try {
      Log.debug("Initing chatbot config for storeID: " + storeID);
      const resultInitChatbotConfig = await ApiProxy.getInstance().sendRequest(
        "POST",
        `/utility/initChatbotConfig/storeID/${storeID}`
      );
      Log.debug("resultInitChatbotConfig: ", resultInitChatbotConfig);
      return resultInitChatbotConfig;
    } catch (error) {
      Log.error("Error while initing chatbot config ", error);
      throw error;
    }
  }

  private async initSalesChannel(storeID: string) {
    try {
      Log.debug("Initing sales channel config for storeID: " + storeID);
      const resultInitSalesChannel = await ApiProxy.getInstance().sendRequest(
        "POST",
        `/utility/initSalesChannel/storeID/${storeID}`
      );
      Log.debug("resultInitSalesChannel: ", resultInitSalesChannel);
      return resultInitSalesChannel;
    } catch (error) {
      Log.error("Error while initing sales channel ", error);
      throw error;
    }
  }

  private async initStorePackage(storeID: string) {
    try {
      Log.debug("Initing store package config for storeID: " + storeID);
      const packageUrl: string = PACKAGE_URL;
      const calculateStorePackageUrl: string = CALCULATE_STORE_PACKAGE_URL;
      let defaultPackage = await ExternalProxy.getInstance().sendRequest({
        uri: packageUrl,
        method: "GET",
      });

      let packageData = await ExternalProxy.getInstance().sendRequest({
        uri: calculateStorePackageUrl,
        method: "POST",
        body: {
          newPackageObj: defaultPackage,
          isActiveNow: true,
          currentPackageObj: {},
        },
      });

      defaultPackage.note = "";
      let chargePrice = packageData.chargePrice;
      let activeDate = packageData.activeDate;
      let expiryDate = packageData.expiryDate;

      let storePackageData = {
        storeID: storeID,
        packageInfo: defaultPackage,
        status: "ACTIVE",
        chargePrice: chargePrice,
        createdAt: Date.now(),
        updatedAt: 0,
        activeDate: activeDate,
        expiryDate: expiryDate,
      };

      const resultInitStorePackage = await ApiProxy.getInstance().sendRequest(
        "POST",
        `/storePackage/new`,
        storePackageData
      );
      Log.debug("resultInitStorePackage: ", resultInitStorePackage);
      return resultInitStorePackage;
    } catch (error) {
      Log.error("Error while initing store package ", error);
      throw error;
    }
  }

  public setCookie(
    res: any,
    cookieObj: cookieObj[],
    set_to_main_domain?: boolean
  ) {
    let cookieOption: any = {
      httpOnly: false,
      secure: true,
    };

    if (set_to_main_domain) {
      this.setCookie(res, cookieObj);
      cookieOption["domain"] = ".arislab.ai";
    }

    return cookieObj.forEach((cookie) => {
      res.cookie(cookie["cookieName"], cookie["cookieValue"], cookieOption);
    });
  }
}
