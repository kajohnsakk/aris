import React, { Component } from "react";
import { Trans, withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import i18n from "../../../../../i18n";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({});

class AlertModal extends Component {
  state = {
    alertMessage: "",
  };

  componentDidMount() {
    this.setState({ alertMessage: this.props.alertMessage });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.alertMessage &&
      this.state.alertMessage !== this.props.alertMessage
    ) {
      this.setState({ alertMessage: this.props.alertMessage });
    }
  }

  render() {
    const { alertMessage } = this.state;

    return (
      <Dialog
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.props.handleCancelBtn}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <div id="alert-dialog-slide-title" className="p-12 font-medium text-xl">
          <Trans i18nKey="settings.store-package-info.message-from-system">
            Message from system
          </Trans>
        </div>
        <div className="px-12 pt-8 pb-24">
          <div className="flex flex-col m-auto my-12">
            <div className="flex pb-6">
              <div className="flex pb-6">
                {this.props.errorMessageI18n &&
                this.props.errorMessageI18n.length > 0
                  ? i18n.t(this.props.errorMessageI18n)
                  : ""}
                <div dangerouslySetInnerHTML={{ __html: alertMessage }} />
              </div>
            </div>
          </div>
        </div>
        <div className="p-12 mt-24 flex justify-end">
          <button
            className=""
            onClick={(event) => {
              event.preventDefault();
              this.props.handleCancelBtn();
            }}
          >
            <Trans i18nKey="main.close-btn">Close</Trans>
          </button>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(AlertModal)
);
