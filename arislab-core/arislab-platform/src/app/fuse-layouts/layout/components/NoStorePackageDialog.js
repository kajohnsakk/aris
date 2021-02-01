import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, IconButton, Typography, Slide, Fab } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import Cookies from "js-cookie";
import { Trans, withTranslation } from "react-i18next";
import classNames from "classnames";
import UtilityFunction from "../../../main/modules/UtilityFunction";
import { UtilityManager } from "../../../main/modules/UtilityManager";
import axios from "axios";
import * as AppConfig from "../../../main/config/AppConfig";

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
    textTransform: "none",
    border: "solid 1px #b7bbbe",
    background: "#fefefe",
    color: "#686868",
    fontWeight: "bolder",
    boxShadow: "none",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  highlightButton: {
    background: theme.palette.primary.color,
    color: "#ffffff",
  },
});

const DialogTitle = withStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
    background: "#ffffff",
    color: "#000000",
    fontWeight: "bolder",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  closeButton: {
    right: theme.spacing.unit,
    color: theme.palette.grey[500],
    fontSize: "small",
    fontWeight: "bolder",
    padding: 0,
  },
}))((props) => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const host = AppConfig.API_URL;

class NoStorePackageDialog extends React.Component {
  state = {
    isDisplayNoStorePackageDialog: false,
  };

  componentDidMount() {
    let cookieValue = Cookies.get("auth0_uid");

    UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then((resultStoreInfo) => {
        let storeID = resultStoreInfo[0].storeID;
        axios
          .get(host + "storePackage/storeID/" + storeID + "/current")
          .then((response) => {
            if (!response.data[0])
              this.setState({ isDisplayNoStorePackageDialog: true });
          });
      });
  }

  toggleDialog = (event) => {
    this.setState({
      isDisplayNoStorePackageDialog: !this.state.isDisplayNoStorePackageDialog,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        fullWidth={true}
        fullScreen={UtilityFunction.useMediaQuery("(max-width: 1024px)")}
        maxWidth="sm"
        open={this.state.isDisplayNoStorePackageDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={this.props.toggleDialog}
        >
          <Trans i18nKey="settings.store-package-info.no-package">
            No Package
          </Trans>
        </DialogTitle>
        <DialogContent className="flex flex-col justify-center px-64 py-32">
          <div className="text-center text-red-dark text-xl">
            <Trans i18nKey="settings.store-package-info.no-package-info">
              Your package has already expired. Please contact us.
            </Trans>
          </div>
          <div className="text-center text-red-dark text-xl mb-12">
            097-016-6045 / 084-536-0262
          </div>
          <div className="text-center">
            <Fab
              variant="extended"
              aria-label="Next"
              className={classNames(
                classes.button,
                classes.highlightButton,
                "mt-8 w-1/2"
              )}
              onClick={this.toggleDialog}
            >
              <span>
                <Trans i18nKey="main.close-btn">Close</Trans>
              </span>
            </Fab>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(NoStorePackageDialog)
);
