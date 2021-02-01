import React from "react";
import { withRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { withStyles } from "@material-ui/core";
import { FuseScrollbars, FuseMessage, FuseDialog } from "@fuse";
import { connect } from "react-redux";
import ToolbarLayout from "./components/ToolbarLayout";
import FooterLayout from "./components/FooterLayout";
import LeftSideLayout from "./components/LeftSideLayout";
import RightSideLayout from "./components/RightSideLayout";
import NavbarWrapperLayout from "./components/NavbarWrapperLayout";
import CreateStoreBar from "./components/CreateStoreBar";
//import SettingsPanel from 'app/fuse-layouts/shared-components/SettingsPanel';
import classNames from "classnames";
import AppContext from "app/AppContext";

const styles = theme => ({
    root: {
        fontFamily: "Kanit, Muli, Roboto, Helvetica Neue, Arial, sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        "&.boxed": {
            maxWidth: 1280,
            margin: "0 auto",
            boxShadow: theme.shadows[3]
        },
        "&.scroll-body": {
            "& $wrapper": {
                height: "auto",
                flex: "0 0 auto",
                overflow: "auto"
            },
            "& $contentWrapper": {},
            "& $content": {}
        },
        "&.scroll-content": {
            "& $wrapper": {},
            "& $contentWrapper": {},
            "& $content": {}
        }
    },
    wrapper: {
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%"
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 3,
        overflow: "hidden",
        flex: "1 1 auto"
    },
    content: {
        // position: 'relative',
        display: "flex",
        overflow: "auto",
        flex: "1 1 auto",
        flexDirection: "column",
        maxWidth: "1280px",
        width: "100%",
        "-webkit-overflow-scrolling": "touch",
        zIndex: 2,
        margin: "auto"
    }
});

const Layout = ({ classes, settings, children }) => {
    // console.warn('FuseLayout:: rendered');
    const layoutConfig = settings.layout.config;
    var url = window.location.href.split('/')
    url = url[window.location.href.split('/').length - 1]

    switch (layoutConfig.scroll) {
        case "body": {
            return (
                <AppContext.Consumer>
                    {({ routes }) =>
                        url.length > 0 && url !== "login" ? (
                            <div id="fuse-layout" className={classNames(classes.root, layoutConfig.mode, "scroll-" + layoutConfig.scroll)}>
                                {layoutConfig.leftSidePanel.display && <LeftSideLayout />}

                                <div className="flex flex-1 flex-col overflow-hidden relative">
                                    {layoutConfig.toolbar.display &&
                                        layoutConfig.toolbar.style === "fixed" &&
                                        layoutConfig.toolbar.position === "above" && <ToolbarLayout />}

                                    <FuseScrollbars className="overflow-auto">
                                        {layoutConfig.toolbar.display &&
                                            layoutConfig.toolbar.style !== "fixed" &&
                                            layoutConfig.toolbar.position === "above" && <ToolbarLayout />}

                                        {layoutConfig.createStoreBar.display && layoutConfig.createStoreBar.position === "above" && (
                                            <CreateStoreBar />
                                        )}

                                        <div className={classes.wrapper}>
                                            {layoutConfig.navbar.display && layoutConfig.navbar.position === "left" && <NavbarWrapperLayout />}

                                            <div className={classes.contentWrapper}>
                                                {layoutConfig.toolbar.display && layoutConfig.toolbar.position === "below" && <ToolbarLayout />}

                                                <div className={classes.content}>
                                                    <React.Fragment>
                                                        <FuseDialog />
                                                        {renderRoutes(routes)}
                                                        {children}
                                                    </React.Fragment>
                                                </div>

                                                {layoutConfig.footer.display && layoutConfig.footer.position === "below" && <FooterLayout />}

                                                {/* <SettingsPanel/> */}
                                            </div>

                                            {layoutConfig.navbar.display && layoutConfig.navbar.position === "right" && <NavbarWrapperLayout />}
                                        </div>

                                        {layoutConfig.footer.display &&
                                            layoutConfig.footer.style !== "fixed" &&
                                            layoutConfig.footer.position === "above" && <FooterLayout />}
                                    </FuseScrollbars>

                                    {layoutConfig.footer.display &&
                                        layoutConfig.footer.style === "fixed" &&
                                        layoutConfig.footer.position === "above" && <FooterLayout />}
                                </div>

                                {layoutConfig.rightSidePanel.display && <RightSideLayout />}

                                <FuseMessage />
                            </div>
                        ) : (
                            <React.Fragment>
                                <FuseDialog />
                                {renderRoutes(routes)}
                                {children}
                            </React.Fragment>
                        )
                    }
                </AppContext.Consumer>
            );
        }
        case "content":
        default: {
            return (
                <AppContext.Consumer>
                    {({ routes }) => (
                        <div id="fuse-layout" className={classNames(classes.root, layoutConfig.mode, "scroll-" + layoutConfig.scroll)}>
                            {layoutConfig.leftSidePanel.display && <LeftSideLayout />}

                            <div className="flex flex-1 flex-col overflow-hidden relative">
                                {layoutConfig.toolbar.display && layoutConfig.toolbar.position === "above" && <ToolbarLayout />}

                                <div className={classes.wrapper}>
                                    {layoutConfig.navbar.display && layoutConfig.navbar.position === "left" && <NavbarWrapperLayout />}

                                    <div className={classes.contentWrapper}>
                                        {layoutConfig.toolbar.display &&
                                            layoutConfig.toolbar.position === "below" &&
                                            layoutConfig.toolbar.style === "fixed" && <ToolbarLayout />}

                                        <FuseScrollbars className={classes.content}>
                                            {layoutConfig.toolbar.display &&
                                                layoutConfig.toolbar.position === "below" &&
                                                layoutConfig.toolbar.style !== "fixed" && <ToolbarLayout />}

                                            <FuseDialog />
                                            <React.Fragment>
                                                {renderRoutes(routes)}
                                                {children}
                                            </React.Fragment>

                                            {layoutConfig.footer.display &&
                                                layoutConfig.footer.position === "below" &&
                                                layoutConfig.footer.style !== "fixed" && <FooterLayout />}
                                        </FuseScrollbars>

                                        {layoutConfig.footer.display &&
                                            layoutConfig.footer.position === "below" &&
                                            layoutConfig.footer.style === "fixed" && <FooterLayout />}

                                        {/* <SettingsPanel/> */}
                                    </div>

                                    {layoutConfig.navbar.display && layoutConfig.navbar.position === "right" && <NavbarWrapperLayout />}
                                </div>

                                {layoutConfig.footer.display && layoutConfig.footer.position === "above" && <FooterLayout />}
                            </div>

                            {layoutConfig.rightSidePanel.display && <RightSideLayout />}

                            <FuseMessage />
                        </div>
                    )}
                </AppContext.Consumer>
            );
        }
    }
};

function mapStateToProps({ fuse }) {
    return {
        settings: fuse.settings.current
    };
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps)(Layout)));
