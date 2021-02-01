import React, { Component } from "react";
import { Trans } from "react-i18next";
import { Fab } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "./SvgIcon/info.svg";
class AlertModal extends Component {
  state = {
    icon: "",
    isClickedBtn: false,
  };

  componentDidMount() {
    let icon = "";
    switch (this.props.messageType) {
      case "INFO":
        icon = <InfoIcon />;
        break;
      default:
        icon = <InfoIcon />;
    }
    this.setState({ icon: icon });
  }

  render() {
    return (
      <div className="flex flex-col mt-20">
        <div className="flex flex-row justify-center mb-24">
          {this.state.icon}
        </div>
        <div className="flex flex-row justify-center mb-40">
          <div dangerouslySetInnerHTML={{ __html: this.props.message }} />
        </div>
        <div className="flex flex-row justify-center">
          <Fab
            variant="extended"
            aria-label="Withdraw"
            className="merchant-button px-40"
            disabled={this.state.isClickedBtn}
            onClick={() => {
              this.setState({ isClickedBtn: true }, () => {
                this.props.handleClick();
              });
            }}
          >
            <Trans i18nKey="transactions.continue-withdraw">
              Continue withdraw
            </Trans>
          </Fab>
        </div>
      </div>
    );
  }
}

export default AlertModal;
