import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  IconButton,
  Typography,
  DialogContentText,
  Button,
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import { Trans, withTranslation } from "react-i18next";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";

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

class UploadLogoDialog extends Component {
  render() {
    return (
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Trans i18nKey="settings.store-config.upload-logo-header">
            Uploading Logo Image
          </Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Trans i18nKey="settings.store-config.upload-logo-warning">
              Please use a square shaped image with file size not exceed 300 kb.
            </Trans>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <label htmlFor="logo-image" className="cursor-pointer">
            <Button component="span">
              <Trans i18nKey="settings.store-config.upload">Upload</Trans>
            </Button>
          </label>
          <Button onClick={this.props.closeDialog}>
            <Trans i18nKey="main.cancel-btn">Cancel</Trans>
          </Button>
        </DialogActions>
        <input
          accept="image/*"
          id="logo-image"
          className="hidden"
          type="file"
          onChange={this.props.uploadLogoImage}
        />
      </Dialog>
    );
  }
}

export default withTranslation()(UploadLogoDialog);
