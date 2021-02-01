import React from "react";
import PropTypes from "prop-types";
import { Button, withStyles } from "@material-ui/core";

import Dialog from "app/components/Dialog";

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
};

const DeleteDialog = (props) => {
  const {
    classes,
    open = false,
    setOpen,
    selectedDeleteData = [],
    onDelete,
    t,
  } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      title={t("GLOBAL.CONFIRM_DELETE_TITLE")}
      description={`${selectedDeleteData.length} ${t("GLOBAL.SELECTED")}`}
      content={<>{t("GLOBAL.CONFIRM_DELETE_QUESTION")}</>}
      actions={
        <>
          <Button onClick={handleClose}>{t("GLOBAL.CLOSE")}</Button>
          <Button
            onClick={onDelete}
            className={classes.buttonDanger}
            variant="contained"
          >
            {t("GLOBAL.DELETE")}
          </Button>
        </>
      }
    />
  );
};

DeleteDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selectedDeleteData: PropTypes.array,
};

export default withStyles(styles)(DeleteDialog);
