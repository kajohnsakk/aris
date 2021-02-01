import React, { useState } from "react";
import { Button, CircularProgress, withStyles } from "@material-ui/core";
import Dialog from "app/components/Dialog";
import { Close as CloseIcon } from "@material-ui/icons";

import { BootstrapTextInput } from "app/main/components/Components";
import { ApiService } from "app/main/modules/ApiService";

const styles = {
  btnSendInvite: {
    backgroundColor: "#e83490",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#d6237e",
    },
  },
  title: {
    textAlign: "center",
  },
  alertBox: {
    backgroundColor: "#fef4f5",
    padding: "10px",
    fontSize: "1em",
    border: "1px solid #fc8180",
    color: "#c5302f",
    borderRadius: "5px",
  },
  cursorPointer: {
    cursor: "pointer",
  },
};

const InviteDialog = (props) => {
  const {
    classes,
    t,
    open,
    setOpen,
    store,
    showMessage,
    userLength,
    userLimit,
  } = props;
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setEmail("");
    onCloseAlert();
    setOpen(false);
  };

  const validEmail = (string) => {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(string);
  };

  const onInviteHandler = async () => {
    try {
      setLoading(true);

      if (userLength >= userLimit) {
        throw new Error(t("settings.USER_MANAGEMENT.MAXIMUM_USER"));
      }

      const isEmail = validEmail(email);
      if (!isEmail) {
        setErrorMsg(t("GLOBAL.INVALID_EMAIL"));
        setLoading(false);
        return;
      }

      const invitedResponse = await ApiService.getInstance().request({
        method: "post",
        url: "/users/invite",
        data: {
          email,
          storeID: store.storeID,
          storeName: store.storeName,
        },
      });

      setLoading(false);
      setEmail("");
      setErrorMsg("");
      handleClose();

      showMessage({
        message: invitedResponse.data.message,
        variant: "success",
      });
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message);
    }
  };

  const onEmailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const onCloseAlert = () => {
    setErrorMsg("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={
        <div className={classes.title}>
          {`${t("settings.USER_MANAGEMENT.INVITE_USER_TO")} `}
          <b>{store.storeName}</b>
        </div>
      }
      description=""
      content={
        <>
          {errorMsg !== "" && (
            <div className={`${classes.alertBox} flex mb-12`}>
              <div className="w-1/2">{errorMsg}</div>
              <div className="w-1/2 text-right">
                <CloseIcon
                  classes={{ root: classes.cursorPointer }}
                  onClick={onCloseAlert}
                />
              </div>
            </div>
          )}
          <div className="w-full">
            <BootstrapTextInput
              fullWidth
              type="email"
              placeholder={t("settings.USER_MANAGEMENT.ENTER_EMAIL_TO_INVITE")}
              onChange={onEmailChangeHandler}
              value={email}
            />
          </div>
        </>
      }
      actions={
        <>
          <Button onClick={handleClose} disabled={loading}>
            {t("GLOBAL.CLOSE")}
          </Button>
          <Button
            classes={{ root: classes.btnSendInvite }}
            onClick={onInviteHandler}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress
                className="text-white"
                style={{ marginRight: "0.5em", color: "#fff" }}
                size="1.6em"
              />
            ) : (
              t("settings.USER_MANAGEMENT.INVITE")
            )}
          </Button>
        </>
      }
    />
  );
};

export default withStyles(styles)(InviteDialog);
