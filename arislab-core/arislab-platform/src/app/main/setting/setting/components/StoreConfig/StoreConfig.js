import React, { Component } from "react";
import _ from "@lodash";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import {
  Switch,
  Divider,
  CircularProgress,
  TextField,
} from "@material-ui/core";

import { Trans, withTranslation } from "react-i18next";
import Classnames from "classnames";
import i18n from "../../../../../i18n";

const styles = (theme) => ({
  subTitle: {
    fontSize: "1.4rem",
  },
});

class StoreConfig extends Component {
  state = {
    storeID: "",
    configInfo: {},
    displayConfig: false,
    data: {},
  };

  componentDidMount() {
    this.setState({ storeID: this.props.storeID });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.storeID !== prevProps.storeID) {
      this.setState({ storeID: this.props.storeID });
    }

    if (!_.isEqual(this.state.configInfo, this.props.configInfo)) {
      this.setState({
        configInfo: this.props.configInfo,
        displayConfig: true,
        data: this.props.configInfo,
      });
    }
  }

  handleChange(e) {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      },
    });
  }

  onSubmit = (e) => {
    const data = this.state.data;
    const businessProfile = {
      useCart: data.useCart,
      useCreditCard: data.useCreditCard,
      useTaxInvoice: data.useTaxInvoice,
      useLastReply: data.useLastReply,
      lastReplyMessage: data.lastReplyMessage,
    };
    e.preventDefault();
    this.props.pushTrackingData("Click", "Click save store config button");

    this.props.saveBusinessProfileSections("STORE_CONFIG", businessProfile);
  };

  render() {
    const { configInfo, displayConfig, data } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className="">
          <div className="flex flex-row justify-between items-center p-8 lg:p-12">
            <div className="flex">
              <Trans i18nKey="settings.store-config.store-config-details">
                Store Config
              </Trans>
            </div>
          </div>
          <Divider />
          {displayConfig ? (
            <div>
              <div className="flex flex-col p-8 sm:p-12 mb-8">
                <div className="flex flex-row items-center w-full sm:w-3/5">
                  <div
                    className={Classnames(classes.subTitle, "w-2/5 font-light")}
                  >
                    <Trans i18nKey="settings.store-config.use-cart-message">
                      Use cart
                    </Trans>
                  </div>
                  <div className="">
                    <Switch
                      color="primary"
                      checked={data.useCart}
                      value={true}
                      name="useCart"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center w-full sm:w-3/5">
                  <div
                    className={Classnames(classes.subTitle, "w-2/5 font-light")}
                  >
                    <Trans i18nKey="settings.store-config.use-credit-card-message">
                      Use credit card
                    </Trans>
                  </div>
                  <div className="">
                    <Switch
                      color="primary"
                      checked={data.useCreditCard}
                      value={true}
                      name="useCreditCard"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
                {data.useCreditCard ? (
                  <div className="text-red text-xs italic">
                    <Trans i18nKey="settings.store-config.credit-card-warning">
                      Accepting credit card payments will incur a 2.9% service
                      charge
                    </Trans>
                  </div>
                ) : (
                  <div />
                )}
                <div className="flex flex-row items-center w-full sm:w-3/5">
                  <div
                    className={Classnames(classes.subTitle, "w-2/5 font-light")}
                  >
                    <Trans i18nKey="settings.store-config.use-tax-invoice">
                      Use tax invoice
                    </Trans>
                  </div>
                  <div className="">
                    <Switch
                      color="primary"
                      checked={data.useTaxInvoice}
                      value={true}
                      name="useTaxInvoice"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center w-full sm:w-3/5">
                  <div
                    className={Classnames(classes.subTitle, "w-2/5 font-light")}
                  >
                    <Trans i18nKey="settings.store-config.use-last-reply-message">
                      Use last reply
                    </Trans>
                  </div>
                  <div className="">
                    <Switch
                      color="primary"
                      checked={data.useLastReply}
                      value={true}
                      name="useLastReply"
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
                {data.useLastReply ? (
                  <TextField
                    id="last-reply-message"
                    name="lastReplyMessage"
                    fullWidth
                    multiline
                    rows="8"
                    margin="normal"
                    variant="outlined"
                    placeholder={i18n.t(
                      "settings.store-config.last-reply-placeholder"
                    )}
                    value={data.lastReplyMessage}
                    onChange={(e) => this.handleChange(e)}
                    inputProps={{ maxLength: 3000 }}
                  />
                ) : (
                  <div />
                )}
              </div>

              <div className="flex flex-row justify-end items-center px-8 lg:px-12">
                <button
                  className="button-primary"
                  onClick={(e) => this.onSubmit(e)}
                >
                  <Trans i18nKey="main.save-btn">Save</Trans>
                </button>
              </div>
            </div>
          ) : (
            <div className={Classnames(classes.loadingPage, "my-64")}>
              <CircularProgress className={classes.highlightText} />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(withTranslation()(StoreConfig))
);
