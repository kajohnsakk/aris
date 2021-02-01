import React, { Component } from "react";
import i18n from "./i18n";

import { Trans, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import TagManager from "react-gtm-module";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import LanguageMenu from "./LanguageMenu";

import pinkLogo from "../assets/pink-logo.svg";

import { ArisButton } from "./Components";
import { withStyles } from "@material-ui/core";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import Styles from "./Styles";
import ig from "../assets/black-ig.svg";
import facebook from "../assets/black-facebook.svg";
import hamburger from "../assets/hamburger.svg";
class Navigation extends Component {
  state = {
    about: false,
    contact: false,
    blog: false,
    mobileMenu: false,
    tutorial: false,
    prevScrollpos: window.pageYOffset,
    navStyle: "flex items-center justify-between body-padding w-full nav",
    isFullNavOpen: false,
    guidePopover: null,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    var navStyle = "flex items-center justify-between body-padding w-full nav"; // don't use navStyle = this.state.navStyle
    if (window.scrollY >= 100 && !navStyle.includes("nav-on-scroll")) {
      navStyle += " nav-on-scroll";
    } else {
      navStyle = navStyle.replace(/ nav-on-scroll/g, "");
    }
    this.setState({ navStyle: navStyle });
  };

  clickSignUpBtn = async () => {
    const tagManagerArgs1 = {
      dataLayer: {
        event: "ARIS",
        pageCategory: "Homepage",
        pageAction: "Click",
        pageLabel: "Click sign up button in nav",
        pageUser: this.props.email || "Anonymous",
      },
    };
    await TagManager.dataLayer(tagManagerArgs1);
    const tagManagerArgs2 = {
      dataLayer: {
        event: "ARIS",
        pageCategory: "Homepage",
        pageAction: "Click",
        pageLabel: "v2 Click sign up button in nav",
        pageUser: this.props.email || "Anonymous",
      },
    };
    await TagManager.dataLayer(tagManagerArgs2);
    window.location.href = "https://beta.arislab.ai/";
  };

  toggleAbout = () => {
    this.setState({ about: !this.state.about });
  };

  toggleContact = () => {
    this.setState({ contact: !this.state.contact });
  };

  toggleBlog = () => {
    this.setState({ blog: !this.state.blog });
  };

  toggleFullNav = () => {
    this.setState({ isFullNavOpen: !this.state.isFullNavOpen });
  };

  openGuideLink = async (event, dataObj) => {
    let url = dataObj.url;
    let guide = dataObj.name;
    const tagManagerArgs = {
      dataLayer: {
        event: "ARIS",
        pageCategory: "Homepage",
        pageAction: "Click",
        pageLabel: `Click guide ${guide}`,
        pageUser: this.props.email || "Anonymous",
      },
    };
    await TagManager.dataLayer(tagManagerArgs);
    this.setState({ guidePopover: null });
    window.open(url, "_blank");
  };

  togglePopover = (event) => {
    let guidePopover = null;

    if (!Boolean(this.state.guidePopover)) {
      guidePopover = event.currentTarget;
    }

    this.setState({ guidePopover: guidePopover });
  };

  renderPopOver = () => {
    const userManualList = [
      {
        name: "Register with ARIS",
        i18nKey: "navigation.register-user-manual",
        url: `https://drive.google.com/file/d/1O2JqQ6DFpUcWjbE80sZW2cojtM3Ktl7o/view`,
      },
      {
        name: "Use automated sales Chatbot",
        i18nKey: "navigation.use-chatbot-user-manual",
        url: `https://drive.google.com/file/d/1pH8R51ZDFu2PVhvgs_zyKaKEPyOaqjny/view`,
      },
      {
        name: "Use LIVE Overlay feature",
        i18nKey: "navigation.use-live-overlay-user-manual",
        url: `https://drive.google.com/file/d/1S-IQqNqQ1YBsJldA_5y52rTviRZwQFZg/view`,
      },
      {
        name: "Update payment settings",
        i18nKey: "navigation.payment-setting-user-manual",
        url: `https://drive.google.com/file/d/1AMfB9R2sJawzKhP-igF80I6tnQOedB33/view`,
      },
    ];

    const { classes } = this.props;

    return (
      <Popover
        className={"flex flex-col items-center"}
        open={Boolean(this.state.guidePopover)}
        anchorEl={this.state.guidePopover}
        onClose={this.togglePopover}
        classes={{ paper: "mt-4" }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {userManualList.map((el, index) => {
          return (
            <MenuItem
              key={index}
              href={el.url}
              className={classes.menuItem}
              onClick={(event) => {
                this.openGuideLink(event, el);
              }}
            >
              {<Trans i18nKey={el.i18nKey}></Trans>}
            </MenuItem>
          );
        })}
      </Popover>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div id="navbar" className={this.state.navStyle}>
          <a className="flex items-center" href="https://arislab.ai">
            <img src={pinkLogo} className="py-4 logo" alt="logo" />
          </a>
          <div className="lg:flex hidden items-center">
            <Link to="/" className="mr-4 nav-link">
              <Trans i18nKey="navigation.home">Home</Trans>
            </Link>
            <div className="mr-4 nav-link" onClick={this.toggleAbout}>
              <Trans i18nKey="navigation.about-us">About</Trans>
            </div>
            <Link to="/package" className="mr-4 nav-link">
              <Trans i18nKey="navigation.package">Package</Trans>
            </Link>
            <div className="mr-4 nav-link" onClick={this.togglePopover}>
              <Trans i18nKey="navigation.guide">Guide</Trans>
              {this.renderPopOver()}
            </div>
            <Link to="/blog" className="mr-4 nav-link">
              <Trans i18nKey="navigation.blog">Blog</Trans>
            </Link>
            <div className="mr-4 nav-link" onClick={this.toggleContact}>
              <Trans i18nKey="navigation.contact-us">Contact</Trans>
            </div>
            <div onClick={this.clickSignUpBtn}>
              <ArisButton className="">
                <Trans i18nKey="navigation.login">Log In</Trans>
              </ArisButton>
            </div>
            {/* <div><img src={  ? th : en} /></div> */}
            <LanguageMenu></LanguageMenu>
          </div>
          <div className="lg:hidden flex items-center">
            <div onClick={this.clickSignUpBtn}>
              <ArisButton className="">
                <Trans i18nKey="navigation.short-sign-up">Sign Up</Trans>
              </ArisButton>
            </div>
            <button className="ml-2 hamburger" onClick={this.toggleFullNav}>
              <img src={hamburger} alt="hamburger" />
            </button>
          </div>
        </div>
        <div
          ref="fullNav"
          className={
            " flex flex-col items-end w-full pt-4 " +
            (this.state.isFullNavOpen ? "full-nav-open" : "full-nav")
          }
        >
          <div className="flex flex-col items-end mr-4">
            <button
              className="ml-2 font-bold shadow-lg rounded-full hamburger"
              onClick={this.toggleFullNav}
            >
              X
            </button>
            <Link
              to="/"
              className="mt-4 mr-4 nav-link"
              onClick={this.toggleFullNav}
            >
              <Trans i18nKey="navigation.home">Home</Trans>
            </Link>
            <div className="mr-4 mt-2 nav-link" onClick={this.toggleAbout}>
              <Trans i18nKey="navigation.about-us">About</Trans>
            </div>
            <Link
              to="/package"
              className="mr-4 mt-2 nav-link"
              onClick={this.toggleFullNav}
            >
              <Trans i18nKey="navigation.package">Package</Trans>
            </Link>
            <div className="mr-4 mt-2 nav-link" onClick={this.togglePopover}>
              <Trans i18nKey="navigation.guide">Guide</Trans>
              {this.renderPopOver()}
            </div>
            <Link
              to="/blog"
              className="mr-4 mt-2 nav-link"
              onClick={this.toggleFullNav}
            >
              <Trans i18nKey="navigation.blog">Blog</Trans>
            </Link>
            <div className="mt-2 mb-4" onClick={this.clickSignUpBtn}>
              <ArisButton className="">
                <Trans i18nKey="navigation.login">Log In</Trans>
              </ArisButton>
            </div>
            <LanguageMenu></LanguageMenu>

            <div className="text-right mt-6">
              <h3 className="mb-2">
                <Trans i18nKey="navigation.contact-us">Contact</Trans>
              </h3>
              <div className="mb-2">
                <a href="https://www.instagram.com/arislab_official/">
                  <img className="social-icon mr-2" src={ig} alt="ig" />
                </a>
                <a href="https://www.facebook.com/arislablive/">
                  <img className="social-icon" src={facebook} alt="facebook" />
                </a>
              </div>
              <div>061-286-6328</div>
              <div>contactus@arislab.ai</div>
            </div>
            <div className="text-right mt-4">
              {i18n.language.includes("en") ? (
                <React.Fragment>
                  <div>38 Lasalle 41</div>
                  <div>Thanon Sukhumvit 105,</div>
                  <div>Bang Na, Bangkok 10260</div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div>38 ซอยลาซาล 41 ถนน สุขุมวิท 105</div>
                  <div>แขวง บางนาใต้ เขต บางนา</div>
                  <div>กรุงเทพ 10260</div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <AboutUs show={this.state.about} onClose={this.toggleAbout}></AboutUs>
        <ContactUs
          show={this.state.contact}
          onClose={this.toggleContact}
        ></ContactUs>
      </React.Fragment>
    );
  }
}

export default withTranslation()(
  withStyles(Styles, { withTheme: true })(Navigation)
);
