import React, { useState, useEffect } from "react";
import { Card, Button, IconButton, withStyles } from "@material-ui/core";
import {
  Email as EmailIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FiberManualRecord as FiberManualRecordIcon,
} from "@material-ui/icons";

import * as moment from "moment";

import Datatable from "app/components/Datatable";
import DeleteDialog from "app/main/shared-components/DeleteDialog";
import InviteDialog from "./InviteDialog";
import UserFormDialog from "./UserFormDialog";
import { ApiService } from "app/main/modules/ApiService";

const styles = {
  root: {
    padding: 24,
  },
  btnDanger: {
    background: "#f95252",
    boxShadow: "0 0 #f3a3a3",
    "&:hover": {
      background: "#e42f2f",
    },
  },
  icon: {
    width: "1em",
    height: "1em",
  },
  activeStatus: {
    color: "#16d059",
  },
  inActiveStatus: {
    color: "#e81717",
  },
  userStatusBox: {
    width: "80px",
  },
};

const fetchData = (storeID) => {
  return ApiService.getInstance().request({
    method: "get",
    url: "/users",
    params: {
      storeID,
    },
  });
};

const UserManagement = (props) => {
  const { classes, t, store, showMessage } = props;
  const [isDeleted, setIsDeleted] = useState(true);
  const [selectedDeleteData, setSelectedDeleteData] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openUserFormDialog, setOpenUserFormDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    getUsers();
  }, [loading]);

  const getUsers = () => {
    setTimeout(async () => {
      const { data } = await fetchData(store.storeID);
      const _users = data.details.users;
      setUsers(_users);
      setLoading(false);
    }, 1000);
  };

  const onSelectDeleteDataChange = (rows) => {
    setIsDeleted(rows.length === 0);
    setSelectedDeleteData(rows);
  };

  const onDeleteHandler = () => {
    setOpenDeleteDialog(true);
  };

  const onDeleteSubmission = async () => {
    try {
      const userIDs = selectedDeleteData.map((user) => user.userID);
      const userDeletedResponse = await ApiService.getInstance().request({
        method: "delete",
        url: "/users",
        data: {
          userIDs,
        },
      });

      setOpenDeleteDialog(false);
      showMessage({
        message: userDeletedResponse.data.message,
        variant: "success",
      });
      setLoading(true);
    } catch (error) {
      setOpenDeleteDialog(false);
      showMessage({
        message: error.message,
        variant: "error",
      });
    }
  };

  const onOpenInviteDialogHandler = () => {
    setOpenInviteDialog(true);
  };

  const onOpenUserFormDialogHandler = (data) => {
    setUserInfo(data);
    setOpenUserFormDialog(true);
  };

  return (
    <Card className="p-12">
      <InviteDialog
        t={t}
        open={openInviteDialog}
        setOpen={setOpenInviteDialog}
        store={store}
        userLength={users.length}
        userLimit={store.userLimit}
        showMessage={showMessage}
      />
      <UserFormDialog
        t={t}
        open={openUserFormDialog}
        setOpen={setOpenUserFormDialog}
        userInfo={userInfo}
        showMessage={showMessage}
        reloadUser={setLoading}
      />
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        selectedDeleteData={selectedDeleteData}
        t={t}
        onDelete={onDeleteSubmission}
        reloadUser={setLoading}
      />

      <Datatable
        title={
          <>
            <Button
              size="small"
              className="ml-12"
              variant="outlined"
              onClick={onOpenInviteDialogHandler}
            >
              <EmailIcon className="mr-4" />
              {t("settings.USER_MANAGEMENT.INVITE")}
            </Button>
            <Button
              size="small"
              className={`ml-6 ${classes.btnDanger}`}
              variant="contained"
              disabled={isDeleted}
              onClick={onDeleteHandler}
              color="primary"
            >
              <DeleteIcon className="mr-4" />
              {t("GLOBAL.DELETE")}
            </Button>
          </>
        }
        columns={[
          {
            title: t("settings.USER_MANAGEMENT.FIRST_NAME"),
            field: "firstName",
          },
          {
            title: t("settings.USER_MANAGEMENT.LAST_NAME"),
            field: "lastName",
          },
          { title: t("settings.USER_MANAGEMENT.EMAIL"), field: "email" },
          {
            title: t("settings.USER_MANAGEMENT.STATUS"),
            field: "actived",
            render: (row) => {
              return (
                <div className={classes.userStatusBox}>
                  <FiberManualRecordIcon
                    className={
                      row.actived
                        ? classes.activeStatus
                        : classes.inActiveStatus
                    }
                  />
                </div>
              );
            },
          },
          {
            title: t("settings.USER_MANAGEMENT.CREATED"),
            field: "createdAt",
            render: (row) => {
              return (
                <span>
                  {`${moment
                    .unix(row.createdAt / 1000)
                    .format("DD/MM/YYYY HH:mm")}`}
                </span>
              );
            },
          },
          {
            title: t("settings.USER_MANAGEMENT.ACTION"),
            field: "actions",
            render: (row) => {
              return (
                <IconButton onClick={() => onOpenUserFormDialogHandler(row)}>
                  <EditIcon />
                </IconButton>
              );
            },
          },
        ]}
        onSelectionChange={onSelectDeleteDataChange}
        usageRefreshData={false}
        actionProps={[
          {
            icon: "refresh",
            isFreeAction: true,
            onClick: () => setLoading(true),
          },
        ]}
        optionProps={{
          selection: true,
        }}
        data={users}
        loading={loading}
      />
    </Card>
  );
};

export default withStyles(styles)(UserManagement);
