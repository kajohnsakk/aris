import React from "react";
import {
  AppBar,
  Hidden,
  MuiThemeProvider,
  Toolbar,
  withStyles,
} from "@material-ui/core";
import connect from "react-redux/es/connect/connect";
import { withRouter, NavLink, Link } from "react-router-dom";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import CurrentMenu from "app/fuse-layouts/shared-components/CurrentMenu";
import UserManualButton from "app/fuse-layouts/shared-components/UserManualButton";
import TutorialTour from "app/fuse-layouts/shared-components/TutorialTour";
import Classnames from "classnames";
import TopToolbarLayout from "./TopToolbarLayout";
import NoStorePackageDialog from "./NoStorePackageDialog";

import { Trans, withTranslation } from "react-i18next";

const styles = (theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
  headerContent: {
    width: "100%",
    maxWidth: "1280px",
    margin: "auto",
  },
  headerNavArea: {
    color: "#FFFFFF",
    backgroundColor: "#EB3390",
  },
  headerNavContent: {
    width: "100%",
    maxWidth: "1280px",
    margin: "auto",
  },
  activeMenuItem: {
    display: "flex",
    [theme.breakpoints.down("lg")]: {
      display: "flex !important",
    },
    [theme.breakpoints.up("lg")]: {
      display: "flex !important",
      borderBottom: "2px solid #EB3390",
    },
  },
});

const ToolbarLayout = ({ classes, settings, toolbarTheme }) => {
  const layoutConfig = settings.layout.config;
  const menuList = [
    {
      name: "Dashboard",
      i18nKey: "navigationMenu.dashboard",
      to: "/platform/dashboard",
      id: "nav-menu-dashboard",
    },
    {
      name: "Live",
      i18nKey: "navigationMenu.live",
      to: "/platform/lives",
      id: "nav-menu-live",
    },
    {
      name: "Products",
      i18nKey: "navigationMenu.products",
      to: "/platform/products",
      id: "nav-menu-products",
    },
    {
      name: "Orders",
      i18nKey: "navigationMenu.orders",
      to: "/platform/orders",
      id: "nav-menu-orders",
    },
    {
      name: "Label_generator",
      i18nKey: "navigationMenu.label_generator",
      to: "https://logistic-label.arislab.ai/",
      id: "label-generator-external-url",
      external: true,
    },
    {
      name: "Transactions",
      i18nKey: "navigationMenu.transactions",
      to: "/platform/merchantTransactions",
      id: "nav-menu-merchant-transactions",
    },
  ];

  return (
    <MuiThemeProvider theme={toolbarTheme}>
      <TopToolbarLayout />

      <AppBar
        id="fuse-toolbar"
        className="flex relative z-10 bg-white shadow-none h-48 lg:h-64"
        color="default"
        style={{ boxShadow: "0px 9px 8px rgba(211, 214, 237, 0.1)" }}
      >
        <Toolbar className={Classnames("p-0 min-h-48", classes.headerContent)}>
          <div className="flex flex-1">
            <div className="flex items-center">
              <img
                src="assets/images/logos/aris-logo.png"
                className="hidden lg:flex"
                alt="Aris Logo"
                height="41px"
              />

              {menuList.map((menuItem) => {
                return (
                  <>
                    {!menuItem.external ? (
                      <NavLink
                        id={menuItem.id}
                        className="hidden ml-16 lg:flex lg:ml-64 font-extrabold text-base"
                        activeClassName={Classnames(classes.activeMenuItem)}
                        style={{ color: "#828282" }}
                        to={menuItem.to}
                        key={menuItem.name}
                      >
                        <Trans i18nKey={menuItem.i18nKey}>
                          {menuItem.name}
                        </Trans>
                      </NavLink>
                    ) : (
                      <a
                        target="_blank"
                        href={menuItem.to}
                        id={menuItem.id}
                        className="hidden ml-16 lg:flex lg:ml-64 font-extrabold text-base"
                        activeClassName={Classnames(classes.activeMenuItem)}
                        style={{ color: "#828282" }}
                        key={menuItem.name}
                      >
                        <Trans i18nKey={menuItem.i18nKey}>
                          {menuItem.name}
                        </Trans>
                      </a>
                    )}
                  </>
                );
              })}
            </div>
          </div>

          <UserManualButton open={true} />

          <div className="hidden lg:flex">
            <TutorialTour />
            <CurrentMenu />
          </div>

          {layoutConfig.navbar.display &&
            layoutConfig.navbar.position === "right" && (
              <Hidden lgUp>
                <NavbarMobileToggleButton />
              </Hidden>
            )}
        </Toolbar>
      </AppBar>
      <NoStorePackageDialog />
    </MuiThemeProvider>
  );
};

function mapStateToProps({ fuse }) {
  return {
    settings: fuse.settings.current,
    toolbarTheme: fuse.settings.toolbarTheme,
  };
}

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps)(withTranslation()(ToolbarLayout)))
);
