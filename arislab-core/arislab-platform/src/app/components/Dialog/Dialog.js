import React from "react";
import { withStyles, Dialog, IconButton } from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Close as CloseIcon } from "@material-ui/icons";

const styles = {
  buttonDanger: {
    backgroundColor: "#D64242",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#dc5353",
    },
  },
  label: {
    fontSize: "1.8rem",
  },
  description: {
    fontSize: "1.5rem",
    color: "#afafaf",
    marginLeft: "0.5em",
  },
  closeBox: {
    position: "absolute",
  },
};

const ConfirmDialog = (props) => {
  const {
    classes,
    title,
    description,
    content,
    actions,
    maxWidth = "sm",
    fullWidth = true,
    onClose,
    open,
    disableBackdropClick = true,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableBackdropClick={disableBackdropClick}
    >
      <DialogTitle>
        {title}
        <span className={classes.description}>{description}</span>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {};

export default withStyles(styles)(ConfirmDialog);
