import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Switch,
  withStyles,
} from "@material-ui/core";
import Dialog from "app/components/Dialog";
import { Close as CloseIcon } from "@material-ui/icons";
import * as yup from "yup";

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
    padding: "24px 24px 0px 24px !important",
  },
  alertBox: {
    backgroundColor: "#fef4f5",
    padding: "10px",
    fontSize: "0.8em",
    border: "1px solid #fc8180",
    color: "#c5302f",
    borderRadius: "5px",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  textfieldDisabled: {
    backgroundColor: "#f1f1f1 !important",
  },
  switch: {
    marginLeft: "-0.8em",
  },
};

const UserFormDialog = (props) => {
  const {
    classes,
    userInfo,
    t,
    open,
    setOpen,
    showMessage,
    reloadUser,
  } = props;

  const [data, setData] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setData(userInfo);
  }, [userInfo]);

  const userSchema = yup.object().shape({
    firstName: yup
      .string()
      .required(t("settings.USER_MANAGEMENT.REQUIRE_FIRST_NAME")),
    lastName: yup
      .string()
      .required(t("settings.USER_MANAGEMENT.REQUIRE_LAST_NAME")),
    email: yup
      .string()
      .email("")
      .required(t("settings.USER_MANAGEMENT.REQUIRE_EMAIL")),
    password: yup
      .string()
      .test(
        "len",
        t("settings.USER_MANAGEMENT.LEAST_8_CHARACTOR_PASSWORD"),
        (value) => {
          if (value === undefined) {
            value = "";
          }

          if (value !== "" && value.length < 8) {
            return false;
          }

          return true;
        }
      ),
    confirmPassword: yup
      .string()
      .test(
        "passwords-match",
        t("settings.USER_MANAGEMENT.PASSWORD_NOT_MATCH"),
        function(value) {
          if (value === undefined) {
            value = "";
          }

          if (this.parent.password === undefined) {
            this.parent.password = "";
          }

          return this.parent.password === value;
        }
      )
      .nullable(true),
  });

  const handleClose = () => {
    onCloseAlert();
    setOpen(false);
    reloadUser(true);
  };

  const onSubmitHandler = async () => {
    try {
      const user = await userSchema.validate(data, {
        abortEarly: false,
        strict: false,
      });

      const _userInfo = {
        storeID: user.storeID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        actived: !!user.actived,
      };

      if (user.password) {
        _userInfo.password = user.password;
      }

      const userResponse = await ApiService.getInstance().request({
        method: "put",
        url: `/users/${userInfo.userID}`,
        data: _userInfo,
      });

      reloadUser(true);
      showMessage({
        message: userResponse.data.message,
        variant: "success",
      });

      handleClose();
    } catch (error) {
      let _errors = [];
      _errors =
        error.name === "ValidationError" ? error.errors : [error.message];
      setErrors(_errors);
    }
  };

  const onCloseAlert = () => {
    setErrors([]);
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onCheck = (e) => {
    setData({ ...data, [e.target.name]: e.target.checked });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={t("settings.USER_MANAGEMENT.USER_FORM")}
      description=""
      content={
        <div>
          {errors.length > 0 && (
            <div className={`${classes.alertBox} flex mb-16`}>
              <div className="w-1/2 w-full">
                {errors.map((error) => (
                  <p>{error}</p>
                ))}
              </div>
              <div className="w-1/2 text-right">
                <CloseIcon
                  classes={{ root: classes.cursorPointer }}
                  onClick={onCloseAlert}
                />
              </div>
            </div>
          )}
          <FormControl className="w-full mb-12">
            <InputLabel shrink htmlFor="first_name">
              {t("settings.USER_MANAGEMENT.FIRST_NAME")}
            </InputLabel>
            <BootstrapTextInput
              name="firstName"
              fullWidth
              type="text"
              onChange={onChange}
              value={data.firstName}
            />
          </FormControl>
          <FormControl className="w-full mb-12">
            <InputLabel shrink htmlFor="last_name">
              {t("settings.USER_MANAGEMENT.LAST_NAME")}
            </InputLabel>
            <BootstrapTextInput
              name="lastName"
              fullWidth
              type="text"
              onChange={onChange}
              value={data.lastName}
            />
          </FormControl>
          <FormControl className="w-full mb-12">
            <InputLabel shrink htmlFor="email">
              {t("settings.USER_MANAGEMENT.EMAIL")}
            </InputLabel>
            <BootstrapTextInput
              classes={classes.textfieldDisabled}
              name="email"
              fullWidth
              type="text"
              onChange={onChange}
              value={data.email}
              disabled
            />
          </FormControl>

          <FormControl className="w-full">
            <InputLabel shrink htmlFor="actived mb-12">
              {t("settings.USER_MANAGEMENT.STATUS")}
            </InputLabel>
            <div className={`${classes.switch} my-12`}>
              <Switch
                checked={data.actived}
                onChange={onCheck}
                name="actived"
                color="primary"
              />
            </div>
          </FormControl>
          <div className="border-b-1 border-grey-light mb-20" />
          <FormControl className="w-full mb-12">
            <InputLabel shrink htmlFor="password">
              {t("settings.USER_MANAGEMENT.PASSWORD")}
            </InputLabel>
            <BootstrapTextInput
              name="password"
              fullWidth
              type="password"
              onChange={onChange}
              value={data.password}
            />
          </FormControl>
          <FormControl className="w-full mb-12">
            <InputLabel shrink htmlFor="confirm_password">
              {t("settings.USER_MANAGEMENT.CONFIRM_PASSWORD")}
            </InputLabel>
            <BootstrapTextInput
              name="confirmPassword"
              fullWidth
              type="password"
              onChange={onChange}
              value={data.confirmPassword}
            />
          </FormControl>
        </div>
      }
      actions={
        <>
          <Button onClick={handleClose}>{t("GLOBAL.CLOSE")}</Button>
          <Button
            classes={{ root: classes.btnSendInvite }}
            onClick={onSubmitHandler}
          >
            {t("GLOBAL.CONFIRM")}
          </Button>
        </>
      }
    />
  );
};

export default withStyles(styles)(UserFormDialog);
