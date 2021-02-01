import React from "react";
import { Redirect } from "react-router-dom";
import { FuseUtils } from "@fuse/index";

import { DashboardConfig } from "app/main/dashboard/DashboardConfig";
import { ProductConfig } from "app/main/product/ProductConfig";
import { OrderConfig } from "app/main/order/OrderConfig";
import { LiveConfig } from "app/main/live/LiveConfig";
import { SettingConfig } from "app/main/setting/SettingConfig";
import { LoginConfig } from "app/main/login/LoginConfig";
import { LandingConfig } from "app/main/landing/LandingConfig";
import { MerchantTransactionsConfig } from "app/main/merchantTransactions/MerchantTransactionsConfig";
import { StoreAccessConfig } from "app/main/developer/storeAccess/StoreAccessConfig";

const routeConfigs = [
  StoreAccessConfig,
  LoginConfig,
  DashboardConfig,
  ProductConfig,
  OrderConfig,
  LiveConfig,
  SettingConfig,
  MerchantTransactionsConfig,
  LandingConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: "/",
    component: () => <Redirect to="/" />,
  },
  {
    path: "/platform/",
    component: () => <Redirect to="/platform/dashboard" />,
  },
  {
    path: "/platform/dashboard",
    component: () => <Redirect to="/platform/dashboard" />,
  },
  {
    path: "/platform/products",
    component: () => <Redirect to="/platform/products" />,
  },
  {
    path: "/platform/lives",
    component: () => <Redirect to="/platform/lives" />,
  },
  {
    path: "/platform/merchantTransactions",
    component: () => <Redirect to="/platform/merchantTransactions" />,
  },
  {
    path: "/logout",
    component: () => <Redirect to="/logout" />,
  },
];

export default routes;
